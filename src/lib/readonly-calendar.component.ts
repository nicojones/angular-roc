import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { RocDay } from './types/day';
import { RocWeekStartsOn } from './enums/roc-week-starts-on';
import { RocMonth, RocMonthIndex, RocMonthObj } from './types/month';
import { RocCalendar, RocWeek, RocWeekDays } from './types/calendar';
import { RocControls, RocDayClickEvent, RocLocale, RocTranslation } from './types/roc-types';

function isLeap(year: number): boolean {
  return !(year & 3 || year & 15 && !(year % 25));
}

function daysInMonth(year: number, month: number): number {
  // Need to pass `month + 1` because setting the date to 0 will go back one month. So (March + 1)-0 = April-0 = March-31
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Given a list of the last days in a month, we complete it with the first days of the following month (to end up with 7 days)
 * @param weekDays
 * @private
 */
function weekNextMonth (weekDays: Partial<RocWeekDays>): Partial<RocWeekDays> {
  const extraDays: Partial<RocWeekDays> = [];
  const complete = 7 - weekDays.length;
  for (let i = 1; i <= complete; ++i) {
    extraDays.push({ class: 'other', number: i });
  }
  return extraDays;
}

/**
 * Valid Year-Month format in case we need to create a {@see Date}.
 * @param index
 * @private
 */
function monthKey (index: RocMonthIndex): string {
  return index.year + '' + index.month;
}

/**
 * Given a Year and a Month we prefill the last days of the previous month to be able to complete the week correctly.
 * @param index
 * @param startsOn
 * @private
 */
function weekPrevMonth (index: RocMonthIndex, startsOn: number): RocWeekDays {
  const firstDay = new Date(index.year, index.month, 1);
  const daysBefore = (firstDay.getDay() - startsOn + 7) % 7;
  if (daysBefore === 0) {
    // meaning: Month starts on monday!
    return [] as unknown as RocWeekDays;
  }
  firstDay.setDate(0); // 0-th of October is the 30-th of September!
  const lastDay = firstDay.getDate();
  const days: Partial<RocWeekDays> = Array(daysBefore).fill(null) as unknown as RocWeekDays;
  return days.map((_, index: number) => ({
    class: 'other',
    number: lastDay - daysBefore + index + 1
  } as RocDay)) as unknown as RocWeekDays;
}

/**
 * Benchmarks (for 100 tests)
 * Macbook - 2.3 GHz Quad-Core Intel Core i7
 * Chrome - Version 87.0.4280.88 (x86_64)
 * 2000 years -> 17ms
 * 100 years -> 0.54ms
 */
@Component({
  selector: 'readonly-calendar',
  templateUrl: './readonly-calendar.component.html',
  styleUrls: [
    './readonly-calendar.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ReadonlyCalendarComponent implements OnInit {

  /**
   * The calendar will open by default on a view that displays this date.
   */
  @Input()
  public date: Date | string = new Date();

  /**
   * The calendar translations. Not added into the build to save size. Please add the language you wish to use by importing (or creating)
   * the file yourself and pass it along.
   */
  @Input('translations')
  public rocT: RocTranslation = null as unknown as RocTranslation;

  /**
   * Controls for the calendar (Previous, Next, Current date)
   */
  @Input('controls')
  public b: RocControls = { prev: '&lt;', next: '&gt;' };

  /**
   * If you don't want to pass translations they will be auto-generated. The locale accepts an array of three parameters:
   * @param locale[0] -> The locale (en-GB, or nl-NL... or `default` to use the user's)
   * @param locale[1] -> Short/Long weekday name
   * @param locale[2] -> Short/Long month name
   */
  @Input()
  public locale: RocLocale = ['default', 'short', 'long'];

  /**
   * If you disable the calendar, no hover/click effects are in place.
   */
  @Input()
  public disabled: boolean = true;

  /**
   * Set it to true to add a `today` class to the current {@see date}
   */
  @Input('highlightToday')
  public seeToday: boolean = true;

  /**
   * Set the first day of the week
   */
  @Input('weekStartsOn')
  public rocStart: RocWeekStartsOn = RocWeekStartsOn.Monday;

  /**
   * Event emitted when clicking on a day.
   */
  @Output('dayClick')
  public click: EventEmitter<RocDayClickEvent> = new EventEmitter();

  /**
   * This holds all the information we need in the component. See the interface for more details.
   */
  public calendar: RocCalendar = {
    d2s: [] as unknown as RocTranslation['days'],
    initial: {} as RocMonthIndex,
    months: {} as RocMonthObj,
    index: {} as RocMonthIndex,
    m$: new BehaviorSubject<RocMonth>({} as RocMonth)
  };

  constructor(
  ) {
  }

  /**
   * After all the {@see Input} and {@see Output} are loaded.
   */
  ngOnInit(): void {
    this.setTranslations();
    // A date of a date is a date! Oooooobvious! -> This is because you can pass it a string or an object.
    this.date = new Date(this.date);
    // If it's done in here, we only need to do it once. And because the loop is static, it does not re-render.
    this.calendar.d2s = this.rocT.days.map((_, index: number) => this.rocT.days[(index + this.rocStart) % 7]) as RocTranslation['days'];
    // The given date is the one that will be used as index.
    [this.calendar.index.year, this.calendar.index.month] = [this.date.getFullYear(), this.date.getMonth()];
    // Save the default date, which is the { year, month } we open the calendar on:
    this.calendar.initial = { ...this.calendar.index };
    // Create a new month based on the index, also using the given date (for highlights)
    const newMonth: RocMonth = this.newMonth(this.calendar.index, this.date.getDate());
    // Will render.
    this.calendar.m$.next(newMonth);
  }

  /**
   * Change the month one up or one down.
   * @param direction
   */
  public showMonth = (direction: 1 | -1) => {
    this.changeMonthIndex(direction);
    this.setMonth(this.calendar.index);
  };

  /**
   * Change the calendar display to display the default Year-Month.
   */
  public setToday = () => {
    this.calendar.index = { ...this.calendar.initial };
    this.calendar.m$.next(this.calendar.months[monthKey(this.calendar.index)]);
  };

  /**
   * Given a {@see RocMonthIndex} which might not yet exist, we set that {@see RocMonth} in the view.
   * @param index
   */
  public setMonth = (index: RocMonthIndex) => {
    let changeToMonth: RocMonth = this.calendar.months[monthKey(index)];
    if (!changeToMonth) {
      changeToMonth = this.newMonth(this.calendar.index);
    }
    this.calendar.m$.next(changeToMonth);
  };

  /**
   * When clicking on a {@see RocDay} we either: Change month (if we clicked in a date from a different month) OR {@see EventEmitter} the date.
   * @param month
   * @param day
   */
  public onClick = (month: RocMonth, day: RocDay) => {
    if (day.class === 'other') {
      // It's not really a click we're just changing month...
      if (day.number < 20) { // if the day is small, means we clicked on NEXT month
        this.showMonth(1);
      } else {
        this.showMonth(-1);
      }
      return;
    }

    this.click.emit({
      year: month.year,
      month: month.month + 1, /* because they are 0-based */
      isLeap: month.isLeap,
      day: day.number,
      date: new Date(month.year, month.month, day.number)
    });
  };


  /**
   * Based on a month index
   * @param index
   * @param day
   * @private
   */
  private newMonth = (index: RocMonthIndex, day: number = 0): RocMonth => {
    const isLeapYear: boolean = isLeap(index.year);
    const monthLength = daysInMonth(index.year, index.month);

    const month: RocMonth = {
      year: index.year,
      month: index.month,
      isLeap: isLeapYear,
      name: this.rocT.months[index.month] || new Date(index.year, index.month, 2).toLocaleDateString(this.locale[0], { month: this.locale[2] }),
      weeks: []
    };

    let week: RocWeek = { days: weekPrevMonth(index, this.rocStart) };
    for (let i = 1; i <= monthLength; ++i) {
      week.days.push({ number: i, class: (day === i && this.seeToday) ? 'today' : '' });
      if (week.days.length === 7) {
        month.weeks.push(week);
        week = { days: [] as unknown as RocWeek['days'] };
      }
    }
    if (week.days.length) {
      month.weeks.push({ ...week, days: [...week.days, ...weekNextMonth(week.days)] as RocWeekDays });
    }

    this.calendar.months[monthKey(index)] = month;
    return month;
  };

  /**
   * Move one month forward/backward.
   * @param increment
   * @private
   */
  private changeMonthIndex = (increment: 1 | -1): void => {
    this.calendar.index.month += increment;

    if (this.calendar.index.month < 0) {
      this.calendar.index.month = 11;
      --this.calendar.index.year;
    } else if (this.calendar.index.month >= 12) {
      this.calendar.index.month = 0;
      ++this.calendar.index.year;
    }
  };

  /**
   * Generates translations based on the `locale` or the {@see locale}, if they are not passed along.
   */
  private setTranslations = () => {
    if (!this.rocT) {
      this.rocT = {
        months: [] as unknown as RocTranslation['months'],
        days: [] as unknown as RocTranslation['days']
      } as RocTranslation;

      const date = new Date();
      for (let i = 10; i < 17; ++i) { // from 0 to 7, but in the middle of the month...
        date.setDate(i);
        this.rocT.days[date.getDay()] = date.toLocaleDateString(this.locale[0], { weekday: this.locale[1] });
      }
    }
  };
}

import { BehaviorSubject } from 'rxjs';
import { RocMonth, RocMonthIndex, RocMonthObj } from './month';
import { RocDay } from './day';
import { RocTranslation } from './roc-types';


export interface RocCalendar {
  d2s: RocTranslation['days'];
  initial: RocMonthIndex;
  months: RocMonthObj;
  index: RocMonthIndex;
  m$: BehaviorSubject<RocMonth>;
}


export type RocWeekDays = [RocDay, RocDay, RocDay, RocDay, RocDay, RocDay, RocDay]; // seven days

export interface RocWeek {
  days: RocWeekDays;
  number?: number; // week number.
}

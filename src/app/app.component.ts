import { Component } from '@angular/core';
import { RocDayClickEvent, RocLocale, RocWeekStartsOn } from 'readonly-calendar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public showCalendar: boolean = true;
  public date = new Date();
  public firstDay = RocWeekStartsOn.Wednesday;
  public title = 'calendar';
  public locale: RocLocale = ['default', 'short', 'short'];

  public onDayClick(event: RocDayClickEvent) {
    console.log(event);
  }
}

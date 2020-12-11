import { NgModule } from '@angular/core';
import { ReadonlyCalendarComponent } from './readonly-calendar.component';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [ReadonlyCalendarComponent],
  imports: [
    CommonModule
  ],
  exports: [ReadonlyCalendarComponent]
})
export class ReadonlyCalendarModule { }

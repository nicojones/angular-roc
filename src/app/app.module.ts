import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ReadonlyCalendarModule } from 'readonly-calendar';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    ReadonlyCalendarModule,
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

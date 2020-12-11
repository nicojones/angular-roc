import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadonlyCalendarComponent } from './readonly-calendar.component';

describe('ReadonlyCalendarComponent', () => {
  let component: ReadonlyCalendarComponent;
  let fixture: ComponentFixture<ReadonlyCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadonlyCalendarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadonlyCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

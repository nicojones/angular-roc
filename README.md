# Readonly Calendar

### A very lightweight calendar for Angular ( **<big style="text-decoration: underline">7KB</big>** ) with basic functionality

**Q**uestion: What can the calendar do?  
**A**nswer: Very basic stuff:  
  - Show month (user choice)
  - Navigate between months
  - Select a day (emits event)
  - Go back to initial month

***

## How to install
 npm

    npm install angular-roc

GitHub

    git clone https://github.com/nicojones/angular-roc.git

## How to Use
Import `ROC` into your module

    @NgModule({
      imports: [
        ...
        ReadonlyCalendarModule
        ...
      ]
    })

And use it in your component

    <readonly-calendar></readonly-calendar>

## How to configure

| Property | Description |
| --- | --- |
| - `date` <br>- type: `Date` or `string`<br>- default: `new Date()` | The date (month) at which the calendar will open. |  
| - `translations` <br>- type: `RocTranslation`<br>- default: `null` (uses Locale) | Translations for the Calendar. (see `locale` as well). You can pass an object defining the translations (names for Months and Week Days) and the buttons <a id="localisation"></a> |  
| - `controls` <br>- type: `RocControls` or `false` (accepts HTML)<br>- default: `{ prev: <, next: > }` | If you don't pass button definitions, only `prev` and `next` will be visible. If you pass as well `{ ... today: '.' }` a third button will be shown. Passing `false` will hide all controls. |
| - `locale` <br>- type: `RocLocale`<br>- default: `['default', 'short', 'long']` | If you don't want to pass translations or reuse the ones you have, you can let Javascript use its `locale` library for the translations. `default` will use the system language, otherwise pass a locale like `nl-NL` or `en-GB`. The second and third parameters are the desired format for Days ('Monday' vs 'Mon') and Months ('December' vs 'Dec'). |
| - `disabled` <br>- type: `boolean`<br>- default: `true` | Set to true to disable `hover` and `click`. Combined with `buttons: false` it's just an overlay which cannot be interacted with. |
| - `highlightToday` <br>- type: `boolean`<br>- default: `true` | If `true`, a class `.today` will be added to the calendar coinciding with the `[date]` parameter passed to the component. | 
| - `specials` <br>- type: `RocSpecials`<br>- default: `{}` | Give a date or list of dates that you want to highlight on your calendar. These "specials" allow you to add classes to that particular day, a title="" on hover or set _your custom data_ which is returned in the `(dayClick)` event. _Any_ data is valid. | 
| - `weeksStartsOn` <br>- type: `RocWeekStartsOn`<br>- default: Monday | The day the week starts with. Everything gets calculated automatically. |
| - `dayClick` (event) <br>- type: `RocDayClickEvent`| When the calendar is `disabled = false` and a date gets clicked, it will emit an event. |


## More Q&A

**Q**: Why another calendar? There are thousands  
**A**: They all are trying to _do everything_. ROC (which stands for Read-Only Calendar) does exactly what it says: It's mostly read-only.

**Q**: Why a component?  
**A**: [Angular Datepicker](https://material.angular.io/components/datepicker/overview) and other components are more than
a user needs 90% of the cases. If all you need to do is pick a date, see the month, etc., this is exactly what you need.

**Q**: Readonly... can I use it as a Datepicker?  
**A**: Yes! Set `[disabled]="false"` and you listen to the `(dayClick)` event.

**Q**: Can I use it in my language?  
**A**: Yes! See [Localisation](#localisation) below.

**Q**: Your calendar looks very ugly.  
**A**: I _did not want_ to add styles that you would have to overwrite, increasing package size. I encourage you
to use your own CSS/Styles, or import the `themes/basic.scss` or `themes/basic.css` to have a quick ("ok") version.

**Q**: How do you open and close it?  
**A**: It's always open. Hide it with `display: none` or `*ngIf="false"`. No more settings available.

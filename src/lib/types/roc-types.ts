import { RocMonth } from './month';

export interface RocTranslation {
  /**
   * Seven days of the week, starting on SUNDAY (has to do with the DATE object)
   * @example [ sunday, monday, ... ] // [ Sun, Mon, ... ]
   */
  days: [string, string, string, string, string, string, string];

  /**
   * The twelve months, as in [ Jan, Feb... ] or [ January, February... ] whatever you prefer.
   */
  months: [string, string, string, string, string, string, string, string, string, string, string, string];
}

/**
 * The value to show for the buttons. HTML allowed. Optional
 */
export type RocControls = false | {
  prev: string; // Defaults to `<`
  next: string; // Defaults to `>`
  today?: string; // Must be _EXPLICITLY_ defined, or it won't be shown.
};

export interface RocDayClickEvent extends Pick<RocMonth, 'year' | 'month' | 'isLeap'> {
  day: number;
  date: Date;
  dateStr: string;
  data: any;
}


/**
 * @var RocSpecialDayKey
 * Format in ISO: YYYY-mm-dd. For example 5th of November: 1605-11-05
 */
export type RocDayKey = string;

export interface RocDayTitle {
    /**
     * @var title
     * Optional title to show on hover.
     */
     title?: string;

     /**
      * @var data
      * If you don't want the title to show on hover, you can still set custom data
      * in the `data-info` attribute, to access it at a later point.
      */
     data?: any;
}

export interface RocSpecialDay extends RocDayTitle {
  /**
   * @var class
   * Optional class to add to the `day` cell.
   */
  class?: string;
}

export type RocSpecials = Record<RocDayKey, RocSpecialDay>;


export type RocLocale = ['default' | string, 'short' | 'long', 'short' | 'long'];

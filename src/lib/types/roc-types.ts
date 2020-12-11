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

export type RocDayClickEvent = Pick<RocMonth, 'year' | 'month' | 'isLeap'> & { day: number } & { date: Date };


export type RocLocale = ['default' | string, 'short' | 'long', 'short' | 'long'];

import { RocDayTitle } from './roc-types';

type DayClassTypes = '' | 'other' | 'today' | 'special';

export interface RocDay extends RocDayTitle {
  number: number;
  class?: DayClassTypes;
}

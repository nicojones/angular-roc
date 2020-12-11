type DayClassTypes = '' | 'other' | 'today';

export interface RocDay {
  number: number;
  class?: DayClassTypes;
}

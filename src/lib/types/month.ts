import { RocWeek } from './calendar';

export interface RocMonth {
  name?: string;
  year: number;
  isLeap: boolean;
  month: number;
  weeks: RocWeek[];
}

export type RocMonthObj = { [key: string]: RocMonth }

export interface RocMonthIndex {
  year: number;
  month: number;
}

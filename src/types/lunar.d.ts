declare module 'lunar-javascript' {
  export class Solar {
    static fromDate(date: Date): Solar
    static fromYmd(year: number, month: number, day: number): Solar
    getLunar(): Lunar
    getYear(): number
    getMonth(): number
    getDay(): number
  }

  export class Lunar {
    getYear(): number
    getMonth(): number
    getDay(): number
    getYearShengXiao(): string
    getMonthShengXiao(): string
    getDayShengXiao(): string
  }

  export class LunarDate {
    static fromYmd(year: number, month: number, day: number): LunarDate
  }
}

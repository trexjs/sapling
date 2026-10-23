/**
 * Date/time utilities built on native Date and Intl APIs.
 * API is inspired by common date-fns / datejs-style operations; no third-party dependency.
 * Note: timezone-aware calendar operations should use an explicit timezone/library when DST correctness is critical.
 */
export type DateInput = Date | string | number;
export type DateUnit = "millisecond" | "second" | "minute" | "hour" | "day" | "week" | "month" | "quarter" | "year";
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export function toDate(input: DateInput): Date {
  const date = input instanceof Date ? new Date(input.getTime()) : new Date(input);
  if (Number.isNaN(date.getTime())) throw new RangeError(`Invalid date: ${String(input)}`);
  return date;
}
export const isValidDate = (input: unknown): input is Date => input instanceof Date && Number.isFinite(input.getTime());
export const isDateBefore = (left: DateInput, right: DateInput): boolean => toDate(left).getTime() < toDate(right).getTime();
export const isDateAfter = (left: DateInput, right: DateInput): boolean => toDate(left).getTime() > toDate(right).getTime();
export const isSameInstant = (left: DateInput, right: DateInput): boolean => toDate(left).getTime() === toDate(right).getTime();
export const compareDates = (left: DateInput, right: DateInput): -1 | 0 | 1 => {
  const diff = toDate(left).getTime() - toDate(right).getTime();
  return diff < 0 ? -1 : diff > 0 ? 1 : 0;
};
export const now = (): Date => new Date();
export const unixTime = (input: DateInput = new Date()): number => Math.floor(toDate(input).getTime() / 1000);
export const epochMilliseconds = (input: DateInput = new Date()): number => toDate(input).getTime();
export const toISOString = (input: DateInput): string => toDate(input).toISOString();
export const toUnixSeconds = (input: DateInput): number => unixTime(input);

export function startOfDay(input: DateInput): Date {
  const d = toDate(input); d.setHours(0, 0, 0, 0); return d;
}
export function endOfDay(input: DateInput): Date {
  const d = toDate(input); d.setHours(23, 59, 59, 999); return d;
}
export function startOfWeek(input: DateInput, weekStartsOn: Weekday = 0): Date {
  const d = startOfDay(input), delta = (d.getDay() - weekStartsOn + 7) % 7;
  d.setDate(d.getDate() - delta); return d;
}
export function endOfWeek(input: DateInput, weekStartsOn: Weekday = 0): Date {
  const d = startOfWeek(input, weekStartsOn); d.setDate(d.getDate() + 7); d.setMilliseconds(-1); return d;
}
export function startOfMonth(input: DateInput): Date {
  const d = toDate(input); d.setDate(1); d.setHours(0, 0, 0, 0); return d;
}
export function endOfMonth(input: DateInput): Date {
  const d = startOfMonth(input); d.setMonth(d.getMonth() + 1); d.setMilliseconds(-1); return d;
}
export function startOfQuarter(input: DateInput): Date {
  const d = toDate(input); d.setMonth(Math.floor(d.getMonth() / 3) * 3, 1); d.setHours(0, 0, 0, 0); return d;
}
export function endOfQuarter(input: DateInput): Date {
  const d = startOfQuarter(input); d.setMonth(d.getMonth() + 3); d.setMilliseconds(-1); return d;
}
export function startOfYear(input: DateInput): Date {
  const d = toDate(input); d.setMonth(0, 1); d.setHours(0, 0, 0, 0); return d;
}
export function endOfYear(input: DateInput): Date {
  const d = startOfYear(input); d.setFullYear(d.getFullYear() + 1); d.setMilliseconds(-1); return d;
}
export const addMilliseconds = (input: DateInput, amount: number): Date => new Date(toDate(input).getTime() + amount);
export const addSeconds = (input: DateInput, amount: number): Date => addMilliseconds(input, amount * 1000);
export const addMinutes = (input: DateInput, amount: number): Date => addMilliseconds(input, amount * 60_000);
export const addHours = (input: DateInput, amount: number): Date => addMilliseconds(input, amount * 3_600_000);
export const addDays = (input: DateInput, amount: number): Date => { const d = toDate(input); d.setDate(d.getDate() + amount); return d; };
export const addWeeks = (input: DateInput, amount: number): Date => addDays(input, amount * 7);
export function addMonths(input: DateInput, amount: number): Date {
  const d = toDate(input), day = d.getDate();
  d.setDate(1); d.setMonth(d.getMonth() + amount);
  const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(day, lastDay)); return d;
}
export const addQuarters = (input: DateInput, amount: number): Date => addMonths(input, amount * 3);
export function addYears(input: DateInput, amount: number): Date {
  const d = toDate(input), month = d.getMonth(), day = d.getDate();
  d.setDate(1); d.setFullYear(d.getFullYear() + amount); d.setMonth(month);
  d.setDate(Math.min(day, new Date(d.getFullYear(), month + 1, 0).getDate())); return d;
}
export const subDays = (input: DateInput, amount: number): Date => addDays(input, -amount);
export const subMonths = (input: DateInput, amount: number): Date => addMonths(input, -amount);
export const subYears = (input: DateInput, amount: number): Date => addYears(input, -amount);
export const differenceInMilliseconds = (left: DateInput, right: DateInput): number => toDate(left).getTime() - toDate(right).getTime();
export const differenceInSeconds = (left: DateInput, right: DateInput): number => Math.trunc(differenceInMilliseconds(left, right) / 1000);
export const differenceInMinutes = (left: DateInput, right: DateInput): number => Math.trunc(differenceInMilliseconds(left, right) / 60_000);
export const differenceInHours = (left: DateInput, right: DateInput): number => Math.trunc(differenceInMilliseconds(left, right) / 3_600_000);
export const differenceInCalendarDays = (left: DateInput, right: DateInput): number => {
  const a = startOfDay(left), b = startOfDay(right);
  return Math.round((Date.UTC(a.getFullYear(), a.getMonth(), a.getDate()) - Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())) / 86_400_000);
};
export const differenceInDays = (left: DateInput, right: DateInput): number => Math.trunc(differenceInMilliseconds(left, right) / 86_400_000);
export const differenceInWeeks = (left: DateInput, right: DateInput): number => Math.trunc(differenceInDays(left, right) / 7);
export const differenceInMonths = (left: DateInput, right: DateInput): number => {
  const a = toDate(left), b = toDate(right);
  return (a.getFullYear() - b.getFullYear()) * 12 + a.getMonth() - b.getMonth();
};
export const isSameDay = (a: DateInput, b: DateInput): boolean => {
  const x = toDate(a), y = toDate(b);
  return x.getFullYear() === y.getFullYear() && x.getMonth() === y.getMonth() && x.getDate() === y.getDate();
};
export const isToday = (input: DateInput): boolean => isSameDay(input, new Date());
export const isWeekend = (input: DateInput): boolean => [0, 6].includes(toDate(input).getDay());
export const isWeekday = (input: DateInput): boolean => !isWeekend(input);
export const isLeapYear = (input: number | DateInput): boolean => {
  const year = typeof input === "number" ? input : toDate(input).getFullYear();
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
};
export const daysInMonth = (input: DateInput): number => {
  const d = toDate(input); return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
};
export const getQuarter = (input: DateInput): 1 | 2 | 3 | 4 => Math.floor(toDate(input).getMonth() / 3) + 1 as 1 | 2 | 3 | 4;
export const clampDate = (input: DateInput, minDate: DateInput, maxDate: DateInput): Date =>
  new Date(Math.min(Math.max(toDate(input).getTime(), toDate(minDate).getTime()), toDate(maxDate).getTime()));
export const minDate = (...inputs: DateInput[]): Date => new Date(Math.min(...inputs.map(d => toDate(d).getTime())));
export const maxDate = (...inputs: DateInput[]): Date => new Date(Math.max(...inputs.map(d => toDate(d).getTime())));
export const eachDayOfInterval = (start: DateInput, end: DateInput): Date[] => {
  const result: Date[] = [], last = startOfDay(end);
  for (let d = startOfDay(start); d <= last; d = addDays(d, 1)) result.push(new Date(d));
  return result;
};
export const isWithinInterval = (input: DateInput, start: DateInput, end: DateInput): boolean => {
  const t = toDate(input).getTime(), a = toDate(start).getTime(), b = toDate(end).getTime();
  return t >= Math.min(a, b) && t <= Math.max(a, b);
};
export const formatDate = (input: DateInput, locale = "en-US", options: Intl.DateTimeFormatOptions = { dateStyle: "medium" }): string =>
  new Intl.DateTimeFormat(locale, options).format(toDate(input));
export const formatDateTime = (input: DateInput, locale = "en-US"): string =>
  new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(toDate(input));
export const formatRelative = (input: DateInput, base: DateInput = new Date(), locale = "en"): string => {
  const seconds = (toDate(input).getTime() - toDate(base).getTime()) / 1000;
  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [["year", 31_536_000], ["month", 2_592_000], ["week", 604_800], ["day", 86_400], ["hour", 3_600], ["minute", 60], ["second", 1]];
  const [unit, divisor] = units.find(([, size]) => Math.abs(seconds) >= size) ?? units[units.length - 1]!;
  return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(Math.round(seconds / divisor), unit);
};
export const toDateKey = (input: DateInput): string => {
  const d = toDate(input);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
export const parseISO = (value: string): Date => {
  if (!/^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(value)) throw new RangeError("Expected an ISO-like date string");
  return toDate(value);
};
export const isISODateString = (value: string): boolean => /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})?)?$/.test(value) && !Number.isNaN(Date.parse(value));
export const startOfMinute = (input: DateInput): Date => { const d = toDate(input); d.setSeconds(0, 0); return d; };
export const startOfHour = (input: DateInput): Date => { const d = toDate(input); d.setMinutes(0, 0, 0); return d; };
export const endOfMinute = (input: DateInput): Date => { const d = startOfMinute(input); d.setSeconds(59, 999); return d; };
export const endOfHour = (input: DateInput): Date => { const d = startOfHour(input); d.setHours(d.getHours() + 1); d.setMilliseconds(-1); return d; };
export const setTime = (input: DateInput, hours: number, minutes = 0, seconds = 0, milliseconds = 0): Date => {
  const d = toDate(input); d.setHours(hours, minutes, seconds, milliseconds); return d;
};
export const getAge = (birthDate: DateInput, at: DateInput = new Date()): number => {
  const birth = toDate(birthDate), today = toDate(at);
  let age = today.getFullYear() - birth.getFullYear();
  if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age--;
  return age;
};

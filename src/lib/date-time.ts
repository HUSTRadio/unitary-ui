import { format, isValid, parse } from "date-fns";
import { TZDate } from "@date-fns/tz";

export interface DateTimeFormatOptions {
  locale?: string;
  timeZone?: string;
  /** Unicode LDML/UTS#35 date pattern, for example yyyy/MM/dd. */
  dateTimeFormat?: string;
  /** Unicode LDML/UTS#35 time pattern, for example HH:mm. */
  timeFormat?: string;
}

const FALLBACK_DATE_FORMAT = "yyyy/MM/dd";
const FALLBACK_TIME_FORMAT = "HH:mm";

export function resolveTimeZone(timeZone?: string): string {
  if (timeZone) return timeZone;
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

/** Derive a numeric LDML date pattern from the browser ICU/CLDR locale data. */
export function defaultDateFmt(locale?: string, timeZone?: string): string {
  try {
    const parts = new Intl.DateTimeFormat(locale, {
      timeZone: resolveTimeZone(timeZone),
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(new Date(Date.UTC(2026, 7, 21)));
    const pattern = parts
      .map((part) => {
        if (part.type === "year") return "yyyy";
        if (part.type === "month") return "MM";
        if (part.type === "day") return "dd";
        return part.value;
      })
      .join("");
    return /yyyy/.test(pattern) && /MM/.test(pattern) && /dd/.test(pattern)
      ? pattern.replace(/[\u200e\u200f]/g, "")
      : FALLBACK_DATE_FORMAT;
  } catch {
    return FALLBACK_DATE_FORMAT;
  }
}

export function defaultTimeFmt(): string {
  return FALLBACK_TIME_FORMAT;
}

function zoned(date: Date, timeZone?: string): TZDate {
  return new TZDate(date.getTime(), resolveTimeZone(timeZone));
}

export function formatDateTime(date: Date, options: DateTimeFormatOptions = {}): string {
  return format(
    zoned(date, options.timeZone),
    options.dateTimeFormat ?? defaultDateFmt(options.locale, options.timeZone),
  );
}

export function formatTimeOfDay(date: Date, options: DateTimeFormatOptions = {}): string {
  return format(zoned(date, options.timeZone), options.timeFormat ?? defaultTimeFmt());
}

/**
 * Parses a numeric date pattern without browser-dependent Date string parsing.
 * date-fns accepts unpadded numeric fields for MM/dd; formatting the result
 * afterwards gives callers the canonical zero-padded form.
 */
export function parseDateTime(value: string, options: DateTimeFormatOptions = {}): Date | null {
  const pattern = options.dateTimeFormat ?? defaultDateFmt(options.locale, options.timeZone);
  try {
    const parsed = parse(
      value.trim(),
      pattern,
      new TZDate(2000, 0, 1, resolveTimeZone(options.timeZone)),
    );
    if (!isValid(parsed)) return null;
    // Round-trip protects against date-fns normalising an invalid date such as 2026/13/40.
    const normalised = format(parsed, pattern);
    const reparsed = parse(normalised, pattern, parsed);
    return isValid(reparsed) ? new Date(parsed.getTime()) : null;
  } catch {
    return null;
  }
}

export function parseTimeOfDay(
  value: string,
  timeFormat = FALLBACK_TIME_FORMAT,
): { hours: number; minutes: number } | null {
  try {
    const parsed = parse(value.trim(), timeFormat, new Date(2000, 0, 1));
    if (!isValid(parsed)) return null;
    return { hours: parsed.getHours(), minutes: parsed.getMinutes() };
  } catch {
    return null;
  }
}

export function setTimeOfDay(
  date: Date,
  time: { hours: number; minutes: number },
  timeZone?: string,
): Date {
  const z = zoned(date, timeZone);
  return new TZDate(
    z.getFullYear(),
    z.getMonth(),
    z.getDate(),
    time.hours,
    time.minutes,
    resolveTimeZone(timeZone),
  );
}

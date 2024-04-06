import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (
  date?: number | Date | undefined,
  options?: Intl.DateTimeFormatOptions | undefined,
  locales: string | string[] | undefined = "en-US",
) => new Intl.DateTimeFormat(locales, options).format(date);

export const genders = [
  "Not specified",
  "Female",
  "Male",
  "Non-binary",
] as const;

export const getGender = (gender: number) => {
  return genders[gender] ?? genders[0];
};

/**
 * Converter for different time units to milliseconds.
 */
export abstract class Duration {
  static seconds(seconds: number) {
    return seconds * 1000;
  }

  static minutes(minutes: number) {
    return minutes * 60 * 1000;
  }

  static hours(hours: number) {
    return hours * 60 * 60 * 1000;
  }

  static days(days: number) {
    return days * 24 * 60 * 60 * 1000;
  }
}

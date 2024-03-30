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

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Format a number as a currency string
 * @param amount - The amount to format
 * @param locale - The locale to use for formatting (default: 'US')
 * @param currency - The currency code (default: 'USD')
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  locale: string = 'US',
  currency: string = 'USD'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

/**
 * Converts a JavaScript array to PostgreSQL array format
 * @param arr - The array to convert
 * @returns A string in PostgreSQL array format
 */
export function toPgArray(arr: (string | number | boolean | null)[]): string {
  if (!Array.isArray(arr)) return '{}';

  const escaped = arr.map(item => {
    if (item === null) return 'NULL';
    if (typeof item === 'string') {
      const escapedStr = item
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n');
      return `"${escapedStr}"`;
    }
    return item;
  });

  return `{${escaped.join(',')}}`;
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 *
 * @param {number} value - 123456
 * @param {string} currency - The currency type to format the value with
 * @requires value - The number to format
 * @returns {string} - The formatted currency string
 * @example formatCurrency(123456) => "Rs 123,456"
 * @description Formats the number with commas and adds the currency symbol
 */

export function formatCurrency(value: number, currency?: "Rs" | "$"): string {
  // Convert the value to a string and format it with commas
  const formattedValue = value.toLocaleString(); // Automatically formats number with commas

  // Return the formatted currency string based on the currency type
  if (currency === "$") {
    return `$ ${formattedValue}`;
  } else {
    return `Rs ${formattedValue}`;
  }
}

/**
 * @requires value - The text to format
 * @param {string} value - The text to format
 * @returns {string} - First letter capitalized text
 * @example formalizeText("hello") => "Hello"
 * @description Capitalizes the first letter of the text to maintain front-end consistency
 */

export function formalizeText(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long", // Full name of the weekday
    day: "2-digit", // Two-digit day
    month: "long", // Full name of the month
    year: "2-digit", // Two-digit year
  };

  const formattedDate = new Date(date).toLocaleDateString("en-US", options);
  return formattedDate;
}

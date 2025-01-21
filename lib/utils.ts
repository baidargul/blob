import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency: "Rs" | "$"): string {
  // Convert the value to a string and format it with commas
  const formattedValue = value.toLocaleString(); // Automatically formats number with commas

  // Return the formatted currency string based on the currency type
  if (currency === "Rs") {
    return `Rs ${formattedValue}`;
  } else {
    return `$ ${formattedValue}`;
  }
}

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

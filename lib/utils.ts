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

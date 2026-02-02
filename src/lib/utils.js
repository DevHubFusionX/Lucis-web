import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge tailwind classes with clsx
 * @param {...string} inputs - Class names or conditions
 * @returns {string} - Merged class names
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

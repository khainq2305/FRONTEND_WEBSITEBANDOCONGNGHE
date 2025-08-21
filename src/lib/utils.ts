import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Gộp className + merge Tailwind xung đột
 */
export function cn(...inputs: any[]) {
  return twMerge(clsx(...inputs))
}

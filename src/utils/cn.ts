import { type ClassValue, clsx } from 'clsx';

/**
 * Utility function to merge class names conditionally
 * Combines clsx for conditional classes
 * @param inputs - Class values to merge
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
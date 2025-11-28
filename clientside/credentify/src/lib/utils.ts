import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Original logic - keep as cn()
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Keep alternative logic but rename the internal function
export function cnBasic(...classes: (string | undefined | null | boolean)[]) {
  return classes.filter(Boolean).join(" ")
}

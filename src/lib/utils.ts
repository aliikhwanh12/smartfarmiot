import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function valueUpdater(updaterOrValue: any, refValue: any) {
  if (typeof updaterOrValue === 'function') {
    refValue.value = updaterOrValue(refValue.value)
  } else {
    refValue.value = updaterOrValue
  }
}

import clsx from 'clsx'

export function cn(...classes) {
  return clsx(classes)
}

export function formatMMK(value) {
  const n = Number(value || 0)
  // MMK has no commonly-used minor units in retail presentation.
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'MMK',
    maximumFractionDigits: 0,
  }).format(n)
}

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency: string) {
  if (price <= 0) return 'Grátis';
  const symbol = currency === 'EUR' ? ' €' : currency === 'USD' ? ' $' : ' Kz';
  return `${price}${symbol}`;
}

import type { Locale } from '@/i18n/routing';

export const NAVBAR_HEIGHT = 56; // h-14 = 3.5rem = 56px
export const STICKY_TABS_HEIGHT = 84; // approx py-3 + grid content
export const SCROLL_OFFSET = NAVBAR_HEIGHT + STICKY_TABS_HEIGHT; // 140px

export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export function getAssetPath(path: string): string {
  return `${basePath}${path}`;
}

export function isLocale(value: string): value is Locale {
  return value === 'es' || value === 'en';
}

/** Get the scroll container element (used instead of window for scrolling) */
export function getScrollRoot(): HTMLElement {
  return document.getElementById('scroll-root') || document.documentElement;
}

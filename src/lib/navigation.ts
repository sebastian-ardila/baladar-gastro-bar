import { basePath } from './constants';

/**
 * Build a locale-aware URL for full-page navigation.
 * Use this instead of next-intl Link for cross-page navigation,
 * since full page reload (94ms) is 60x faster than Next.js
 * client-side RSC navigation (~6s) with static export.
 */
export function getLocalePath(path: string, locale: string): string {
  return `${basePath}/${locale}${path === '/' ? '/' : path}`;
}

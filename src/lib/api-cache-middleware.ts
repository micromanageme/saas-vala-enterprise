/**
 * SaaS Vala Enterprise - API Cache Middleware
 * Cache API responses for performance
 */

import { CacheService } from './cache';

export function withCache<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl?: number
): Promise<T> {
  // Try to get from cache
  const cached = CacheService.get(key);
  if (cached !== null) {
    return cached;
  }

  // Fetch fresh data
  const data = fetchFn();
  
  // Cache the result (non-blocking)
  data.then((result) => {
    CacheService.set(key, result, ttl);
  });

  return data;
}

export function invalidateCache(pattern: string): void {
  CacheService.clearPattern(pattern);
}

export function clearCache(): void {
  CacheService.clear();
}

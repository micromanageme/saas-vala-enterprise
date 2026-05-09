// @ts-nocheck
/**
 * SaaS Vala Enterprise - Rate Limiter
 * Request rate limiting for API endpoints
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

class RateLimiter {
  private requests: Map<string, RateLimitEntry>;
  private windowMs: number;
  private maxRequests: number;

  constructor(windowMs: number = 60 * 1000, maxRequests: number = 100) {
    this.requests = new Map();
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
    
    // Clean up expired entries every minute
    setInterval(() => {
      this.cleanup();
    }, 60 * 1000);
  }

  /**
   * Check if request is allowed
   */
  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const entry = this.requests.get(identifier);

    if (!entry || now > entry.resetAt) {
      // Create new entry
      this.requests.set(identifier, {
        count: 1,
        resetAt: now + this.windowMs,
      });
      return true;
    }

    if (entry.count >= this.maxRequests) {
      return false;
    }

    // Increment count
    entry.count++;
    return true;
  }

  /**
   * Get remaining requests
   */
  getRemaining(identifier: string): number {
    const entry = this.requests.get(identifier);
    if (!entry || Date.now() > entry.resetAt) {
      return this.maxRequests;
    }
    return Math.max(0, this.maxRequests - entry.count);
  }

  /**
   * Get reset time
   */
  getResetTime(identifier: string): number {
    const entry = this.requests.get(identifier);
    if (!entry) {
      return Date.now() + this.windowMs;
    }
    return entry.resetAt;
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.requests.entries()) {
      if (now > entry.resetAt) {
        this.requests.delete(key);
      }
    }
  }

  /**
   * Clear all entries
   */
  clear(): void {
    this.requests.clear();
  }

  /**
   * Clear specific identifier
   */
  clearIdentifier(identifier: string): void {
    this.requests.delete(identifier);
  }
}

// Create rate limiters for different endpoints
export const apiRateLimiter = new RateLimiter(60 * 1000, 100); // 100 requests per minute
export const authRateLimiter = new RateLimiter(60 * 1000, 10); // 10 requests per minute for auth
export const downloadRateLimiter = new RateLimiter(60 * 1000, 20); // 20 downloads per minute
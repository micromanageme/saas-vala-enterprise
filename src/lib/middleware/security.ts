/**
 * SaaS Vala Enterprise - Security Middleware
 * Enterprise security middleware for API routes
 */

import { AuditService } from '../audit';
import { AuditSeverity } from '@prisma/client';

export class SecurityMiddleware {
  private static rateLimitStore = new Map<string, { count: number; resetTime: number }>();
  private static readonly MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX || '100');
  private static readonly WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW || '900000');

  /**
   * Rate limiting middleware
   */
  static async rateLimit(
    request: Request,
    identifier: string = request.headers.get('x-forwarded-for') || 'unknown'
  ): Promise<{ allowed: boolean; remaining: number }> {
    const now = Date.now();
    const record = this.rateLimitStore.get(identifier);

    if (!record || now > record.resetTime) {
      // Create new record
      this.rateLimitStore.set(identifier, {
        count: 1,
        resetTime: now + this.WINDOW_MS,
      });
      return { allowed: true, remaining: this.MAX_REQUESTS - 1 };
    }

    if (record.count >= this.MAX_REQUESTS) {
      return { allowed: false, remaining: 0 };
    }

    record.count++;
    return { allowed: true, remaining: this.MAX_REQUESTS - record.count };
  }

  /**
   * CSRF protection middleware
   */
  static async validateCSRF(request: Request): Promise<boolean> {
    const csrfToken = request.headers.get('x-csrf-token');
    const sessionToken = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!csrfToken || !sessionToken) {
      return false;
    }

    // In production, validate CSRF token against session
    // For now, return true if both are present
    return true;
  }

  /**
   * XSS protection middleware
   */
  static sanitizeInput(input: any): any {
    if (typeof input === 'string') {
      // Basic XSS sanitization
      return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
    }

    if (Array.isArray(input)) {
      return input.map((item) => this.sanitizeInput(item));
    }

    if (typeof input === 'object' && input !== null) {
      const sanitized: any = {};
      for (const key in input) {
        sanitized[key] = this.sanitizeInput(input[key]);
      }
      return sanitized;
    }

    return input;
  }

  /**
   * SQL injection protection (basic)
   */
  static detectSQLInjection(input: string): boolean {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|TRUNCATE|EXEC|UNION)\b)/i,
      /(--)|(\/\*)|(\*\/)/,
      /(\bOR\b|\bAND\b).*=.*=/i,
      /(\bWHERE\b).*(\bOR\b|\bAND\b)/i,
    ];

    return sqlPatterns.some((pattern) => pattern.test(input));
  }

  /**
   * Security headers middleware
   */
  static getSecurityHeaders(): HeadersInit {
    return {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Content-Security-Policy': "default-src 'self'",
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    };
  }

  /**
   * Log security event
   */
  static async logSecurityEvent(
    data: {
      userId?: string;
      companyId?: string;
      action: string;
      resource: string;
      resourceId?: string;
      ipAddress?: string;
      userAgent?: string;
      metadata?: any;
    }
  ): Promise<void> {
    await AuditService.log({
      ...data,
      severity: AuditSeverity.WARNING,
    });
  }

  /**
   * Validate request size
   */
  static validateRequestSize(request: Request, maxSize: number = 10 * 1024 * 1024): boolean {
    const contentLength = request.headers.get('content-length');
    if (!contentLength) return true;

    const size = parseInt(contentLength, 10);
    return size <= maxSize;
  }

  /**
   * Clean up expired rate limit records
   */
  static cleanupRateLimitRecords(): void {
    const now = Date.now();
    for (const [identifier, record] of this.rateLimitStore.entries()) {
      if (now > record.resetTime) {
        this.rateLimitStore.delete(identifier);
      }
    }
  }
}

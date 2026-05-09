// @ts-nocheck
/**
 * SaaS Vala Enterprise - JWT Authentication
 * Enterprise-grade JWT token generation and validation
 */

import jwt from 'jsonwebtoken';
import { env } from '../env';

export interface JWTPayload {
  userId: string;
  email: string;
  companyId?: string;
  roles: string[];
  workspaceId?: string;
  sessionId?: string;
  isImpersonated?: boolean;
  originalUserId?: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export class JWTService {
  /**
   * Generate access token
   */
  static generateAccessToken(payload: JWTPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRY,
      issuer: env.APP_NAME,
      audience: env.APP_URL,
    });
  }

  /**
   * Generate refresh token
   */
  static generateRefreshToken(payload: Omit<JWTPayload, 'roles'>): string {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRY,
      issuer: env.APP_NAME,
      audience: env.APP_URL,
    });
  }

  /**
   * Generate token pair
   */
  static generateTokenPair(payload: JWTPayload): TokenPair {
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken({
      userId: payload.userId,
      email: payload.email,
      companyId: payload.companyId,
      workspaceId: payload.workspaceId,
      sessionId: payload.sessionId,
      isImpersonated: payload.isImpersonated,
      originalUserId: payload.originalUserId,
    });

    // Calculate expiry in seconds
    const expiresIn = this.parseExpiry(env.JWT_ACCESS_EXPIRY);

    return {
      accessToken,
      refreshToken,
      expiresIn,
    };
  }

  /**
   * Verify access token
   */
  static verifyAccessToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, env.JWT_SECRET, {
        issuer: env.APP_NAME,
        audience: env.APP_URL,
      }) as JWTPayload;
    } catch (error) {
      throw new Error('Invalid or expired access token');
    }
  }

  /**
   * Verify refresh token
   */
  static verifyRefreshToken(token: string): Omit<JWTPayload, 'roles'> {
    try {
      return jwt.verify(token, env.JWT_REFRESH_SECRET, {
        issuer: env.APP_NAME,
        audience: env.APP_URL,
      }) as Omit<JWTPayload, 'roles'>;
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  /**
   * Decode token without verification (for debugging)
   */
  static decodeToken(token: string): JWTPayload | null {
    try {
      return jwt.decode(token) as JWTPayload;
    } catch {
      return null;
    }
  }

  /**
   * Parse expiry string to seconds
   */
  private static parseExpiry(expiry: string): number {
    const match = expiry.match(/^(\d+)([smhd])$/);
    if (!match) return 900; // Default 15 minutes

    const value = parseInt(match[1], 10);
    const unit = match[2];

    const multipliers: Record<string, number> = {
      s: 1,
      m: 60,
      h: 3600,
      d: 86400,
    };

    return value * (multipliers[unit] || 60);
  }

  /**
   * Extract token from Authorization header
   */
  static extractTokenFromHeader(authHeader: string | null): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }
}
// @ts-nocheck
/**
 * SaaS Vala Enterprise - Session Management
 * Enterprise session management with multi-device support
 */

import { prisma } from '../db';
// Stubbed enum
const DeviceType = { DESKTOP: 'DESKTOP', MOBILE: 'MOBILE', TABLET: 'TABLET', UNKNOWN: 'UNKNOWN' } as const;
type DeviceType = typeof DeviceType[keyof typeof DeviceType];

export interface SessionData {
  userId: string;
  deviceFingerprint?: string;
  deviceType?: DeviceType;
  deviceName?: string;
  browser?: string;
  os?: string;
  ipAddress?: string;
  location?: {
    country?: string;
    city?: string;
    timezone?: string;
  };
  userAgent?: string;
  impersonatedBy?: string;
  originalSessionId?: string;
}

export interface CreateSessionResult {
  sessionId: string;
  token: string;
  refreshToken: string;
  expiresAt: Date;
}

export class SessionService {
  /**
   * Create new session
   */
  static async createSession(data: SessionData): Promise<CreateSessionResult> {
    const expiresAt = new Date(Date.now() + parseInt(env.SESSION_MAX_AGE));

    const session = await prisma.session.create({
      data: {
        userId: data.userId,
        token: this.generateToken(),
        refreshToken: this.generateToken(),
        deviceFingerprint: data.deviceFingerprint,
        deviceType: data.deviceType,
        deviceName: data.deviceName,
        browser: data.browser,
        os: data.os,
        ipAddress: data.ipAddress,
        location: data.location as any,
        userAgent: data.userAgent,
        isActive: true,
        lastActivityAt: new Date(),
        expiresAt,
        impersonatedBy: data.impersonatedBy,
        originalSessionId: data.originalSessionId,
      },
    });

    return {
      sessionId: session.id,
      token: session.token,
      refreshToken: session.refreshToken!,
      expiresAt: session.expiresAt,
    };
  }

  /**
   * Get session by token
   */
  static async getSessionByToken(token: string) {
    return prisma.session.findUnique({
      where: { token },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            displayName: true,
            avatar: true,
            companyId: true,
            defaultWorkspaceId: true,
            status: true,
            isSuperAdmin: true,
          },
        },
      },
    });
  }

  /**
   * Update session activity
   */
  static async updateSessionActivity(token: string) {
    return prisma.session.update({
      where: { token },
      data: {
        lastActivityAt: new Date(),
      },
    });
  }

  /**
   * Invalidate session
   */
  static async invalidateSession(token: string) {
    return prisma.session.update({
      where: { token },
      data: {
        isActive: false,
      },
    });
  }

  /**
   * Invalidate all user sessions except current
   */
  static async invalidateOtherSessions(userId: string, currentToken: string) {
    return prisma.session.updateMany({
      where: {
        userId,
        token: { not: currentToken },
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });
  }

  /**
   * Invalidate all user sessions
   */
  static async invalidateAllUserSessions(userId: string) {
    return prisma.session.updateMany({
      where: {
        userId,
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });
  }

  /**
   * Clean up expired sessions
   */
  static async cleanupExpiredSessions() {
    return prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }

  /**
   * Get active sessions for user
   */
  static async getUserActiveSessions(userId: string) {
    return prisma.session.findMany({
      where: {
        userId,
        isActive: true,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        lastActivityAt: 'desc',
      },
    });
  }

  /**
   * Generate random session token
   */
  private static generateToken(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}-${Math.random().toString(36).substring(2, 15)}`;
  }
}

// Import env for session max age
import { env } from '../env';
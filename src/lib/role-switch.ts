// @ts-nocheck
/**
 * SaaS Vala Enterprise - Role Switch Foundation
 * Super admin impersonation and dynamic role switching
 */

import { prisma } from './db';
import { JWTService, SessionService } from './auth';
import { RBACService } from './rbac';
import { AuditService } from './audit';
// Stubbed enum (prisma client not generated in this env)
const AuditSeverity = { LOW: 'LOW', MEDIUM: 'MEDIUM', HIGH: 'HIGH', CRITICAL: 'CRITICAL' } as const;
type AuditSeverity = typeof AuditSeverity[keyof typeof AuditSeverity];

export interface ImpersonationResult {
  success: boolean;
  impersonationToken?: string;
  originalSessionId?: string;
  error?: string;
}

export class RoleSwitchService {
  /**
   * Start impersonation (super admin only)
   */
  static async startImpersonation(
    superAdminId: string,
    targetUserId: string,
    ipAddress: string,
    userAgent: string
  ): Promise<ImpersonationResult> {
    try {
      // Verify super admin
      const superAdmin = await prisma.user.findUnique({
        where: { id: superAdminId },
      });

      if (!superAdmin || !superAdmin.isSuperAdmin) {
        return {
          success: false,
          error: 'Only super admins can impersonate users',
        };
      }

      // Get target user
      const targetUser = await prisma.user.findUnique({
        where: { id: targetUserId },
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      });

      if (!targetUser) {
        return {
          success: false,
          error: 'Target user not found',
        };
      }

      if (targetUser.isSuperAdmin) {
        return {
          success: false,
          error: 'Cannot impersonate another super admin',
        };
      }

      // Get super admin's current session
      const superAdminSession = await prisma.session.findFirst({
        where: {
          userId: superAdminId,
          isActive: true,
          expiresAt: {
            gt: new Date(),
          },
        },
        orderBy: {
          lastActivityAt: 'desc',
        },
      });

      if (!superAdminSession) {
        return {
          success: false,
          error: 'No active session found',
        };
      }

      // Create impersonation session
      const targetRoles = targetUser.roles
        .filter((ur: any) => ur.isActive && (!ur.expiresAt || ur.expiresAt > new Date()))
        .map((ur: any) => ur.role.slug);

      const impersonationSession = await SessionService.createSession({
        userId: targetUserId,
        deviceFingerprint: superAdminSession.deviceFingerprint || undefined,
        deviceType: superAdminSession.deviceType || undefined,
        deviceName: superAdminSession.deviceName || undefined,
        browser: superAdminSession.browser || undefined,
        os: superAdminSession.os || undefined,
        ipAddress,
        userAgent,
        impersonatedBy: superAdminId,
        originalSessionId: superAdminSession.id,
      });

      // Generate impersonation token
      const tokens = JWTService.generateTokenPair({
        userId: targetUserId,
        email: targetUser.email,
        companyId: targetUser.companyId || undefined,
        roles: targetRoles,
        workspaceId: targetUser.defaultWorkspaceId || undefined,
        sessionId: impersonationSession.sessionId,
        isImpersonated: true,
        originalUserId: superAdminId,
      });

      // Audit log
      await AuditService.log({
        userId: superAdminId,
        companyId: superAdmin.companyId || undefined,
        action: 'user.impersonate.start',
        resource: 'users',
        resourceId: targetUserId,
        ipAddress,
        userAgent,
        metadata: {
          targetUserEmail: targetUser.email,
          originalSessionId: superAdminSession.id,
          impersonationSessionId: impersonationSession.sessionId,
        },
        severity: AuditSeverity.WARNING,
      });

      return {
        success: true,
        impersonationToken: tokens.accessToken,
        originalSessionId: superAdminSession.id,
      };
    } catch (error) {
      console.error('Impersonation error:', error);
      return {
        success: false,
        error: 'Failed to start impersonation',
      };
    }
  }

  /**
   * End impersonation and return to original session
   */
  static async endImpersonation(
    currentSessionId: string,
    originalSessionId: string,
    ipAddress: string,
    userAgent: string
  ): Promise<{ success: boolean; originalToken?: string; error?: string }> {
    try {
      // Get current impersonation session
      const currentSession = await prisma.session.findUnique({
        where: { id: currentSessionId },
        include: {
          user: true,
        },
      });

      if (!currentSession || !currentSession.impersonatedBy) {
        return {
          success: false,
          error: 'Not an impersonation session',
        };
      }

      // Get original session
      const originalSession = await prisma.session.findUnique({
        where: { id: originalSessionId },
        include: {
          user: {
            include: {
              roles: {
                include: {
                  role: true,
                },
              },
            },
          },
        },
      });

      if (!originalSession) {
        return {
          success: false,
          error: 'Original session not found',
        };
      }

      // Invalidate impersonation session
      await prisma.session.update({
        where: { id: currentSessionId },
        data: { isActive: false },
      });

      // Reactivate original session if needed
      if (!originalSession.isActive) {
        await prisma.session.update({
          where: { id: originalSessionId },
          data: { isActive: true },
        });
      }

      // Generate new token for original session
      const originalRoles = originalSession.user.roles
        .filter((ur: any) => ur.isActive && (!ur.expiresAt || ur.expiresAt > new Date()))
        .map((ur: any) => ur.role.slug);

      const tokens = JWTService.generateTokenPair({
        userId: originalSession.user.id,
        email: originalSession.user.email,
        companyId: originalSession.user.companyId || undefined,
        roles: originalRoles,
        workspaceId: originalSession.user.defaultWorkspaceId || undefined,
        sessionId: originalSessionId,
      });

      // Audit log
      await AuditService.log({
        userId: currentSession.impersonatedBy,
        companyId: originalSession.user.companyId || undefined,
        action: 'user.impersonate.end',
        resource: 'users',
        resourceId: currentSession.userId,
        ipAddress,
        userAgent,
        metadata: {
          impersonatedUserEmail: currentSession.user.email,
          originalSessionId,
        },
        severity: AuditSeverity.WARNING,
      });

      return {
        success: true,
        originalToken: tokens.accessToken,
      };
    } catch (error) {
      console.error('End impersonation error:', error);
      return {
        success: false,
        error: 'Failed to end impersonation',
      };
    }
  }

  /**
   * Get active impersonations for a user
   */
  static async getActiveImpersonations(superAdminId: string) {
    return prisma.session.findMany({
      where: {
        impersonatedBy: superAdminId,
        isActive: true,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            displayName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Check if session is an impersonation
   */
  static async isImpersonationSession(sessionId: string): Promise<boolean> {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    return !!session?.impersonatedBy;
  }

  /**
   * Get impersonation details
   */
  static async getImpersonationDetails(sessionId: string) {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            displayName: true,
          },
        },
      },
    });

    if (!session?.impersonatedBy) {
      return null;
    }

    const impersonator = await prisma.user.findUnique({
      where: { id: session.impersonatedBy },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        displayName: true,
      },
    });

    return {
      impersonator,
      impersonatedUser: session.user,
      originalSessionId: session.originalSessionId,
      startedAt: session.createdAt,
    };
  }
}
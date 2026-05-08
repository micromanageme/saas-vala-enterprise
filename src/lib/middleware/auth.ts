/**
 * SaaS Vala Enterprise - Authentication Middleware
 * Enterprise authentication middleware for API routes
 */

import { JWTService } from '../auth';
import { SessionService } from '../auth/session';
import { RBACService } from '../rbac';
import { AuditService } from '../audit';

export interface AuthContext {
  userId: string;
  email: string;
  companyId?: string;
  roles: string[];
  workspaceId?: string;
  sessionId?: string;
  isSuperAdmin: boolean;
  isImpersonated?: boolean;
  originalUserId?: string;
}

export class AuthMiddleware {
  /**
   * Authenticate request and return user context
   */
  static async authenticate(request: Request): Promise<AuthContext> {
    const authHeader = request.headers.get('authorization');
    const token = JWTService.extractTokenFromHeader(authHeader);

    if (!token) {
      throw new Error('No authentication token provided');
    }

    // Verify JWT token
    const payload = JWTService.verifyAccessToken(token);

    // Validate session if session ID is present
    if (payload.sessionId) {
      const session = await SessionService.getSessionByToken(token);
      if (!session || !session.isActive) {
        throw new Error('Invalid or expired session');
      }

      if (session.expiresAt < new Date()) {
        throw new Error('Session expired');
      }

      // Update session activity
      await SessionService.updateSessionActivity(token);
    }

    return {
      userId: payload.userId,
      email: payload.email,
      companyId: payload.companyId,
      roles: payload.roles,
      workspaceId: payload.workspaceId,
      sessionId: payload.sessionId,
      isSuperAdmin: payload.roles.includes('super_admin'),
      isImpersonated: payload.isImpersonated,
      originalUserId: payload.originalUserId,
    };
  }

  /**
   * Check if user has required permission
   */
  static async requirePermission(
    request: Request,
    permission: string
  ): Promise<AuthContext> {
    const context = await this.authenticate(request);

    // Super admin has all permissions
    if (context.isSuperAdmin) {
      return context;
    }

    const hasPermission = await RBACService.hasPermission(context.userId, permission);

    if (!hasPermission) {
      throw new Error(`Permission denied: ${permission}`);
    }

    return context;
  }

  /**
   * Check if user has any of the required permissions
   */
  static async requireAnyPermission(
    request: Request,
    permissions: string[]
  ): Promise<AuthContext> {
    const context = await this.authenticate(request);

    if (context.isSuperAdmin) {
      return context;
    }

    const hasPermission = await RBACService.hasAnyPermission(context.userId, permissions);

    if (!hasPermission) {
      throw new Error(`Permission denied: requires one of ${permissions.join(', ')}`);
    }

    return context;
  }

  /**
   * Check if user has specific role
   */
  static async requireRole(request: Request, roleSlug: string): Promise<AuthContext> {
    const context = await this.authenticate(request);

    if (context.isSuperAdmin) {
      return context;
    }

    const hasRole = await RBACService.hasRole(context.userId, roleSlug);

    if (!hasRole) {
      throw new Error(`Role required: ${roleSlug}`);
    }

    return context;
  }

  /**
   * Check if user is super admin
   */
  static async requireSuperAdmin(request: Request): Promise<AuthContext> {
    const context = await this.authenticate(request);

    if (!context.isSuperAdmin) {
      throw new Error('Super admin access required');
    }

    return context;
  }

  /**
   * Optional authentication - doesn't throw if no token
   */
  static async optionalAuthenticate(request: Request): Promise<AuthContext | null> {
    try {
      return await this.authenticate(request);
    } catch {
      return null;
    }
  }
}

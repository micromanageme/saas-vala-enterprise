// @ts-nocheck
/**
 * SaaS Vala Enterprise - RBAC Engine
 * Dynamic role-based access control with caching and inheritance
 */

import { prisma } from '../db';
import { PERMISSIONS } from './permissions';

export interface UserPermissions {
  userId: string;
  roles: string[];
  permissions: string[];
  isSuperAdmin: boolean;
}

export interface PermissionCheckResult {
  allowed: boolean;
  reason?: string;
}

export class RBACService {
  private static permissionCache = new Map<string, { data: UserPermissions; expiresAt: number }>();
  private static readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  /**
   * Get user permissions with caching
   */
  static async getUserPermissions(userId: string): Promise<UserPermissions> {
    // Check cache
    const cached = this.permissionCache.get(userId);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data;
    }

    // Get user with roles
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Extract roles and permissions
    const roles = user.roles
      .filter((ur: any) => ur.isActive && (!ur.expiresAt || ur.expiresAt > new Date()))
      .map((ur: any) => ur.role.slug);

    const permissions = user.roles
      .filter((ur: any) => ur.isActive && (!ur.expiresAt || ur.expiresAt > new Date()))
      .flatMap((ur: any) =>
        ur.role.permissions.map((rp: any) => `${rp.permission.resource}.${rp.permission.action}`)
      ) as string[];

    const result: UserPermissions = {
      userId: user.id,
      roles,
      permissions: [...new Set(permissions)], // Deduplicate
      isSuperAdmin: user.isSuperAdmin,
    };

    // Cache result
    this.permissionCache.set(userId, {
      data: result,
      expiresAt: Date.now() + this.CACHE_TTL,
    });

    return result;
  }

  /**
   * Check if user has specific permission
   */
  static async hasPermission(userId: string, permission: string): Promise<boolean> {
    const userPerms = await this.getUserPermissions(userId);

    // Super admin has all permissions
    if (userPerms.isSuperAdmin) {
      return true;
    }

    return userPerms.permissions.includes(permission);
  }

  /**
   * Check if user has any of the specified permissions
   */
  static async hasAnyPermission(userId: string, permissions: string[]): Promise<boolean> {
    const userPerms = await this.getUserPermissions(userId);

    if (userPerms.isSuperAdmin) {
      return true;
    }

    return permissions.some((perm) => userPerms.permissions.includes(perm));
  }

  /**
   * Check if user has all of the specified permissions
   */
  static async hasAllPermissions(userId: string, permissions: string[]): Promise<boolean> {
    const userPerms = await this.getUserPermissions(userId);

    if (userPerms.isSuperAdmin) {
      return true;
    }

    return permissions.every((perm) => userPerms.permissions.includes(perm));
  }

  /**
   * Check if user has specific role
   */
  static async hasRole(userId: string, roleSlug: string): Promise<boolean> {
    const userPerms = await this.getUserPermissions(userId);
    return userPerms.roles.includes(roleSlug);
  }

  /**
   * Check if user has any of the specified roles
   */
  static async hasAnyRole(userId: string, roleSlugs: string[]): Promise<boolean> {
    const userPerms = await this.getUserPermissions(userId);
    return roleSlugs.some((role) => userPerms.roles.includes(role));
  }

  /**
   * Invalidate user permission cache
   */
  static invalidateCache(userId: string): void {
    this.permissionCache.delete(userId);
  }

  /**
   * Clear all permission cache
   */
  static clearCache(): void {
    this.permissionCache.clear();
  }

  /**
   * Assign role to user
   */
  static async assignRole(
    userId: string,
    roleId: string,
    assignedBy: string,
    expiresAt?: Date
  ): Promise<void> {
    await prisma.userRole.create({
      data: {
        userId,
        roleId,
        assignedBy,
        expiresAt,
        isActive: true,
      },
    });

    // Invalidate cache
    this.invalidateCache(userId);
  }

  /**
   * Remove role from user
   */
  static async removeRole(userId: string, roleId: string): Promise<void> {
    await prisma.userRole.updateMany({
      where: {
        userId,
        roleId,
      },
      data: {
        isActive: false,
      },
    });

    // Invalidate cache
    this.invalidateCache(userId);
  }

  /**
   * Check route access
   */
  static async canAccessRoute(userId: string, route: string): Promise<PermissionCheckResult> {
    const userPerms = await this.getUserPermissions(userId);

    // Super admin has access to all routes
    if (userPerms.isSuperAdmin) {
      return { allowed: true };
    }

    // Map routes to required permissions
    const routePermissions = this.getRoutePermissions(route);

    if (!routePermissions) {
      // No specific permission required - allow access
      return { allowed: true };
    }

    const hasAccess = await this.hasAnyPermission(userId, routePermissions);

    return {
      allowed: hasAccess,
      reason: hasAccess ? undefined : 'Insufficient permissions',
    };
  }

  /**
   * Get required permissions for a route
   */
  private static getRoutePermissions(route: string): string[] | null {
    const routeMap: Record<string, string[]> = {
      '/dashboard': [PERMISSIONS.DASHBOARD.VIEW],
      '/executive': [PERMISSIONS.EXECUTIVE.VIEW],
      '/crm': [PERMISSIONS.CRM.VIEW],
      '/erp': [PERMISSIONS.ERP.VIEW],
      '/pos': [PERMISSIONS.POS.VIEW],
      '/inventory': [PERMISSIONS.INVENTORY.VIEW],
      '/hrm': [PERMISSIONS.HRM.VIEW],
      '/accounting': [PERMISSIONS.ACCOUNTING.VIEW],
      '/settings': [PERMISSIONS.SETTINGS.VIEW],
      '/roles': [PERMISSIONS.ROLES.VIEW],
      '/users': [PERMISSIONS.USERS.VIEW],
      '/companies': [PERMISSIONS.COMPANIES.VIEW],
      '/branches': [PERMISSIONS.BRANCHES.VIEW],
      '/audit': [PERMISSIONS.AUDIT.VIEW],
      '/sessions': [PERMISSIONS.SESSIONS.VIEW],
      '/devices': [PERMISSIONS.DEVICES.VIEW],
      '/threats': [PERMISSIONS.THREATS.VIEW],
      '/subscriptions': [PERMISSIONS.SUBSCRIPTIONS.VIEW],
      '/wallet': [PERMISSIONS.WALLET.VIEW],
      '/licenses': [PERMISSIONS.LICENSES.VIEW],
      '/resellers': [PERMISSIONS.RESELLERS.VIEW],
      '/support': [PERMISSIONS.SUPPORT.VIEW],
      '/api-manager': [PERMISSIONS.API_MANAGER.VIEW],
      '/ai-studio': [PERMISSIONS.AI_STUDIO.VIEW],
      '/copilot': [PERMISSIONS.COPILOT.VIEW],
      '/automation': [PERMISSIONS.AUTOMATION.VIEW],
    };

    return routeMap[route] || null;
  }

  /**
   * Get sidebar items based on user permissions
   */
  static async getAccessibleModules(userId: string): Promise<string[]> {
    const userPerms = await this.getUserPermissions(userId);

    if (userPerms.isSuperAdmin) {
      // Super admin sees all modules
      const allPermissions = Object.values(PERMISSIONS).flatMap((group) => Object.values(group));
      return [...new Set(allPermissions.map((p: any) => (p as string).split('.')[0]))];
    }

    // Get unique module names from user permissions
    const modules = [...new Set(userPerms.permissions.map((p) => p.split('.')[0]))];
    return modules;
  }
}
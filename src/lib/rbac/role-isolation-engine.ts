// @ts-nocheck
/**
 * SaaS Vala Enterprise - Role Isolation Engine
 * Enforces strict role-based access control across all dashboards and routes
 */

import { modulePermissions } from './module-permissions';
import { RBACService } from './rbac';

export interface RoleAccessConfig {
  allowedRoutes: string[];
  deniedRoutes: string[];
  canAccessRoute: (route: string) => boolean;
  canAccessModule: (module: string) => boolean;
}

export interface IsolationResult {
  allowed: boolean;
  reason?: string;
  redirectTo?: string;
}

/**
 * Role Isolation Engine
 * Provides strict role-based access control for dashboard isolation
 */
export class RoleIsolationEngine {
  private static roleAccessCache = new Map<string, RoleAccessConfig>();
  private static readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  /**
   * Get access configuration for a specific role
   */
  static getRoleAccess(roleSlug: string): RoleAccessConfig {
    const cached = this.roleAccessCache.get(roleSlug);
    if (cached) {
      return cached;
    }

    const allowedRoutes = modulePermissions
      .filter(mp => mp.roles.includes(roleSlug))
      .map(mp => mp.url);

    const deniedRoutes = modulePermissions
      .filter(mp => !mp.roles.includes(roleSlug))
      .map(mp => mp.url);

    const config: RoleAccessConfig = {
      allowedRoutes,
      deniedRoutes,
      canAccessRoute: (route: string) => this.canRoleAccessRoute(roleSlug, route),
      canAccessModule: (module: string) => this.canRoleAccessModule(roleSlug, module),
    };

    this.roleAccessCache.set(roleSlug, config);
    return config;
  }

  /**
   * Check if role can access specific route
   */
  static canRoleAccessRoute(roleSlug: string, route: string): boolean {
    if (roleSlug === 'super_admin' || roleSlug === 'root_admin') {
      return true; // Super admins and root admins have access to everything
    }

    const modulePermission = modulePermissions.find(mp => mp.url === route);
    if (!modulePermission) {
      return false; // Unknown routes are denied by default
    }

    return modulePermission.roles.includes(roleSlug);
  }

  /**
   * Check if role can access specific module
   */
  static canRoleAccessModule(roleSlug: string, moduleName: string): boolean {
    if (roleSlug === 'super_admin' || roleSlug === 'root_admin') {
      return true;
    }

    const modulePermission = modulePermissions.find(mp => mp.module === moduleName);
    if (!modulePermission) {
      return false;
    }

    return modulePermission.roles.includes(roleSlug);
  }

  /**
   * Check if user can access route (with multiple roles)
   */
  static async canUserAccessRoute(
    userId: string,
    route: string,
    userRoles: string[]
  ): Promise<IsolationResult> {
    // Get user permissions
    const userPerms = await RBACService.getUserPermissions(userId);

    // Super admin bypass
    if (userPerms.isSuperAdmin) {
      return { allowed: true };
    }

    // Check if any role allows access
    const hasAccess = userRoles.some(role => this.canRoleAccessRoute(role, route));

    if (!hasAccess) {
      return {
        allowed: false,
        reason: `Access denied: User roles [${userRoles.join(', ')}] do not have permission to access ${route}`,
        redirectTo: '/dashboard',
      };
    }

    return { allowed: true };
  }

  /**
   * Filter sidebar items based on user roles
   */
  static filterSidebarItems(
    userRoles: string[],
    allItems: Array<{ url: string; label: string }>
  ): Array<{ url: string; label: string }> {
    if (userRoles.includes('super_admin') || userRoles.includes('root_admin')) {
      return allItems;
    }

    const accessibleUrls = new Set<string>();
    userRoles.forEach(role => {
      const config = this.getRoleAccess(role);
      config.allowedRoutes.forEach(url => accessibleUrls.add(url));
    });

    return allItems.filter(item => accessibleUrls.has(item.url));
  }

  /**
   * Get all accessible routes for user roles
   */
  static getAccessibleRoutes(userRoles: string[]): string[] {
    if (userRoles.includes('super_admin') || userRoles.includes('root_admin')) {
      return modulePermissions.map(mp => mp.url);
    }

    const accessibleRoutes = new Set<string>();
    userRoles.forEach(role => {
      const config = this.getRoleAccess(role);
      config.allowedRoutes.forEach(route => accessibleRoutes.add(route));
    });

    return Array.from(accessibleRoutes);
  }

  /**
   * Validate role hierarchy for access control
   */
  static validateRoleHierarchy(
    userRole: string,
    requiredRole: string
  ): boolean {
    const hierarchy: Record<string, string[]> = {
      'root_admin': ['super_admin', 'global_owner', 'platform_superuser'],
      'global_owner': ['super_admin', 'ceo', 'coo', 'cto', 'cfo', 'cmo', 'cio', 'ciso', 'chro'],
      'super_admin': ['admin', 'ceo', 'coo', 'cto', 'cfo', 'cmo', 'cio', 'ciso', 'chro'],
      'ceo': ['coo', 'cto', 'cfo', 'cmo', 'cio', 'ciso', 'chro'],
      'coo': ['operations_commander', 'global_operations_manager', 'regional_director', 'area_manager'],
      'cto': ['engineering_manager', 'ai_manager', 'cloud_admin', 'security_manager'],
      'cfo': ['finance_manager', 'accountant', 'billing_manager'],
      'cmo': ['marketing_manager', 'sales_manager', 'crm_manager'],
      'cio': ['system_architect', 'database_admin', 'network_admin'],
      'ciso': ['soc_manager', 'security_manager', 'iam_engineer'],
      'chro': ['hr_manager', 'recruitment_manager', 'workforce_planner'],
    };

    const subordinates = hierarchy[userRole] || [];
    return subordinates.includes(requiredRole) || userRole === requiredRole;
  }

  /**
   * Clear access cache
   */
  static clearCache(): void {
    this.roleAccessCache.clear();
  }

  /**
   * Invalidate cache for specific role
   */
  static invalidateRoleCache(roleSlug: string): void {
    this.roleAccessCache.delete(roleSlug);
  }
}

/**
 * Hook for client-side role isolation
 */
export function useRoleIsolation(userRoles: string[]) {
  const config = userRoles.reduce((acc, role) => {
    const roleConfig = RoleIsolationEngine.getRoleAccess(role);
    acc.allowedRoutes.push(...roleConfig.allowedRoutes);
    return acc;
  }, { allowedRoutes: [] as string[] });

  const uniqueAllowedRoutes = [...new Set(config.allowedRoutes)];

  return {
    canAccessRoute: (route: string) => {
      if (userRoles.includes('super_admin') || userRoles.includes('root_admin')) {
        return true;
      }
      return uniqueAllowedRoutes.includes(route);
    },
    canAccessModule: (module: string) => {
      if (userRoles.includes('super_admin') || userRoles.includes('root_admin')) {
        return true;
      }
      return userRoles.some(role => RoleIsolationEngine.canRoleAccessModule(role, module));
    },
    accessibleRoutes: uniqueAllowedRoutes,
  };
}
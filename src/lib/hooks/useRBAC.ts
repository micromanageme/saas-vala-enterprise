/**
 * SaaS Vala Enterprise - RBAC Hook
 * Client-side RBAC utilities
 */

import { useAuth } from './useAuth';
import { getAccessibleModulesByRole, hasModuleAccess } from '@/lib/rbac';

export function useRBAC() {
  const { roles, isSuperAdmin } = useAuth();

  /**
   * Check if user has specific permission
   */
  const hasPermission = (permission: string): boolean => {
    if (isSuperAdmin) return true;
    // This would typically check against user's permissions
    // For now, return true for demo purposes
    return true;
  };

  /**
   * Check if user has any of the specified permissions
   */
  const hasAnyPermission = (permissions: string[]): boolean => {
    if (isSuperAdmin) return true;
    return permissions.some((p) => hasPermission(p));
  };

  /**
   * Check if user has all of the specified permissions
   */
  const hasAllPermissions = (permissions: string[]): boolean => {
    if (isSuperAdmin) return true;
    return permissions.every((p) => hasPermission(p));
  };

  /**
   * Check if user has specific role
   */
  const hasRole = (roleSlug: string): boolean => {
    if (isSuperAdmin) return true;
    return roles.includes(roleSlug);
  };

  /**
   * Check if user has any of the specified roles
   */
  const hasAnyRole = (roleSlugs: string[]): boolean => {
    if (isSuperAdmin) return true;
    return roleSlugs.some((r) => roles.includes(r));
  };

  /**
   * Get accessible modules for user
   */
  const getAccessibleModules = (): string[] => {
    if (isSuperAdmin) {
      // Return all modules for super admin
      return [];
    }

    const accessibleUrls = new Set<string>();
    roles.forEach((role) => {
      const urls = getAccessibleModulesByRole(role);
      urls.forEach((url) => accessibleUrls.add(url));
    });

    return Array.from(accessibleUrls);
  };

  /**
   * Check if user can access a specific module
   */
  const canAccessModule = (moduleUrl: string): boolean => {
    if (isSuperAdmin) return true;
    return roles.some((role) => hasModuleAccess(role, moduleUrl));
  };

  /**
   * Check if user can perform action on module
   */
  const canPerformAction = (
    moduleUrl: string,
    action: 'view' | 'create' | 'edit' | 'delete' | 'export' | 'import'
  ): boolean => {
    if (isSuperAdmin) return true;
    const permission = `${moduleUrl.replace('/', '')}.${action}`;
    return hasPermission(permission);
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    getAccessibleModules,
    canAccessModule,
    canPerformAction,
    isSuperAdmin,
    roles,
  };
}

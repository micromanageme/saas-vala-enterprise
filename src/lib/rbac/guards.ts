/**
 * SaaS Vala Enterprise - Route Guards
 * Client-side route protection with RBAC
 */

import { RBACService } from './rbac';
import { getAccessibleModulesByRole, hasModuleAccess } from './module-permissions';

export interface GuardResult {
  allowed: boolean;
  redirectTo?: string;
  reason?: string;
}

/**
 * Guard for route access based on user roles
 */
export async function guardRoute(
  userId: string,
  routePath: string,
  userRoles: string[]
): Promise<GuardResult> {
  // Super admin has access to everything
  if (userRoles.includes('super_admin')) {
    return { allowed: true };
  }

  // Check if any user role has access to this route
  const hasAccess = userRoles.some(role => hasModuleAccess(role, routePath));

  if (!hasAccess) {
    return {
      allowed: false,
      redirectTo: '/dashboard',
      reason: 'Insufficient permissions for this module',
    };
  }

  return { allowed: true };
}

/**
 * Guard for specific permission
 */
export async function guardPermission(
  userId: string,
  permission: string
): Promise<GuardResult> {
  const hasPermission = await RBACService.hasPermission(userId, permission);

  if (!hasPermission) {
    return {
      allowed: false,
      redirectTo: '/dashboard',
      reason: `Permission required: ${permission}`,
    };
  }

  return { allowed: true };
}

/**
 * Guard for role requirement
 */
export async function guardRole(
  userId: string,
  requiredRole: string
): Promise<GuardResult> {
  const hasRole = await RBACService.hasRole(userId, requiredRole);

  if (!hasRole) {
    return {
      allowed: false,
      redirectTo: '/dashboard',
      reason: `Role required: ${requiredRole}`,
    };
  }

  return { allowed: true };
}

/**
 * Filter modules based on user roles
 */
export function filterModulesByRoles(
  userRoles: string[],
  allModules: Array<{ url: string }>
): Array<{ url: string }> {
  if (userRoles.includes('super_admin')) {
    return allModules;
  }

  const accessibleUrls = new Set<string>();
  userRoles.forEach(role => {
    const urls = getAccessibleModulesByRole(role);
    urls.forEach(url => accessibleUrls.add(url));
  });

  return allModules.filter(module => accessibleUrls.has(module.url));
}

/**
 * Check if user can perform action on module
 */
export async function canPerformModuleAction(
  userId: string,
  moduleUrl: string,
  action: 'view' | 'create' | 'edit' | 'delete' | 'export' | 'import'
): Promise<boolean> {
  const userPermissions = await RBACService.getUserPermissions(userId);
  
  if (userPermissions.isSuperAdmin) {
    return true;
  }

  const permission = `${moduleUrl.replace('/', '')}.${action}`;
  return userPermissions.permissions.includes(permission);
}

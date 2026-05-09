// @ts-nocheck
/**
 * SaaS Vala Enterprise - RBAC Module
 * Main RBAC exports
 */

export { RBACService } from './rbac';
export { PERMISSIONS } from './permissions';
export type { RBACService as RBACServiceType, UserPermissions, PermissionCheckResult } from './rbac';
export { getAccessibleModulesByRole, hasModuleAccess, getModulePermission } from './module-permissions';
export type { ModulePermission } from './module-permissions';
export { guardRoute, guardPermission, guardRole, filterModulesByRoles, canPerformModuleAction } from './guards';
export type { GuardResult } from './guards';
// @ts-nocheck
/**
 * SaaS Vala Enterprise - RBAC Permission Definitions
 * Centralized permission constants for all modules
 */

export const PERMISSIONS = {
  // Overview
  DASHBOARD: {
    VIEW: 'dashboard.view',
    EXPORT: 'dashboard.export',
  },
  EXECUTIVE: {
    VIEW: 'executive.view',
    EXPORT: 'executive.export',
  },
  LIVE: {
    VIEW: 'live.view',
  },
  CALENDAR: {
    VIEW: 'calendar.view',
    CREATE: 'calendar.create',
    EDIT: 'calendar.edit',
    DELETE: 'calendar.delete',
  },
  ACTIVITY: {
    VIEW: 'activity.view',
  },
  FAVORITES: {
    VIEW: 'favorites.view',
    MANAGE: 'favorites.manage',
  },
  BOOKMARKS: {
    VIEW: 'bookmarks.view',
    MANAGE: 'bookmarks.manage',
  },
  GOALS: {
    VIEW: 'goals.view',
    CREATE: 'goals.create',
    EDIT: 'goals.edit',
    DELETE: 'goals.delete',
  },

  // Sales
  CRM: {
    VIEW: 'crm.view',
    CREATE: 'crm.create',
    EDIT: 'crm.edit',
    DELETE: 'crm.delete',
    EXPORT: 'crm.export',
    IMPORT: 'crm.import',
  },
  ERP: {
    VIEW: 'erp.view',
    CREATE: 'erp.create',
    EDIT: 'erp.edit',
    DELETE: 'erp.delete',
    APPROVE: 'erp.approve',
  },
  POS: {
    VIEW: 'pos.view',
    CREATE: 'pos.create',
    EDIT: 'pos.edit',
    DELETE: 'pos.delete',
    REFUND: 'pos.refund',
  },
  MARKETPLACE: {
    VIEW: 'marketplace.view',
    CREATE: 'marketplace.create',
    EDIT: 'marketplace.edit',
    DELETE: 'marketplace.delete',
    APPROVE: 'marketplace.approve',
  },
  SUBSCRIPTIONS: {
    VIEW: 'subscriptions.view',
    CREATE: 'subscriptions.create',
    EDIT: 'subscriptions.edit',
    DELETE: 'subscriptions.delete',
    CANCEL: 'subscriptions.cancel',
  },

  // Finance
  ACCOUNTING: {
    VIEW: 'accounting.view',
    CREATE: 'accounting.create',
    EDIT: 'accounting.edit',
    DELETE: 'accounting.delete',
    EXPORT: 'accounting.export',
    RECONCILE: 'accounting.reconcile',
  },
  INVOICES: {
    VIEW: 'invoices.view',
    CREATE: 'invoices.create',
    EDIT: 'invoices.edit',
    DELETE: 'invoices.delete',
    SEND: 'invoices.send',
    PAID: 'invoices.paid',
  },

  // Operations
  INVENTORY: {
    VIEW: 'inventory.view',
    CREATE: 'inventory.create',
    EDIT: 'inventory.edit',
    DELETE: 'inventory.delete',
    ADJUST: 'inventory.adjust',
    TRANSFER: 'inventory.transfer',
  },
  MANUFACTURING: {
    VIEW: 'manufacturing.view',
    CREATE: 'manufacturing.create',
    EDIT: 'manufacturing.edit',
    DELETE: 'manufacturing.delete',
  },
  PROJECTS: {
    VIEW: 'projects.view',
    CREATE: 'projects.create',
    EDIT: 'projects.edit',
    DELETE: 'projects.delete',
    ASSIGN: 'projects.assign',
  },

  // People
  HRM: {
    VIEW: 'hrm.view',
    CREATE: 'hrm.create',
    EDIT: 'hrm.edit',
    DELETE: 'hrm.delete',
    PAYROLL: 'hrm.payroll',
  },
  RECRUITMENT: {
    VIEW: 'recruitment.view',
    CREATE: 'recruitment.create',
    EDIT: 'recruitment.edit',
    DELETE: 'recruitment.delete',
    HIRE: 'recruitment.hire',
  },

  // Partners
  LICENSES: {
    VIEW: 'licenses.view',
    CREATE: 'licenses.create',
    EDIT: 'licenses.edit',
    DELETE: 'licenses.delete',
    REVOKE: 'licenses.revoke',
  },
  RESELLERS: {
    VIEW: 'resellers.view',
    CREATE: 'resellers.create',
    EDIT: 'resellers.edit',
    DELETE: 'resellers.delete',
    APPROVE: 'resellers.approve',
  },
  FRANCHISES: {
    VIEW: 'franchises.view',
    CREATE: 'franchises.create',
    EDIT: 'franchises.edit',
    DELETE: 'franchises.delete',
  },
  MLM: {
    VIEW: 'mlm.view',
    MANAGE: 'mlm.manage',
  },

  // Organization
  COMPANIES: {
    VIEW: 'companies.view',
    CREATE: 'companies.create',
    EDIT: 'companies.edit',
    DELETE: 'companies.delete',
    SWITCH: 'companies.switch',
  },
  BRANCHES: {
    VIEW: 'branches.view',
    CREATE: 'branches.create',
    EDIT: 'branches.edit',
    DELETE: 'branches.delete',
  },
  ORG_CHART: {
    VIEW: 'org_chart.view',
    EDIT: 'org_chart.edit',
  },

  // Insights
  ANALYTICS: {
    VIEW: 'analytics.view',
    EXPORT: 'analytics.export',
    CUSTOM: 'analytics.custom',
  },
  REPORTS: {
    VIEW: 'reports.view',
    CREATE: 'reports.create',
    EDIT: 'reports.edit',
    DELETE: 'reports.delete',
    EXPORT: 'reports.export',
  },
  HEATMAPS: {
    VIEW: 'heatmaps.view',
  },

  // Platform
  OFFLINE: {
    VIEW: 'offline.view',
    SYNC: 'offline.sync',
  },
  NOTIFICATIONS: {
    VIEW: 'notifications.view',
    MANAGE: 'notifications.manage',
    SEND: 'notifications.send',
  },
  MESSAGING: {
    VIEW: 'messaging.view',
    SEND: 'messaging.send',
  },
  AI_STUDIO: {
    VIEW: 'ai_studio.view',
    CREATE: 'ai_studio.create',
    EDIT: 'ai_studio.edit',
    DELETE: 'ai_studio.delete',
  },
  COPILOT: {
    VIEW: 'copilot.view',
    USE: 'copilot.use',
  },
  AUTOMATION: {
    VIEW: 'automation.view',
    CREATE: 'automation.create',
    EDIT: 'automation.edit',
    DELETE: 'automation.delete',
    RUN: 'automation.run',
  },
  API_MANAGER: {
    VIEW: 'api_manager.view',
    CREATE: 'api_manager.create',
    EDIT: 'api_manager.edit',
    DELETE: 'api_manager.delete',
  },
  DOCUMENTS: {
    VIEW: 'documents.view',
    CREATE: 'documents.create',
    EDIT: 'documents.edit',
    DELETE: 'documents.delete',
    SIGN: 'documents.sign',
  },
  APPROVALS: {
    VIEW: 'approvals.view',
    APPROVE: 'approvals.approve',
    REJECT: 'approvals.reject',
  },
  WEBSITE: {
    VIEW: 'website.view',
    EDIT: 'website.edit',
    PUBLISH: 'website.publish',
  },
  SUPPORT: {
    VIEW: 'support.view',
    CREATE: 'support.create',
    EDIT: 'support.edit',
    DELETE: 'support.delete',
    ASSIGN: 'support.assign',
    CLOSE: 'support.close',
  },
  KNOWLEDGE: {
    VIEW: 'knowledge.view',
    CREATE: 'knowledge.create',
    EDIT: 'knowledge.edit',
    DELETE: 'knowledge.delete',
  },

  // Security
  AUDIT: {
    VIEW: 'audit.view',
    EXPORT: 'audit.export',
  },
  SESSIONS: {
    VIEW: 'sessions.view',
    TERMINATE: 'sessions.terminate',
    TERMINATE_ALL: 'sessions.terminate_all',
  },
  DEVICES: {
    VIEW: 'devices.view',
    TRUST: 'devices.trust',
    REMOVE: 'devices.remove',
  },
  THREATS: {
    VIEW: 'threats.view',
    MANAGE: 'threats.manage',
  },
  TRAIL: {
    VIEW: 'trail.view',
  },

  // System
  PROFILE: {
    VIEW: 'profile.view',
    EDIT: 'profile.edit',
  },
  WALLET: {
    VIEW: 'wallet.view',
    ADD: 'wallet.add',
    WITHDRAW: 'wallet.withdraw',
    TRANSFER: 'wallet.transfer',
  },
  LEADERBOARD: {
    VIEW: 'leaderboard.view',
  },
  THEME: {
    VIEW: 'theme.view',
    EDIT: 'theme.edit',
  },
  ROLES: {
    VIEW: 'roles.view',
    CREATE: 'roles.create',
    EDIT: 'roles.edit',
    DELETE: 'roles.delete',
    ASSIGN: 'roles.assign',
  },
  SETTINGS: {
    VIEW: 'settings.view',
    EDIT: 'settings.edit',
    SYSTEM: 'settings.system',
  },

  // Admin
  USERS: {
    VIEW: 'users.view',
    CREATE: 'users.create',
    EDIT: 'users.edit',
    DELETE: 'users.delete',
    IMPERSONATE: 'users.impersonate',
    RESET_PASSWORD: 'users.reset_password',
  },
  TENANTS: {
    VIEW: 'tenants.view',
    CREATE: 'tenants.create',
    EDIT: 'tenants.edit',
    DELETE: 'tenants.delete',
    SUSPEND: 'tenants.suspend',
  },
  SYSTEM: {
    VIEW: 'system.view',
    CONFIGURE: 'system.configure',
    MAINTENANCE: 'system.maintenance',
  },
} as const;

export type PermissionKey = typeof PERMISSIONS[keyof typeof PERMISSIONS][keyof typeof PERMISSIONS[keyof typeof PERMISSIONS]];
/**
 * SaaS Vala Enterprise - Database Seed
 * Enterprise seed data for roles, permissions, and initial setup
 */

import { PrismaClient, UserStatus, CompanyStatus, PlanInterval, SubscriptionStatus, LicenseStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // ============================================================================
  // CREATE PERMISSIONS
  // ============================================================================
  console.log('📋 Creating permissions...');

  const permissions = [
    // Overview
    { resource: 'dashboard', action: 'view', category: 'overview' },
    { resource: 'dashboard', action: 'export', category: 'overview' },
    { resource: 'executive', action: 'view', category: 'overview' },
    { resource: 'executive', action: 'export', category: 'overview' },
    { resource: 'live', action: 'view', category: 'overview' },
    { resource: 'calendar', action: 'view', category: 'overview' },
    { resource: 'calendar', action: 'create', category: 'overview' },
    { resource: 'calendar', action: 'edit', category: 'overview' },
    { resource: 'calendar', action: 'delete', category: 'overview' },
    { resource: 'activity', action: 'view', category: 'overview' },
    { resource: 'favorites', action: 'view', category: 'overview' },
    { resource: 'favorites', action: 'manage', category: 'overview' },
    { resource: 'bookmarks', action: 'view', category: 'overview' },
    { resource: 'bookmarks', action: 'manage', category: 'overview' },
    { resource: 'goals', action: 'view', category: 'overview' },
    { resource: 'goals', action: 'create', category: 'overview' },
    { resource: 'goals', action: 'edit', category: 'overview' },
    { resource: 'goals', action: 'delete', category: 'overview' },

    // Sales
    { resource: 'crm', action: 'view', category: 'sales' },
    { resource: 'crm', action: 'create', category: 'sales' },
    { resource: 'crm', action: 'edit', category: 'sales' },
    { resource: 'crm', action: 'delete', category: 'sales' },
    { resource: 'crm', action: 'export', category: 'sales' },
    { resource: 'crm', action: 'import', category: 'sales' },
    { resource: 'erp', action: 'view', category: 'sales' },
    { resource: 'erp', action: 'create', category: 'sales' },
    { resource: 'erp', action: 'edit', category: 'sales' },
    { resource: 'erp', action: 'delete', category: 'sales' },
    { resource: 'erp', action: 'approve', category: 'sales' },
    { resource: 'pos', action: 'view', category: 'sales' },
    { resource: 'pos', action: 'create', category: 'sales' },
    { resource: 'pos', action: 'edit', category: 'sales' },
    { resource: 'pos', action: 'delete', category: 'sales' },
    { resource: 'pos', action: 'refund', category: 'sales' },
    { resource: 'marketplace', action: 'view', category: 'sales' },
    { resource: 'marketplace', action: 'create', category: 'sales' },
    { resource: 'marketplace', action: 'edit', category: 'sales' },
    { resource: 'marketplace', action: 'delete', category: 'sales' },
    { resource: 'marketplace', action: 'approve', category: 'sales' },
    { resource: 'subscriptions', action: 'view', category: 'sales' },
    { resource: 'subscriptions', action: 'create', category: 'sales' },
    { resource: 'subscriptions', action: 'edit', category: 'sales' },
    { resource: 'subscriptions', action: 'delete', category: 'sales' },
    { resource: 'subscriptions', action: 'cancel', category: 'sales' },

    // Finance
    { resource: 'accounting', action: 'view', category: 'finance' },
    { resource: 'accounting', action: 'create', category: 'finance' },
    { resource: 'accounting', action: 'edit', category: 'finance' },
    { resource: 'accounting', action: 'delete', category: 'finance' },
    { resource: 'accounting', action: 'export', category: 'finance' },
    { resource: 'accounting', action: 'reconcile', category: 'finance' },
    { resource: 'invoices', action: 'view', category: 'finance' },
    { resource: 'invoices', action: 'create', category: 'finance' },
    { resource: 'invoices', action: 'edit', category: 'finance' },
    { resource: 'invoices', action: 'delete', category: 'finance' },
    { resource: 'invoices', action: 'send', category: 'finance' },
    { resource: 'invoices', action: 'paid', category: 'finance' },

    // Operations
    { resource: 'inventory', action: 'view', category: 'operations' },
    { resource: 'inventory', action: 'create', category: 'operations' },
    { resource: 'inventory', action: 'edit', category: 'operations' },
    { resource: 'inventory', action: 'delete', category: 'operations' },
    { resource: 'inventory', action: 'adjust', category: 'operations' },
    { resource: 'inventory', action: 'transfer', category: 'operations' },
    { resource: 'manufacturing', action: 'view', category: 'operations' },
    { resource: 'manufacturing', action: 'create', category: 'operations' },
    { resource: 'manufacturing', action: 'edit', category: 'operations' },
    { resource: 'manufacturing', action: 'delete', category: 'operations' },
    { resource: 'projects', action: 'view', category: 'operations' },
    { resource: 'projects', action: 'create', category: 'operations' },
    { resource: 'projects', action: 'edit', category: 'operations' },
    { resource: 'projects', action: 'delete', category: 'operations' },
    { resource: 'projects', action: 'assign', category: 'operations' },

    // People
    { resource: 'hrm', action: 'view', category: 'people' },
    { resource: 'hrm', action: 'create', category: 'people' },
    { resource: 'hrm', action: 'edit', category: 'people' },
    { resource: 'hrm', action: 'delete', category: 'people' },
    { resource: 'hrm', action: 'payroll', category: 'people' },
    { resource: 'recruitment', action: 'view', category: 'people' },
    { resource: 'recruitment', action: 'create', category: 'people' },
    { resource: 'recruitment', action: 'edit', category: 'people' },
    { resource: 'recruitment', action: 'delete', category: 'people' },
    { resource: 'recruitment', action: 'hire', category: 'people' },

    // System
    { resource: 'users', action: 'view', category: 'system' },
    { resource: 'users', action: 'create', category: 'system' },
    { resource: 'users', action: 'edit', category: 'system' },
    { resource: 'users', action: 'delete', category: 'system' },
    { resource: 'users', action: 'impersonate', category: 'system' },
    { resource: 'users', action: 'reset_password', category: 'system' },
    { resource: 'roles', action: 'view', category: 'system' },
    { resource: 'roles', action: 'create', category: 'system' },
    { resource: 'roles', action: 'edit', category: 'system' },
    { resource: 'roles', action: 'delete', category: 'system' },
    { resource: 'roles', action: 'assign', category: 'system' },
    { resource: 'settings', action: 'view', category: 'system' },
    { resource: 'settings', action: 'edit', category: 'system' },
    { resource: 'settings', action: 'system', category: 'system' },
  ];

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { resource_action: { resource: permission.resource, action: permission.action } },
      update: {},
      create: permission,
    });
  }

  console.log(`✅ Created ${permissions.length} permissions`);

  // ============================================================================
  // CREATE ROLES
  // ============================================================================
  console.log('👥 Creating roles...');

  const roles = [
    {
      name: 'Super Admin',
      slug: 'super_admin',
      description: 'Full system access with impersonation capabilities',
      level: 1000,
      isSystem: true,
    },
    {
      name: 'ERP Admin',
      slug: 'erp_admin',
      description: 'Full access to ERP modules',
      level: 900,
      isSystem: true,
    },
    {
      name: 'Admin',
      slug: 'admin',
      description: 'Full administrative access',
      level: 800,
      isSystem: true,
    },
    {
      name: 'Sales Manager',
      slug: 'sales_manager',
      description: 'Full access to sales modules',
      level: 700,
      isSystem: true,
    },
    {
      name: 'Sales',
      slug: 'sales',
      description: 'Sales representative access',
      level: 600,
      isSystem: true,
    },
    {
      name: 'CRM Manager',
      slug: 'crm_manager',
      description: 'Full access to CRM module',
      level: 650,
      isSystem: true,
    },
    {
      name: 'CRM',
      slug: 'crm',
      description: 'CRM representative access',
      level: 550,
      isSystem: true,
    },
    {
      name: 'HR Manager',
      slug: 'hr_manager',
      description: 'Full access to HR module',
      level: 680,
      isSystem: true,
    },
    {
      name: 'HR',
      slug: 'hr',
      description: 'HR representative access',
      level: 530,
      isSystem: true,
    },
    {
      name: 'Inventory Manager',
      slug: 'inventory_manager',
      description: 'Full access to inventory module',
      level: 670,
      isSystem: true,
    },
    {
      name: 'Inventory',
      slug: 'inventory',
      description: 'Inventory staff access',
      level: 520,
      isSystem: true,
    },
    {
      name: 'Marketplace Vendor',
      slug: 'marketplace_vendor',
      description: 'Marketplace vendor access',
      level: 500,
      isSystem: true,
    },
    {
      name: 'Reseller',
      slug: 'reseller',
      description: 'Reseller partner access',
      level: 480,
      isSystem: true,
    },
    {
      name: 'Affiliate',
      slug: 'affiliate',
      description: 'Affiliate partner access',
      level: 460,
      isSystem: true,
    },
    {
      name: 'Customer',
      slug: 'customer',
      description: 'Customer access',
      level: 400,
      isSystem: true,
    },
    {
      name: 'Billing',
      slug: 'billing',
      description: 'Billing and finance access',
      level: 690,
      isSystem: true,
    },
    {
      name: 'Analytics',
      slug: 'analytics',
      description: 'Analytics and reporting access',
      level: 660,
      isSystem: true,
    },
    {
      name: 'Support',
      slug: 'support',
      description: 'Support team access',
      level: 540,
      isSystem: true,
    },
    {
      name: 'Security',
      slug: 'security',
      description: 'Security team access',
      level: 950,
      isSystem: true,
    },
    {
      name: 'AI Manager',
      slug: 'ai_manager',
      description: 'AI features management access',
      level: 720,
      isSystem: true,
    },
    {
      name: 'API Manager',
      slug: 'api_manager',
      description: 'API management access',
      level: 710,
      isSystem: true,
    },
  ];

  const createdRoles: any[] = [];
  for (const role of roles) {
    const created = await prisma.role.upsert({
      where: { slug: role.slug },
      update: {},
      create: role,
    });
    createdRoles.push(created);
  }

  console.log(`✅ Created ${roles.length} roles`);

  // ============================================================================
  // ASSIGN PERMISSIONS TO ROLES
  // ============================================================================
  console.log('🔐 Assigning permissions to roles...');

  // Super Admin gets all permissions
  const allPermissions = await prisma.permission.findMany();
  const superAdminRole = createdRoles.find((r) => r.slug === 'super_admin');
  for (const permission of allPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: superAdminRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: superAdminRole.id,
        permissionId: permission.id,
      },
    });
  }

  // ERP Admin gets most permissions except user impersonation
  const erpAdminRole = createdRoles.find((r) => r.slug === 'erp_admin');
  const erpAdminPermissions = allPermissions.filter(
    (p) => !p.action.includes('impersonate') && !p.action.includes('system')
  );
  for (const permission of erpAdminPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: erpAdminRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: erpAdminRole.id,
        permissionId: permission.id,
      },
    });
  }

  // Sales roles get sales permissions
  const salesPermissions = allPermissions.filter((p) => p.category === 'sales');
  const salesManagerRole = createdRoles.find((r) => r.slug === 'sales_manager');
  const salesRole = createdRoles.find((r) => r.slug === 'sales');

  for (const permission of salesPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: salesManagerRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: salesManagerRole.id,
        permissionId: permission.id,
      },
    });
  }

  const salesViewOnly = salesPermissions.filter((p) => p.action === 'view');
  for (const permission of salesViewOnly) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: salesRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: salesRole.id,
        permissionId: permission.id,
      },
    });
  }

  console.log('✅ Assigned permissions to roles');

  // ============================================================================
  // CREATE DEFAULT PLAN
  // ============================================================================
  console.log('💳 Creating default plan...');

  const defaultPlan = await prisma.plan.upsert({
    where: { slug: 'enterprise' },
    update: {},
    create: {
      name: 'Enterprise',
      slug: 'enterprise',
      description: 'Full-featured enterprise plan',
      price: 99.99,
      currency: 'USD',
      interval: PlanInterval.MONTHLY,
      features: {
        users: 'unlimited',
        storage: '100GB',
        apiCalls: '1000000/month',
        support: '24/7 priority',
        customBranding: true,
        advancedAnalytics: true,
        aiFeatures: true,
        multiTenant: true,
      },
      limits: {
        users: 999999,
        storage: 100, // GB
        apiCalls: 1000000,
      },
      isPopular: true,
      isActive: true,
    },
  });

  console.log('✅ Created default plan');

  // ============================================================================
  // CREATE DEFAULT COMPANY
  // ============================================================================
  console.log('🏢 Creating default company...');

  const defaultCompany = await prisma.company.upsert({
    where: { slug: 'default' },
    update: {},
    create: {
      name: 'Default Company',
      slug: 'default',
      status: CompanyStatus.ACTIVE,
      planId: defaultPlan.id,
      settings: {
        timezone: 'UTC',
        dateFormat: 'YYYY-MM-DD',
        currency: 'USD',
      },
    },
  });

  console.log('✅ Created default company');

  // ============================================================================
  // CREATE SUPER ADMIN USER
  // ============================================================================
  console.log('👤 Creating super admin user...');

  const passwordHash = await bcrypt.hash('Admin123!', 12);

  const superAdminUser = await prisma.user.upsert({
    where: { email: 'admin@saasvala.com' },
    update: {},
    create: {
      email: 'admin@saasvala.com',
      emailVerified: true,
      passwordHash,
      firstName: 'Super',
      lastName: 'Admin',
      displayName: 'Super Admin',
      status: UserStatus.ACTIVE,
      isSuperAdmin: true,
      companyId: defaultCompany.id,
    },
  });

  // Assign super admin role
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: superAdminUser.id,
        roleId: superAdminRole.id,
      },
    },
    update: {},
    create: {
      userId: superAdminUser.id,
      roleId: superAdminRole.id,
      isActive: true,
    },
  });

  console.log('✅ Created super admin user (admin@saasvala.com / Admin123!)');

  // ============================================================================
  // CREATE SETTINGS
  // ============================================================================
  console.log('⚙️ Creating system settings...');

  const settings = [
    {
      key: 'app.name',
      value: 'SaaS Vala Enterprise',
      category: 'app',
      description: 'Application name',
      isPublic: true,
    },
    {
      key: 'app.version',
      value: '1.0.0',
      category: 'app',
      description: 'Application version',
      isPublic: true,
    },
    {
      key: 'auth.session.timeout',
      value: 604800000,
      category: 'auth',
      description: 'Session timeout in milliseconds',
      isPublic: false,
    },
    {
      key: 'auth.max.login.attempts',
      value: 5,
      category: 'auth',
      description: 'Maximum failed login attempts before lock',
      isPublic: false,
    },
    {
      key: 'auth.lockout.duration',
      value: 900000,
      category: 'auth',
      description: 'Account lockout duration in milliseconds',
      isPublic: false,
    },
  ];

  for (const setting of settings) {
    await prisma.settings.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }

  console.log(`✅ Created ${settings.length} system settings`);

  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

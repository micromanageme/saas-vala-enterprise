/**
 * SaaS Vala Enterprise - Universal Access Admin API
 * TOPMOST ROOT CONTROL LAYER - Above Super Admin
 * Absolute root authority over entire ecosystem
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';

export const Route = createFileRoute('/api/root/dashboard')({
  GET: async ({ request }) => {
    const logger = Logger.createRequestLogger('root-admin-api');

    try {
      const auth = await AuthMiddleware.authenticate(request);
      
      // ROOT ACCESS ONLY - Check for special root flag or super_admin with root override
      const isRoot = auth.isSuperAdmin && request.headers.get('X-Root-Access') === 'true';
      
      if (!isRoot) {
        return Response.json(
          { error: 'Unauthorized access - Root level only' },
          { status: 403 }
        );
      }

      const url = new URL(request.url);
      const type = url.searchParams.get('type') || 'all';

      logger.info('Fetching Root Admin dashboard data', { userId: auth.userId, type });

      const data: any = {};

      if (type === 'all' || type === 'universal-control') {
        const [
          totalSystemUsers,
          totalTenants,
          totalBranches,
          totalServers,
          totalDatabases,
          activeAiModels,
          totalWorkflows,
          systemHealth,
          emergencyMode,
          maintenanceMode,
        ] = await Promise.all([
          prisma.user.count(),
          prisma.company.count(),
          prisma.branch.count(),
          24, // Would come from infrastructure monitoring
          8, // Would come from database monitoring
          5, // Would come from AI registry
          0, // Would come from workflow engine
          'HEALTHY',
          false,
          false,
        ]);

        data.universalControl = {
          totalSystemUsers,
          totalTenants,
          totalBranches,
          totalServers,
          totalDatabases,
          activeAiModels,
          totalWorkflows,
          systemHealth,
          emergencyMode,
          maintenanceMode,
        };
      }

      if (type === 'all' || type === 'root-activity') {
        const rootActivities = await prisma.activity.findMany({
          where: {
            OR: [
              { action: { contains: 'root' } },
              { action: { contains: 'emergency' } },
              { action: { contains: 'override' } },
            ],
          },
          orderBy: { createdAt: 'desc' },
          take: 50,
          include: {
            user: {
              select: {
                displayName: true,
                email: true,
              },
            },
          },
        });

        data.rootActivity = rootActivities.map((a) => ({
          id: a.id,
          action: a.action,
          entity: a.entity,
          user: a.user?.displayName || a.user?.email,
          timestamp: a.createdAt,
          metadata: a.metadata,
        }));
      }

      if (type === 'all' || type === 'system-map') {
        data.systemMap = {
          dashboards: [
            { id: 'admin', name: 'Super Admin Dashboard', route: '/admin', status: 'ACTIVE' },
            { id: 'dashboard', name: 'Main Dashboard', route: '/dashboard', status: 'ACTIVE' },
            { id: 'executive', name: 'Executive Dashboard', route: '/executive', status: 'ACTIVE' },
            { id: 'live', name: 'Live Analytics', route: '/live', status: 'ACTIVE' },
          ],
          modules: [
            { id: 'users', name: 'Users', route: '/users', status: 'ACTIVE' },
            { id: 'roles', name: 'Roles', route: '/roles', status: 'ACTIVE' },
            { id: 'marketplace', name: 'Marketplace', route: '/marketplace', status: 'ACTIVE' },
            { id: 'licenses', name: 'Licenses', route: '/licenses', status: 'ACTIVE' },
            { id: 'support', name: 'Support', route: '/support', status: 'ACTIVE' },
            { id: 'resellers', name: 'Resellers', route: '/resellers', status: 'ACTIVE' },
            { id: 'franchises', name: 'Franchises', route: '/franchises', status: 'ACTIVE' },
          ],
          apis: [
            { id: 'users-api', name: 'Users API', route: '/api/users', status: 'ACTIVE' },
            { id: 'roles-api', name: 'Roles API', route: '/api/roles', status: 'ACTIVE' },
            { id: 'products-api', name: 'Products API', route: '/api/products', status: 'ACTIVE' },
            { id: 'licenses-api', name: 'Licenses API', route: '/api/licenses', status: 'ACTIVE' },
          ],
        };
      }

      if (type === 'all' || type === 'emergency-actions') {
        data.emergencyActions = [
          { id: 'emergency-lockdown', name: 'Emergency Lockdown', status: 'AVAILABLE' },
          { id: 'system-maintenance', name: 'System Maintenance Mode', status: 'AVAILABLE' },
          { id: 'emergency-rollback', name: 'Emergency Rollback', status: 'AVAILABLE' },
          { id: 'emergency-restore', name: 'Emergency Restore', status: 'AVAILABLE' },
          { id: 'emergency-shutdown', name: 'Emergency Shutdown', status: 'AVAILABLE' },
        ];
      }

      logger.info('Root Admin dashboard data fetched successfully');

      return Response.json({ success: true, data });
    } catch (error: any) {
      if (error.message === 'No authentication token provided') {
        return Response.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      logger.error('Failed to fetch Root Admin dashboard data', error);

      return Response.json(
        { success: false, error: 'Failed to fetch root dashboard data' },
        { status: 500 }
      );
    }
  },
});

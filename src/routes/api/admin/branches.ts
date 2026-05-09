// @ts-nocheck
/**
 * SaaS Vala Enterprise - Global Branch Management API
 * Super Admin branch and location management
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';

export const Route = createFileRoute('/api/admin/branches')({
  GET: async ({ request }) => {
    const logger = Logger.createRequestLogger('admin-branches-api');

    try {
      const auth = await AuthMiddleware.authenticate(request);
      
      if (!auth.isSuperAdmin) {
        return Response.json(
          { error: 'Unauthorized access' },
          { status: 403 }
        );
      }

      const url = new URL(request.url);
      const type = url.searchParams.get('type') || 'all';

      logger.info('Fetching branch management data', { userId: auth.userId, type });

      const data: any = {};

      if (type === 'all' || type === 'kpis') {
        const [
          totalBranches,
          activeBranches,
          totalCountries,
          totalCities,
          totalFranchises,
          totalResellers,
        ] = await Promise.all([
          prisma.branch.count(),
          prisma.branch.count({ where: { status: 'ACTIVE' } }),
          prisma.branch.groupBy({ by: ['country'], _count: true }).then(r => r.length),
          prisma.branch.groupBy({ by: ['city'], _count: true }).then(r => r.length),
          prisma.franchise.count(),
          prisma.reseller.count(),
        ]);

        data.kpis = {
          totalBranches,
          activeBranches,
          totalCountries,
          totalCities,
          totalFranchises,
          totalResellers,
          branchesDelta: 6,
          franchisesDelta: 4,
          resellersDelta: 8,
        };
      }

      if (type === 'all' || type === 'branches') {
        const branches = await prisma.branch.findMany({
          include: {
            company: {
              select: {
                name: true,
              },
            },
            _count: {
              select: {
                users: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 50,
        });

        data.branches = branches.map((b) => ({
          id: b.id,
          name: b.name,
          code: b.code,
          country: b.country,
          city: b.city,
          state: b.state,
          status: b.status,
          company: b.company?.name,
          users: b._count.users,
          createdAt: b.createdAt,
        }));
      }

      if (type === 'all' || type === 'countries') {
        const countries = await prisma.branch.groupBy({
          by: ['country'],
          _count: {
            country: true,
          },
        });

        data.countries = countries.map((c) => ({
          country: c.country,
          branches: c._count.country,
        }));
      }

      logger.info('Branch management data fetched successfully');

      return Response.json({ success: true, data });
    } catch (error: any) {
      if (error.message === 'No authentication token provided') {
        return Response.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      logger.error('Failed to fetch branch management data', error);

      return Response.json(
        { success: false, error: 'Failed to fetch branch data' },
        { status: 500 }
      );
    }
  },
});

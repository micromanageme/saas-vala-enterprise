// @ts-nocheck
/**
 * SaaS Vala Enterprise - Franchises API
 * Franchisee network management (Database Integration)
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';

export const Route = createFileRoute('/api/franchises')({
  GET: async ({ request }) => {
    const logger = Logger.createRequestLogger('franchises-api');
    const url = new URL(request.url);
    const type = url.searchParams.get('type') || 'all';

    try {
      const auth = await AuthMiddleware.authenticate(request);
      logger.info('Fetching Franchises data', { userId: auth.userId, type });

      const data: any = {};

      if (type === 'all' || type === 'kpis') {
        const totalCount = await prisma.franchise.count();
        const activeCount = await prisma.franchise.count({ where: { status: 'ACTIVE' }});
        
        // Calculate total locations
        const franchises = await prisma.franchise.findMany({
          select: { locations: true },
        });
        const totalLocations = franchises.reduce((sum, f) => sum + f.locations, 0);
        
        // Calculate total royalties from transactions
        const royaltyData = await prisma.transaction.aggregate({
          _sum: { amount: true },
          where: {
            description: { contains: 'ROYALTY' },
            status: 'COMPLETED',
          },
        });

        // Count open support tickets from franchises
        const openTickets = await prisma.supportTicket.count({
          where: {
            user: {
              franchise: { isNot: null }
            },
            status: 'OPEN',
          },
        });

        data.kpis = {
          franchises: totalCount,
          active: activeCount,
          locations: totalLocations,
          royalties: royaltyData._sum.amount || 0,
          openTickets,
          franchisesDelta: 4,
          activeDelta: 3,
          locationsDelta: 9,
          royaltiesDelta: 6,
          openTicketsDelta: -3,
        };
      }

      if (type === 'all' || type === 'franchises') {
        const franchises = await prisma.franchise.findMany({
          include: {
            user: {
              select: {
                id: true,
                displayName: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 50,
        });

        data.franchises = franchises.map((f) => ({
          id: f.id,
          name: f.name,
          code: f.code,
          region: f.region,
          locations: f.locations,
          status: f.status,
          joinedDate: f.joinedDate.toISOString(),
          royaltyRate: Number(f.royaltyRate),
        }));
      }

      if (type === 'all' || type === 'regions') {
        const franchises = await prisma.franchise.findMany({
          select: {
            region: true,
            locations: true,
          },
        });

        const regionMap = new Map<string, { franchises: number; locations: number; revenue: number }>();
        
        franchises.forEach((f) => {
          const region = f.region;
          if (!regionMap.has(region)) {
            regionMap.set(region, { franchises: 0, locations: 0, revenue: 0 });
          }
          const data = regionMap.get(region)!;
          data.franchises++;
          data.locations += f.locations;
        });

        data.regions = Array.from(regionMap.entries()).map(([region, data]) => ({
          region,
          franchises: data.franchises,
          locations: data.locations,
          revenue: data.revenue,
        }));
      }

      logger.info('Franchises data fetched successfully');

      return Response.json({ success: true, data });
    } catch (error: any) {
      if (error.message === 'No authentication token provided') {
        return Response.json({ error: 'Authentication required' }, { status: 401 });
      }

      logger.error('Failed to fetch Franchises data', error);

      return Response.json({ success: false, error: 'Failed to fetch Franchises data' }, { status: 500 });
    }
  },

  POST: async ({ request }) => {
    const logger = Logger.createRequestLogger('franchises-api');

    try {
      const auth = await AuthMiddleware.authenticate(request);
      const body = await request.json();

      logger.info('Creating franchise', { userId: auth.userId });

      // Check if user is authorized (admin or sales_manager)
      if (!auth.isSuperAdmin && !auth.roles.includes('admin') && !auth.roles.includes('sales_manager')) {
        return Response.json({ error: 'Insufficient permissions' }, { status: 403 });
      }

      // Generate unique franchise code
      const code = `FRN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      const franchise = await prisma.franchise.create({
        data: {
          userId: body.userId,
          code,
          name: body.name,
          region: body.region,
          locations: body.locations || 0,
          royaltyRate: body.royaltyRate || 0,
          status: body.status || 'PENDING',
          metadata: body.metadata || {},
        },
      });

      logger.info('Franchise created successfully', { franchiseId: franchise.id });

      return Response.json({ success: true, franchise });
    } catch (error: any) {
      if (error.message === 'No authentication token provided') {
        return Response.json({ error: 'Authentication required' }, { status: 401 });
      }

      logger.error('Failed to create franchise', error);

      return Response.json({ success: false, error: 'Failed to create franchise' }, { status: 500 });
    }
  },

  PUT: async ({ request }) => {
    const logger = Logger.createRequestLogger('franchises-api');

    try {
      const auth = await AuthMiddleware.authenticate(request);
      const body = await request.json();

      logger.info('Updating franchise', { userId: auth.userId, franchiseId: body.id });

      // Check if user is authorized
      if (!auth.isSuperAdmin && !auth.roles.includes('admin') && !auth.roles.includes('sales_manager')) {
        return Response.json({ error: 'Insufficient permissions' }, { status: 403 });
      }

      const franchise = await prisma.franchise.update({
        where: { id: body.id },
        data: {
          name: body.name,
          region: body.region,
          locations: body.locations,
          royaltyRate: body.royaltyRate,
          status: body.status,
          metadata: body.metadata,
        },
      });

      logger.info('Franchise updated successfully', { franchiseId: franchise.id });

      return Response.json({ success: true, franchise });
    } catch (error: any) {
      if (error.message === 'No authentication token provided') {
        return Response.json({ error: 'Authentication required' }, { status: 401 });
      }

      logger.error('Failed to update franchise', error);

      return Response.json({ success: false, error: 'Failed to update franchise' }, { status: 500 });
    }
  },

  DELETE: async ({ request }) => {
    const logger = Logger.createRequestLogger('franchises-api');

    try {
      const auth = await AuthMiddleware.authenticate(request);
      const url = new URL(request.url);
      const id = url.searchParams.get('id');

      if (!id) {
        return Response.json({ error: 'Franchise ID required' }, { status: 400 });
      }

      logger.info('Deleting franchise', { userId: auth.userId, franchiseId: id });

      // Check if user is authorized
      if (!auth.isSuperAdmin && !auth.roles.includes('admin')) {
        return Response.json({ error: 'Insufficient permissions' }, { status: 403 });
      }

      await prisma.franchise.update({
        where: { id },
        data: { status: 'TERMINATED' },
      });

      logger.info('Franchise deleted successfully', { franchiseId: id });

      return Response.json({ success: true });
    } catch (error: any) {
      if (error.message === 'No authentication token provided') {
        return Response.json({ error: 'Authentication required' }, { status: 401 });
      }

      logger.error('Failed to delete franchise', error);

      return Response.json({ success: false, error: 'Failed to delete franchise' }, { status: 500 });
    }
  },
});

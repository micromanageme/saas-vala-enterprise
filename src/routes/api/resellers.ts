// @ts-nocheck
/**
 * SaaS Vala Enterprise - Resellers API
 * Channel partners and commissions (Database Integration)
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';

export const Route = createFileRoute('/api/resellers')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const logger = Logger.createRequestLogger('resellers-api');
        const url = new URL(request.url);
        const type = url.searchParams.get('type') || 'all';

        try {
          const auth = await AuthMiddleware.authenticate(request);
          logger.info('Fetching Resellers data', { userId: auth.userId, type });

          const data: any = {};

          if (type === 'all' || type === 'kpis') {
            const totalCount = await prisma.reseller.count();
            const activeCount = await prisma.reseller.count({ where: { status: 'ACTIVE' }});
            const goldTierCount = await prisma.reseller.count({ where: { tier: 'GOLD' }});
            
            // Calculate total sales from reseller transactions
            const salesData = await prisma.transaction.aggregate({
              _sum: { amount: true },
              where: {
                user: {
                  reseller: { isNot: null }
                },
                status: 'COMPLETED',
              },
            });

            // Calculate total commissions
            const commissionData = await prisma.transaction.aggregate({
              _sum: { amount: true },
              where: {
                type: 'CREDIT',
                description: { contains: 'COMMISSION' },
              },
            });

            data.kpis = {
              resellers: totalCount,
              active: activeCount,
              goldTier: goldTierCount,
              sales: salesData._sum.amount || 0,
              commission: commissionData._sum.amount || 0,
              resellersDelta: 8,
              activeDelta: 5,
              goldTierDelta: 1,
              salesDelta: 11,
              commissionDelta: 11,
            };
          }

          if (type === 'all' || type === 'resellers') {
            const resellers = await prisma.reseller.findMany({
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

            // Calculate sales per reseller
            const resellersWithSales = await Promise.all(
              resellers.map(async (r) => {
                const sales = await prisma.transaction.aggregate({
                  _sum: { amount: true },
                  where: {
                    userId: r.userId,
                    status: 'COMPLETED',
                  },
                });

                const commission = await prisma.transaction.aggregate({
                  _sum: { amount: true },
                  where: {
                    userId: r.userId,
                    type: 'CREDIT',
                    description: { contains: 'COMMISSION' },
                  },
                });

                return {
                  id: r.id,
                  name: r.user.displayName || r.user.email,
                  tier: r.tier,
                  sales: sales._sum.amount || 0,
                  commission: commission._sum.amount || 0,
                  status: r.status,
                  code: r.code,
                  balance: Number(r.balance),
                };
              })
            );

            data.resellers = resellersWithSales;
          }

          if (type === 'all' || type === 'tiers') {
            const tiers = await prisma.reseller.groupBy({
              by: ['tier'],
              _count: {
                tier: true,
              },
            });

            // Commission rates from CommissionEngine
            const commissionRates: Record<string, number> = {
              BRONZE: 5,
              SILVER: 8,
              GOLD: 12,
              PLATINUM: 15,
            };

            const minSales: Record<string, number> = {
              BRONZE: 0,
              SILVER: 75000,
              GOLD: 150000,
              PLATINUM: 300000,
            };

            data.tiers = tiers.map((t) => ({
              tier: t.tier,
              count: t._count.tier,
              commissionRate: commissionRates[t.tier] || 5,
              minSales: minSales[t.tier] || 0,
            }));
          }

          logger.info('Resellers data fetched successfully');

          return Response.json({ success: true, data });
        } catch (error: any) {
          if (error.message === 'No authentication token provided') {
            return Response.json({ error: 'Authentication required' }, { status: 401 });
          }

          logger.error('Failed to fetch Resellers data', error);

          return Response.json({ success: false, error: 'Failed to fetch Resellers data' }, { status: 500 });
        }
      },

      POST: async ({ request }) => {
        const logger = Logger.createRequestLogger('resellers-api');

        try {
          const auth = await AuthMiddleware.authenticate(request);
          const body = await request.json();

          logger.info('Creating reseller', { userId: auth.userId });

          // Check if user is authorized (admin or sales_manager)
          if (!auth.isSuperAdmin && !auth.roles.includes('admin') && !auth.roles.includes('sales_manager')) {
            return Response.json({ error: 'Insufficient permissions' }, { status: 403 });
          }

          // Generate unique reseller code
          const code = `RES-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

          const reseller = await prisma.reseller.create({
            data: {
              userId: body.userId,
              code,
              tier: body.tier || 'BRONZE',
              status: body.status || 'PENDING',
              metadata: body.metadata || {},
            },
          });

          logger.info('Reseller created successfully', { resellerId: reseller.id });

          return Response.json({ success: true, reseller });
        } catch (error: any) {
          if (error.message === 'No authentication token provided') {
            return Response.json({ error: 'Authentication required' }, { status: 401 });
          }

          logger.error('Failed to create reseller', error);

          return Response.json({ success: false, error: 'Failed to create reseller' }, { status: 500 });
        }
      },

      PUT: async ({ request }) => {
        const logger = Logger.createRequestLogger('resellers-api');

        try {
          const auth = await AuthMiddleware.authenticate(request);
          const body = await request.json();

          logger.info('Updating reseller', { userId: auth.userId, resellerId: body.id });

          // Check if user is authorized
          if (!auth.isSuperAdmin && !auth.roles.includes('admin') && !auth.roles.includes('sales_manager')) {
            return Response.json({ error: 'Insufficient permissions' }, { status: 403 });
          }

          const reseller = await prisma.reseller.update({
            where: { id: body.id },
            data: {
              tier: body.tier,
              status: body.status,
              metadata: body.metadata,
            },
          });

          logger.info('Reseller updated successfully', { resellerId: reseller.id });

          return Response.json({ success: true, reseller });
        } catch (error: any) {
          if (error.message === 'No authentication token provided') {
            return Response.json({ error: 'Authentication required' }, { status: 401 });
          }

          logger.error('Failed to update reseller', error);

          return Response.json({ success: false, error: 'Failed to update reseller' }, { status: 500 });
        }
      },

      DELETE: async ({ request }) => {
        const logger = Logger.createRequestLogger('resellers-api');

        try {
          const auth = await AuthMiddleware.authenticate(request);
          const url = new URL(request.url);
          const id = url.searchParams.get('id');

          if (!id) {
            return Response.json({ error: 'Reseller ID required' }, { status: 400 });
          }

          logger.info('Deleting reseller', { userId: auth.userId, resellerId: id });

          // Check if user is authorized
          if (!auth.isSuperAdmin && !auth.roles.includes('admin')) {
            return Response.json({ error: 'Insufficient permissions' }, { status: 403 });
          }

          await prisma.reseller.update({
            where: { id },
            data: { status: 'DELETED' },
          });

          logger.info('Reseller deleted successfully', { resellerId: id });

          return Response.json({ success: true });
        } catch (error: any) {
          if (error.message === 'No authentication token provided') {
            return Response.json({ error: 'Authentication required' }, { status: 401 });
          }

          logger.error('Failed to delete reseller', error);

          return Response.json({ success: false, error: 'Failed to delete reseller' }, { status: 500 });
        }
      },
    },
  },
});

// @ts-nocheck
/**
 * SaaS Vala Enterprise - Global Billing & Finance API
 * Super Admin billing and financial management
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';

export const Route = createFileRoute('/api/admin/billing')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const logger = Logger.createRequestLogger('admin-billing-api');

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

          logger.info('Fetching billing data', { userId: auth.userId, type });

          const data: any = {};

          if (type === 'all' || type === 'kpis') {
            const [
              totalRevenue,
              monthlyRevenue,
              totalInvoices,
              paidInvoices,
              pendingInvoices,
              overdueInvoices,
              totalRefunds,
              activeSubscriptions,
            ] = await Promise.all([
              prisma.transaction.aggregate({
                where: { type: 'CREDIT', status: 'COMPLETED' },
                _sum: { amount: true },
              }),
              prisma.transaction.aggregate({
                where: {
                  type: 'CREDIT',
                  status: 'COMPLETED',
                  createdAt: { gte: new Date(new Date().setDate(new Date().getDate() - 30)) },
                },
                _sum: { amount: true },
              }),
              prisma.invoice.count(),
              prisma.invoice.count({ where: { status: 'PAID' } }),
              prisma.invoice.count({ where: { status: 'PENDING' } }),
              prisma.invoice.count({ where: { status: 'OVERDUE' } }),
              prisma.transaction.aggregate({
                where: { type: 'DEBIT', description: { contains: 'refund' } },
                _sum: { amount: true },
              }),
              prisma.subscription.count({ where: { status: 'ACTIVE' } }),
            ]);

            data.kpis = {
              totalRevenue: totalRevenue._sum.amount?.toNumber() || 0,
              monthlyRevenue: monthlyRevenue._sum.amount?.toNumber() || 0,
              totalInvoices,
              paidInvoices,
              pendingInvoices,
              overdueInvoices,
              totalRefunds: totalRefunds._sum.amount?.toNumber() || 0,
              activeSubscriptions,
              revenueDelta: 15,
              invoicesDelta: 8,
              subscriptionsDelta: 12,
            };
          }

          if (type === 'all' || type === 'revenue') {
            const revenueByMonth = await prisma.transaction.groupBy({
              by: ['createdAt'],
              where: {
                type: 'CREDIT',
                status: 'COMPLETED',
                createdAt: { gte: new Date(new Date().setMonth(new Date().getMonth() - 12)) },
              },
              _sum: { amount: true },
              orderBy: { createdAt: 'asc' },
            });

            data.revenue = revenueByMonth.map((r) => ({
              month: new Date(r.createdAt).toISOString().substring(0, 7),
              amount: r._sum.amount?.toNumber() || 0,
            }));
          }

          if (type === 'all' || type === 'invoices') {
            const invoices = await prisma.invoice.findMany({
              include: {
                user: {
                  select: {
                    displayName: true,
                    email: true,
                  },
                },
                company: {
                  select: {
                    name: true,
                  },
                },
              },
              orderBy: {
                createdAt: 'desc',
              },
              take: 50,
            });

            data.invoices = invoices.map((inv) => ({
              id: inv.id,
              invoiceNumber: inv.invoiceNumber,
              amount: Number(inv.amount),
              status: inv.status,
              dueDate: inv.dueDate,
              user: inv.user?.displayName || inv.user?.email,
              company: inv.company?.name,
              createdAt: inv.createdAt,
            }));
          }

          logger.info('Billing data fetched successfully');

          return Response.json({ success: true, data });
        } catch (error: any) {
          if (error.message === 'No authentication token provided') {
            return Response.json(
              { error: 'Authentication required' },
              { status: 401 }
            );
          }

          logger.error('Failed to fetch billing data', error);

          return Response.json(
            { success: false, error: 'Failed to fetch billing data' },
            { status: 500 }
          );
        }
      },
    },
  },
});

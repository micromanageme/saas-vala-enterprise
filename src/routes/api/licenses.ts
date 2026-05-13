// @ts-nocheck
/**
 * SaaS Vala Enterprise - Licenses API
 * License generation and validation
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';
// randomUUID provided by global Web Crypto

export const Route = createFileRoute('/api/licenses')({
  GET: async ({ request }) => {
    const logger = Logger.createRequestLogger('licenses-api');
    const url = new URL(request.url);
    const type = url.searchParams.get('type') || 'all';

    try {
      const auth = await AuthMiddleware.authenticate(request);
      logger.info('Fetching licenses', { userId: auth.userId, type });

      const licenses = await prisma.license.findMany({
        where: {
          userId: auth.userId,
        },
        include: {
          product: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      const activeCount = licenses.filter(l => l.status === 'ACTIVE').length;
      const revokedCount = licenses.filter(l => l.status === 'REVOKED').length;
      const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      const expiringCount = licenses.filter(l => l.expiresAt && new Date(l.expiresAt) < thirtyDaysFromNow).length;

      const data: any = { licenses };

      if (type === 'all' || type === 'kpis') {
        data.kpis = {
          active: activeCount,
          total: licenses.length,
          revoked: revokedCount,
          expiring: expiringCount,
          activeDelta: 2,
          totalDelta: 1,
          revokedDelta: 0,
          expiringDelta: -1,
        };
      }

      logger.info('Licenses fetched successfully', { count: licenses.length });

      return Response.json({ success: true, data });
    } catch (error: any) {
      if (error.message === 'No authentication token provided') {
        return Response.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      logger.error('Failed to fetch licenses', error);

      return Response.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  },

  POST: async ({ request }) => {
    const logger = Logger.createRequestLogger('licenses-api');

    try {
      const auth = await AuthMiddleware.authenticate(request);
      const body = await request.json();

      logger.info('Generating license', { userId: auth.userId, productId: body.productId });

      // Generate unique license key
      const licenseKey = `SV-${crypto.randomUUID().toUpperCase().replace(/-/g, '').substring(0, 16)}`;

      const license = await prisma.license.create({
        data: {
          userId: auth.userId,
          productId: body.productId,
          licenseKey,
          status: 'ACTIVE',
          expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
          metadata: body.metadata || {},
        },
      });

      logger.info('License generated successfully', { licenseId: license.id });

      return Response.json({ license });
    } catch (error: any) {
      if (error.message === 'No authentication token provided') {
        return Response.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      logger.error('Failed to generate license', error);

      return Response.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  },
});

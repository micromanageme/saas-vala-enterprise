/**
 * SaaS Vala Enterprise - Affiliates API
 * Affiliate onboarding and management
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';
import { z } from 'zod';

const createAffiliateSchema = z.object({
  code: z.string(),
  metadata: z.any().optional(),
});

export const Route = createFileRoute('/api/affiliates')({
  GET: async ({ request }) => {
    const logger = Logger.createRequestLogger('affiliates-api');

    try {
      const auth = await AuthMiddleware.authenticate(request);
      logger.info('Fetching affiliates', { userId: auth.userId });

      const affiliates = await prisma.affiliate.findMany({
        where: {
          status: 'ACTIVE',
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              displayName: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      logger.info('Affiliates fetched successfully', { count: affiliates.length });

      return Response.json({ affiliates });
    } catch (error: any) {
      if (error.message === 'No authentication token provided') {
        return Response.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      logger.error('Failed to fetch affiliates', error);

      return Response.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  },

  POST: async ({ request }) => {
    const logger = Logger.createRequestLogger('affiliates-api');

    try {
      const auth = await AuthMiddleware.authenticate(request);
      const body = await request.json();
      const validatedData = createAffiliateSchema.parse(body);

      logger.info('Creating affiliate', { userId: auth.userId });

      // Check if user already has an affiliate account
      const existingAffiliate = await prisma.affiliate.findUnique({
        where: { userId: auth.userId },
      });

      if (existingAffiliate) {
        return Response.json(
          { error: 'User already has an affiliate account' },
          { status: 400 }
        );
      }

      const affiliate = await prisma.affiliate.create({
        data: {
          userId: auth.userId,
          code: validatedData.code,
          commission: 0,
          balance: 0,
          clicks: 0,
          conversions: 0,
          status: 'PENDING',
          metadata: validatedData.metadata || {},
        },
      });

      logger.info('Affiliate created successfully', { affiliateId: affiliate.id });

      return Response.json({ affiliate });
    } catch (error: any) {
      if (error.message === 'No authentication token provided') {
        return Response.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      if (error instanceof z.ZodError) {
        return Response.json(
          { error: 'Validation error', details: error.errors },
          { status: 400 }
        );
      }

      logger.error('Failed to create affiliate', error);

      return Response.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  },
});

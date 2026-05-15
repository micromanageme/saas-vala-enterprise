// @ts-nocheck
/**
 * SaaS Vala Enterprise - Vendors API
 * Vendor onboarding and management
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';
import { z } from 'zod';

const createVendorSchema = z.object({
  code: z.string(),
  tier: z.enum(['BRONZE', 'SILVER', 'GOLD', 'PLATINUM']),
  companyName: z.string().optional(),
  metadata: z.any().optional(),
});

export const Route = createFileRoute('/api/vendors')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const logger = Logger.createRequestLogger('vendors-api');

        try {
          const auth = await AuthMiddleware.authenticate(request);
          logger.info('Fetching vendors', { userId: auth.userId });

          const vendors = await prisma.reseller.findMany({
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

          logger.info('Vendors fetched successfully', { count: vendors.length });

          return Response.json({ vendors });
        } catch (error: any) {
          if (error.message === 'No authentication token provided') {
            return Response.json(
              { error: 'Authentication required' },
              { status: 401 }
            );
          }

          logger.error('Failed to fetch vendors', error);

          return Response.json(
            { error: 'Internal server error' },
            { status: 500 }
          );
        }
      },

      POST: async ({ request }) => {
        const logger = Logger.createRequestLogger('vendors-api');

        try {
          const auth = await AuthMiddleware.authenticate(request);
          const body = await request.json();
          const validatedData = createVendorSchema.parse(body);

          logger.info('Creating vendor', { userId: auth.userId });

          // Check if user already has a vendor account
          const existingVendor = await prisma.reseller.findUnique({
            where: { userId: auth.userId },
          });

          if (existingVendor) {
            return Response.json(
              { error: 'User already has a vendor account' },
              { status: 400 }
            );
          }

          const vendor = await prisma.reseller.create({
            data: {
              userId: auth.userId,
              code: validatedData.code,
              tier: validatedData.tier,
              commission: 0,
              balance: 0,
              status: 'PENDING',
              metadata: {
                ...validatedData.metadata,
                companyName: validatedData.companyName,
              },
            },
          });

          logger.info('Vendor created successfully', { vendorId: vendor.id });

          return Response.json({ vendor });
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

          logger.error('Failed to create vendor', error);

          return Response.json(
            { error: 'Internal server error' },
            { status: 500 }
          );
        }
      },
    },
  },
});

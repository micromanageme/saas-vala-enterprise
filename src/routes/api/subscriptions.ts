/**
 * SaaS Vala Enterprise - Subscriptions API
 * Subscription management and billing
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';
import { z } from 'zod';

const createSubscriptionSchema = z.object({
  planId: z.string(),
  paymentMethod: z.any().optional(),
});

export const Route = createFileRoute('/api/subscriptions')({
  GET: async ({ request }) => {
    const logger = Logger.createRequestLogger('subscriptions-api');

    try {
      const auth = await AuthMiddleware.authenticate(request);
      logger.info('Fetching subscriptions', { userId: auth.userId });

      const subscriptions = await prisma.subscription.findMany({
        where: {
          userId: auth.userId,
        },
        include: {
          plan: true,
          company: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      logger.info('Subscriptions fetched successfully', { count: subscriptions.length });

      return Response.json({ subscriptions });
    } catch (error: any) {
      if (error.message === 'No authentication token provided') {
        return Response.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      logger.error('Failed to fetch subscriptions', error);

      return Response.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  },

  POST: async ({ request }) => {
    const logger = Logger.createRequestLogger('subscriptions-api');

    try {
      const auth = await AuthMiddleware.authenticate(request);
      const body = await request.json();
      const validatedData = createSubscriptionSchema.parse(body);

      logger.info('Creating subscription', { userId: auth.userId, planId: validatedData.planId });

      // Get plan details
      const plan = await prisma.plan.findUnique({
        where: { id: validatedData.planId },
      });

      if (!plan) {
        return Response.json(
          { error: 'Plan not found' },
          { status: 404 }
        );
      }

      // Calculate end date based on plan interval
      const endDate = new Date();
      if (plan.interval === 'MONTHLY') {
        endDate.setMonth(endDate.getMonth() + 1);
      } else if (plan.interval === 'QUARTERLY') {
        endDate.setMonth(endDate.getMonth() + 3);
      } else if (plan.interval === 'YEARLY') {
        endDate.setFullYear(endDate.getFullYear() + 1);
      }

      const subscription = await prisma.subscription.create({
        data: {
          userId: auth.userId,
          companyId: auth.companyId,
          planId: validatedData.planId,
          status: 'ACTIVE',
          startDate: new Date(),
          endDate,
          billingCycle: plan.interval,
          amount: plan.price,
          currency: plan.currency,
          paymentMethod: validatedData.paymentMethod || {},
        },
      });

      logger.info('Subscription created successfully', { subscriptionId: subscription.id });

      return Response.json({ subscription });
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

      logger.error('Failed to create subscription', error);

      return Response.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  },
});

// @ts-nocheck
/**
 * SaaS Vala Enterprise - Invoices API
 * Invoice generation and management
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';
import { z } from 'zod';

const createInvoiceSchema = z.object({
  subscriptionId: z.string().optional(),
  amount: z.number(),
  currency: z.string(),
  dueDate: z.string().optional(),
  metadata: z.any().optional(),
});

export const Route = createFileRoute('/api/billing/invoices')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const logger = Logger.createRequestLogger('invoices-api');

        try {
          const auth = await AuthMiddleware.authenticate(request);
          logger.info('Fetching invoices', { userId: auth.userId });

          const invoices = await prisma.invoice.findMany({
            where: {
              userId: auth.userId,
            },
            orderBy: {
              createdAt: 'desc',
            },
          });

          logger.info('Invoices fetched successfully', { count: invoices.length });

          return Response.json({ invoices });
        } catch (error: any) {
          if (error.message === 'No authentication token provided') {
            return Response.json(
              { error: 'Authentication required' },
              { status: 401 }
            );
          }

          logger.error('Failed to fetch invoices', error);

          return Response.json(
            { error: 'Internal server error' },
            { status: 500 }
          );
        }
      },

      POST: async ({ request }) => {
        const logger = Logger.createRequestLogger('invoices-api');

        try {
          const auth = await AuthMiddleware.authenticate(request);
          const body = await request.json();
          const validatedData = createInvoiceSchema.parse(body);

          logger.info('Creating invoice', { userId: auth.userId });

          // Generate invoice number
          const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

          const invoice = await prisma.invoice.create({
            data: {
              userId: auth.userId,
              subscriptionId: validatedData.subscriptionId,
              invoiceNumber,
              amount: validatedData.amount,
              currency: validatedData.currency,
              dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : null,
              status: 'PENDING',
              metadata: validatedData.metadata || {},
            },
          });

          logger.info('Invoice created successfully', { invoiceId: invoice.id });

          return Response.json({ invoice });
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

          logger.error('Failed to create invoice', error);

          return Response.json(
            { error: 'Internal server error' },
            { status: 500 }
          );
        }
      },
    },
  },
});

/**
 * SaaS Vala Enterprise - Payment Workflow API
 * Payment processing and transaction tracking
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';
import { z } from 'zod';
import { randomUUID } from 'crypto';

const createPaymentSchema = z.object({
  amount: z.number(),
  currency: z.string(),
  paymentMethod: z.object({
    type: z.enum(['CARD', 'BANK_TRANSFER', 'PAYPAL', 'CRYPTO']),
    details: z.any(),
  }),
  subscriptionId: z.string().optional(),
  invoiceId: z.string().optional(),
  metadata: z.any().optional(),
});

export const Route = createFileRoute('/api/billing/payment')({
  POST: async ({ request }) => {
    const logger = Logger.createRequestLogger('payment-api');

    try {
      const auth = await AuthMiddleware.authenticate(request);
      const body = await request.json();
      const validatedData = createPaymentSchema.parse(body);

      logger.info('Processing payment', { userId: auth.userId, amount: validatedData.amount });

      // Generate payment reference
      const paymentReference = `PAY-${Date.now()}-${randomUUID().substring(0, 8).toUpperCase()}`;

      // Create transaction record
      const transaction = await prisma.transaction.create({
        data: {
          userId: auth.userId,
          type: 'DEBIT',
          amount: validatedData.amount,
          currency: validatedData.currency,
          status: 'PENDING',
          description: 'Payment',
          reference: paymentReference,
          metadata: {
            ...validatedData.metadata,
            paymentMethod: validatedData.paymentMethod,
            subscriptionId: validatedData.subscriptionId,
            invoiceId: validatedData.invoiceId,
          },
        },
      });

      // Update subscription status if linked
      if (validatedData.subscriptionId) {
        await prisma.subscription.update({
          where: { id: validatedData.subscriptionId },
          data: {
            paymentMethod: validatedData.paymentMethod,
            lastPaymentAt: new Date(),
          },
        });
      }

      // Update invoice status if linked
      if (validatedData.invoiceId) {
        await prisma.invoice.update({
          where: { id: validatedData.invoiceId },
          data: {
            status: 'PAID',
            paidAt: new Date(),
            transactionId: transaction.id,
          },
        });
      }

      logger.info('Payment processed successfully', { transactionId: transaction.id });

      return Response.json({
        transaction,
        paymentReference,
        status: 'PENDING',
      });
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

      logger.error('Failed to process payment', error);

      return Response.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  },
});

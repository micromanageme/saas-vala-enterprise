/**
 * SaaS Vala Enterprise - Wallet API
 * Wallet and commission management
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';

export const Route = createFileRoute('/api/wallet')({
  GET: async ({ request }) => {
    const logger = Logger.createRequestLogger('wallet-api');

    try {
      const auth = await AuthMiddleware.authenticate(request);
      logger.info('Fetching wallet', { userId: auth.userId });

      const wallet = await prisma.wallet.findUnique({
        where: {
          userId: auth.userId,
        },
        include: {
          transactions: {
            orderBy: {
              createdAt: 'desc',
            },
            take: 20,
          },
        },
      });

      if (!wallet) {
        // Create wallet if it doesn't exist
        const newWallet = await prisma.wallet.create({
          data: {
            userId: auth.userId,
            balance: 0,
            currency: 'USD',
          },
        });

        logger.info('Wallet created successfully', { walletId: newWallet.id });

        return Response.json({ wallet: newWallet, transactions: [] });
      }

      logger.info('Wallet fetched successfully', { walletId: wallet.id });

      return Response.json({ wallet, transactions: wallet.transactions });
    } catch (error: any) {
      if (error.message === 'No authentication token provided') {
        return Response.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      logger.error('Failed to fetch wallet', error);

      return Response.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  },
});

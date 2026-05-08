/**
 * SaaS Vala Enterprise - Support Tickets API
 * Support ticket management
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';
import { z } from 'zod';

const createTicketSchema = z.object({
  subject: z.string(),
  description: z.string(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  category: z.string().optional(),
  productId: z.string().optional(),
});

export const Route = createFileRoute('/api/support/tickets')({
  GET: async ({ request }) => {
    const logger = Logger.createRequestLogger('support-tickets-api');
    const url = new URL(request.url);
    const type = url.searchParams.get('type') || 'all';

    try {
      const auth = await AuthMiddleware.authenticate(request);
      logger.info('Fetching support tickets', { userId: auth.userId, type });

      const tickets = await prisma.supportTicket.findMany({
        where: {
          OR: [
            { userId: auth.userId },
            { assignedTo: auth.userId },
          ],
        },
        include: {
          user: {
            select: {
              id: true,
              displayName: true,
              email: true,
            },
          },
          assignedToUser: {
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
      });

      const openTickets = tickets.filter(t => t.status === 'OPEN').length;
      const pendingTickets = tickets.filter(t => t.status === 'PENDING').length;

      const data: any = { tickets };

      if (type === 'all' || type === 'kpis') {
        data.kpis = {
          openTickets,
          slaHitRate: 98.5,
          csat: 4.8,
          avgReplyTime: 2,
          openTicketsDelta: 3,
          slaHitRateDelta: 0.5,
          csatDelta: 0.2,
          avgReplyTimeDelta: -0.5,
        };
      }

      logger.info('Support tickets fetched successfully', { count: tickets.length });

      return Response.json({ success: true, data });
    } catch (error: any) {
      if (error.message === 'No authentication token provided') {
        return Response.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      logger.error('Failed to fetch support tickets', error);

      return Response.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  },

  POST: async ({ request }) => {
    const logger = Logger.createRequestLogger('support-tickets-api');

    try {
      const auth = await AuthMiddleware.authenticate(request);
      const body = await request.json();
      const validatedData = createTicketSchema.parse(body);

      logger.info('Creating support ticket', { userId: auth.userId });

      const ticket = await prisma.supportTicket.create({
        data: {
          userId: auth.userId,
          subject: validatedData.subject,
          description: validatedData.description,
          priority: validatedData.priority,
          status: 'OPEN',
          category: validatedData.category,
          productId: validatedData.productId,
        },
      });

      // Create activity log
      await prisma.activity.create({
        data: {
          userId: auth.userId,
          action: 'ticket.created',
          entity: 'support_ticket',
          entityId: ticket.id,
          metadata: {
            ticketId: ticket.id,
            subject: ticket.subject,
          },
        },
      });

      logger.info('Support ticket created successfully', { ticketId: ticket.id });

      return Response.json({ ticket });
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

      logger.error('Failed to create support ticket', error);

      return Response.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  },
});

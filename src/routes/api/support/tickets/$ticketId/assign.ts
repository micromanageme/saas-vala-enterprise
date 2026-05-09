// @ts-nocheck
/**
 * SaaS Vala Enterprise - Ticket Assignment API
 * Support ticket assignment and workflow
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';
import { z } from 'zod';

const assignTicketSchema = z.object({
  assignedTo: z.string(),
});

export const Route = createFileRoute('/api/support/tickets/$ticketId/assign')({
  POST: async ({ request, params }) => {
    const logger = Logger.createRequestLogger('ticket-assignment-api');

    try {
      const auth = await AuthMiddleware.authenticate(request);
      const body = await request.json();
      const validatedData = assignTicketSchema.parse(body);

      logger.info('Assigning ticket', { userId: auth.userId, ticketId: params.ticketId });

      // Check if ticket exists
      const ticket = await prisma.supportTicket.findUnique({
        where: { id: params.ticketId },
      });

      if (!ticket) {
        return Response.json(
          { error: 'Ticket not found' },
          { status: 404 }
        );
      }

      // Update ticket assignment
      const updatedTicket = await prisma.supportTicket.update({
        where: { id: params.ticketId },
        data: {
          assignedTo: validatedData.assignedTo,
          status: 'IN_PROGRESS',
        },
      });

      // Log activity
      await prisma.activity.create({
        data: {
          userId: auth.userId,
          action: 'ticket.assigned',
          entity: 'support_ticket',
          entityId: params.ticketId,
          metadata: {
            assignedTo: validatedData.assignedTo,
          },
        },
      });

      logger.info('Ticket assigned successfully', { ticketId: params.ticketId });

      return Response.json({ ticket: updatedTicket });
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

      logger.error('Failed to assign ticket', error);

      return Response.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  },
});

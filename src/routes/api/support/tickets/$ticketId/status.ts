// @ts-nocheck
/**
 * SaaS Vala Enterprise - Ticket Status API
 * Support ticket status workflow
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';
import { z } from 'zod';

const updateTicketStatusSchema = z.object({
  status: z.enum(['OPEN', 'IN_PROGRESS', 'PENDING', 'RESOLVED', 'CLOSED']),
  resolution: z.string().optional(),
});

export const Route = createFileRoute('/api/support/tickets/$ticketId/status')({
  server: {
    handlers: {
      POST: async ({ request, params }) => {
        const logger = Logger.createRequestLogger('ticket-status-api');

        try {
          const auth = await AuthMiddleware.authenticate(request);
          const body = await request.json();
          const validatedData = updateTicketStatusSchema.parse(body);

          logger.info('Updating ticket status', { userId: auth.userId, ticketId: params.ticketId });

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

          // Update ticket status
          const updateData: any = {
            status: validatedData.status,
          };

          if (validatedData.status === 'CLOSED') {
            updateData.closedAt = new Date();
          }

          if (validatedData.resolution) {
            updateData.metadata = {
              ...ticket.metadata,
              resolution: validatedData.resolution,
            };
          }

          const updatedTicket = await prisma.supportTicket.update({
            where: { id: params.ticketId },
            data: updateData,
          });

          // Log activity
          await prisma.activity.create({
            data: {
              userId: auth.userId,
              action: 'ticket.status_updated',
              entity: 'support_ticket',
              entityId: params.ticketId,
              metadata: {
                oldStatus: ticket.status,
                newStatus: validatedData.status,
              },
            },
          });

          logger.info('Ticket status updated successfully', { ticketId: params.ticketId });

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

          logger.error('Failed to update ticket status', error);

          return Response.json(
            { error: 'Internal server error' },
            { status: 500 }
          );
        }
      },
    },
  },
});

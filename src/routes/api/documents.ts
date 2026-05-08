/**
 * SaaS Vala Enterprise - Documents API
 * File management & storage
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';

export const Route = createFileRoute('/api/documents')({
  GET: async ({ request }) => {
    const logger = Logger.createRequestLogger('documents-api');
    const url = new URL(request.url);
    const type = url.searchParams.get('type') || 'all';

    try {
      const auth = await AuthMiddleware.authenticate(request);
      logger.info('Fetching Documents data', { userId: auth.userId, type });

      const data: any = {};

      if (type === 'all' || type === 'kpis') {
        data.kpis = {
          totalFiles: 12482,
          storageUsed: 48.5,
          shared: 842,
          folders: 324,
          totalFilesDelta: 124,
          storageUsedDelta: 2.4,
          sharedDelta: 18,
          foldersDelta: 8,
        };
      }

      if (type === 'all' || type === 'documents') {
        data.documents = [
          { id: 'DOC-001', name: 'Q1 Financial Report.pdf', type: 'PDF', size: 2450000, uploadedBy: 'Finance Team', uploadedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
          { id: 'DOC-002', name: 'Product Roadmap.pptx', type: 'PPTX', size: 5200000, uploadedBy: 'Product Team', uploadedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() },
          { id: 'DOC-003', name: 'Contract Template.docx', type: 'DOCX', size: 125000, uploadedBy: 'Legal Team', uploadedAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString() },
        ];
      }

      logger.info('Documents data fetched successfully');

      return Response.json({ success: true, data });
    } catch (error: any) {
      if (error.message === 'No authentication token provided') {
        return Response.json({ error: 'Authentication required' }, { status: 401 });
      }

      logger.error('Failed to fetch Documents data', error);

      return Response.json({ success: false, error: 'Failed to fetch Documents data' }, { status: 500 });
    }
  },
});

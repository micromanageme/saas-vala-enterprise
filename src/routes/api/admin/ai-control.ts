// @ts-nocheck
/**
 * SaaS Vala Enterprise - AI Control Center API
 * Super Admin AI model and usage management
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';

export const Route = createFileRoute('/api/admin/ai-control')({
  GET: async ({ request }) => {
    const logger = Logger.createRequestLogger('admin-ai-control-api');

    try {
      const auth = await AuthMiddleware.authenticate(request);
      
      if (!auth.isSuperAdmin) {
        return Response.json(
          { error: 'Unauthorized access' },
          { status: 403 }
        );
      }

      const url = new URL(request.url);
      const type = url.searchParams.get('type') || 'all';

      logger.info('Fetching AI control data', { userId: auth.userId, type });

      const data: any = {};

      if (type === 'all' || type === 'kpis') {
        const [
          totalAiCalls,
          monthlyAiCalls,
          activeModels,
          totalTokens,
          monthlyTokens,
          avgResponseTime,
          errorRate,
        ] = await Promise.all([
          prisma.activity.count({
            where: {
              action: { contains: 'ai_call' },
            },
          }),
          prisma.activity.count({
            where: {
              action: { contains: 'ai_call' },
              createdAt: { gte: new Date(new Date().setDate(new Date().getDate() - 30)) },
            },
          }),
          5, // Mock - would come from AI model registry
          0, // Mock - would come from AI usage tracking
          0, // Mock - would come from AI usage tracking
          1.2, // Mock - would come from AI monitoring
          0.02, // Mock - would come from AI monitoring
        ]);

        data.kpis = {
          totalAiCalls,
          monthlyAiCalls,
          activeModels,
          totalTokens,
          monthlyTokens,
          avgResponseTime,
          errorRate,
          callsDelta: 25,
          tokensDelta: 30,
          errorRateDelta: -0.01,
        };
      }

      if (type === 'all' || type === 'models') {
        // Mock data - would come from AI model registry
        data.models = [
          { id: 'gpt-4', name: 'GPT-4', status: 'ACTIVE', calls: 15000, avgLatency: 1200 },
          { id: 'gpt-3.5', name: 'GPT-3.5 Turbo', status: 'ACTIVE', calls: 45000, avgLatency: 800 },
          { id: 'claude-3', name: 'Claude 3', status: 'ACTIVE', calls: 12000, avgLatency: 1000 },
          { id: 'gemini', name: 'Gemini Pro', status: 'ACTIVE', calls: 8000, avgLatency: 900 },
          { id: 'llama', name: 'Llama 2', status: 'ACTIVE', calls: 5000, avgLatency: 1500 },
        ];
      }

      if (type === 'all' || type === 'usage') {
        const recentAiCalls = await prisma.activity.findMany({
          where: {
            action: { contains: 'ai_call' },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 50,
          include: {
            user: {
              select: {
                displayName: true,
                email: true,
              },
            },
          },
        });

        data.usage = recentAiCalls.map((a) => ({
          id: a.id,
          action: a.action,
          user: a.user?.displayName || a.user?.email,
          timestamp: a.createdAt,
          metadata: a.metadata,
        }));
      }

      logger.info('AI control data fetched successfully');

      return Response.json({ success: true, data });
    } catch (error: any) {
      if (error.message === 'No authentication token provided') {
        return Response.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      logger.error('Failed to fetch AI control data', error);

      return Response.json(
        { success: false, error: 'Failed to fetch AI control data' },
        { status: 500 }
      );
    }
  },
});

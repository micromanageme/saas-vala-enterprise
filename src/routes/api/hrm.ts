/**
 * SaaS Vala Enterprise - HRM API
 * Employees, Payroll & Leave Management
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';

export const Route = createFileRoute('/api/hrm')({
  GET: async ({ request }) => {
    const logger = Logger.createRequestLogger('hrm-api');
    const url = new URL(request.url);
    const type = url.searchParams.get('type') || 'all';

    try {
      const auth = await AuthMiddleware.authenticate(request);
      logger.info('Fetching HRM data', { userId: auth.userId, type });

      const data: any = {};

      if (type === 'all' || type === 'kpis') {
        data.kpis = {
          totalEmployees: 248,
          active: 235,
          onLeave: 13,
          newHires: 8,
          totalEmployeesDelta: 3,
          activeDelta: 2,
          onLeaveDelta: 1,
          newHiresDelta: 25,
        };
      }

      if (type === 'all' || type === 'employees') {
        data.employees = [
          { id: 'EMP-001', name: 'John Doe', department: 'Engineering', position: 'Senior Developer', status: 'Active', joinDate: '2022-03-15' },
          { id: 'EMP-002', name: 'Jane Smith', department: 'Sales', position: 'Sales Manager', status: 'Active', joinDate: '2021-08-22' },
          { id: 'EMP-003', name: 'Bob Johnson', department: 'HR', position: 'HR Specialist', status: 'On Leave', joinDate: '2023-01-10' },
          { id: 'EMP-004', name: 'Alice Brown', department: 'Marketing', position: 'Marketing Lead', status: 'Active', joinDate: '2022-11-05' },
          { id: 'EMP-005', name: 'Charlie Wilson', department: 'Finance', position: 'Accountant', status: 'Active', joinDate: '2023-04-18' },
        ];
      }

      if (type === 'all' || type === 'departments') {
        data.departments = [
          { id: 'DEPT-001', name: 'Engineering', head: 'John Doe', employees: 45, budget: 1250000 },
          { id: 'DEPT-002', name: 'Sales', head: 'Jane Smith', employees: 38, budget: 890000 },
          { id: 'DEPT-003', name: 'Marketing', head: 'Alice Brown', employees: 28, budget: 650000 },
          { id: 'DEPT-004', name: 'HR', head: 'Bob Johnson', employees: 12, budget: 320000 },
          { id: 'DEPT-005', name: 'Finance', head: 'Charlie Wilson', employees: 18, budget: 480000 },
        ];
      }

      logger.info('HRM data fetched successfully');

      return Response.json({ success: true, data });
    } catch (error: any) {
      if (error.message === 'No authentication token provided') {
        return Response.json({ error: 'Authentication required' }, { status: 401 });
      }

      logger.error('Failed to fetch HRM data', error);

      return Response.json({ success: false, error: 'Failed to fetch HRM data' }, { status: 500 });
    }
  },
});

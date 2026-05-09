// @ts-nocheck
/**
 * SaaS Vala Enterprise - Database Optimization
 * Database query optimization utilities
 */

import { prisma } from './db';

/**
 * Optimized product query with selective fields
 */
export async function getProductsOptimized(options?: {
  skip?: number;
  take?: number;
  where?: any;
  orderBy?: any;
}) {
  return prisma.product.findMany({
    skip: options?.skip,
    take: options?.take || 20,
    where: options?.where,
    orderBy: options?.orderBy || { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      currency: true,
      category: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      // Exclude heavy metadata field by default
    },
  });
}

/**
 * Optimized license query with minimal data
 */
export async function getLicensesOptimized(options?: {
  skip?: number;
  take?: number;
  where?: any;
}) {
  return prisma.license.findMany({
    skip: options?.skip,
    take: options?.take || 20,
    where: options?.where,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      licenseKey: true,
      status: true,
      expiresAt: true,
      createdAt: true,
      product: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}

/**
 * Batch query for dashboard statistics
 */
export async function getDashboardStatsOptimized() {
  const [userCount, productCount, licenseCount, downloadCount] = await Promise.all([
    prisma.user.count({ where: { deletedAt: null } }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.license.count({ where: { status: 'ACTIVE' } }),
    prisma.download.count(),
  ]);

  return {
    userCount,
    productCount,
    licenseCount,
    downloadCount,
  };
}

/**
 * Optimized transaction query with pagination
 */
export async function getTransactionsOptimized(options?: {
  skip?: number;
  take?: number;
  userId?: string;
}) {
  return prisma.transaction.findMany({
    skip: options?.skip,
    take: options?.take || 20,
    where: options?.userId ? { userId: options.userId } : {},
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      type: true,
      amount: true,
      currency: true,
      status: true,
      description: true,
      createdAt: true,
    },
  });
}
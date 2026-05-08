/**
 * SaaS Vala Enterprise - Commission Engine
 * Calculate and distribute commissions for vendors, resellers, and affiliates
 */

import { prisma } from './db';
import { Logger } from './logger';

export interface CommissionCalculation {
  vendorCommission: number;
  resellerCommission: number;
  affiliateCommission: number;
  platformCommission: number;
}

export interface CommissionRule {
  type: 'VENDOR' | 'RESELLER' | 'AFFILIATE';
  tier: string;
  rate: number; // percentage
  minAmount?: number;
  maxAmount?: number;
}

const COMMISSION_RULES: CommissionRule[] = [
  // Vendor tiers
  { type: 'VENDOR', tier: 'BRONZE', rate: 10 },
  { type: 'VENDOR', tier: 'SILVER', rate: 15 },
  { type: 'VENDOR', tier: 'GOLD', rate: 20 },
  { type: 'VENDOR', tier: 'PLATINUM', rate: 25 },
  
  // Reseller tiers
  { type: 'RESELLER', tier: 'BRONZE', rate: 5 },
  { type: 'RESELLER', tier: 'SILVER', rate: 8 },
  { type: 'RESELLER', tier: 'GOLD', rate: 12 },
  { type: 'RESELLER', tier: 'PLATINUM', rate: 15 },
  
  // Affiliate tiers
  { type: 'AFFILIATE', tier: 'BRONZE', rate: 3 },
  { type: 'AFFILIATE', tier: 'SILVER', rate: 5 },
  { type: 'AFFILIATE', tier: 'GOLD', rate: 7 },
  { type: 'AFFILIATE', tier: 'PLATINUM', rate: 10 },
];

export class CommissionEngine {
  private logger = Logger.createRequestLogger('commission-engine');

  /**
   * Calculate commissions for a transaction
   */
  async calculateCommissions(
    amount: number,
    vendorId?: string,
    resellerId?: string,
    affiliateId?: string
  ): Promise<CommissionCalculation> {
    this.logger.info('Calculating commissions', { amount, vendorId, resellerId, affiliateId });

    let vendorCommission = 0;
    let resellerCommission = 0;
    let affiliateCommission = 0;

    // Get vendor commission rate
    if (vendorId) {
      const vendor = await prisma.reseller.findUnique({
        where: { userId: vendorId },
      });
      if (vendor) {
        const rule = COMMISSION_RULES.find(
          (r) => r.type === 'VENDOR' && r.tier === vendor.tier
        );
        vendorCommission = (amount * (rule?.rate || 10)) / 100;
      }
    }

    // Get reseller commission rate
    if (resellerId) {
      const reseller = await prisma.reseller.findUnique({
        where: { userId: resellerId },
      });
      if (reseller) {
        const rule = COMMISSION_RULES.find(
          (r) => r.type === 'RESELLER' && r.tier === reseller.tier
        );
        resellerCommission = (amount * (rule?.rate || 5)) / 100;
      }
    }

    // Get affiliate commission rate
    if (affiliateId) {
      const affiliate = await prisma.affiliate.findUnique({
        where: { userId: affiliateId },
      });
      if (affiliate) {
        const rule = COMMISSION_RULES.find(
          (r) => r.type === 'AFFILIATE' && r.tier === affiliate.tier
        );
        affiliateCommission = (amount * (rule?.rate || 3)) / 100;
      }
    }

    const platformCommission = amount - vendorCommission - resellerCommission - affiliateCommission;

    this.logger.info('Commissions calculated', {
      vendorCommission,
      resellerCommission,
      affiliateCommission,
      platformCommission,
    });

    return {
      vendorCommission,
      resellerCommission,
      affiliateCommission,
      platformCommission,
    };
  }

  /**
   * Distribute commissions after a successful transaction
   */
  async distributeCommissions(
    transactionId: string,
    commissions: CommissionCalculation,
    vendorId?: string,
    resellerId?: string,
    affiliateId?: string
  ): Promise<void> {
    this.logger.info('Distributing commissions', { transactionId, commissions });

    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    // Distribute vendor commission
    if (vendorId && commissions.vendorCommission > 0) {
      await this.addToWallet(vendorId, commissions.vendorCommission, 'VENDOR_COMMISSION', transactionId);
    }

    // Distribute reseller commission
    if (resellerId && commissions.resellerCommission > 0) {
      await this.addToWallet(resellerId, commissions.resellerCommission, 'RESELLER_COMMISSION', transactionId);
    }

    // Distribute affiliate commission
    if (affiliateId && commissions.affiliateCommission > 0) {
      await this.addToWallet(affiliateId, commissions.affiliateCommission, 'AFFILIATE_COMMISSION', transactionId);
    }

    this.logger.info('Commissions distributed successfully', { transactionId });
  }

  /**
   * Add commission to user's wallet
   */
  private async addToWallet(
    userId: string,
    amount: number,
    type: string,
    transactionId: string
  ): Promise<void> {
    let wallet = await prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          userId,
          balance: 0,
          currency: 'USD',
        },
      });
    }

    // Update wallet balance
    await prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: {
          increment: amount,
        },
      },
    });

    // Create transaction record
    await prisma.transaction.create({
      data: {
        walletId: wallet.id,
        userId,
        type: 'CREDIT',
        amount,
        currency: 'USD',
        status: 'COMPLETED',
        description: type,
        reference: transactionId,
      },
    });
  }

  /**
   * Get commission rule for a user type and tier
   */
  getCommissionRule(type: 'VENDOR' | 'RESELLER' | 'AFFILIATE', tier: string): CommissionRule | undefined {
    return COMMISSION_RULES.find((r) => r.type === type && r.tier === tier);
  }

  /**
   * Get all commission rules
   */
  getAllCommissionRules(): CommissionRule[] {
    return COMMISSION_RULES;
  }
}

export const CommissionEngineService = new CommissionEngine();

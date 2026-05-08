/**
 * SaaS Vala Enterprise - Subscription Renewal Engine
 * Automatic subscription renewal processing
 */

import { prisma } from './db';
import { Logger } from './logger';

export class SubscriptionRenewalEngine {
  private logger = Logger.createRequestLogger('subscription-renewal');

  /**
   * Check and renew expiring subscriptions
   */
  async checkAndRenewSubscriptions(): Promise<void> {
    this.logger.info('Checking for expiring subscriptions');

    const now = new Date();
    const warningDays = 7;
    const warningDate = new Date(now.getTime() + warningDays * 24 * 60 * 60 * 1000);

    // Find subscriptions expiring soon
    const expiringSubscriptions = await prisma.subscription.findMany({
      where: {
        status: 'ACTIVE',
        endDate: {
          lte: warningDate,
        },
      },
      include: {
        plan: true,
        user: true,
      },
    });

    this.logger.info(`Found ${expiringSubscriptions.length} expiring subscriptions`);

    for (const subscription of expiringSubscriptions) {
      await this.processRenewal(subscription);
    }
  }

  /**
   * Process single subscription renewal
   */
  private async processRenewal(subscription: any): Promise<void> {
    this.logger.info('Processing subscription renewal', { subscriptionId: subscription.id });

    const now = new Date();

    // Check if subscription has already expired
    if (subscription.endDate < now) {
      // Cancel expired subscription
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          status: 'EXPIRED',
        },
      });

      // Create notification
      await prisma.notification.create({
        data: {
          userId: subscription.userId,
          type: 'SUBSCRIPTION_EXPIRED',
          title: 'Subscription Expired',
          content: `Your subscription to ${subscription.plan?.name} has expired.`,
          metadata: {
            subscriptionId: subscription.id,
            planName: subscription.plan?.name,
          },
        },
      });

      this.logger.info('Subscription expired', { subscriptionId: subscription.id });
      return;
    }

    // Renew subscription
    const newEndDate = new Date(subscription.endDate);
    
    // Calculate new end date based on billing cycle
    if (subscription.billingCycle === 'MONTHLY') {
      newEndDate.setMonth(newEndDate.getMonth() + 1);
    } else if (subscription.billingCycle === 'QUARTERLY') {
      newEndDate.setMonth(newEndDate.getMonth() + 3);
    } else if (subscription.billingCycle === 'YEARLY') {
      newEndDate.setFullYear(newEndDate.getFullYear() + 1);
    }

    // Update subscription
    const updatedSubscription = await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        endDate: newEndDate,
        lastRenewedAt: now,
      },
    });

    // Create renewal transaction
    await prisma.transaction.create({
      data: {
        userId: subscription.userId,
        type: 'DEBIT',
        amount: subscription.amount,
        currency: subscription.currency,
        status: 'COMPLETED',
        description: `Subscription renewal - ${subscription.plan?.name}`,
        reference: `RENEWAL-${subscription.id}`,
        metadata: {
          subscriptionId: subscription.id,
          billingCycle: subscription.billingCycle,
        },
      },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        userId: subscription.userId,
        type: 'SUBSCRIPTION_RENEWED',
        title: 'Subscription Renewed',
        content: `Your subscription to ${subscription.plan?.name} has been renewed until ${newEndDate.toLocaleDateString()}.`,
        metadata: {
          subscriptionId: subscription.id,
          planName: subscription.plan?.name,
          newEndDate: newEndDate.toISOString(),
        },
      },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        userId: subscription.userId,
        action: 'subscription.renewed',
        entity: 'subscription',
        entityId: subscription.id,
        metadata: {
          oldEndDate: subscription.endDate,
          newEndDate: newEndDate.toISOString(),
        },
      },
    });

    this.logger.info('Subscription renewed successfully', { subscriptionId: subscription.id });
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(subscriptionId: string, reason?: string): Promise<void> {
    this.logger.info('Cancelling subscription', { subscriptionId });

    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: { plan: true },
    });

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
        metadata: {
          ...subscription.metadata,
          cancelReason: reason,
        },
      },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        userId: subscription.userId,
        type: 'SUBSCRIPTION_CANCELLED',
        title: 'Subscription Cancelled',
        content: `Your subscription to ${subscription.plan?.name} has been cancelled.`,
        metadata: {
          subscriptionId: subscription.id,
          planName: subscription.plan?.name,
          reason,
        },
      },
    });

    this.logger.info('Subscription cancelled successfully', { subscriptionId });
  }

  /**
   * Upgrade/downgrade subscription
   */
  async changePlan(subscriptionId: string, newPlanId: string): Promise<void> {
    this.logger.info('Changing subscription plan', { subscriptionId, newPlanId });

    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    const newPlan = await prisma.plan.findUnique({
      where: { id: newPlanId },
    });

    if (!newPlan) {
      throw new Error('Plan not found');
    }

    // Update subscription
    const updatedSubscription = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        planId: newPlanId,
        amount: newPlan.price,
        currency: newPlan.currency,
        billingCycle: newPlan.interval,
      },
    });

    // Create transaction for plan change
    await prisma.transaction.create({
      data: {
        userId: subscription.userId,
        type: 'DEBIT',
        amount: newPlan.price,
        currency: newPlan.currency,
        status: 'COMPLETED',
        description: `Plan change to ${newPlan.name}`,
        reference: `PLANCHANGE-${subscriptionId}`,
        metadata: {
          subscriptionId: subscription.id,
          oldPlanId: subscription.planId,
          newPlanId,
        },
      },
    });

    this.logger.info('Subscription plan changed successfully', { subscriptionId });
  }
}

export const SubscriptionRenewalEngine = new SubscriptionRenewalEngine();

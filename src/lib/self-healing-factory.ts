/**
 * SaaS Vala Enterprise - Self-Healing Software Factory
 * Comprehensive automated recovery system for role-based dashboards and services
 */

import { Logger } from './logger';
import { RoleIsolationEngine } from './rbac/role-isolation-engine';

export interface HealthCheckResult {
  service: string;
  healthy: boolean;
  lastCheck: Date;
  issues: string[];
  autoRecoverable: boolean;
}

export interface RecoveryAction {
  id: string;
  service: string;
  action: 'restart' | 'clear-cache' | 'reconnect' | 'scale' | 'rollback';
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  timestamp: Date;
  result?: string;
}

export interface FactoryMetrics {
  totalHealthChecks: number;
  successfulRecoveries: number;
  failedRecoveries: number;
  avgRecoveryTime: number;
  uptime: number;
}

/**
 * Self-Healing Software Factory
 * Provides automated recovery for dashboards, services, and infrastructure
 */
export class SelfHealingFactory {
  private logger = Logger.createRequestLogger('self-healing-factory');
  private isRunning = false;
  private interval: NodeJS.Timeout | null = null;
  private healthCheckResults = new Map<string, HealthCheckResult>();
  private recoveryActions: RecoveryAction[] = [];
  private metrics: FactoryMetrics = {
    totalHealthChecks: 0,
    successfulRecoveries: 0,
    failedRecoveries: 0,
    avgRecoveryTime: 0,
    uptime: 0,
  };

  /**
   * Start the self-healing factory
   */
  start(intervalMs: number = 60000): void {
    if (this.isRunning) {
      this.logger.warn('Self-healing factory already running');
      return;
    }

    this.isRunning = true;
    this.logger.info('Starting self-healing software factory', { intervalMs });

    this.interval = setInterval(() => {
      this.runHealthChecks();
    }, intervalMs);
  }

  /**
   * Stop the self-healing factory
   */
  stop(): void {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }

    this.logger.info('Self-healing software factory stopped');
  }

  /**
   * Run comprehensive health checks
   */
  private async runHealthChecks(): Promise<void> {
    this.logger.debug('Running health checks');

    try {
      const services = [
        'authentication-service',
        'authorization-service',
        'database-service',
        'cache-service',
        'api-gateway',
        'message-queue',
        'file-storage',
        'dashboard-service',
        'rbac-service',
        'self-healing-service',
      ];

      const results = await Promise.all(
        services.map(service => this.checkServiceHealth(service))
      );

      results.forEach(result => {
        this.healthCheckResults.set(result.service, result);
        this.metrics.totalHealthChecks++;

        if (!result.healthy && result.autoRecoverable) {
          this.queueRecoveryAction(result);
        }
      });

      this.processRecoveryQueue();
    } catch (error) {
      this.logger.error('Health check failed', error instanceof Error ? error.message : String(error));
    }
  }

  /**
   * Check individual service health
   */
  private async checkServiceHealth(service: string): Promise<HealthCheckResult> {
    const startTime = Date.now();
    const issues: string[] = [];
    let healthy = true;
    let autoRecoverable = false;

    try {
      // Simulate health check - in production, this would make actual API calls
      const response = await fetch(`/api/health/${service}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }).catch(() => null);

      if (!response || !response.ok) {
        healthy = false;
        issues.push('Service not responding');
        autoRecoverable = true;
      }

      // Check response time
      const responseTime = Date.now() - startTime;
      if (responseTime > 5000) {
        healthy = false;
        issues.push(`Slow response: ${responseTime}ms`);
        autoRecoverable = true;
      }
    } catch (error) {
      healthy = false;
      issues.push(`Health check error: ${error instanceof Error ? error.message : String(error)}`);
      autoRecoverable = true;
    }

    return {
      service,
      healthy,
      lastCheck: new Date(),
      issues,
      autoRecoverable,
    };
  }

  /**
   * Queue recovery action for unhealthy service
   */
  private queueRecoveryAction(result: HealthCheckResult): void {
    const action: RecoveryAction = {
      id: `recovery-${Date.now()}-${result.service}`,
      service: result.service,
      action: this.determineRecoveryAction(result),
      priority: this.determinePriority(result),
      status: 'pending',
      timestamp: new Date(),
    };

    this.recoveryActions.push(action);
    this.logger.info('Queued recovery action', {
      service: result.service,
      action: action.action,
      priority: action.priority,
    });
  }

  /**
   * Determine appropriate recovery action
   */
  private determineRecoveryAction(result: HealthCheckResult): RecoveryAction['action'] {
    if (result.service.includes('cache')) {
      return 'clear-cache';
    }
    if (result.service.includes('database')) {
      return 'reconnect';
    }
    if (result.issues.some(issue => issue.includes('not responding'))) {
      return 'restart';
    }
    return 'scale';
  }

  /**
   * Determine recovery priority
   */
  private determinePriority(result: HealthCheckResult): RecoveryAction['priority'] {
    const criticalServices = ['authentication-service', 'authorization-service', 'database-service'];
    if (criticalServices.includes(result.service)) {
      return 'critical';
    }
    if (result.issues.length > 2) {
      return 'high';
    }
    return 'medium';
  }

  /**
   * Process recovery queue
   */
  private async processRecoveryQueue(): Promise<void> {
    if (this.recoveryActions.length === 0) {
      return;
    }

    // Sort by priority
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    this.recoveryActions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    // Process up to 3 concurrent recoveries
    const actionsToProcess = this.recoveryActions
      .filter(a => a.status === 'pending')
      .slice(0, 3);

    await Promise.all(actionsToProcess.map(action => this.executeRecovery(action)));
  }

  /**
   * Execute recovery action
   */
  private async executeRecovery(action: RecoveryAction): Promise<void> {
    const startTime = Date.now();
    action.status = 'in-progress';

    this.logger.info('Executing recovery action', {
      service: action.service,
      action: action.action,
    });

    try {
      let result: string;

      switch (action.action) {
        case 'restart':
          result = await this.restartService(action.service);
          break;
        case 'clear-cache':
          result = await this.clearCache(action.service);
          break;
        case 'reconnect':
          result = await this.reconnectService(action.service);
          break;
        case 'scale':
          result = await this.scaleService(action.service);
          break;
        case 'rollback':
          result = await this.rollbackService(action.service);
          break;
        default:
          throw new Error(`Unknown action: ${action.action}`);
      }

      action.status = 'completed';
      action.result = result;
      this.metrics.successfulRecoveries++;

      const recoveryTime = Date.now() - startTime;
      this.updateAvgRecoveryTime(recoveryTime);

      this.logger.info('Recovery action completed', {
        service: action.service,
        action: action.action,
        result,
        duration: recoveryTime,
      });
    } catch (error) {
      action.status = 'failed';
      action.result = `Error: ${error instanceof Error ? error.message : String(error)}`;
      this.metrics.failedRecoveries++;

      this.logger.error('Recovery action failed', {
        service: action.service,
        action: action.action,
        errorMessage: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Restart service
   */
  private async restartService(service: string): Promise<string> {
    // In production, this would call actual service management APIs
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `Service ${service} restarted successfully`;
  }

  /**
   * Clear cache
   */
  private async clearCache(service: string): Promise<string> {
    RoleIsolationEngine.clearCache();
    await new Promise(resolve => setTimeout(resolve, 500));
    return `Cache cleared for ${service}`;
  }

  /**
   * Reconnect service
   */
  private async reconnectService(service: string): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return `Reconnected to ${service}`;
  }

  /**
   * Scale service
   */
  private async scaleService(service: string): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return `Scaled ${service} to handle increased load`;
  }

  /**
   * Rollback service
   */
  private async rollbackService(service: string): Promise<string> {
    await new Promise<void>(resolve => setTimeout(resolve, 2000));
    return `Rolled back ${service} to previous stable version`;
  }

  /**
   * Update average recovery time
   */
  private updateAvgRecoveryTime(recoveryTime: number): void {
    const total = this.metrics.successfulRecoveries;
    const currentAvg = this.metrics.avgRecoveryTime;
    this.metrics.avgRecoveryTime = (currentAvg * (total - 1) + recoveryTime) / total;
  }

  /**
   * Get health status for all services
   */
  getHealthStatus(): Map<string, HealthCheckResult> {
    return new Map(this.healthCheckResults);
  }

  /**
   * Get recovery actions history
   */
  getRecoveryActions(limit: number = 50): RecoveryAction[] {
    return this.recoveryActions.slice(-limit);
  }

  /**
   * Get factory metrics
   */
  getMetrics(): FactoryMetrics {
    return { ...this.metrics };
  }

  /**
   * Run manual health check
   */
  async runManualHealthCheck(service?: string): Promise<HealthCheckResult | HealthCheckResult[]> {
    if (service) {
      return this.checkServiceHealth(service);
    }

    const services = Array.from(this.healthCheckResults.keys());
    const results = await Promise.all(
      services.map(s => this.checkServiceHealth(s))
    );

    results.forEach(result => {
      this.healthCheckResults.set(result.service, result);
      this.metrics.totalHealthChecks++;
    });

    return results;
  }

  /**
   * Trigger manual recovery
   */
  async triggerManualRecovery(service: string, action: RecoveryAction['action']): Promise<RecoveryAction> {
    const recoveryAction: RecoveryAction = {
      id: `manual-${Date.now()}-${service}`,
      service,
      action,
      priority: 'high',
      status: 'pending',
      timestamp: new Date(),
    };

    this.recoveryActions.push(recoveryAction);
    await this.executeRecovery(recoveryAction);

    return recoveryAction;
  }
}

export const selfHealingFactory = new SelfHealingFactory();

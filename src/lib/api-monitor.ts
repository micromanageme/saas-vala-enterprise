// @ts-nocheck
/**
 * SaaS Vala Enterprise - API Monitor
 * API monitoring and metrics collection
 */

interface MetricEntry {
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
  timestamp: number;
}

class ApiMonitor {
  private metrics: MetricEntry[];
  private maxMetrics = 1000;

  constructor() {
    this.metrics = [];
  }

  /**
   * Record API call
   */
  record(
    endpoint: string,
    method: string,
    statusCode: number,
    responseTime: number
  ): void {
    this.metrics.push({
      endpoint,
      method,
      statusCode,
      responseTime,
      timestamp: Date.now(),
    });

    // Keep only recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
  }

  /**
   * Get metrics for endpoint
   */
  getMetrics(endpoint: string, timeRange?: number): MetricEntry[] {
    const since = timeRange ? Date.now() - timeRange : 0;
    return this.metrics.filter(
      (m) => m.endpoint === endpoint && m.timestamp >= since
    );
  }

  /**
   * Get average response time
   */
  getAvgResponseTime(endpoint: string, timeRange?: number): number {
    const metrics = this.getMetrics(endpoint, timeRange);
    if (metrics.length === 0) return 0;
    const sum = metrics.reduce((acc, m) => acc + m.responseTime, 0);
    return sum / metrics.length;
  }

  /**
   * Get error rate
   */
  getErrorRate(endpoint: string, timeRange?: number): number {
    const metrics = this.getMetrics(endpoint, timeRange);
    if (metrics.length === 0) return 0;
    const errors = metrics.filter((m) => m.statusCode >= 400).length;
    return (errors / metrics.length) * 100;
  }

  /**
   * Get request count
   */
  getRequestCount(endpoint: string, timeRange?: number): number {
    return this.getMetrics(endpoint, timeRange).length;
  }

  /**
   * Get all metrics
   */
  getAllMetrics(timeRange?: number): MetricEntry[] {
    const since = timeRange ? Date.now() - timeRange : 0;
    return this.metrics.filter((m) => m.timestamp >= since);
  }

  /**
   * Clear metrics
   */
  clear(): void {
    this.metrics = [];
  }

  /**
   * Get summary statistics
   */
  getSummary(timeRange?: number) {
    const metrics = this.getAllMetrics(timeRange);
    
    if (metrics.length === 0) {
      return {
        totalRequests: 0,
        avgResponseTime: 0,
        errorRate: 0,
        endpoints: {},
      };
    }

    const avgResponseTime = metrics.reduce((acc, m) => acc + m.responseTime, 0) / metrics.length;
    const errorRate = (metrics.filter((m) => m.statusCode >= 400).length / metrics.length) * 100;

    const endpoints: Record<string, number> = {};
    metrics.forEach((m) => {
      endpoints[m.endpoint] = (endpoints[m.endpoint] || 0) + 1;
    });

    return {
      totalRequests: metrics.length,
      avgResponseTime,
      errorRate,
      endpoints,
    };
  }
}

export const apiMonitor = new ApiMonitor();
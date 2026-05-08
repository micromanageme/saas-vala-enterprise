/**
 * SaaS Vala Enterprise - Logger
 * Enterprise structured logging with correlation IDs
 */

import { env } from './env';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  CRITICAL = 4,
}

export interface LogContext {
  correlationId?: string;
  userId?: string;
  companyId?: string;
  sessionId?: string;
  requestId?: string;
  [key: string]: any;
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: LogContext;
  error?: Error;
  metadata?: any;
}

export class Logger {
  private static correlationIdStore = new Map<string, string>();

  /**
   * Generate correlation ID
   */
  static generateCorrelationId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }

  /**
   * Set correlation ID for request
   */
  static setCorrelationId(requestId: string, correlationId: string): void {
    this.correlationIdStore.set(requestId, correlationId);
  }

  /**
   * Get correlation ID for request
   */
  static getCorrelationId(requestId: string): string | undefined {
    return this.correlationIdStore.get(requestId);
  }

  /**
   * Clear correlation ID for request
   */
  static clearCorrelationId(requestId: string): void {
    this.correlationIdStore.delete(requestId);
  }

  /**
   * Log debug message
   */
  static debug(message: string, context?: LogContext, metadata?: any): void {
    this.log(LogLevel.DEBUG, message, context, metadata);
  }

  /**
   * Log info message
   */
  static info(message: string, context?: LogContext, metadata?: any): void {
    this.log(LogLevel.INFO, message, context, metadata);
  }

  /**
   * Log warning message
   */
  static warn(message: string, context?: LogContext, metadata?: any): void {
    this.log(LogLevel.WARN, message, context, metadata);
  }

  /**
   * Log error message
   */
  static error(message: string, error?: Error, context?: LogContext, metadata?: any): void {
    this.log(LogLevel.ERROR, message, context, metadata, error);
  }

  /**
   * Log critical message
   */
  static critical(message: string, error?: Error, context?: LogContext, metadata?: any): void {
    this.log(LogLevel.CRITICAL, message, context, metadata, error);
  }

  /**
   * Core logging method
   */
  private static log(
    level: LogLevel,
    message: string,
    context?: LogContext,
    metadata?: any,
    error?: Error
  ): void {
    const minLevel = this.getLogLevel(env.LOG_LEVEL);

    if (level < minLevel) {
      return;
    }

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
      metadata,
    };

    // Format log entry
    const formatted = this.formatLogEntry(entry);

    // Output to console
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formatted);
        break;
      case LogLevel.INFO:
        console.info(formatted);
        break;
      case LogLevel.WARN:
        console.warn(formatted);
        break;
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
        console.error(formatted);
        break;
    }

    // In production, send to external logging service
    if (env.APP_ENV === 'production') {
      this.sendToExternalLogger(entry);
    }
  }

  /**
   * Format log entry for console output
   */
  private static formatLogEntry(entry: LogEntry): string {
    const levelName = LogLevel[entry.level];
    const contextStr = entry.context ? ` ${JSON.stringify(entry.context)}` : '';
    const metadataStr = entry.metadata ? ` ${JSON.stringify(entry.metadata)}` : '';
    const errorStr = entry.error ? ` ${entry.error.stack}` : '';

    return `[${entry.timestamp}] [${levelName}]${contextStr} ${entry.message}${metadataStr}${errorStr}`;
  }

  /**
   * Get log level from string
   */
  private static getLogLevel(level: string): LogLevel {
    switch (level.toLowerCase()) {
      case 'debug':
        return LogLevel.DEBUG;
      case 'info':
        return LogLevel.INFO;
      case 'warn':
        return LogLevel.WARN;
      case 'error':
        return LogLevel.ERROR;
      case 'critical':
        return LogLevel.CRITICAL;
      default:
        return LogLevel.INFO;
    }
  }

  /**
   * Send log entry to external logging service
   */
  private static async sendToExternalLogger(entry: LogEntry): Promise<void> {
    // Implement integration with external logging service
    // e.g., Datadog, Sentry, LogRocket, etc.
    // For now, this is a placeholder
  }

  /**
   * Create request logger
   */
  static createRequestLogger(requestId: string) {
    const correlationId = this.generateCorrelationId();
    this.setCorrelationId(requestId, correlationId);

    return {
      debug: (message: string, context?: LogContext, metadata?: any) =>
        this.debug(message, { ...context, correlationId }, metadata),
      info: (message: string, context?: LogContext, metadata?: any) =>
        this.info(message, { ...context, correlationId }, metadata),
      warn: (message: string, context?: LogContext, metadata?: any) =>
        this.warn(message, { ...context, correlationId }, metadata),
      error: (message: string, error?: Error, context?: LogContext, metadata?: any) =>
        this.error(message, error, { ...context, correlationId }, metadata),
      critical: (message: string, error?: Error, context?: LogContext, metadata?: any) =>
        this.critical(message, error, { ...context, correlationId }, metadata),
      cleanup: () => this.clearCorrelationId(requestId),
    };
  }
}

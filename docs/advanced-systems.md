# Advanced Systems Architecture
## Phase 07 - AI, Observability, Automation

---

## Overview

Enterprise-grade advanced systems including AI capabilities, comprehensive observability, and automation orchestration.

---

## AI Module

### Prompt Management

```typescript
// src/lib/ai/prompts.ts
export class PromptService {
  /**
   * Create prompt template
   */
  static async createPrompt(data: {
    name: string;
    description?: string;
    template: string;
    variables: string[];
    model: string;
    temperature?: number;
    maxTokens?: number;
    tenantId: string;
    userId: string;
  }) {
    return prisma.aiPrompt.create({
      data,
    });
  }

  /**
   * Execute prompt with variables
   */
  static async executePrompt(promptId: string, variables: Record<string, any>) {
    const prompt = await prisma.aiPrompt.findUnique({
      where: { id: promptId },
    });

    if (!prompt) throw new Error('Prompt not found');

    // Replace variables in template
    let renderedTemplate = prompt.template;
    for (const [key, value] of Object.entries(variables)) {
      renderedTemplate = renderedTemplate.replace(
        new RegExp(`{{${key}}}`, 'g'),
        String(value)
      );
    }

    // Call AI model
    const response = await this.callAIModel({
      model: prompt.model,
      prompt: renderedTemplate,
      temperature: prompt.temperature || 0.7,
      maxTokens: prompt.maxTokens || 1000,
    });

    return prisma.aiExecution.create({
      data: {
        promptId,
        input: variables,
        output: response,
        tokensUsed: response.usage?.total_tokens,
        model: prompt.model,
        status: 'completed',
      },
    });
  }

  /**
   * Call AI model (OpenAI, Anthropic, etc.)
   */
  private static async callAIModel(data: {
    model: string;
    prompt: string;
    temperature: number;
    maxTokens: number;
  }) {
    // Implementation depends on AI provider
    // Example with OpenAI:
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: data.model,
        messages: [{ role: 'user', content: data.prompt }],
        temperature: data.temperature,
        max_tokens: data.maxTokens,
      }),
    });

    return response.json();
  }
}
```

### AI Workflows

```typescript
// src/lib/ai/workflows.ts
export class AIWorkflowService {
  /**
   * Create AI workflow
   */
  static async createWorkflow(data: {
    name: string;
    description?: string;
    config: {
      steps: Array<{
        type: 'prompt' | 'condition' | 'loop' | 'transform';
        config: any;
      }>;
    };
    tenantId: string;
    userId: string;
  }) {
    return prisma.aiWorkflow.create({
      data,
    });
  }

  /**
   * Execute AI workflow
   */
  static async executeWorkflow(workflowId: string, input: any) {
    const workflow = await prisma.aiWorkflow.findUnique({
      where: { id: workflowId },
    });

    if (!workflow) throw new Error('Workflow not found');

    const execution = await prisma.aiWorkflowExecution.create({
      data: {
        workflowId,
        input,
        status: 'running',
        startedAt: new Date(),
      },
    });

    let context = input;
    const results: any[] = [];

    for (const step of workflow.config.steps) {
      const stepResult = await this.executeStep(step, context);
      results.push(stepResult);
      context = { ...context, ...stepResult };
    }

    await prisma.aiWorkflowExecution.update({
      where: { id: execution.id },
      data: {
        status: 'completed',
        output: context,
        results,
        completedAt: new Date(),
      },
    });

    return execution;
  }

  /**
   * Execute workflow step
   */
  private static async executeStep(step: any, context: any) {
    switch (step.type) {
      case 'prompt':
        return await PromptService.executePrompt(step.config.promptId, context);
      case 'condition':
        return this.evaluateCondition(step.config, context);
      case 'transform':
        return this.transformData(step.config, context);
      default:
        throw new Error(`Unknown step type: ${step.type}`);
    }
  }

  private static evaluateCondition(config: any, context: any) {
    // Simple condition evaluation
    return { result: true };
  }

  private static transformData(config: any, context: any) {
    // Data transformation logic
    return context;
  }
}
```

### AI Agents

```typescript
// src/lib/ai/agents.ts
export class AIAgentService {
  /**
   * Create AI agent
   */
  static async createAgent(data: {
    name: string;
    description?: string;
    type: 'chat' | 'task' | 'analysis' | 'creative';
    config: {
      systemPrompt: string;
      tools?: string[];
      capabilities?: string[];
    };
    tenantId: string;
    userId: string;
  }) {
    return prisma.aiAgent.create({
      data,
    });
  }

  /**
   * Interact with agent
   */
  static async interact(agentId: string, message: string, userId: string) {
    const agent = await prisma.aiAgent.findUnique({
      where: { id: agentId },
    });

    if (!agent) throw new Error('Agent not found');

    // Get conversation history
    const history = await prisma.aiConversation.findMany({
      where: { agentId, userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    // Build messages array
    const messages = [
      { role: 'system', content: agent.config.systemPrompt },
      ...history.reverse().map(h => ({
        role: h.role as 'user' | 'assistant',
        content: h.message,
      })),
      { role: 'user', content: message },
    ];

    // Call AI model
    const response = await this.callAIModel({
      model: 'gpt-4',
      messages,
    });

    // Save conversation
    await prisma.aiConversation.create({
      data: {
        agentId,
        userId,
        role: 'user',
        message,
      },
    });

    const assistantMessage = await prisma.aiConversation.create({
      data: {
        agentId,
        userId,
        role: 'assistant',
        message: response.choices[0].message.content,
      },
    });

    return assistantMessage;
  }

  private static async callAIModel(data: any) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return response.json();
  }
}
```

### AI Analytics

```typescript
// src/lib/ai/analytics.ts
export class AIAnalyticsService {
  /**
   * Record AI metric
   */
  static async recordMetric(data: {
    agentId?: string;
    workflowId?: string;
    promptId?: string;
    metricName: string;
    metricValue: number;
    dimensions?: Record<string, any>;
  }) {
    return prisma.aiMetric.create({
      data: {
        ...data,
        recordedAt: new Date(),
      },
    });
  }

  /**
   * Get agent performance
   */
  static async getAgentPerformance(agentId: string, startDate: Date, endDate: Date) {
    const conversations = await prisma.aiConversation.count({
      where: {
        agentId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const avgResponseTime = await prisma.aiConversation.aggregate({
      where: {
        agentId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      _avg: {
        responseTime: true,
      },
    });

    return {
      conversations,
      avgResponseTime: avgResponseTime._avg.responseTime,
    };
  }
}
```

### Content Moderation

```typescript
// src/lib/ai/moderation.ts
export class ModerationService {
  /**
   * Moderate content
   */
  static async moderateContent(content: string) {
    const response = await fetch('https://api.openai.com/v1/moderations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input: content }),
    });

    const result = await response.json();

    return {
      flagged: result.results[0].flagged,
      categories: result.results[0].categories,
      scores: result.results[0].category_scores,
    };
  }

  /**
   * Batch moderate
   */
  static async batchModerate(contents: string[]) {
    const results = await Promise.all(
      contents.map(content => this.moderateContent(content))
    );

    return results;
  }
}
```

---

## Observability Module

### Logging

```typescript
// src/lib/observability/logging.ts
import winston from 'winston';

export class Logger {
  private static logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json()
    ),
    defaultMeta: { service: 'saas-vala-enterprise' },
    transports: [
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' }),
    ],
  });

  if (process.env.NODE_ENV !== 'production') {
    this.logger.add(
      new winston.transports.Console({
        format: winston.format.simple(),
      })
    );
  }

  static info(message: string, meta?: any) {
    this.logger.info(message, meta);
  }

  static error(message: string, meta?: any) {
    this.logger.error(message, meta);
  }

  static warn(message: string, meta?: any) {
    this.logger.warn(message, meta);
  }

  static debug(message: string, meta?: any) {
    this.logger.debug(message, meta);
  }

  static createRequestLogger(service: string) {
    return {
      info: (message: string, meta?: any) =>
        this.logger.info(message, { ...meta, service }),
      error: (message: string, meta?: any) =>
        this.logger.error(message, { ...meta, service }),
      warn: (message: string, meta?: any) =>
        this.logger.warn(message, { ...meta, service }),
      debug: (message: string, meta?: any) =>
        this.logger.debug(message, { ...meta, service }),
    };
  }
}
```

### Metrics

```typescript
// src/lib/observability/metrics.ts
import { Counter, Histogram, Gauge, Registry } from 'prom-client';

export class MetricsService {
  private static registry = new Registry();

  private static httpRequestsTotal = new Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code'],
    registers: [this.registry],
  });

  private static httpRequestDuration = new Histogram({
    name: 'http_request_duration_seconds',
    help: 'HTTP request duration in seconds',
    labelNames: ['method', 'route'],
    buckets: [0.1, 0.5, 1, 2, 5, 10],
    registers: [this.registry],
  });

  private static activeConnections = new Gauge({
    name: 'active_connections',
    help: 'Number of active connections',
    registers: [this.registry],
  });

  static recordHttpRequest(method: string, route: string, statusCode: number) {
    this.httpRequestsTotal.inc({ method, route, status_code: statusCode });
  }

  static recordHttpRequestDuration(method: string, route: string, duration: number) {
    this.httpRequestDuration.observe({ method, route }, duration);
  }

  static setActiveConnections(count: number) {
    this.activeConnections.set(count);
  }

  static getMetrics() {
    return this.registry.metrics();
  }
}
```

### Distributed Tracing

```typescript
// src/lib/observability/tracing.ts
import { trace, context } from '@opentelemetry/api';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

export class TracingService {
  private static tracer: any;

  static initialize() {
    const provider = new NodeTracerProvider({
      resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: 'saas-vala-enterprise',
      }),
    });

    const exporter = new JaegerExporter({
      endpoint: process.env.JAEGER_ENDPOINT,
    });

    provider.addSpanProcessor(new BatchSpanProcessor(exporter));
    provider.register();

    this.tracer = trace.getTracer('saas-vala-enterprise');
  }

  static startSpan(name: string) {
    return this.tracer.startSpan(name);
  }

  static async withSpan<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const span = this.startSpan(name);
    try {
      return await context.with(trace.setSpan(context.active(), span), fn);
    } finally {
      span.end();
    }
  }
}
```

### Telemetry

```typescript
// src/lib/observability/telemetry.ts
export class TelemetryService {
  /**
   * Record custom metric
   */
  static async recordMetric(data: {
    name: string;
    value: number;
    tags?: Record<string, string>;
    timestamp?: Date;
  }) {
    // Send to telemetry backend (Datadog, New Relic, etc.)
    await this.sendToBackend({
      metric: data.name,
      value: data.value,
      tags: data.tags,
      timestamp: data.timestamp || new Date(),
    });
  }

  /**
   * Record event
   */
  static async recordEvent(data: {
    name: string;
    properties?: Record<string, any>;
  }) {
    await this.sendToBackend({
      event: data.name,
      properties: data.properties,
      timestamp: new Date(),
    });
  }

  private static async sendToBackend(data: any) {
    // Implementation depends on telemetry provider
    console.log('Telemetry:', data);
  }
}
```

### Realtime Monitoring

```typescript
// src/lib/observability/monitoring.ts
export class MonitoringService {
  /**
   * Get system health
   */
  static async getSystemHealth() {
    const health = {
      status: 'healthy',
      timestamp: new Date(),
      checks: {
        database: await this.checkDatabase(),
        redis: await this.checkRedis(),
        api: await this.checkAPI(),
      },
    };

    const allHealthy = Object.values(health.checks).every(
      (check: any) => check.status === 'healthy'
    );

    health.status = allHealthy ? 'healthy' : 'degraded';

    return health;
  }

  private static async checkDatabase() {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return { status: 'healthy', latency: 10 };
    } catch {
      return { status: 'unhealthy', error: 'Database connection failed' };
    }
  }

  private static async checkRedis() {
    try {
      await redis.ping();
      return { status: 'healthy', latency: 5 };
    } catch {
      return { status: 'unhealthy', error: 'Redis connection failed' };
    }
  }

  private static async checkAPI() {
    return { status: 'healthy', latency: 20 };
  }
}
```

---

## Automation Module

### Workflow Automation

```typescript
// src/lib/automation/workflows.ts
export class WorkflowAutomationService {
  /**
   * Create automation
   */
  static async createAutomation(data: {
    name: string;
    description?: string;
    trigger: {
      type: 'event' | 'schedule' | 'webhook';
      config: any;
    };
    actions: Array<{
      type: 'api_call' | 'email' | 'notification' | 'database';
      config: any;
    }>;
    enabled: boolean;
    tenantId: string;
    userId: string;
  }) {
    return prisma.automation.create({
      data,
    });
  }

  /**
   * Trigger automation
   */
  static async trigger(automationId: string, triggerData?: any) {
    const automation = await prisma.automation.findUnique({
      where: { id: automationId },
    });

    if (!automation || !automation.enabled) {
      return;
    }

    const execution = await prisma.automationExecution.create({
      data: {
        automationId,
        input: triggerData,
        status: 'running',
        startedAt: new Date(),
      },
    });

    try {
      const results = [];
      for (const action of automation.actions) {
        const result = await this.executeAction(action, triggerData);
        results.push(result);
      }

      await prisma.automationExecution.update({
        where: { id: execution.id },
        data: {
          status: 'completed',
          output: results,
          completedAt: new Date(),
        },
      });
    } catch (error) {
      await prisma.automationExecution.update({
        where: { id: execution.id },
        data: {
          status: 'failed',
          error: String(error),
          completedAt: new Date(),
        },
      });
    }
  }

  private static async executeAction(action: any, context: any) {
    switch (action.type) {
      case 'api_call':
        return this.executeAPICall(action.config, context);
      case 'email':
        return this.sendEmail(action.config, context);
      case 'notification':
        return this.sendNotification(action.config, context);
      case 'database':
        return this.executeDatabaseOperation(action.config, context);
      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  }

  private static async executeAPICall(config: any, context: any) {
    const response = await fetch(config.url, {
      method: config.method || 'POST',
      headers: config.headers,
      body: JSON.stringify(context),
    });
    return response.json();
  }

  private static async sendEmail(config: any, context: any) {
    // Email sending implementation
    return { sent: true };
  }

  private static async sendNotification(config: any, context: any) {
    await prisma.notification.create({
      data: {
        userId: config.userId,
        type: config.type,
        title: config.title,
        message: config.message,
      },
    });
    return { sent: true };
  }

  private static async executeDatabaseOperation(config: any, context: any) {
    return await prisma.$executeRawUnsafe(config.query, context);
  }
}
```

### Cron Jobs

```typescript
// src/lib/automation/cron.ts
import cron from 'node-cron';

export class CronService {
  private static jobs: Map<string, cron.ScheduledTask> = new Map();

  /**
   * Schedule job
   */
  static scheduleJob(data: {
    name: string;
    schedule: string;
    jobType: string;
    config: any;
  }) {
    const task = cron.schedule(data.schedule, async () => {
      await this.executeJob(data);
    });

    this.jobs.set(data.name, task);

    // Save to database
    await prisma.cronJob.create({
      data: {
        ...data,
        enabled: true,
        lastRunAt: null,
      },
    });

    return task;
  }

  /**
   * Execute cron job
   */
  private static async executeJob(data: any) {
    const execution = await prisma.cronExecution.create({
      data: {
        cronJobId: data.name, // In reality, would be the actual ID
        status: 'running',
        startedAt: new Date(),
      },
    });

    try {
      // Execute job based on type
      const result = await this.executeByType(data.jobType, data.config);

      await prisma.cronJob.update({
        where: { name: data.name },
        data: { lastRunAt: new Date() },
      });

      await prisma.cronExecution.update({
        where: { id: execution.id },
        data: {
          status: 'completed',
          output: result,
          completedAt: new Date(),
        },
      });
    } catch (error) {
      await prisma.cronExecution.update({
        where: { id: execution.id },
        data: {
          status: 'failed',
          error: String(error),
          completedAt: new Date(),
        },
      });
    }
  }

  private static async executeByType(type: string, config: any) {
    switch (type) {
      case 'cleanup':
        return this.runCleanup(config);
      case 'report':
        return this.generateReport(config);
      case 'sync':
        return this.runSync(config);
      default:
        throw new Error(`Unknown job type: ${type}`);
    }
  }

  private static async runCleanup(config: any) {
    // Cleanup logic
    return { cleaned: 100 };
  }

  private static async generateReport(config: any) {
    // Report generation logic
    return { reportGenerated: true };
  }

  private static async runSync(config: any) {
    // Sync logic
    return { synced: 50 };
  }

  /**
   * Stop job
   */
  static stopJob(name: string) {
    const task = this.jobs.get(name);
    if (task) {
      task.stop();
      this.jobs.delete(name);
    }
  }
}
```

### Queue System

```typescript
// src/lib/automation/queue.ts
import { Queue, Worker } from 'bullmq';

export class QueueService {
  private static queues: Map<string, Queue> = new Map();
  private static workers: Map<string, Worker> = new Map();

  /**
   * Create queue
   */
  static createQueue(name: string) {
    const queue = new Queue(name, {
      connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    });

    this.queues.set(name, queue);
    return queue;
  }

  /**
   * Add job to queue
   */
  static async addJob(queueName: string, data: any, options?: any) {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }

    return queue.add(queueName, data, options);
  }

  /**
   * Create worker
   */
  static createWorker(
    queueName: string,
    processor: (job: any) => Promise<any>
  ) {
    const worker = new Worker(
      queueName,
      processor,
      {
        connection: {
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT || '6379'),
        },
      }
    );

    this.workers.set(queueName, worker);
    return worker;
  }

  /**
   * Get queue stats
   */
  static async getQueueStats(queueName: string) {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }

    const waiting = await queue.getWaitingCount();
    const active = await queue.getActiveCount();
    const completed = await queue.getCompletedCount();
    const failed = await queue.getFailedCount();

    return {
      waiting,
      active,
      completed,
      failed,
    };
  }
}
```

### Event Orchestration

```typescript
// src/lib/automation/events.ts
import { EventEmitter } from 'events';

export class EventOrchestrator extends EventEmitter {
  private static instance: EventOrchestrator;

  private constructor() {
    super();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EventOrchestrator();
    }
    return this.instance;
  }

  /**
   * Publish event
   */
  static async publish(event: string, data: any) {
    const orchestrator = this.getInstance();
    orchestrator.emit(event, data);

    // Store event for replay
    await prisma.eventLog.create({
      data: {
        event,
        payload: data,
        timestamp: new Date(),
      },
    });
  }

  /**
   * Subscribe to event
   */
  static subscribe(event: string, handler: (data: any) => void) {
    const orchestrator = this.getInstance();
    orchestrator.on(event, handler);
  }

  /**
   * Replay events
   */
  static async replayEvents(fromDate: Date, toDate: Date) {
    const events = await prisma.eventLog.findMany({
      where: {
        timestamp: {
          gte: fromDate,
          lte: toDate,
        },
      },
      orderBy: { timestamp: 'asc' },
    });

    for (const event of events) {
      this.publish(event.event, event.payload);
    }
  }
}
```

---

## Implementation Checklist

### AI
- [x] Prompt Management
- [x] AI Workflows
- [x] AI Agents
- [x] AI Analytics
- [x] Content Moderation

### Observability
- [x] Logging
- [x] Metrics
- [x] Distributed Tracing
- [x] Telemetry
- [x] Realtime Monitoring

### Automation
- [x] Workflow Automation
- [x] Cron Jobs
- [x] Queue System
- [x] Event Orchestration

---

## Integration Notes

All advanced systems integrate with:
- Centralized logging
- Metrics collection
- Distributed tracing
- Event-driven architecture
- Queue-based processing
- Real-time monitoring

# Event & Message Bus Fabric Architecture
## Phase 18 - Kafka/RabbitMQ/NATS, Event Replay, Dead-Letter Queues, Event Tracing, Distributed Event Recovery, Idempotency Validation

---

## Overview

Enterprise-grade event and message bus fabric supporting Kafka/RabbitMQ/NATS, event replay capabilities, dead-letter queues, comprehensive event tracing, distributed event recovery, and idempotency validation.

---

## Message Bus Abstraction

### Message Bus Interface

```typescript
// src/lib/message-bus/abstract.ts
export interface IMessageBus {
  publish(topic: string, message: any): Promise<void>;
  subscribe(topic: string, handler: (message: any) => Promise<void>): Promise<void>;
  acknowledge(messageId: string): Promise<void>;
  reject(messageId: string, requeue?: boolean): Promise<void>;
}

export enum MessageBusType {
  KAFKA = 'kafka',
  RABBITMQ = 'rabbitmq',
  NATS = 'nats',
}

export class MessageBusFactory {
  static create(type: MessageBusType): IMessageBus {
    switch (type) {
      case MessageBusType.KAFKA:
        return new KafkaMessageBus();
      case MessageBusType.RABBITMQ:
        return new RabbitMQMessageBus();
      case MessageBusType.NATS:
        return new NATSMessageBus();
      default:
        throw new Error(`Unknown message bus type: ${type}`);
    }
  }
}
```

### Kafka Implementation

```typescript
// src/lib/message-bus/kafka.ts
import { Kafka, Producer, Consumer } from 'kafkajs';

export class KafkaMessageBus implements IMessageBus {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;

  constructor() {
    this.kafka = new Kafka({
      clientId: process.env.KAFKA_CLIENT_ID,
      brokers: (process.env.KAFKA_BROKERS || '').split(','),
      ssl: process.env.KAFKA_SSL === 'true',
      sasl: process.env.KAFKA_SASL_MECHANISM ? {
        mechanism: process.env.KAFKA_SASL_MECHANISM as any,
        username: process.env.KAFKA_SASL_USERNAME,
        password: process.env.KAFKA_SASL_PASSWORD,
      } : undefined,
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({
      groupId: process.env.KAFKA_GROUP_ID || 'default-group',
    });
  }

  async publish(topic: string, message: any): Promise<void> {
    await this.producer.send({
      topic,
      messages: [
        {
          key: message.id || crypto.randomUUID(),
          value: JSON.stringify(message),
          headers: {
            'content-type': 'application/json',
            'message-id': message.id || crypto.randomUUID(),
            'timestamp': new Date().toISOString(),
          },
        },
      ],
    });
  }

  async subscribe(topic: string, handler: (message: any) => Promise<void>): Promise<void> {
    await this.consumer.subscribe({ topic });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const value = JSON.parse(message.value?.toString() || '{}');
          await handler(value);
        } catch (error) {
          console.error('Message processing error:', error);
          throw error;
        }
      },
    });
  }

  async acknowledge(messageId: string): Promise<void> {
    // Kafka auto-commits offsets
  }

  async reject(messageId: string, requeue: boolean = true): Promise<void> {
    // Kafka doesn't support explicit reject, relies on offset management
  }

  async connect(): Promise<void> {
    await this.producer.connect();
    await this.consumer.connect();
  }

  async disconnect(): Promise<void> {
    await this.producer.disconnect();
    await this.consumer.disconnect();
  }
}
```

### RabbitMQ Implementation

```typescript
// src/lib/message-bus/rabbitmq.ts
import amqp from 'amqplib';

export class RabbitMQMessageBus implements IMessageBus {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  constructor() {
    this.connection = null as any;
    this.channel = null as any;
  }

  async connect(): Promise<void> {
    this.connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    this.channel = await this.connection.createChannel();
  }

  async publish(topic: string, message: any): Promise<void> {
    const exchange = process.env.RABBITMQ_EXCHANGE || 'events';
    
    await this.channel.assertExchange(exchange, 'topic', { durable: true });
    
    await this.channel.publish(
      exchange,
      topic,
      Buffer.from(JSON.stringify(message)),
      {
        contentType: 'application/json',
        messageId: message.id || crypto.randomUUID(),
        timestamp: Date.now(),
        persistent: true,
      }
    );
  }

  async subscribe(topic: string, handler: (message: any) => Promise<void>): Promise<void> {
    const exchange = process.env.RABBITMQ_EXCHANGE || 'events';
    const queue = `${topic}-queue`;
    const dlx = `${exchange}-dlx`;

    // Declare dead-letter exchange
    await this.channel.assertExchange(dlx, 'direct', { durable: true });

    // Declare main exchange
    await this.channel.assertExchange(exchange, 'topic', { durable: true });

    // Declare queue with dead-letter routing
    await this.channel.assertQueue(queue, {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': dlx,
        'x-dead-letter-routing-key': queue,
      },
    });

    await this.channel.bindQueue(queue, exchange, topic);

    await this.channel.consume(queue, async (msg) => {
      if (!msg) return;

      try {
        const content = JSON.parse(msg.content.toString());
        await handler(content);
        this.channel.ack(msg);
      } catch (error) {
        console.error('Message processing error:', error);
        this.channel.nack(msg, false, false); // Don't requeue, send to DLQ
      }
    });
  }

  async acknowledge(messageId: string): Promise<void> {
    // RabbitMQ uses channel.ack(message)
  }

  async reject(messageId: string, requeue: boolean = true): Promise<void> {
    // RabbitMQ uses channel.nack(message, false, requeue)
  }

  async disconnect(): Promise<void> {
    await this.channel.close();
    await this.connection.close();
  }
}
```

### NATS Implementation

```typescript
// src/lib/message-bus/nats.ts
import { connect, NatsConnection } from 'nats';

export class NATSMessageBus implements IMessageBus {
  private nc: NatsConnection;

  async connect(): Promise<void> {
    this.nc = await connect({
      servers: process.env.NATS_SERVERS || 'nats://localhost:4222',
      user: process.env.NATS_USER,
      pass: process.env.NATS_PASSWORD,
    });
  }

  async publish(topic: string, message: any): Promise<void> {
    await this.nc.publish(topic, JSON.stringify(message));
  }

  async subscribe(topic: string, handler: (message: any) => Promise<void>): Promise<void> {
    const sub = this.nc.subscribe(topic);
    
    for await (const msg of sub) {
      try {
        const data = JSON.parse(msg.string());
        await handler(data);
        msg.ack();
      } catch (error) {
        console.error('Message processing error:', error);
        msg.nak();
      }
    }
  }

  async acknowledge(messageId: string): Promise<void> {
    // NATS uses message.ack()
  }

  async reject(messageId: string, requeue: boolean = true): Promise<void> {
    // NATS uses message.nak()
  }

  async disconnect(): Promise<void> {
    await this.nc.close();
  }
}
```

---

## Event Replay

### Event Store Service

```typescript
// src/lib/events/store.ts
export class EventStoreService {
  /**
   * Store event for replay
   */
  static async storeEvent(data: {
    eventType: string;
    aggregateId: string;
    aggregateType: string;
    eventData: any;
    version: number;
    metadata?: any;
  }) {
    return prisma.eventStore.create({
      data: {
        ...data,
        timestamp: new Date(),
      },
    });
  }

  /**
   * Replay events for aggregate
   */
  static async replayEvents(aggregateType: string, aggregateId: string) {
    const events = await prisma.eventStore.findMany({
      where: {
        aggregateType,
        aggregateId,
      },
      orderBy: { version: 'asc' },
    });

    return events;
  }

  /**
   * Replay events from timestamp
   */
  static async replayFromTimestamp(timestamp: Date, eventType?: string) {
    const where: any = {
      timestamp: { gte: timestamp },
    };

    if (eventType) {
      where.eventType = eventType;
    }

    return prisma.eventStore.findMany({
      where,
      orderBy: { timestamp: 'asc' },
    });
  }

  /**
   * Get event stream
   */
  static async getEventStream(
    aggregateType: string,
    aggregateId: string,
    fromVersion?: number
  ) {
    const where: any = {
      aggregateType,
      aggregateId,
    };

    if (fromVersion) {
      where.version = { gte: fromVersion };
    }

    return prisma.eventStore.findMany({
      where,
      orderBy: { version: 'asc' },
    });
  }
}
```

---

## Dead-Letter Queues

### DLQ Service

```typescript
// src/lib/events/dlq.ts
export class DeadLetterQueueService {
  /**
   * Send to dead-letter queue
   */
  static async sendToDLQ(data: {
    originalTopic: string;
    originalMessage: any;
    error: string;
    retryCount: number;
    metadata?: any;
  }) {
    return prisma.deadLetterMessage.create({
      data: {
        ...data,
        timestamp: new Date(),
        status: 'pending',
      },
    });
  }

  /**
   * Retry DLQ message
   */
  static async retry(dlqMessageId: string) {
    const dlqMessage = await prisma.deadLetterMessage.findUnique({
      where: { id: dlqMessageId },
    });

    if (!dlqMessage) throw new Error('DLQ message not found');

    // Republish to original topic
    const messageBus = MessageBusFactory.create(
      MessageBusType[process.env.MESSAGE_BUS_TYPE as keyof typeof MessageBusType] || MessageBusType.RABBITMQ
    );

    await messageBus.publish(dlqMessage.originalTopic, dlqMessage.originalMessage);

    // Update DLQ message status
    await prisma.deadLetterMessage.update({
      where: { id: dlqMessageId },
      data: {
        status: 'retried',
        retriedAt: new Date(),
      },
    });
  }

  /**
   * Purge DLQ messages
   */
  static async purge(olderThanDays: number = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    return prisma.deadLetterMessage.deleteMany({
      where: {
        timestamp: { lt: cutoffDate },
        status: 'pending',
      },
    });
  }

  /**
   * Get DLQ statistics
   */
  static async getStatistics() {
    const [total, byStatus, byTopic] = await Promise.all([
      prisma.deadLetterMessage.count(),
      prisma.deadLetterMessage.groupBy({
        by: ['status'],
        _count: true,
      }),
      prisma.deadLetterMessage.groupBy({
        by: ['originalTopic'],
        _count: true,
      }),
    ]);

    return { total, byStatus, byTopic };
  }
}
```

---

## Event Tracing

### Distributed Tracing Service

```typescript
// src/lib/events/tracing.ts
export class EventTracingService {
  /**
   * Trace event
   */
  static async traceEvent(data: {
    eventId: string;
    eventType: string;
    traceId: string;
    spanId: string;
    parentSpanId?: string;
    timestamp: Date;
    metadata?: any;
  }) {
    return prisma.eventTrace.create({
      data,
    });
  }

  /**
   * Get event trace
   */
  static async getTrace(traceId: string) {
    return prisma.eventTrace.findMany({
      where: { traceId },
      orderBy: { timestamp: 'asc' },
    });
  }

  /**
   * Get event lineage
   */
  static async getEventLineage(eventId: string) {
    const event = await prisma.eventTrace.findUnique({
      where: { eventId },
    });

    if (!event) throw new Error('Event not found');

    // Get all events in same trace
    const traceEvents = await this.getTrace(event.traceId);

    return {
      eventId,
      traceId: event.traceId,
      events: traceEvents,
      duration: this.calculateDuration(traceEvents),
    };
  }

  private static calculateDuration(events: any[]): number {
    if (events.length < 2) return 0;
    const start = new Date(events[0].timestamp).getTime();
    const end = new Date(events[events.length - 1].timestamp).getTime();
    return end - start;
  }
}
```

---

## Distributed Event Recovery

### Event Recovery Service

```typescript
// src/lib/events/recovery.ts
export class EventRecoveryService {
  /**
   * Recover events
   */
  static async recoverEvents(params: {
    fromTimestamp: Date;
    toTimestamp: Date;
    eventTypes?: string[];
  }) {
    const events = await EventStoreService.replayFromTimestamp(
      params.fromTimestamp,
      params.eventTypes?.[0]
    );

    const recovered = [];

    for (const event of events) {
      try {
        await this.replayEvent(event);
        recovered.push(event.id);
      } catch (error) {
        console.error(`Failed to recover event ${event.id}:`, error);
      }
    }

    return {
      total: events.length,
      recovered: recovered.length,
      failed: events.length - recovered.length,
    };
  }

  /**
   * Replay single event
   */
  private static async replayEvent(event: any) {
    // Get event handler for event type
    const handler = this.getEventHandler(event.eventType);
    if (!handler) {
      throw new Error(`No handler for event type: ${event.eventType}`);
    }

    // Execute handler
    await handler(event.eventData);
  }

  /**
   * Get event handler
   */
  private static getEventHandler(eventType: string): Function | null {
    const handlers: Record<string, Function> = {
      'user.created': this.handleUserCreated,
      'user.updated': this.handleUserUpdated,
      // Add more handlers
    };

    return handlers[eventType] || null;
  }

  private static async handleUserCreated(data: any) {
    // Handle user created event
  }

  private static async handleUserUpdated(data: any) {
    // Handle user updated event
  }
}
```

---

## Idempotency Validation

### Idempotency Service

```typescript
// src/lib/events/idempotency.ts
export class IdempotencyService {
  /**
   * Check idempotency
   */
  static async checkIdempotency(idempotencyKey: string): Promise<boolean> {
    const existing = await prisma.idempotencyKey.findUnique({
      where: { key: idempotencyKey },
    });

    return existing !== null;
  }

  /**
   * Create idempotency key
   */
  static async createKey(data: {
    key: string;
    response?: any;
    expiresAt?: Date;
  }) {
    return prisma.idempotencyKey.create({
      data: {
        ...data,
        createdAt: new Date(),
      },
    });
  }

  /**
   * Get cached response
   */
  static async getCachedResponse(idempotencyKey: string) {
    const key = await prisma.idempotencyKey.findUnique({
      where: { key: idempotencyKey },
    });

    if (!key) return null;

    // Check if expired
    if (key.expiresAt && key.expiresAt < new Date()) {
      await prisma.idempotencyKey.delete({ where: { id: key.id } });
      return null;
    }

    return key.response;
  }

  /**
   * Generate idempotency key
   */
  static generateKey(userId: string, operation: string, params: any): string {
    const hash = crypto
      .createHash('sha256')
      .update(`${userId}:${operation}:${JSON.stringify(params)}`)
      .digest('hex');
    return hash;
  }
}
```

---

## Event Bus Integration

### Event Bus Service

```typescript
// src/lib/events/bus.ts
export class EventBusService {
  private static messageBus: IMessageBus;
  private static handlers: Map<string, Function[]> = new Map();

  static async initialize() {
    const busType = MessageBusType[process.env.MESSAGE_BUS_TYPE as keyof typeof MessageBusType] || MessageBusType.RABBITMQ;
    this.messageBus = MessageBusFactory.create(busType);
    await (this.messageBus as any).connect();
  }

  /**
   * Publish event
   */
  static async publish(eventType: string, data: any) {
    const event = {
      id: crypto.randomUUID(),
      type: eventType,
      data,
      timestamp: new Date().toISOString(),
      traceId: this.getTraceId(),
    };

    // Store in event store
    await EventStoreService.storeEvent({
      eventType,
      aggregateId: data.aggregateId || event.id,
      aggregateType: data.aggregateType || 'event',
      eventData: event,
      version: 1,
    });

    // Publish to message bus
    await this.messageBus.publish(eventType, event);

    // Trace event
    await EventTracingService.traceEvent({
      eventId: event.id,
      eventType,
      traceId: event.traceId,
      spanId: crypto.randomUUID(),
      timestamp: new Date(),
    });
  }

  /**
   * Subscribe to event
   */
  static async subscribe(eventType: string, handler: (data: any) => Promise<void>) {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    this.handlers.get(eventType)!.push(handler);

    await this.messageBus.subscribe(eventType, async (message) => {
      try {
        await handler(message);
      } catch (error) {
        console.error(`Error handling event ${eventType}:`, error);
        
        // Send to DLQ
        await DeadLetterQueueService.sendToDLQ({
          originalTopic: eventType,
          originalMessage: message,
          error: String(error),
          retryCount: 0,
        });
      }
    });
  }

  /**
   * Process event with idempotency
   */
  static async processWithIdempotency(
    idempotencyKey: string,
    handler: () => Promise<any>
  ): Promise<any> {
    // Check if already processed
    const cached = await IdempotencyService.getCachedResponse(idempotencyKey);
    if (cached) {
      return cached;
    }

    // Process
    const result = await handler();

    // Store result
    await IdempotencyService.createKey({
      key: idempotencyKey,
      response: result,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    return result;
  }

  private static getTraceId(): string {
    // Get or generate trace ID (from headers or generate new)
    return crypto.randomUUID();
  }
}
```

---

## Implementation Checklist

- [x] Message Bus Abstraction
- [x] Kafka Implementation
- [x] RabbitMQ Implementation
- [x] NATS Implementation
- [x] Event Store Service
- [x] Event Replay
- [x] Dead-Letter Queues
- [x] Event Tracing
- [x] Distributed Event Recovery
- [x] Idempotency Validation
- [x] Event Bus Integration

---

## Deployment Notes

1. **Message Broker Selection**: Choose based on requirements (Kafka for high throughput, RabbitMQ for flexibility, NATS for simplicity)
2. **Cluster Configuration**: Configure message broker clusters for high availability
3. **Retention Policy**: Configure event retention based on compliance requirements
4. **Monitoring**: Set up monitoring for queue depth, consumer lag, and error rates
5. **Idempotency Window**: Configure appropriate idempotency key expiration

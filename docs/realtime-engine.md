# Realtime Engine Architecture
## Phase 08 - WebSocket, Notifications, Live Dashboards, Queue Sync, Cache Invalidation

---

## Overview

Enterprise-grade realtime engine providing WebSocket infrastructure, instant notifications, live dashboards, queue synchronization, and realtime cache invalidation.

---

## WebSocket Architecture

### WebSocket Server

```typescript
// src/lib/realtime/websocket.ts
import { WebSocketServer, WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';

export class WebSocketService {
  private static wss: WebSocketServer;
  private static clients: Map<string, WebSocket> = new Map();
  private static userSockets: Map<string, Set<string>> = new Map();
  private static tenantSockets: Map<string, Set<string>> = new Map();

  static initialize(port: number = 8080) {
    this.wss = new WebSocketServer({ port });

    this.wss.on('connection', (ws: WebSocket) => {
      const clientId = uuidv4();
      this.clients.set(clientId, ws);

      ws.on('message', async (message: string) => {
        try {
          const data = JSON.parse(message);
          await this.handleMessage(clientId, data, ws);
        } catch (error) {
          console.error('WebSocket message error:', error);
        }
      });

      ws.on('close', () => {
        this.handleDisconnect(clientId);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });

      // Send welcome message
      ws.send(JSON.stringify({
        type: 'connected',
        clientId,
        timestamp: new Date().toISOString(),
      }));
    });

    console.log(`WebSocket server running on port ${port}`);
  }

  private static async handleMessage(
    clientId: string,
    data: any,
    ws: WebSocket
  ) {
    switch (data.type) {
      case 'authenticate':
        await this.authenticate(clientId, data.token, ws);
        break;
      case 'subscribe':
        await this.subscribe(clientId, data.channel, ws);
        break;
      case 'unsubscribe':
        await this.unsubscribe(clientId, data.channel, ws);
        break;
      case 'ping':
        ws.send(JSON.stringify({ type: 'pong', timestamp: new Date().toISOString() }));
        break;
      default:
        ws.send(JSON.stringify({ type: 'error', message: 'Unknown message type' }));
    }
  }

  private static async authenticate(
    clientId: string,
    token: string,
    ws: WebSocket
  ) {
    try {
      const payload = JWTService.verifyAccessToken(token);
      
      // Associate socket with user
      if (!this.userSockets.has(payload.userId)) {
        this.userSockets.set(payload.userId, new Set());
      }
      this.userSockets.get(payload.userId)!.add(clientId);

      // Associate socket with tenant
      if (payload.companyId) {
        if (!this.tenantSockets.has(payload.companyId)) {
          this.tenantSockets.set(payload.companyId, new Set());
        }
        this.tenantSockets.get(payload.companyId)!.add(clientId);
      }

      ws.send(JSON.stringify({
        type: 'authenticated',
        userId: payload.userId,
        tenantId: payload.companyId,
      }));
    } catch (error) {
      ws.send(JSON.stringify({ type: 'error', message: 'Authentication failed' }));
    }
  }

  private static async subscribe(
    clientId: string,
    channel: string,
    ws: WebSocket
  ) {
    // Subscribe to channel (Redis pub/sub)
    await redis.subscribe(channel, (message) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(message);
      }
    });

    ws.send(JSON.stringify({
      type: 'subscribed',
      channel,
    }));
  }

  private static async unsubscribe(
    clientId: string,
    channel: string,
    ws: WebSocket
  ) {
    await redis.unsubscribe(channel);
    
    ws.send(JSON.stringify({
      type: 'unsubscribed',
      channel,
    }));
  }

  private static handleDisconnect(clientId: string) {
    // Remove client from all mappings
    this.clients.delete(clientId);

    for (const [userId, sockets] of this.userSockets.entries()) {
      sockets.delete(clientId);
      if (sockets.size === 0) {
        this.userSockets.delete(userId);
      }
    }

    for (const [tenantId, sockets] of this.tenantSockets.entries()) {
      sockets.delete(clientId);
      if (sockets.size === 0) {
        this.tenantSockets.delete(tenantId);
      }
    }
  }

  /**
   * Send message to specific user
   */
  static async sendToUser(userId: string, message: any) {
    const sockets = this.userSockets.get(userId);
    if (!sockets) return;

    const payload = JSON.stringify(message);
    for (const clientId of sockets) {
      const ws = this.clients.get(clientId);
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(payload);
      }
    }
  }

  /**
   * Send message to tenant
   */
  static async sendToTenant(tenantId: string, message: any) {
    const sockets = this.tenantSockets.get(tenantId);
    if (!sockets) return;

    const payload = JSON.stringify(message);
    for (const clientId of sockets) {
      const ws = this.clients.get(clientId);
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(payload);
      }
    }
  }

  /**
   * Broadcast to all clients
   */
  static async broadcast(message: any) {
    const payload = JSON.stringify(message);
    for (const [clientId, ws] of this.clients.entries()) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(payload);
      }
    }
  }
}
```

### WebSocket Client

```typescript
// src/lib/realtime/client.ts
export class WebSocketClient {
  private ws: WebSocket | null = null;
  private clientId: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private subscriptions: Set<string> = new Set();
  private messageHandlers: Map<string, Function[]> = new Map();

  constructor(private url: string) {}

  connect(token: string) {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      
      // Authenticate
      this.send({
        type: 'authenticate',
        token,
      });

      // Resubscribe to channels
      for (const channel of this.subscriptions) {
        this.send({ type: 'subscribe', channel });
      }
    };

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.handleMessage(message);
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.attemptReconnect(token);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  private handleMessage(message: any) {
    switch (message.type) {
      case 'connected':
        this.clientId = message.clientId;
        break;
      case 'authenticated':
        console.log('Authenticated as user:', message.userId);
        break;
      default:
        // Call registered handlers
        const handlers = this.messageHandlers.get(message.type) || [];
        handlers.forEach(handler => handler(message));
    }
  }

  send(message: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  subscribe(channel: string) {
    this.subscriptions.add(channel);
    this.send({ type: 'subscribe', channel });
  }

  unsubscribe(channel: string) {
    this.subscriptions.delete(channel);
    this.send({ type: 'unsubscribe', channel });
  }

  on(messageType: string, handler: Function) {
    if (!this.messageHandlers.has(messageType)) {
      this.messageHandlers.set(messageType, []);
    }
    this.messageHandlers.get(messageType)!.push(handler);
  }

  private attemptReconnect(token: string) {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    setTimeout(() => {
      console.log(`Reconnection attempt ${this.reconnectAttempts}`);
      this.connect(token);
    }, delay);
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
}
```

---

## Realtime Notifications

### Notification Service

```typescript
// src/lib/realtime/notifications.ts
export class NotificationService {
  /**
   * Create notification
   */
  static async createNotification(data: {
    userId: string;
    type: string;
    title: string;
    message: string;
    actionUrl?: string;
    metadata?: any;
    tenantId?: string;
  }) {
    const notification = await prisma.notification.create({
      data: {
        ...data,
        read: false,
        createdAt: new Date(),
      },
    });

    // Send realtime notification
    await WebSocketService.sendToUser(data.userId, {
      type: 'notification',
      data: notification,
    });

    // Send push notification if enabled
    await this.sendPushNotification(data.userId, notification);

    return notification;
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId: string, userId: string) {
    const notification = await prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId,
      },
      data: {
        read: true,
        readAt: new Date(),
      },
    });

    // Update unread count
    await WebSocketService.sendToUser(userId, {
      type: 'notification_count_updated',
      data: await this.getUnreadCount(userId),
    });

    return notification;
  }

  /**
   * Mark all notifications as read
   */
  static async markAllAsRead(userId: string) {
    await prisma.notification.updateMany({
      where: {
        userId,
        read: false,
      },
      data: {
        read: true,
        readAt: new Date(),
      },
    });

    await WebSocketService.sendToUser(userId, {
      type: 'notification_count_updated',
      data: 0,
    });
  }

  /**
   * Get unread count
   */
  static async getUnreadCount(userId: string): Promise<number> {
    return prisma.notification.count({
      where: {
        userId,
        read: false,
      },
    });
  }

  /**
   * Send push notification
   */
  private static async sendPushNotification(userId: string, notification: any) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { pushSubscriptions: true },
    });

    if (!user || user.pushSubscriptions.length === 0) return;

    // Send to all push subscriptions
    for (const subscription of user.pushSubscriptions) {
      await webpush.sendNotification(
        subscription.subscription,
        JSON.stringify({
          title: notification.title,
          body: notification.message,
          icon: '/icon.png',
          data: { actionUrl: notification.actionUrl },
        })
      );
    }
  }

  /**
   * Broadcast notification to tenant
   */
  static async broadcastToTenant(tenantId: string, data: {
    type: string;
    title: string;
    message: string;
    metadata?: any;
  }) {
    const users = await prisma.user.findMany({
      where: { companyId: tenantId },
      select: { id: true },
    });

    for (const user of users) {
      await this.createNotification({
        userId: user.id,
        ...data,
        tenantId,
      });
    }
  }
}
```

### Push Notification Manager

```typescript
// src/lib/realtime/push.ts
import webpush from 'web-push';

export class PushNotificationService {
  static initialize() {
    webpush.setVapidDetails(
      process.env.VAPID_SUBJECT!,
      process.env.VAPID_PUBLIC_KEY!,
      process.env.VAPID_PRIVATE_KEY!
    );
  }

  /**
   * Register push subscription
   */
  static async registerSubscription(userId: string, subscription: any) {
    return prisma.pushSubscription.create({
      data: {
        userId,
        subscription,
        endpoint: subscription.endpoint,
      },
    });
  }

  /**
   * Unregister push subscription
   */
  static async unregisterSubscription(subscriptionId: string) {
    return prisma.pushSubscription.delete({
      where: { id: subscriptionId },
    });
  }
}
```

---

## Live Dashboards

### Live Dashboard Service

```typescript
// src/lib/realtime/dashboard.ts
export class LiveDashboardService {
  private static activeDashboards: Map<string, Set<string>> = new Map();

  /**
   * Subscribe to dashboard updates
   */
  static async subscribeToDashboard(dashboardId: string, userId: string) {
    if (!this.activeDashboards.has(dashboardId)) {
      this.activeDashboards.set(dashboardId, new Set());
    }
    this.activeDashboards.get(dashboardId)!.add(userId);

    await WebSocketService.sendToUser(userId, {
      type: 'dashboard_subscribed',
      dashboardId,
    });
  }

  /**
   * Unsubscribe from dashboard
   */
  static async unsubscribeFromDashboard(dashboardId: string, userId: string) {
    const subscribers = this.activeDashboards.get(dashboardId);
    if (subscribers) {
      subscribers.delete(userId);
      if (subscribers.size === 0) {
        this.activeDashboards.delete(dashboardId);
      }
    }
  }

  /**
   * Push dashboard update
   */
  static async pushUpdate(dashboardId: string, data: any) {
    const subscribers = this.activeDashboards.get(dashboardId);
    if (!subscribers) return;

    for (const userId of subscribers) {
      await WebSocketService.sendToUser(userId, {
        type: 'dashboard_update',
        dashboardId,
        data,
      });
    }
  }

  /**
   * Broadcast KPI update
   */
  static async broadcastKPI(tenantId: string, kpi: string, value: any) {
    await WebSocketService.sendToTenant(tenantId, {
      type: 'kpi_update',
      kpi,
      value,
      timestamp: new Date().toISOString(),
    });
  }
}
```

### Live Analytics Stream

```typescript
// src/lib/realtime/analytics.ts
export class LiveAnalyticsService {
  /**
   * Stream realtime metrics
   */
  static async streamMetrics(tenantId: string, metrics: Record<string, number>) {
    await WebSocketService.sendToTenant(tenantId, {
      type: 'metrics_update',
      data: metrics,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Stream activity feed
   */
  static async streamActivity(tenantId: string, activity: any) {
    await WebSocketService.sendToTenant(tenantId, {
      type: 'activity_update',
      data: activity,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Stream chart data
   */
  static async streamChartData(dashboardId: string, chartId: string, data: any) {
    await LiveDashboardService.pushUpdate(dashboardId, {
      type: 'chart_update',
      chartId,
      data,
    });
  }
}
```

### Activity Wall

```typescript
// src/lib/realtime/activity-wall.ts
export class ActivityWallService {
  /**
   * Post activity
   */
  static async postActivity(data: {
    userId: string;
    type: string;
    message: string;
    metadata?: any;
    tenantId: string;
  }) {
    const activity = await prisma.activity.create({
      data: {
        ...data,
        timestamp: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
            avatar: true,
          },
        },
      },
    });

    // Stream to activity wall
    await LiveAnalyticsService.streamActivity(data.tenantId, activity);

    return activity;
  }

  /**
   * Get recent activities
   */
  static async getRecentActivities(tenantId: string, limit: number = 50) {
    return prisma.activity.findMany({
      where: { tenantId },
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
            avatar: true,
          },
        },
      },
      orderBy: { timestamp: 'desc' },
      take: limit,
    });
  }
}
```

---

## Queue Synchronization

### Queue Sync Service

```typescript
// src/lib/realtime/queue-sync.ts
export class QueueSyncService {
  /**
   * Sync queue status
   */
  static async syncQueueStatus(queueName: string, status: any) {
    // Broadcast queue status to all connected clients
    await WebSocketService.broadcast({
      type: 'queue_status',
      queue: queueName,
      status,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Sync job status
   */
  static async syncJobStatus(jobId: string, status: string, result?: any) {
    await WebSocketService.broadcast({
      type: 'job_status',
      jobId,
      status,
      result,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Subscribe to queue updates
   */
  static async subscribeToQueue(userId: string, queueName: string) {
    // Subscribe to Redis channel for queue updates
    await redis.subscribe(`queue:${queueName}`, (message) => {
      WebSocketService.sendToUser(userId, JSON.parse(message));
    });
  }
}
```

### Distributed Lock Sync

```typescript
// src/lib/realtime/lock-sync.ts
export class LockSyncService {
  /**
   * Broadcast lock acquisition
   */
  static async broadcastLockAcquired(lockKey: string, holder: string) {
    await WebSocketService.broadcast({
      type: 'lock_acquired',
      lockKey,
      holder,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Broadcast lock release
   */
  static async broadcastLockReleased(lockKey: string) {
    await WebSocketService.broadcast({
      type: 'lock_released',
      lockKey,
      timestamp: new Date().toISOString(),
    });
  }
}
```

---

## Cache Invalidation

### Cache Invalidation Service

```typescript
// src/lib/realtime/cache-invalidation.ts
export class CacheInvalidationService {
  /**
   * Invalidate cache key
   */
  static async invalidate(key: string, pattern?: string) {
    // Invalidate in Redis
    if (pattern) {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } else {
      await redis.del(key);
    }

    // Broadcast invalidation to all instances
    await WebSocketService.broadcast({
      type: 'cache_invalidated',
      key,
      pattern,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Invalidate tenant cache
   */
  static async invalidateTenant(tenantId: string) {
    await this.invalidate(`tenant:${tenantId}:*`, `tenant:${tenantId}:*`);
  }

  /**
   * Invalidate user cache
   */
  static async invalidateUser(userId: string) {
    await this.invalidate(`user:${userId}:*`, `user:${userId}:*`);
  }

  /**
   * Subscribe to cache invalidation
   */
  static async subscribeToInvalidation(callback: (data: any) => void) {
    await redis.subscribe('cache_invalidation', (message) => {
      callback(JSON.parse(message));
    });
  }
}
```

### Cache Sync Strategy

```typescript
// src/lib/realtime/cache-sync.ts
export class CacheSyncService {
  /**
   * Sync cache update
   */
  static async syncUpdate(key: string, value: any) {
    // Set in Redis
    await redis.set(key, JSON.stringify(value));

    // Broadcast update
    await WebSocketService.broadcast({
      type: 'cache_updated',
      key,
      value,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Sync cache delete
   */
  static async syncDelete(key: string) {
    // Delete from Redis
    await redis.del(key);

    // Broadcast delete
    await WebSocketService.broadcast({
      type: 'cache_deleted',
      key,
      timestamp: new Date().toISOString(),
    });
  }
}
```

---

## Realtime Event Bus

### Event Bus Integration

```typescript
// src/lib/realtime/event-bus.ts
export class RealtimeEventBus {
  /**
   * Publish realtime event
   */
  static async publish(event: string, data: any, target?: {
    userId?: string;
    tenantId?: string;
  }) {
    const payload = {
      type: 'event',
      event,
      data,
      timestamp: new Date().toISOString(),
    };

    if (target?.userId) {
      await WebSocketService.sendToUser(target.userId, payload);
    } else if (target?.tenantId) {
      await WebSocketService.sendToTenant(target.tenantId, payload);
    } else {
      await WebSocketService.broadcast(payload);
    }
  }

  /**
   * Subscribe to event
   */
  static async subscribe(event: string, handler: (data: any) => void) {
    await redis.subscribe(`event:${event}`, (message) => {
      const payload = JSON.parse(message);
      handler(payload.data);
    });
  }
}
```

---

## Presence System

### Presence Service

```typescript
// src/lib/realtime/presence.ts
export class PresenceService {
  private static presence: Map<string, Set<string>> = new Map();

  /**
   * User joins
   */
  static async join(userId: string, channel: string) {
    if (!this.presence.has(channel)) {
      this.presence.set(channel, new Set());
    }
    this.presence.get(channel)!.add(userId);

    // Broadcast presence update
    await WebSocketService.broadcast({
      type: 'presence_join',
      channel,
      userId,
      timestamp: new Date().toISOString(),
    });

    // Send current presence to user
    const currentPresence = this.presence.get(channel);
    await WebSocketService.sendToUser(userId, {
      type: 'presence_list',
      channel,
      users: Array.from(currentPresence || []),
    });
  }

  /**
   * User leaves
   */
  static async leave(userId: string, channel: string) {
    const channelUsers = this.presence.get(channel);
    if (channelUsers) {
      channelUsers.delete(userId);
      if (channelUsers.size === 0) {
        this.presence.delete(channel);
      }
    }

    // Broadcast presence update
    await WebSocketService.broadcast({
      type: 'presence_leave',
      channel,
      userId,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Get presence for channel
   */
  static async getPresence(channel: string): Promise<string[]> {
    return Array.from(this.presence.get(channel) || []);
  }

  /**
   * Update user status
   */
  static async updateStatus(userId: string, status: 'online' | 'away' | 'busy' | 'offline') {
    await WebSocketService.broadcast({
      type: 'presence_status',
      userId,
      status,
      timestamp: new Date().toISOString(),
    });
  }
}
```

---

## Implementation Checklist

- [x] WebSocket Server
- [x] WebSocket Client
- [x] Notification Service
- [x] Push Notification Manager
- [x] Live Dashboard Service
- [x] Live Analytics Stream
- [x] Activity Wall
- [x] Queue Synchronization
- [x] Distributed Lock Sync
- [x] Cache Invalidation Service
- [x] Cache Sync Strategy
- [x] Realtime Event Bus
- [x] Presence System

---

## Deployment Notes

1. **WebSocket Server**: Deploy as separate service or integrate with main API server
2. **Redis Pub/Sub**: Required for multi-instance synchronization
3. **Load Balancer**: Configure sticky sessions for WebSocket connections
4. **Push Notifications**: Configure VAPID keys for web push
5. **Scaling**: Use Redis adapter for scaling across multiple instances

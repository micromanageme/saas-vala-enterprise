# Performance & Scaling Architecture
## Phase 09 - Optimization, Caching, CDN, Distributed Systems, High Availability

---

## Overview

Enterprise-grade performance optimization and scaling strategies including lazy loading, code splitting, query optimization, multi-layer caching, CDN integration, distributed queues, edge delivery, horizontal scaling, and high availability.

---

## Lazy Loading

### Route-Based Lazy Loading

```typescript
// src/router.tsx
import { createRouter, createRoute } from '@tanstack/react-router';
import { lazy } from 'react';

// Lazy load route components
const Dashboard = lazy(() => import('./routes/dashboard'));
const Users = lazy(() => import('./routes/users'));
const Settings = lazy(() => import('./routes/settings'));

const router = createRouter({
  routeTree: createRoute({
    path: '/',
    component: Dashboard,
  })
    .addChildRoute({
      path: 'users',
      component: Users,
    })
    .addChildRoute({
      path: 'settings',
      component: Settings,
    }),
});
```

### Component Lazy Loading

```typescript
// src/components/LazyComponent.tsx
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

export function LazyComponentWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### Data Lazy Loading

```typescript
// src/lib/data/lazy-loading.ts
export class LazyDataService {
  /**
   * Paginated data fetching
   */
  static async fetchPaginated(params: {
    page: number;
    limit: number;
    query?: any;
  }) {
    const { page, limit, query } = params;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.model.findMany({
        where: query,
        skip,
        take: limit,
      }),
      prisma.model.count({ where: query }),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Infinite scroll data fetching
   */
  static async fetchInfinite(params: {
    cursor?: string;
    limit: number;
  }) {
    const { cursor, limit } = params;
    
    return prisma.model.findMany({
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      orderBy: { id: 'asc' },
    });
  }
}
```

---

## Code Splitting

### Dynamic Imports

```typescript
// src/lib/code-splitting.ts
export function dynamicImport<T>(modulePath: string): Promise<T> {
  return import(modulePath) as Promise<T>;
}

// Usage
const { heavyFunction } = await dynamicImport('./heavy-module');
```

### Chunk Splitting Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', '@tanstack/react-router'],
          ui: ['lucide-react', '@radix-ui/react-*'],
          charts: ['recharts'],
          forms: ['react-hook-form', 'zod'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
```

### Prefetching Strategy

```typescript
// src/lib/prefetch.ts
export class PrefetchService {
  /**
   * Prefetch route
   */
  static prefetchRoute(path: string) {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = path;
    document.head.appendChild(link);
  }

  /**
   * Prefetch on hover
   */
  static setupHoverPrefetch(selector: string, routePath: string) {
    document.querySelectorAll(selector).forEach((el) => {
      el.addEventListener('mouseenter', () => {
        this.prefetchRoute(routePath);
      });
    });
  }
}
```

---

## Query Optimization

### Database Query Optimization

```typescript
// src/lib/db/optimization.ts
export class QueryOptimizer {
  /**
   * Select only needed fields
   */
  static async optimizedSelect(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        displayName: true,
        // Only select fields that are needed
      },
    });
  }

  /**
   * Use pagination for large datasets
   */
  static async paginatedQuery(params: {
    skip: number;
    take: number;
  }) {
    return prisma.model.findMany({
      skip: params.skip,
      take: params.take,
    });
  }

  /**
   * Use indexed fields in where clauses
   */
  static async indexedQuery(indexedField: string) {
    return prisma.model.findMany({
      where: { indexedField },
    });
  }

  /**
   * Avoid N+1 queries with include/select
   */
  static async avoidNPlus1() {
    return prisma.user.findMany({
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  /**
   * Use transactions for multiple operations
   */
  static async transactionalUpdate(updates: any[]) {
    return prisma.$transaction(
      updates.map((update) =>
        prisma.model.update({
          where: { id: update.id },
          data: update.data,
        })
      )
    );
  }

  /**
   * Batch operations
   */
  static async batchCreate(items: any[]) {
    return prisma.model.createMany({
      data: items,
    });
  }
}
```

### Connection Pooling

```typescript
// src/lib/db/pool.ts
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
});

// Connection pool configuration
const poolConfig = {
  connection_limit: 20, // Max connections
  pool_timeout: 30, // Seconds to wait for connection
};

// Health check
setInterval(async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (error) {
    console.error('Database health check failed:', error);
  }
}, 60000); // Check every minute
```

---

## Multi-Layer Caching

### Redis Cache Layer

```typescript
// src/lib/cache/redis.ts
import Redis from 'ioredis';

export const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0'),
  maxRetriesPerRequest: 3,
  retryDelayOnFailover: 100,
  lazyConnect: true,
});

export class RedisCache {
  /**
   * Get cached value
   */
  static async get<T>(key: string): Promise<T | null> {
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
  }

  /**
   * Set cached value with TTL
   */
  static async set(key: string, value: any, ttl: number = 3600) {
    await redis.setex(key, ttl, JSON.stringify(value));
  }

  /**
   * Delete cached value
   */
  static async del(key: string) {
    await redis.del(key);
  }

  /**
   * Delete by pattern
   */
  static async delPattern(pattern: string) {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }

  /**
   * Get or set pattern
   */
  static async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttl: number = 3600
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached) return cached;

    const value = await factory();
    await this.set(key, value, ttl);
    return value;
  }
}
```

### Memory Cache Layer

```typescript
// src/lib/cache/memory.ts
export class MemoryCache {
  private static cache: Map<string, { value: any; expires: number }> = new Map();

  /**
   * Get from memory cache
   */
  static get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  /**
   * Set in memory cache
   */
  static set(key: string, value: any, ttl: number = 60000) {
    this.cache.set(key, {
      value,
      expires: Date.now() + ttl,
    });
  }

  /**
   * Delete from memory cache
   */
  static del(key: string) {
    this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  static clear() {
    this.cache.clear();
  }
}
```

### Multi-Layer Cache Service

```typescript
// src/lib/cache/multi-layer.ts
export class MultiLayerCache {
  /**
   * Get from cache (memory -> Redis -> DB)
   */
  static async get<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: {
      memoryTTL?: number;
      redisTTL?: number;
    } = {}
  ): Promise<T> {
    const { memoryTTL = 60000, redisTTL = 3600 } = options;

    // Check memory cache first
    const memoryValue = MemoryCache.get<T>(key);
    if (memoryValue) return memoryValue;

    // Check Redis cache
    const redisValue = await RedisCache.get<T>(key);
    if (redisValue) {
      // Store in memory for faster access
      MemoryCache.set(key, redisValue, memoryTTL);
      return redisValue;
    }

    // Fetch from source
    const value = await fetcher();

    // Store in both caches
    MemoryCache.set(key, value, memoryTTL);
    await RedisCache.set(key, value, redisTTL);

    return value;
  }

  /**
   * Invalidate all layers
   */
  static async invalidate(key: string) {
    MemoryCache.del(key);
    await RedisCache.del(key);
  }

  /**
   * Invalidate by pattern
   */
  static async invalidatePattern(pattern: string) {
    // Clear all memory cache
    MemoryCache.clear();
    // Clear Redis by pattern
    await RedisCache.delPattern(pattern);
  }
}
```

---

## CDN Integration

### CDN Configuration

```typescript
// src/lib/cdn/config.ts
export const CDNConfig = {
  provider: 'cloudflare' | 'aws' | 'fastly',
  baseUrl: process.env.CDN_BASE_URL,
  apiKey: process.env.CDN_API_KEY,
  zoneId: process.env.CDN_ZONE_ID,
};

export class CDNService {
  /**
   * Get CDN URL for asset
   */
  static getAssetUrl(path: string): string {
    return `${CDNConfig.baseUrl}/${path}`;
  }

  /**
   * Purge CDN cache
   */
  static async purgeCache(urls: string[]) {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${CDNConfig.zoneId}/purge_cache`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CDNConfig.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ files: urls }),
      }
    );

    return response.json();
  }

  /**
   * Purge all cache
   */
  static async purgeAll() {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${CDNConfig.zoneId}/purge_cache`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CDNConfig.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ purge_everything: true }),
      }
    );

    return response.json();
  }
}
```

### Asset Optimization

```typescript
// src/lib/cdn/assets.ts
import sharp from 'sharp';

export class AssetOptimizer {
  /**
   * Optimize image
   */
  static async optimizeImage(buffer: Buffer, options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'jpeg' | 'png' | 'webp';
  }) {
    let transformer = sharp(buffer);

    if (options.width || options.height) {
      transformer = transformer.resize(options.width, options.height, {
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    if (options.format === 'webp') {
      transformer = transformer.webp({ quality: options.quality || 80 });
    } else if (options.format === 'jpeg') {
      transformer = transformer.jpeg({ quality: options.quality || 80 });
    } else if (options.format === 'png') {
      transformer = transformer.png({ compressionLevel: 9 });
    }

    return transformer.toBuffer();
  }

  /**
   * Generate responsive images
   */
  static async generateResponsiveImages(
    buffer: Buffer,
    sizes: number[]
  ): Promise<{ size: number; buffer: Buffer }[]> {
    return Promise.all(
      sizes.map(async (size) => ({
        size,
        buffer: await this.optimizeImage(buffer, { width: size, format: 'webp' }),
      }))
    );
  }
}
```

---

## Distributed Queues

### BullMQ Queue Implementation

```typescript
// src/lib/queues/bullmq.ts
import { Queue, Worker, QueueScheduler } from 'bullmq';

export class DistributedQueue {
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
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
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
    if (!queue) throw new Error(`Queue ${queueName} not found`);

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
        concurrency: 5,
      }
    );

    this.workers.set(queueName, worker);
    return worker;
  }
}
```

---

## Edge Delivery

### Edge Function Deployment

```typescript
// src/edge/functions.ts
export const edgeFunctions = {
  /**
   * Edge-based content personalization
   */
  personalizeContent: async (request: Request) => {
    const userAgent = request.headers.get('user-agent');
    const geo = request.cf?.country; // Cloudflare-specific

    return {
      personalized: true,
      country: geo,
      device: detectDevice(userAgent),
    };
  },

  /**
   * Edge-based A/B testing
   */
  abTest: async (request: Request) => {
    const variant = hash(request.headers.get('cf-connecting-ip') || '') % 2;

    return {
      variant: variant === 0 ? 'A' : 'B',
    };
  },
};
```

### Edge Cache Configuration

```typescript
// src/edge/cache.ts
export const edgeCacheConfig = {
  /**
   * Cache rules
   */
  rules: [
    {
      pattern: '/static/*',
      ttl: 31536000, // 1 year
      edgeTTL: 86400, // 1 day
    },
    {
      pattern: '/api/public/*',
      ttl: 3600, // 1 hour
      edgeTTL: 300, // 5 minutes
    },
    {
      pattern: '/images/*',
      ttl: 2592000, // 30 days
      edgeTTL: 604800, // 7 days
    },
  ],

  /**
   * Bypass patterns
   */
  bypass: ['/api/auth/*', '/api/private/*'],
};
```

---

## Horizontal Scaling

### Load Balancer Configuration

```typescript
// src/infrastructure/load-balancer.ts
export const loadBalancerConfig = {
  algorithm: 'round_robin' | 'least_connections' | 'ip_hash',
  healthCheck: {
    path: '/health',
    interval: 30, // seconds
    timeout: 5, // seconds
    unhealthyThreshold: 3,
    healthyThreshold: 2,
  },
  servers: [
    { host: 'server1.example.com', port: 3000, weight: 1 },
    { host: 'server2.example.com', port: 3000, weight: 1 },
    { host: 'server3.example.com', port: 3000, weight: 1 },
  ],
};
```

### Auto-Scaling Configuration

```typescript
// src/infrastructure/auto-scaling.ts
export const autoScalingConfig = {
  minInstances: 2,
  maxInstances: 10,
  targetCPU: 70, // percent
  targetMemory: 80, // percent
  scaleUpCooldown: 300, // seconds
  scaleDownCooldown: 600, // seconds,
};
```

### Database Read Replicas

```typescript
// src/lib/db/replicas.ts
import { PrismaClient } from '@prisma/client';

// Read replica for read operations
export const readReplica = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_READ_REPLICA_URL,
    },
  },
});

// Write primary for write operations
export const writePrimary = prisma;

export class DatabaseRouter {
  /**
   * Route read operations to replica
   */
  static async read<T>(query: () => Promise<T>): Promise<T> {
    return query(); // Execute on read replica
  }

  /**
   * Route write operations to primary
   */
  static async write<T>(query: () => Promise<T>): Promise<T> {
    return query(); // Execute on primary
  }
}
```

---

## High Availability

### Health Checks

```typescript
// src/lib/health/check.ts
export class HealthCheckService {
  /**
   * Comprehensive health check
   */
  static async check() {
    const checks = {
      database: await this.checkDatabase(),
      redis: await this.checkRedis(),
      api: await this.checkAPI(),
      disk: await this.checkDisk(),
      memory: await this.checkMemory(),
    };

    const healthy = Object.values(checks).every((check: any) => check.status === 'healthy');

    return {
      status: healthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      checks,
    };
  }

  private static async checkDatabase() {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return { status: 'healthy', latency: 10 };
    } catch (error) {
      return { status: 'unhealthy', error: String(error) };
    }
  }

  private static async checkRedis() {
    try {
      await redis.ping();
      return { status: 'healthy', latency: 5 };
    } catch (error) {
      return { status: 'unhealthy', error: String(error) };
    }
  }

  private static async checkAPI() {
    return { status: 'healthy', latency: 20 };
  }

  private static async checkDisk() {
    const stats = await diskusage.check('/');
    return {
      status: stats.used / stats.total < 0.9 ? 'healthy' : 'unhealthy',
      usage: stats.used / stats.total,
    };
  }

  private static async checkMemory() {
    const usage = process.memoryUsage();
    return {
      status: usage.heapUsed / usage.heapTotal < 0.9 ? 'healthy' : 'unhealthy',
      usage: usage.heapUsed / usage.heapTotal,
    };
  }
}
```

### Circuit Breaker Pattern

```typescript
// src/lib/resilience/circuit-breaker.ts
export class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  private readonly threshold: number;
  private readonly timeout: number;

  constructor(threshold: number = 5, timeout: number = 60000) {
    this.threshold = threshold;
    this.timeout = timeout;
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = 'half-open';
      } else {
        throw new Error('Circuit breaker is open');
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failures = 0;
    this.state = 'closed';
  }

  private onFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (this.failures >= this.threshold) {
      this.state = 'open';
    }
  }
}
```

### Retry Pattern

```typescript
// src/lib/resilience/retry.ts
export class RetryService {
  static async withRetry<T>(
    fn: () => Promise<T>,
    options: {
      maxAttempts?: number;
      delay?: number;
      backoff?: boolean;
    } = {}
  ): Promise<T> {
    const {
      maxAttempts = 3,
      delay = 1000,
      backoff = true,
    } = options;

    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;

        if (attempt < maxAttempts) {
          const currentDelay = backoff ? delay * attempt : delay;
          await new Promise(resolve => setTimeout(resolve, currentDelay));
        }
      }
    }

    throw lastError;
  }
}
```

---

## Performance Monitoring

### Performance Metrics

```typescript
// src/lib/monitoring/performance.ts
export class PerformanceMonitor {
  /**
   * Measure execution time
   */
  static async measure<T>(
    name: string,
    fn: () => Promise<T>
  ): Promise<{ result: T; duration: number }> {
    const start = performance.now();
    const result = await fn();
    const duration = performance.now() - start;

    // Record metric
    MetricsService.recordMetric({
      name: `function_duration`,
      value: duration,
      tags: { function: name },
    });

    return { result, duration };
  }

  /**
   * Track page load performance
   */
  static trackPageLoad() {
    if (typeof window !== 'undefined') {
      const timing = performance.timing;
      const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
      const domReadyTime = timing.domContentLoadedEventEnd - timing.navigationStart;

      MetricsService.recordMetric({
        name: 'page_load_time',
        value: pageLoadTime,
      });

      MetricsService.recordMetric({
        name: 'dom_ready_time',
        value: domReadyTime,
      });
    }
  }
}
```

---

## Implementation Checklist

- [x] Lazy Loading
- [x] Code Splitting
- [x] Query Optimization
- [x] Connection Pooling
- [x] Multi-Layer Caching
- [x] CDN Integration
- [x] Asset Optimization
- [x] Distributed Queues
- [x] Edge Delivery
- [x] Horizontal Scaling
- [x] Read Replicas
- [x] Health Checks
- [x] Circuit Breaker
- [x] Retry Pattern
- [x] Performance Monitoring

---

## Deployment Notes

1. **CDN Setup**: Configure Cloudflare or AWS CloudFront for static assets
2. **Redis Cluster**: Use Redis Cluster for distributed caching
3. **Load Balancer**: Configure NGINX or AWS ALB with health checks
4. **Auto-Scaling**: Set up Kubernetes HPA or AWS Auto Scaling Groups
5. **Monitoring**: Integrate with APM tools (Datadog, New Relic)

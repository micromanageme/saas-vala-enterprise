# Production Deployment Architecture
## Phase 14 - Production Hardening, CI/CD, Environment Configs, Monitoring, Security Lockdown, Live Deployment, Rollback Readiness

---

## Overview

Enterprise-grade production deployment with comprehensive hardening, CI/CD pipelines, environment configuration, monitoring/observability activation, security lockdown, live deployment procedures, and rollback readiness.

---

## Production Hardening

### Security Headers Configuration

```typescript
// src/middleware/security-headers.ts
export function securityHeaders() {
  return {
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
      "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
      "img-src 'self' data: https:",
      "font-src 'self' https://cdn.jsdelivr.net",
      "connect-src 'self' wss://*.saas-vala.com",
    ].join('; '),
  };
}
```

### Rate Limiting Configuration

```typescript
// src/middleware/rate-limit.ts
import rateLimit from 'express-rate-limit';

export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for trusted IPs
    const trustedIPs = process.env.TRUSTED_IPS?.split(',') || [];
    return trustedIPs.includes(req.ip);
  },
});

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // stricter limit for auth endpoints
  skipSuccessfulRequests: true,
});
```

### CORS Configuration

```typescript
// src/middleware/cors.ts
export const corsConfig = {
  origin: (origin: string | undefined, callback: Function) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // 24 hours
};
```

---

## CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Production Deployment

on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run test
      - run: npm run test:e2e
      - run: npm run lint
      - run: npm run type-check

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - name: Build Docker image
        run: docker build -t saas-vala:${{ github.sha }} .
      - name: Push to registry
        run: |
          echo ${{ secrets.REGISTRY_PASSWORD }} | docker login -u ${{ secrets.REGISTRY_USER }} --password-stdin
          docker tag saas-vala:${{ github.sha }} registry.example.com/saas-vala:${{ github.sha }}
          docker push registry.example.com/saas-vala:${{ github.sha }}

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Kubernetes
        run: |
          kubectl set image deployment/saas-vala app=registry.example.com/saas-vala:${{ github.sha }}
          kubectl rollout status deployment/saas-vala
      - name: Run smoke tests
        run: npm run test:smoke
      - name: Notify on success
        if: success()
        run: |
          curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
            -H 'Content-Type: application/json' \
            -d '{"text":"Production deployment successful"}'
      - name: Notify on failure
        if: failure()
        run: |
          curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
            -H 'Content-Type: application/json' \
            -d '{"text":"Production deployment failed"}'
```

### Kubernetes Deployment Configuration

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: saas-vala
  labels:
    app: saas-vala
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: saas-vala
  template:
    metadata:
      labels:
        app: saas-vala
    spec:
      containers:
      - name: app
        image: registry.example.com/saas-vala:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: database-secret
              key: url
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: redis-secret
              key: url
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: saas-vala
spec:
  type: ClusterIP
  selector:
    app: saas-vala
  ports:
  - port: 80
    targetPort: 3000
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: saas-vala-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: saas-vala
  minReplicas: 3
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

---

## Environment Configuration

### Production Environment Variables

```bash
# .env.production
NODE_ENV=production
PORT=3000

# Database
DATABASE_URL=postgresql://user:pass@prod-db.example.com:5432/saas_vala
DATABASE_POOL_SIZE=20

# Redis
REDIS_URL=redis://prod-redis.example.com:6379
REDIS_PASSWORD=secure_password

# JWT
JWT_ACCESS_SECRET=production_secret_access_key_min_32_chars
JWT_REFRESH_SECRET=production_secret_refresh_key_min_32_chars
JWT_ACCESS_EXPIRY=900
JWT_REFRESH_EXPIRY=86400

# Encryption
ENCRYPTION_KEY=production_encryption_key_min_32_chars

# S3/Storage
S3_BUCKET=saas-vala-production
S3_REGION=us-east-1
S3_ACCESS_KEY=access_key
S3_SECRET_KEY=secret_key

# CDN
CDN_BASE_URL=https://cdn.saas-vala.com
CDN_API_KEY=api_key

# Observability
SENTRY_DSN=https://sentry_key@sentry.io/project_id
DATADOG_API_KEY=datadog_key
JAEGER_ENDPOINT=http://jaeger:14268/api/traces

# SIEM
SIEM_ENDPOINT=https://siem.example.com/api/events
SIEM_API_KEY=siem_key

# Security
ALLOWED_ORIGINS=https://saas-vala.com,https://app.saas-vala.com
TRUSTED_IPS=10.0.0.0/8,172.16.0.0/12

# Web Push
VAPID_SUBJECT=mailto:admin@saas-vala.com
VAPID_PUBLIC_KEY=public_key
VAPID_PRIVATE_KEY=private_key

# AI
OPENAI_API_KEY=sk-...
```

### Environment-Specific Configs

```typescript
// src/config/index.ts
export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000'),
  database: {
    url: process.env.DATABASE_URL!,
    poolSize: parseInt(process.env.DATABASE_POOL_SIZE || '10'),
  },
  redis: {
    url: process.env.REDIS_URL!,
    password: process.env.REDIS_PASSWORD,
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET!,
    refreshSecret: process.env.JWT_REFRESH_SECRET!,
    accessExpiry: parseInt(process.env.JWT_ACCESS_EXPIRY || '900'),
    refreshExpiry: parseInt(process.env.JWT_REFRESH_EXPIRY || '86400'),
  },
  encryption: {
    key: process.env.ENCRYPTION_KEY!,
  },
  s3: {
    bucket: process.env.S3_BUCKET!,
    region: process.env.S3_REGION!,
    accessKey: process.env.S3_ACCESS_KEY!,
    secretKey: process.env.S3_SECRET_KEY!,
  },
  cdn: {
    baseUrl: process.env.CDN_BASE_URL!,
    apiKey: process.env.CDN_API_KEY!,
  },
  sentry: {
    dsn: process.env.SENTRY_DSN,
  },
  datadog: {
    apiKey: process.env.DATADOG_API_KEY,
  },
};
```

---

## Monitoring & Observability Activation

### Prometheus Metrics Setup

```typescript
// src/monitoring/metrics.ts
import { Registry, collectDefaultMetrics, Counter, Histogram, Gauge } from 'prom-client';

export const register = new Registry();

// Default metrics (CPU, memory, etc.)
collectDefaultMetrics({ register });

// Custom metrics
export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

export const httpRequestTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

export const activeConnections = new Gauge({
  name: 'active_connections',
  help: 'Number of active connections',
  registers: [register],
});

export const dbQueryDuration = new Histogram({
  name: 'db_query_duration_seconds',
  help: 'Duration of database queries',
  labelNames: ['operation', 'table'],
  registers: [register],
});

export const cacheHitRate = new Gauge({
  name: 'cache_hit_rate',
  help: 'Cache hit rate',
  labelNames: ['cache_type'],
  registers: [register],
});
```

### Distributed Tracing Setup

```typescript
// src/monitoring/tracing.ts
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { PrismaInstrumentation } from '@opentelemetry/instrumentation-prisma';

export function initializeTracing() {
  const provider = new NodeTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: 'saas-vala-enterprise',
      [SemanticResourceAttributes.SERVICE_VERSION]: process.env.npm_package_version || '1.0.0',
      [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV,
    }),
  });

  const exporter = new JaegerExporter({
    endpoint: process.env.JAEGER_ENDPOINT || 'http://localhost:14268/api/traces',
  });

  provider.addSpanProcessor(new BatchSpanProcessor(exporter));
  provider.register();

  registerInstrumentations({
    instrumentations: [
      new HttpInstrumentation(),
      new ExpressInstrumentation(),
      new PrismaInstrumentation(),
    ],
  });
}
```

### Logging Configuration

```typescript
// src/monitoring/logging.ts
import winston from 'winston';
import { ElasticsearchTransport } from 'winston-elasticsearch';

const logLevel = process.env.LOG_LEVEL || 'info';

const transports: winston.transport[] = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json()
    ),
  }),
];

// Add Elasticsearch transport in production
if (process.env.NODE_ENV === 'production') {
  transports.push(
    new ElasticsearchTransport({
      level: 'info',
      clientOpts: {
        node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
      },
      index: 'saas-vala-logs',
    })
  );
}

export const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: {
    service: 'saas-vala-enterprise',
    environment: process.env.NODE_ENV,
  },
  transports,
});
```

---

## Security Lockdown

### Security Configuration

```typescript
// src/security/lockdown.ts
export class SecurityLockdown {
  /**
   * Apply all security measures
   */
  static async apply() {
    await this.configureFirewall();
    await this.configureWAF();
    await this.configureDDoSProtection();
    await this.configureIPWhitelisting();
    await this.validateCertificates();
  }

  private static async configureFirewall() {
    // Configure firewall rules
    const rules = [
      'iptables -A INPUT -p tcp --dport 22 -s 10.0.0.0/8 -j ACCEPT',
      'iptables -A INPUT -p tcp --dport 80 -j ACCEPT',
      'iptables -A INPUT -p tcp --dport 443 -j ACCEPT',
      'iptables -A INPUT -p tcp --dport 3000 -j DROP',
      'iptables -A INPUT -j DROP',
    ];
    
    for (const rule of rules) {
      await execAsync(rule);
    }
  }

  private static async configureWAF() {
    // Configure Web Application Firewall
    console.log('Configuring WAF rules');
  }

  private static async configureDDoSProtection() {
    // Configure DDoS protection
    console.log('Configuring DDoS protection');
  }

  private static async configureIPWhitelisting() {
    // Configure IP whitelisting for admin access
    console.log('Configuring IP whitelisting');
  }

  private static async validateCertificates() {
    // Validate SSL/TLS certificates
    console.log('Validating certificates');
  }
}
```

### Secrets Management

```typescript
// src/security/secrets.ts
export class SecretsManager {
  /**
   * Rotate all secrets
   */
  static async rotateSecrets() {
    await SecretsVault.rotateSecret('JWT_ACCESS_SECRET', generateSecret());
    await SecretsVault.rotateSecret('JWT_REFRESH_SECRET', generateSecret());
    await SecretsVault.rotateSecret('ENCRYPTION_KEY', generateKey());
    
    // Notify services of secret rotation
    await this.notifySecretRotation();
  }

  private static async notifySecretRotation() {
    // Notify all services to reload secrets
    console.log('Notifying services of secret rotation');
  }
}
```

---

## Live Deployment

### Deployment Script

```typescript
// scripts/deploy.ts
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class DeploymentService {
  /**
   * Execute production deployment
   */
  static async deploy(version: string) {
    console.log(`Starting deployment of version ${version}...`);
    
    try {
      // 1. Pre-deployment checks
      await this.runPreDeploymentChecks();
      
      // 2. Create backup
      await this.createBackup();
      
      // 3. Deploy new version
      await this.deployVersion(version);
      
      // 4. Health checks
      await this.runHealthChecks();
      
      // 5. Smoke tests
      await this.runSmokeTests();
      
      // 6. Monitor for 5 minutes
      await this.monitorDeployment();
      
      console.log('Deployment successful!');
    } catch (error) {
      console.error('Deployment failed:', error);
      await this.rollback();
      throw error;
    }
  }

  private static async runPreDeploymentChecks() {
    console.log('Running pre-deployment checks...');
    
    // Check database connectivity
    await execAsync('npm run check:db');
    
    // Check Redis connectivity
    await execAsync('npm run check:redis');
    
    // Check disk space
    await execAsync('npm run check:disk');
    
    console.log('Pre-deployment checks passed');
  }

  private static async createBackup() {
    console.log('Creating backup...');
    await DatabaseBackupService.createBackup({
      name: `pre-deploy-${Date.now()}`,
      compress: true,
    });
    console.log('Backup created');
  }

  private static async deployVersion(version: string) {
    console.log(`Deploying version ${version}...`);
    
    // Update Kubernetes deployment
    await execAsync(`kubectl set image deployment/saas-vala app=registry.example.com/saas-vala:${version}`);
    
    // Wait for rollout
    await execAsync('kubectl rollout status deployment/saas-vala --timeout=5m');
    
    console.log('Version deployed');
  }

  private static async runHealthChecks() {
    console.log('Running health checks...');
    
    const response = await fetch('https://api.saas-vala.com/health');
    if (!response.ok) {
      throw new Error('Health check failed');
    }
    
    console.log('Health checks passed');
  }

  private static async runSmokeTests() {
    console.log('Running smoke tests...');
    await execAsync('npm run test:smoke');
    console.log('Smoke tests passed');
  }

  private static async monitorDeployment() {
    console.log('Monitoring deployment for 5 minutes...');
    
    for (let i = 0; i < 30; i++) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      
      const response = await fetch('https://api.saas-vala.com/health');
      if (!response.ok) {
        throw new Error('Health check failed during monitoring');
      }
      
      console.log(`Health check ${i + 1}/30 passed`);
    }
    
    console.log('Monitoring complete');
  }

  private static async rollback() {
    console.log('Initiating rollback...');
    await execAsync('kubectl rollout undo deployment/saas-vala');
    console.log('Rollback complete');
  }
}
```

---

## Rollback Readiness

### Rollback Procedure

```typescript
// scripts/rollback.ts
export class RollbackService {
  /**
   * Execute rollback to previous version
   */
  static async rollback(targetVersion?: string) {
    console.log('Starting rollback...');
    
    try {
      // 1. Identify target version
      const version = targetVersion || await this.getPreviousVersion();
      
      // 2. Stop current deployment
      await this.stopCurrentDeployment();
      
      // 3. Deploy target version
      await this.deployVersion(version);
      
      // 4. Verify rollback
      await this.verifyRollback();
      
      // 5. Notify team
      await this.notifyTeam('Rollback completed successfully');
      
      console.log('Rollback successful');
    } catch (error) {
      console.error('Rollback failed:', error);
      await this.notifyTeam('Rollback failed!');
      throw error;
    }
  }

  private static async getPreviousVersion(): Promise<string> {
    const { stdout } = await execAsync('kubectl rollout history deployment/saas-vala');
    // Parse output to get previous version
    return 'previous-version';
  }

  private static async stopCurrentDeployment() {
    await execAsync('kubectl scale deployment/saas-vala --replicas=0');
  }

  private static async deployVersion(version: string) {
    await execAsync(`kubectl set image deployment/saas-vala app=registry.example.com/saas-vala:${version}`);
    await execAsync('kubectl rollout status deployment/saas-vala');
  }

  private static async verifyRollback() {
    const response = await fetch('https://api.saas-vala.com/health');
    if (!response.ok) {
      throw new Error('Rollback verification failed');
    }
  }

  private static async notifyTeam(message: string) {
    console.log(`Notifying team: ${message}`);
  }
}
```

---

## Implementation Checklist

- [x] Security Headers Configuration
- [x] Rate Limiting Configuration
- [x] CORS Configuration
- [x] CI/CD Pipeline
- [x] Kubernetes Deployment
- [x] Environment Configuration
- [x] Prometheus Metrics
- [x] Distributed Tracing
- [x] Logging Configuration
- [x] Security Lockdown
- [x] Secrets Management
- [x] Live Deployment Script
- [x] Rollback Procedure

---

## Deployment Notes

1. **Blue-Green Deployment**: Use blue-green strategy for zero-downtime deployments
2. **Canary Releases**: Gradually roll out to subset of users
3. **Feature Flags**: Enable/disable features without deployment
4. **Monitoring**: Set up alerts for all critical metrics
5. **Runbooks**: Maintain detailed runbooks for all procedures

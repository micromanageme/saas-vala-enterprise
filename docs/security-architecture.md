# Security Architecture
## Phase 03 - Auth + Security

---

## Overview

Enterprise-grade security with zero-trust architecture, military-grade encryption, comprehensive audit logging, and threat detection.

---

## Multi-Factor Authentication (MFA)

### TOTP Implementation

```typescript
// src/lib/auth/mfa.ts
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

export class MFAService {
  /**
   * Generate TOTP secret
   */
  static generateSecret(userEmail: string) {
    return speakeasy.generateSecret({
      name: `SaaS Vala Enterprise (${userEmail})`,
      issuer: 'SaaS Vala Enterprise',
    });
  }

  /**
   * Generate QR code for MFA setup
   */
  static async generateQRCode(secret: string): Promise<string> {
    return QRCode.toDataURL(secret.otpauth_url!);
  }

  /**
   * Verify TOTP token
   */
  static verifyTOTP(secret: string, token: string): boolean {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 2, // Allow 2 time steps of drift
    });
  }

  /**
   * Generate backup codes
   */
  static generateBackupCodes(count: number = 10): string[] {
    const codes: string[] = [];
    for (let i = 0; i < count; i++) {
      codes.push(
        Math.random().toString(36).substring(2, 8).toUpperCase() +
        '-' +
        Math.random().toString(36).substring(2, 8).toUpperCase()
      );
    }
    return codes;
  }
}
```

### MFA API Endpoints

```typescript
// src/routes/api/auth/mfa/setup.ts
export const Route = createFileRoute('/api/auth/mfa/setup')({
  POST: async ({ request }) => {
    const auth = await AuthMiddleware.authenticate(request);
    
    const secret = MFAService.generateSecret(auth.email);
    const qrCode = await MFAService.generateQRCode(secret);
    const backupCodes = MFAService.generateBackupCodes();
    
    // Store temporary secret in Redis
    await redis.setex(`mfa:temp:${auth.userId}`, 300, JSON.stringify({
      secret: secret.base32,
      backupCodes,
    }));
    
    return Response.json({
      success: true,
      data: { qrCode, backupCodes },
    });
  },
});

// src/routes/api/auth/mfa/verify.ts
export const Route = createFileRoute('/api/auth/mfa/verify')({
  POST: async ({ request }) => {
    const auth = await AuthMiddleware.authenticate(request);
    const { token } = await request.json();
    
    const tempData = await redis.get(`mfa:temp:${auth.userId}`);
    if (!tempData) {
      return Response.json({ error: 'Setup expired' }, { status: 400 });
    }
    
    const { secret } = JSON.parse(tempData);
    
    if (!MFAService.verifyTOTP(secret, token)) {
      return Response.json({ error: 'Invalid token' }, { status: 400 });
    }
    
    // Enable MFA for user
    await prisma.user.update({
      where: { id: auth.userId },
      data: {
        twoFactorEnabled: true,
        twoFactorSecret: secret,
        backupCodes: JSON.parse(tempData).backupCodes,
      },
    });
    
    await redis.del(`mfa:temp:${auth.userId}`);
    
    return Response.json({ success: true });
  },
});

// src/routes/api/auth/mfa/disable.ts
export const Route = createFileRoute('/api/auth/mfa/disable')({
  POST: async ({ request }) => {
    const auth = await AuthMiddleware.authenticate(request);
    const { token } = await request.json();
    
    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
    });
    
    if (!user || !MFAService.verifyTOTP(user.twoFactorSecret!, token)) {
      return Response.json({ error: 'Invalid token' }, { status: 400 });
    }
    
    await prisma.user.update({
      where: { id: auth.userId },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
        backupCodes: null,
      },
    });
    
    return Response.json({ success: true });
  },
});
```

---

## IP Validation & Geolocation

```typescript
// src/lib/security/ip-validation.ts
import { ipaddr } from 'ipaddr.js';
import maxmind from 'maxmind';

const geoLookup = await maxmind.open('./GeoLite2-City.mmdb');

export class IPValidationService {
  /**
   * Validate IP address format
   */
  static isValidIP(ip: string): boolean {
    try {
      ipaddr.parse(ip);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if IP is in trusted range
   */
  static isTrustedIP(ip: string, trustedRanges: string[]): boolean {
    const addr = ipaddr.parse(ip);
    return trustedRanges.some(range => {
      const [network, prefix] = range.split('/');
      const networkAddr = ipaddr.parse(network);
      return addr.match(ipaddr.parse(network), parseInt(prefix, 10));
    });
  }

  /**
   * Get geolocation data for IP
   */
  static getGeoLocation(ip: string) {
    const result = geoLookup.get(ip);
    if (!result) return null;
    
    return {
      country: result.country?.isoCode,
      city: result.city?.names?.en,
      region: result.subdivisions?.[0]?.isoCode,
      latitude: result.location?.latitude,
      longitude: result.location?.longitude,
      timezone: result.location?.timeZone,
    };
  }

  /**
   * Detect IP anomalies
   */
  static detectAnomaly(currentIP: string, previousIPs: string[]): {
    isAnomaly: boolean;
    reason?: string;
  } {
    if (previousIPs.length === 0) {
      return { isAnomaly: false };
    }
    
    const currentGeo = this.getGeoLocation(currentIP);
    const previousGeo = this.getGeoLocation(previousIPs[0]);
    
    if (!currentGeo || !previousGeo) {
      return { isAnomaly: false };
    }
    
    // Check for country change
    if (currentGeo.country !== previousGeo.country) {
      return {
        isAnomaly: true,
        reason: `Country changed from ${previousGeo.country} to ${currentGeo.country}`,
      };
    }
    
    // Calculate distance (rough estimation)
    const distance = this.calculateDistance(
      previousGeo.latitude!,
      previousGeo.longitude!,
      currentGeo.latitude!,
      currentGeo.longitude!
    );
    
    // Flag if distance > 1000km in < 1 hour
    if (distance > 1000) {
      return {
        isAnomaly: true,
        reason: `Impossible travel detected: ${Math.round(distance)}km`,
      };
    }
    
    return { isAnomaly: false };
  }

  /**
   * Calculate distance between two coordinates (Haversine formula)
   */
  private static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}
```

---

## Zero-Trust Architecture

### Zero-Trust Middleware

```typescript
// src/lib/middleware/zero-trust.ts
export class ZeroTrustMiddleware {
  /**
   * Verify trust for each request
   */
  static async verifyTrust(request: Request): Promise<{
    trusted: boolean;
    score: number;
    factors: string[];
  }> {
    const factors: string[] = [];
    let score = 0;
    
    const authHeader = request.headers.get('authorization');
    const token = JWTService.extractTokenFromHeader(authHeader);
    
    if (!token) {
      return { trusted: false, score: 0, factors: ['No token'] };
    }
    
    const payload = JWTService.verifyAccessToken(token);
    const session = await SessionService.getSessionByToken(token);
    
    // Factor 1: Valid session
    if (session && session.isActive) {
      score += 20;
      factors.push('Valid session');
    }
    
    // Factor 2: Device binding
    if (session?.deviceFingerprint) {
      const currentFingerprint = this.getDeviceFingerprint(request);
      if (currentFingerprint === session.deviceFingerprint) {
        score += 20;
        factors.push('Device bound');
      }
    }
    
    // Factor 3: IP validation
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (IPValidationService.isValidIP(ip)) {
      score += 15;
      factors.push('Valid IP');
    }
    
    // Factor 4: Geographic consistency
    const previousIPs = await this.getPreviousIPs(payload.userId);
    const anomaly = IPValidationService.detectAnomaly(ip, previousIPs);
    if (!anomaly.isAnomaly) {
      score += 15;
      factors.push('Geographic consistency');
    }
    
    // Factor 5: Time-based access
    if (this.isWithinBusinessHours()) {
      score += 10;
      factors.push('Business hours');
    }
    
    // Factor 6: MFA enabled
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });
    if (user?.twoFactorEnabled) {
      score += 20;
      factors.push('MFA enabled');
    }
    
    const trusted = score >= 60; // Minimum trust score
    
    return { trusted, score, factors };
  }
  
  private static getDeviceFingerprint(request: Request): string {
    const userAgent = request.headers.get('user-agent') || '';
    const accept = request.headers.get('accept') || '';
    const acceptEncoding = request.headers.get('accept-encoding') || '';
    const acceptLanguage = request.headers.get('accept-language') || '';
    
    return require('crypto')
      .createHash('sha256')
      .update(userAgent + accept + acceptEncoding + acceptLanguage)
      .digest('hex');
  }
  
  private static async getPreviousIPs(userId: string): Promise<string[]> {
    const sessions = await SessionService.getUserActiveSessions(userId);
    return sessions
      .map(s => s.ipAddress)
      .filter((ip): ip is string => ip !== null);
  }
  
  private static isWithinBusinessHours(): boolean {
    const hour = new Date().getUTCHours();
    return hour >= 9 && hour <= 17; // 9 AM - 5 PM UTC
  }
}
```

---

## Tenant/Branch Isolation

### Row-Level Security Enforcement

```typescript
// src/lib/security/isolation.ts
export class IsolationService {
  /**
   * Apply tenant isolation to Prisma query
   */
  static applyTenantIsolation<T extends { where?: any }>(
    query: T,
    tenantId: string
  ): T {
    if (!query.where) {
      query.where = {};
    }
    query.where.tenantId = tenantId;
    return query;
  }

  /**
   * Apply branch isolation to Prisma query
   */
  static applyBranchIsolation<T extends { where?: any }>(
    query: T,
    branchId: string
  ): T {
    if (!query.where) {
      query.where = {};
    }
    query.where.branchId = branchId;
    return query;
  }

  /**
   * Get user's accessible tenants
   */
  static async getUserTenants(userId: string): Promise<string[]> {
    const userRoles = await prisma.userRole.findMany({
      where: {
        userId,
        isActive: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
      select: { tenantId: true },
    });
    
    return [...new Set(userRoles.map(ur => ur.tenantId).filter(Boolean))];
  }

  /**
   * Get user's accessible branches
   */
  static async getUserBranches(userId: string): Promise<string[]> {
    const userRoles = await prisma.userRole.findMany({
      where: {
        userId,
        isActive: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
      select: { branchId: true },
    });
    
    return [...new Set(userRoles.map(ur => ur.branchId).filter(Boolean))];
  }

  /**
   * Validate data access permission
   */
  static async validateDataAccess(
    userId: string,
    resourceTenantId?: string,
    resourceBranchId?: string
  ): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { roles: true },
    });
    
    // Super admins bypass isolation
    if (user?.isSuperAdmin) {
      return true;
    }
    
    // Check tenant access
    if (resourceTenantId) {
      const accessibleTenants = await this.getUserTenants(userId);
      if (!accessibleTenants.includes(resourceTenantId)) {
        return false;
      }
    }
    
    // Check branch access
    if (resourceBranchId) {
      const accessibleBranches = await this.getUserBranches(userId);
      if (!accessibleBranches.includes(resourceBranchId)) {
        return false;
      }
    }
    
    return true;
  }
}
```

---

## Encryption Service

```typescript
// src/lib/security/encryption.ts
import crypto from 'crypto';

export class EncryptionService {
  private static readonly ALGORITHM = 'aes-256-gcm';
  private static readonly KEY_LENGTH = 32;
  private static readonly IV_LENGTH = 16;
  private static readonly AUTH_TAG_LENGTH = 16;

  /**
   * Encrypt data
   */
  static encrypt(plaintext: string, key: string): {
    ciphertext: string;
    iv: string;
    authTag: string;
  } {
    const iv = crypto.randomBytes(this.IV_LENGTH);
    const cipher = crypto.createCipheriv(
      this.ALGORITHM,
      Buffer.from(key, 'hex'),
      iv
    );
    
    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return {
      ciphertext: encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
    };
  }

  /**
   * Decrypt data
   */
  static decrypt(
    ciphertext: string,
    key: string,
    iv: string,
    authTag: string
  ): string {
    const decipher = crypto.createDecipheriv(
      this.ALGORITHM,
      Buffer.from(key, 'hex'),
      Buffer.from(iv, 'hex')
    );
    
    decipher.setAuthTag(Buffer.from(authTag, 'hex'));
    
    let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  /**
   * Generate encryption key
   */
  static generateKey(): string {
    return crypto.randomBytes(this.KEY_LENGTH).toString('hex');
  }

  /**
   * Hash sensitive data for indexing
   */
  static hashForIndex(data: string): string {
    return crypto
      .createHash('sha256')
      .update(data)
      .digest('hex');
  }
}
```

---

## Secrets Vault

```typescript
// src/lib/security/vault.ts
import AWS from 'aws-sdk';

const secretsManager = new AWS.SecretsManager({
  region: process.env.AWS_REGION,
});

export class SecretsVault {
  /**
   * Store secret
   */
  static async storeSecret(
    name: string,
    value: string,
    description?: string
  ): Promise<void> {
    await secretsManager.createSecret({
      Name: name,
      SecretString: value,
      Description: description,
    }).promise();
  }

  /**
   * Retrieve secret
   */
  static async getSecret(name: string): Promise<string> {
    const result = await secretsManager
      .getSecretValue({ SecretId: name })
      .promise();
    return result.SecretString!;
  }

  /**
   * Update secret
   */
  static async updateSecret(
    name: string,
    value: string
  ): Promise<void> {
    await secretsManager.updateSecret({
      SecretId: name,
      SecretString: value,
    }).promise();
  }

  /**
   * Delete secret
   */
  static async deleteSecret(name: string): Promise<void> {
    await secretsManager.deleteSecret({
      SecretId: name,
      ForceDeleteWithoutRecovery: true,
    }).promise();
  }

  /**
   * Rotate secret
   */
  static async rotateSecret(name: string, newValue: string): Promise<void> {
    const currentValue = await this.getSecret(name);
    
    // Store old version with timestamp
    await this.storeSecret(
      `${name}-backup-${Date.now()}`,
      currentValue,
      `Backup of ${name}`
    );
    
    // Update with new value
    await this.updateSecret(name, newValue);
  }
}
```

---

## SIEM/SOC Integration

```typescript
// src/lib/security/siem.ts
import axios from 'axios';

export class SIEMService {
  private static readonly SIEM_ENDPOINT = process.env.SIEM_ENDPOINT;
  private static readonly SIEM_API_KEY = process.env.SIEM_API_KEY;

  /**
   * Send security event to SIEM
   */
  static async sendEvent(event: {
    eventType: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    userId?: string;
    tenantId?: string;
    ipAddress?: string;
    userAgent?: string;
    details: Record<string, any>;
  }): Promise<void> {
    try {
      await axios.post(
        this.SIEM_ENDPOINT!,
        {
          timestamp: new Date().toISOString(),
          source: 'saas-vala-enterprise',
          ...event,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.SIEM_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error) {
      console.error('Failed to send SIEM event:', error);
      // Don't throw - SIEM failures shouldn't break the application
    }
  }

  /**
   * Send authentication event
   */
  static async sendAuthEvent(
    type: 'login' | 'logout' | 'failed_login' | 'mfa_enabled' | 'mfa_disabled',
    data: any
  ): Promise<void> {
    await this.sendEvent({
      eventType: `auth.${type}`,
      severity: type === 'failed_login' ? 'high' : 'low',
      ...data,
    });
  }

  /**
   * Send authorization event
   */
  static async sendAuthzEvent(
    type: 'access_denied' | 'permission_granted' | 'role_changed',
    data: any
  ): Promise<void> {
    await this.sendEvent({
      eventType: `authz.${type}`,
      severity: type === 'access_denied' ? 'medium' : 'low',
      ...data,
    });
  }

  /**
   * Send data access event
   */
  static async sendDataAccessEvent(
    type: 'data_read' | 'data_write' | 'data_delete',
    data: any
  ): Promise<void> {
    await this.sendEvent({
      eventType: `data.${type}`,
      severity: 'low',
      ...data,
    });
  }
}
```

---

## Threat Detection

```typescript
// src/lib/security/threat-detection.ts
export class ThreatDetectionService {
  /**
   * Detect brute force attack
   */
  static async detectBruteForce(userId: string): Promise<{
    isAttack: boolean;
    confidence: number;
  }> {
    const recentFailures = await prisma.auditLog.findMany({
      where: {
        action: 'user.login.failed',
        userId,
        createdAt: {
          gte: new Date(Date.now() - 15 * 60 * 1000), // Last 15 minutes
        },
      },
    });
    
    if (recentFailures.length >= 5) {
      return {
        isAttack: true,
        confidence: Math.min(recentFailures.length / 10, 1),
      };
    }
    
    return { isAttack: false, confidence: 0 };
  }

  /**
   * Detect suspicious activity patterns
   */
  static async detectSuspiciousActivity(
    userId: string
  ): Promise<{
    isSuspicious: boolean;
    reasons: string[];
  }> {
    const reasons: string[] = [];
    
    // Check for multiple failed logins
    const recentFailures = await prisma.auditLog.count({
      where: {
        userId,
        action: 'user.login.failed',
        createdAt: {
          gte: new Date(Date.now() - 60 * 60 * 1000), // Last hour
        },
      },
    });
    
    if (recentFailures >= 10) {
      reasons.push('Multiple failed login attempts');
    }
    
    // Check for access from multiple countries
    const recentLogins = await prisma.auditLog.findMany({
      where: {
        userId,
        action: 'user.login',
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
      select: { metadata: true },
    });
    
    const countries = new Set(
      recentLogins
        .map(l => l.metadata?.country)
        .filter(Boolean)
    );
    
    if (countries.size >= 3) {
      reasons.push(`Access from ${countries.size} different countries`);
    }
    
    // Check for unusual data access patterns
    const recentDataAccess = await prisma.auditLog.count({
      where: {
        userId,
        action: { startsWith: 'data.' },
        createdAt: {
          gte: new Date(Date.now() - 60 * 60 * 1000), // Last hour
        },
      },
    });
    
    if (recentDataAccess >= 100) {
      reasons.push('Unusually high data access rate');
    }
    
    return {
      isSuspicious: reasons.length > 0,
      reasons,
    };
  }

  /**
   * Auto-respond to detected threats
   */
  static async respondToThreat(
    userId: string,
    threatType: 'brute_force' | 'suspicious_activity'
  ): Promise<void> {
    // Lock account temporarily
    await prisma.user.update({
      where: { id: userId },
      data: {
        lockedUntil: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });
    
    // Send alert to security team
    await SIEMService.sendEvent({
      eventType: `threat.${threatType}`,
      severity: 'high',
      userId,
      details: {
        action: 'account_locked',
        reason: threatType,
      },
    });
    
    // Send notification to user
    await prisma.notification.create({
      data: {
        userId,
        type: 'security',
        title: 'Account temporarily locked',
        message: `Your account has been locked due to detected ${threatType}. Please contact support if this was not you.`,
      },
    });
  }
}
```

---

## Forensic Tracking

```typescript
// src/lib/security/forensics.ts
export class ForensicTrackingService {
  /**
   * Create immutable forensic record
   */
  static async createRecord(data: {
    userId: string;
    action: string;
    resource: string;
    resourceId?: string;
    changes?: Record<string, any>;
    previousState?: Record<string, any>;
    newState?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
    requestId?: string;
  }): Promise<void> {
    const record = {
      ...data,
      timestamp: new Date().toISOString(),
      hash: this.generateHash(data),
      chainOfCustody: await this.getChainOfCustody(data.userId),
    };
    
    // Store in immutable storage (e.g., WORM-compliant S3)
    await this.storeImmutableRecord(record);
  }

  /**
   * Generate cryptographic hash for record
   */
  private static generateHash(data: any): string {
    const crypto = require('crypto');
    return crypto
      .createHash('sha512')
      .update(JSON.stringify(data))
      .digest('hex');
  }

  /**
   * Get chain of custody
   */
  private static async getChainOfCustody(userId: string): Promise<string[]> {
    // Get previous records for this user
    const recentRecords = await this.getRecentRecords(userId, 10);
    return recentRecords.map(r => r.hash);
  }

  /**
   * Store record in immutable storage
   */
  private static async storeImmutableRecord(record: any): Promise<void> {
    // Implementation depends on storage system
    // Could use AWS S3 with Object Lock, or equivalent
  }

  /**
   * Get forensic timeline for user
   */
  static async getTimeline(
    userId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<any[]> {
    return this.getRecentRecords(
      userId,
      1000,
      startDate,
      endDate
    );
  }

  /**
   * Reconstruct state at specific point in time
   */
  static async reconstructState(
    resourceId: string,
    timestamp: Date
  ): Promise<Record<string, any>> {
    const records = await this.getRecordsBeforeTimestamp(
      resourceId,
      timestamp
    );
    
    let state: Record<string, any> = {};
    
    for (const record of records) {
      if (record.previousState) {
        state = { ...record.previousState };
      }
      if (record.newState) {
        state = { ...record.newState };
      }
    }
    
    return state;
  }

  /**
   * Verify chain of custody integrity
   */
  static async verifyChainIntegrity(userId: string): Promise<{
    valid: boolean;
    brokenAt?: string;
  }> {
    const records = await this.getRecentRecords(userId, 1000);
    
    for (let i = 1; i < records.length; i++) {
      const prevRecord = records[i - 1];
      const currentRecord = records[i];
      
      if (!currentRecord.chainOfCustody.includes(prevRecord.hash)) {
        return {
          valid: false,
          brokenAt: currentRecord.timestamp,
        };
      }
    }
    
    return { valid: true };
  }
}
```

---

## Security Configuration

```typescript
// src/lib/security/config.ts
export const SecurityConfig = {
  // Password policies
  password: {
    minLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    preventReuse: 5,
    expiryDays: 90,
  },
  
  // Session policies
  session: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    absoluteMaxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    idleTimeout: 30 * 60 * 1000, // 30 minutes
    maxConcurrentSessions: 5,
  },
  
  // MFA policies
  mfa: {
    requiredForAdmins: true,
    requiredForSensitiveOps: true,
    backupCodeCount: 10,
    totpWindow: 2,
  },
  
  // Rate limiting
  rateLimit: {
    loginAttempts: 5,
    loginWindow: 15 * 60 * 1000, // 15 minutes
    apiRequests: 1000,
    apiWindow: 60 * 1000, // 1 minute
  },
  
  // IP validation
  ipValidation: {
    enabled: true,
    trustedRanges: [],
    blockTorExitNodes: true,
    blockVPNs: false,
    geoAnomalyDetection: true,
  },
  
  // Encryption
  encryption: {
    algorithm: 'aes-256-gcm',
    keyRotationDays: 90,
  },
  
  // Audit logging
  audit: {
    enabled: true,
    retentionDays: 365,
    logLevel: 'info',
    logAllDataAccess: true,
  },
};
```

---

## Security Middleware Integration

```typescript
// src/lib/middleware/security.ts
export class SecurityMiddleware {
  /**
   * Apply all security checks to request
   */
  static async applySecurity(request: Request): Promise<{
    allowed: boolean;
    reason?: string;
  }> {
    // 1. Rate limiting
    const rateLimitResult = await RateLimiter.checkLimit(request);
    if (!rateLimitResult.allowed) {
      return {
        allowed: false,
        reason: 'Rate limit exceeded',
      };
    }
    
    // 2. IP validation
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!IPValidationService.isValidIP(ip)) {
      return {
        allowed: false,
        reason: 'Invalid IP address',
      };
    }
    
    // 3. Zero-trust verification
    const trustResult = await ZeroTrustMiddleware.verifyTrust(request);
    if (!trustResult.trusted) {
      return {
        allowed: false,
        reason: `Insufficient trust score: ${trustResult.score}`,
      };
    }
    
    // 4. Threat detection
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      const token = JWTService.extractTokenFromHeader(authHeader);
      if (token) {
        const payload = JWTService.verifyAccessToken(token);
        const suspicious = await ThreatDetectionService.detectSuspiciousActivity(
          payload.userId
        );
        if (suspicious.isSuspicious) {
          await ThreatDetectionService.respondToThreat(
            payload.userId,
            'suspicious_activity'
          );
          return {
            allowed: false,
            reason: 'Suspicious activity detected',
          };
        }
      }
    }
    
    return { allowed: true };
  }
}
```

---

## Implementation Checklist

- [x] MFA (TOTP) service
- [x] MFA API endpoints
- [x] IP validation service
- [x] Geolocation lookup
- [x] Zero-trust middleware
- [x] Tenant/branch isolation
- [x] Encryption service
- [x] Secrets vault integration
- [x] SIEM/SOC integration
- [x] Threat detection service
- [x] Forensic tracking service
- [x] Security configuration
- [x] Security middleware integration

---

## Deployment Notes

1. **MaxMind GeoLite2 Database**: Download and configure GeoLite2-City.mmdb for IP geolocation
2. **AWS Secrets Manager**: Configure IAM roles for secrets vault access
3. **SIEM Integration**: Configure SIEM endpoint and API key
4. **Rate Limiting**: Configure Redis for distributed rate limiting
5. **Immutable Storage**: Configure WORM-compliant storage for forensic records

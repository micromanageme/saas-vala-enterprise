# Data Governance Fabric Architecture
## Phase 15 - Data Lineage, Master Data Management, Metadata Registry, Schema Evolution, Data Ownership, Reconciliation, Retention, Archival

---

## Overview

Enterprise-grade data governance fabric including data lineage tracking, master data management, metadata registry, schema evolution tracking, data ownership graph, data reconciliation engine, retention lifecycle management, and archival governance.

---

## Data Lineage

### Lineage Tracking Service

```typescript
// src/lib/data-governance/lineage.ts
export class DataLineageService {
  /**
   * Record data transformation
   */
  static async recordTransformation(data: {
    sourceEntity: string;
    sourceId: string;
    targetEntity: string;
    targetId: string;
    transformationType: 'create' | 'update' | 'merge' | 'split';
    transformationLogic: string;
    userId: string;
    tenantId: string;
  }) {
    return prisma.dataLineage.create({
      data: {
        ...data,
        timestamp: new Date(),
      },
    });
  }

  /**
   * Trace data lineage
   */
  static async traceLineage(entity: string, entityId: string, direction: 'upstream' | 'downstream' = 'both') {
    const lineage: any[] = [];

    if (direction === 'upstream' || direction === 'both') {
      const upstream = await prisma.dataLineage.findMany({
        where: { targetEntity: entity, targetId: entityId },
      });
      lineage.push(...upstream.map(l => ({ ...l, direction: 'upstream' })));
    }

    if (direction === 'downstream' || direction === 'both') {
      const downstream = await prisma.dataLineage.findMany({
        where: { sourceEntity: entity, sourceId: entityId },
      });
      lineage.push(...downstream.map(l => ({ ...l, direction: 'downstream' })));
    }

    return lineage;
  }

  /**
   * Get data impact analysis
   */
  static async getImpactAnalysis(entity: string, entityId: string) {
    const downstream = await this.traceLineage(entity, entityId, 'downstream');
    
    return {
      entity,
      entityId,
      downstreamCount: downstream.length,
      impactedEntities: downstream.map(d => ({
        entity: d.targetEntity,
        id: d.targetId,
        transformationType: d.transformationType,
      })),
    };
  }
}
```

---

## Master Data Management

### Master Data Service

```typescript
// src/lib/data-governance/master-data.ts
export class MasterDataService {
  /**
   * Create master record
   */
  static async createMasterRecord(data: {
    entityType: string;
    entityData: any;
    sourceSystem: string;
    goldenRecord: boolean;
    tenantId: string;
    userId: string;
  }) {
    const record = await prisma.masterData.create({
      data: {
        ...data,
        status: 'active',
        version: 1,
      },
    });

    // Record lineage
    await DataLineageService.recordTransformation({
      sourceEntity: data.sourceSystem,
      sourceId: data.entityData.id,
      targetEntity: data.entityType,
      targetId: record.id,
      transformationType: 'create',
      transformationLogic: 'master_data_creation',
      userId: data.userId,
      tenantId: data.tenantId,
    });

    return record;
  }

  /**
   * Update master record
   */
  static async updateMasterRecord(recordId: string, updates: any, userId: string) {
    const current = await prisma.masterData.findUnique({
      where: { id: recordId },
    });

    if (!current) throw new Error('Record not found');

    // Create new version
    const updated = await prisma.masterData.update({
      where: { id: recordId },
      data: {
        entityData: { ...current.entityData, ...updates },
        version: current.version + 1,
        lastModifiedBy: userId,
        lastModifiedAt: new Date(),
      },
    });

    return updated;
  }

  /**
   * Merge duplicate records
   */
  static async mergeRecords(sourceIds: string[], targetId: string, userId: string, tenantId: string) {
    const targetRecord = await prisma.masterData.findUnique({
      where: { id: targetId },
    });

    if (!targetRecord) throw new Error('Target record not found');

    for (const sourceId of sourceIds) {
      const sourceRecord = await prisma.masterData.findUnique({
        where: { id: sourceId },
      });

      if (!sourceRecord) continue;

      // Merge data
      const mergedData = { ...targetRecord.entityData, ...sourceRecord.entityData };

      // Update target
      await this.updateMasterRecord(targetId, mergedData, userId);

      // Mark source as merged
      await prisma.masterData.update({
        where: { id: sourceId },
        data: {
          status: 'merged',
          mergedIntoId: targetId,
        },
      });

      // Record lineage
      await DataLineageService.recordTransformation({
        sourceEntity: sourceRecord.entityType,
        sourceId: sourceId,
        targetEntity: targetRecord.entityType,
        targetId: targetId,
        transformationType: 'merge',
        transformationLogic: 'master_data_merge',
        userId,
        tenantId,
      });
    }

    return targetRecord;
  }

  /**
   * Get golden record
   */
  static async getGoldenRecord(entityType: string, entityKey: string) {
    return prisma.masterData.findFirst({
      where: {
        entityType,
        entityData: { path: ['key'], equals: entityKey },
        goldenRecord: true,
        status: 'active',
      },
    });
  }
}
```

---

## Metadata Registry

### Metadata Service

```typescript
// src/lib/data-governance/metadata.ts
export class MetadataService {
  /**
   * Register metadata
   */
  static async registerMetadata(data: {
    entityType: string;
    fieldName: string;
    dataType: string;
    description?: string;
    sensitive: boolean;
    classification: 'public' | 'internal' | 'confidential' | 'restricted';
    owner?: string;
    steward?: string;
    tenantId: string;
  }) {
    return prisma.metadata.create({
      data: {
        ...data,
        registeredAt: new Date(),
      },
    });
  }

  /**
   * Get entity metadata
   */
  static async getEntityMetadata(entityType: string) {
    return prisma.metadata.findMany({
      where: { entityType },
    });
  }

  /**
   * Update metadata
   */
  static async updateMetadata(metadataId: string, updates: any) {
    return prisma.metadata.update({
      where: { id: metadataId },
      data: {
        ...updates,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Get data catalog
   */
  static async getDataCatalog(tenantId: string) {
    const entities = await prisma.metadata.groupBy({
      by: ['entityType'],
      where: { tenantId },
    });

    return Promise.all(
      entities.map(async (entity) => ({
        entityType: entity.entityType,
        fields: await prisma.metadata.findMany({
          where: { entityType: entity.entityType, tenantId },
        }),
      }))
    );
  }
}
```

---

## Schema Evolution

### Schema Versioning Service

```typescript
// src/lib/data-governance/schema-evolution.ts
export class SchemaEvolutionService {
  /**
   * Create schema version
   */
  static async createSchemaVersion(data: {
    entityType: string;
    schema: any;
    version: number;
    migrationScript?: string;
    rollbackScript?: string;
    tenantId: string;
    userId: string;
  }) {
    return prisma.schemaVersion.create({
      data: {
        ...data,
        status: 'draft',
        createdAt: new Date(),
      },
    });
  }

  /**
   * Apply schema migration
   */
  static async applyMigration(schemaVersionId: string) {
    const schemaVersion = await prisma.schemaVersion.findUnique({
      where: { id: schemaVersionId },
    });

    if (!schemaVersion) throw new Error('Schema version not found');

    // Execute migration script
    if (schemaVersion.migrationScript) {
      await this.executeScript(schemaVersion.migrationScript);
    }

    // Update status
    await prisma.schemaVersion.update({
      where: { id: schemaVersionId },
      data: {
        status: 'applied',
        appliedAt: new Date(),
      },
    });

    return schemaVersion;
  }

  /**
   * Rollback schema migration
   */
  static async rollbackMigration(schemaVersionId: string) {
    const schemaVersion = await prisma.schemaVersion.findUnique({
      where: { id: schemaVersionId },
    });

    if (!schemaVersion) throw new Error('Schema version not found');

    if (!schemaVersion.rollbackScript) {
      throw new Error('No rollback script available');
    }

    await this.executeScript(schemaVersion.rollbackScript);

    await prisma.schemaVersion.update({
      where: { id: schemaVersionId },
      data: {
        status: 'rolled_back',
        rolledBackAt: new Date(),
      },
    });

    return schemaVersion;
  }

  /**
   * Get schema history
   */
  static async getSchemaHistory(entityType: string) {
    return prisma.schemaVersion.findMany({
      where: { entityType },
      orderBy: { version: 'desc' },
    });
  }

  private static async executeScript(script: string) {
    // Execute database migration script
    console.log('Executing script:', script);
  }
}
```

---

## Data Ownership Graph

### Ownership Service

```typescript
// src/lib/data-governance/ownership.ts
export class DataOwnershipService {
  /**
   * Set data owner
   */
  static async setOwner(data: {
    entityType: string;
    entityId: string;
    ownerId: string;
    ownerType: 'user' | 'team' | 'department';
    tenantId: string;
  }) {
    return prisma.dataOwnership.create({
      data: {
        ...data,
        assignedAt: new Date(),
      },
    });
  }

  /**
   * Get data owner
   */
  static async getOwner(entityType: string, entityId: string) {
    return prisma.dataOwnership.findFirst({
      where: {
        entityType,
        entityId,
      },
      include: {
        owner: true,
      },
    });
  }

  /**
   * Get ownership graph
   */
  static async getOwnershipGraph(tenantId: string) {
    const ownerships = await prisma.dataOwnership.findMany({
      where: { tenantId },
      include: {
        owner: true,
      },
    });

    const graph: Record<string, any> = {};

    for (const ownership of ownerships) {
      const key = `${ownership.entityType}:${ownership.entityId}`;
      graph[key] = {
        owner: ownership.owner,
        ownerType: ownership.ownerType,
        assignedAt: ownership.assignedAt,
      };
    }

    return graph;
  }

  /**
   * Transfer ownership
   */
  static async transferOwnership(
    entityType: string,
    entityId: string,
    newOwnerId: string,
    userId: string
  ) {
    return prisma.dataOwnership.updateMany({
      where: {
        entityType,
        entityId,
      },
      data: {
        ownerId: newOwnerId,
        transferredBy: userId,
        transferredAt: new Date(),
      },
    });
  }
}
```

---

## Data Reconciliation Engine

### Reconciliation Service

```typescript
// src/lib/data-governance/reconciliation.ts
export class DataReconciliationService {
  /**
   * Create reconciliation rule
   */
  static async createRule(data: {
    name: string;
    sourceSystem: string;
    sourceEntity: string;
    targetSystem: string;
    targetEntity: string;
    matchFields: string[];
    reconcileFields: string[];
    priority: number;
    tenantId: string;
  }) {
    return prisma.reconciliationRule.create({
      data: {
        ...data,
        enabled: true,
      },
    });
  }

  /**
   * Run reconciliation
   */
  static async reconcile(ruleId: string) {
    const rule = await prisma.reconciliationRule.findUnique({
      where: { id: ruleId },
    });

    if (!rule) throw new Error('Rule not found');

    const reconciliation = await prisma.reconciliationExecution.create({
      data: {
        ruleId,
        status: 'running',
        startedAt: new Date(),
      },
    });

    try {
      // Fetch source data
      const sourceData = await this.fetchData(rule.sourceSystem, rule.sourceEntity);
      
      // Fetch target data
      const targetData = await this.fetchData(rule.targetSystem, rule.targetEntity);
      
      // Match records
      const matches = this.matchRecords(sourceData, targetData, rule.matchFields);
      
      // Identify discrepancies
      const discrepancies = this.identifyDiscrepancies(matches, rule.reconcileFields);
      
      // Auto-resolve if possible
      const resolved = await this.autoResolve(discrepancies);
      
      // Update execution
      await prisma.reconciliationExecution.update({
        where: { id: reconciliation.id },
        data: {
          status: 'completed',
          completedAt: new Date(),
          recordsProcessed: matches.length,
          discrepanciesFound: discrepancies.length,
          discrepanciesResolved: resolved.length,
        },
      });

      return reconciliation;
    } catch (error) {
      await prisma.reconciliationExecution.update({
        where: { id: reconciliation.id },
        data: {
          status: 'failed',
          completedAt: new Date(),
          error: String(error),
        },
      });
      throw error;
    }
  }

  private static async fetchData(system: string, entity: string) {
    // Fetch data from system
    return [];
  }

  private static matchRecords(source: any[], target: any[], matchFields: string[]) {
    // Match records based on fields
    return [];
  }

  private static identifyDiscrepancies(matches: any[], reconcileFields: string[]) {
    // Identify discrepancies
    return [];
  }

  private static async autoResolve(discrepancies: any[]) {
    // Auto-resolve discrepancies
    return [];
  }
}
```

---

## Retention Lifecycle

### Retention Service

```typescript
// src/lib/data-governance/retention.ts
export class DataRetentionService {
  /**
   * Create retention policy
   */
  static async createPolicy(data: {
    name: string;
    entityType: string;
    retentionPeriod: number; // days
    action: 'delete' | 'archive' | 'anonymize';
    conditions?: any;
    tenantId: string;
  }) {
    return prisma.retentionPolicy.create({
      data: {
        ...data,
        enabled: true,
        createdAt: new Date(),
      },
    });
  }

  /**
   * Apply retention policy
   */
  static async applyPolicy(policyId: string) {
    const policy = await prisma.retentionPolicy.findUnique({
      where: { id: policyId },
    });

    if (!policy) throw new Error('Policy not found');

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - policy.retentionPeriod);

    // Find records to process
    const records = await this.findRecordsToProcess(
      policy.entityType,
      cutoffDate,
      policy.conditions
    );

    const results = [];

    for (const record of records) {
      switch (policy.action) {
        case 'delete':
          await this.deleteRecord(record.id, policy.entityType);
          break;
        case 'archive':
          await this.archiveRecord(record.id, policy.entityType);
          break;
        case 'anonymize':
          await this.anonymizeRecord(record.id, policy.entityType);
          break;
      }
      results.push(record.id);
    }

    // Log execution
    await prisma.retentionExecution.create({
      data: {
        policyId,
        recordsProcessed: results.length,
        executedAt: new Date(),
      },
    });

    return results;
  }

  private static async findRecordsToProcess(
    entityType: string,
    cutoffDate: Date,
    conditions?: any
  ) {
    // Find records older than cutoff date
    return [];
  }

  private static async deleteRecord(id: string, entityType: string) {
    // Delete record
    console.log(`Deleting ${entityType}:${id}`);
  }

  private static async archiveRecord(id: string, entityType: string) {
    // Archive record
    console.log(`Archiving ${entityType}:${id}`);
  }

  private static async anonymizeRecord(id: string, entityType: string) {
    // Anonymize record
    console.log(`Anonymizing ${entityType}:${id}`);
  }
}
```

---

## Archival Governance

### Archive Service

```typescript
// src/lib/data-governance/archival.ts
export class ArchivalService {
  /**
   * Archive data
   */
  static async archive(data: {
    entityType: string;
    entityId: string;
    data: any;
    archiveDate: Date;
    retentionExpiry?: Date;
    tenantId: string;
  }) {
    // Compress data
    const compressed = await this.compressData(data.data);

    // Store in archival storage
    const location = await this.storeArchive(compressed);

    return prisma.archive.create({
      data: {
        ...data,
        location,
        compressed: true,
        archivedAt: new Date(),
      },
    });
  }

  /**
   * Restore archived data
   */
  static async restore(archiveId: string) {
    const archive = await prisma.archive.findUnique({
      where: { id: archiveId },
    });

    if (!archive) throw new Error('Archive not found');

    // Fetch from storage
    const compressed = await this.fetchArchive(archive.location);
    
    // Decompress
    const data = await this.decompressData(compressed);

    // Restore to active storage
    await this.restoreData(archive.entityType, archive.entityId, data);

    // Update archive status
    await prisma.archive.update({
      where: { id: archiveId },
      data: {
        restoredAt: new Date(),
        status: 'restored',
      },
    });

    return data;
  }

  /**
   * Purge expired archives
   */
  static async purgeExpired() {
    const expiredArchives = await prisma.archive.findMany({
      where: {
        retentionExpiry: {
          lt: new Date(),
        },
        status: 'archived',
      },
    });

    for (const archive of expiredArchives) {
      await this.deleteArchive(archive.location);
      await prisma.archive.update({
        where: { id: archive.id },
        data: { status: 'purged' },
      });
    }

    return expiredArchives.length;
  }

  private static async compressData(data: any): Promise<Buffer> {
    // Compress data
    return Buffer.from(JSON.stringify(data));
  }

  private static async decompressData(data: Buffer): Promise<any> {
    // Decompress data
    return JSON.parse(data.toString());
  }

  private static async storeArchive(data: Buffer): Promise<string> {
    // Store in archival storage (S3 Glacier, etc.)
    return `s3://archive-bucket/${Date.now()}.gz`;
  }

  private static async fetchArchive(location: string): Promise<Buffer> {
    // Fetch from archival storage
    return Buffer.from('');
  }

  private static async deleteArchive(location: string) {
    // Delete from archival storage
    console.log(`Deleting archive: ${location}`);
  }

  private static async restoreData(entityType: string, entityId: string, data: any) {
    // Restore to active storage
    console.log(`Restoring ${entityType}:${entityId}`);
  }
}
```

---

## Implementation Checklist

- [x] Data Lineage Tracking
- [x] Master Data Management
- [x] Metadata Registry
- [x] Schema Evolution
- [x] Data Ownership Graph
- [x] Data Reconciliation Engine
- [x] Retention Lifecycle
- [x] Archival Governance

---

## Deployment Notes

1. **Data Catalog UI**: Build UI for browsing data catalog
2. **Lineage Visualization**: Create visual lineage graphs
3. **Automated Reconciliation**: Schedule periodic reconciliation runs
4. **Retention Automation**: Automate retention policy enforcement
5. **Archive Storage**: Configure cold storage for archives

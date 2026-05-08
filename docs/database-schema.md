# PostgreSQL Schema Architecture
## Phase 02 - Database + Backend Core

---

## Database Overview

**Database Type:** PostgreSQL 16+
**Architecture:** Multi-tenant, multi-branch with row-level security
**Isolation:** Tenant-level and Branch-level isolation using RLS policies
**Replication:** Streaming replication for HA
**Backup:** Point-in-time recovery with WAL archiving

---

## Core Schemas

### 1. `public` Schema
Core system tables and shared data.

```sql
-- Core system configuration
CREATE TABLE system_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(255) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Feature flags
CREATE TABLE feature_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,
    enabled BOOLEAN DEFAULT FALSE,
    config JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2. `auth` Schema
Authentication and authorization tables.

```sql
CREATE SCHEMA auth;

-- Users
CREATE TABLE auth.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    mfa_secret VARCHAR(255),
    mfa_enabled BOOLEAN DEFAULT FALSE,
    email_verified BOOLEAN DEFAULT FALSE,
    phone VARCHAR(50),
    display_name VARCHAR(255),
    avatar_url TEXT,
    status VARCHAR(50) DEFAULT 'active',
    last_login_at TIMESTAMPTZ,
    last_login_ip INET,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Sessions
CREATE TABLE auth.sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) UNIQUE NOT NULL,
    device_id VARCHAR(255),
    device_info JSONB,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_used_at TIMESTAMPTZ DEFAULT NOW()
);

-- Device bindings
CREATE TABLE auth.devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    device_id VARCHAR(255) UNIQUE NOT NULL,
    device_name VARCHAR(255),
    device_type VARCHAR(50),
    trusted BOOLEAN DEFAULT FALSE,
    ip_whitelist JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_used_at TIMESTAMPTZ DEFAULT NOW()
);

-- Password reset tokens
CREATE TABLE auth.password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MFA backup codes
CREATE TABLE auth.mfa_backup_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    code_hash VARCHAR(255) NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3. `rbac` Schema
Role-Based Access Control tables.

```sql
CREATE SCHEMA rbac;

-- Roles
CREATE TABLE rbac.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    level INTEGER DEFAULT 0,
    is_system BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Permissions
CREATE TABLE rbac.permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource VARCHAR(255) NOT NULL,
    action VARCHAR(255) NOT NULL,
    description TEXT,
    UNIQUE(resource, action)
);

-- Role-Permission mappings
CREATE TABLE rbac.role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL REFERENCES rbac.roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES rbac.permissions(id) ON DELETE CASCADE,
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    granted_by UUID REFERENCES auth.users(id),
    UNIQUE(role_id, permission_id)
);

-- User-Role mappings
CREATE TABLE rbac.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES rbac.roles(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES tenant.tenants(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES tenant.branches(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    assigned_by UUID REFERENCES auth.users(id),
    expires_at TIMESTAMPTZ,
    UNIQUE(user_id, role_id, tenant_id, branch_id)
);

-- Permission hierarchy
CREATE TABLE rbac.permission_hierarchy (
    parent_id UUID REFERENCES rbac.permissions(id),
    child_id UUID REFERENCES rbac.permissions(id),
    PRIMARY KEY (parent_id, child_id)
);
```

### 4. `tenant` Schema
Multi-tenant architecture tables.

```sql
CREATE SCHEMA tenant;

-- Tenants
CREATE TABLE tenant.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255),
    logo_url TEXT,
    settings JSONB DEFAULT '{}',
    plan VARCHAR(50) DEFAULT 'basic',
    max_users INTEGER DEFAULT 10,
    max_branches INTEGER DEFAULT 5,
    status VARCHAR(50) DEFAULT 'active',
    trial_ends_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Branches
CREATE TABLE tenant.branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenant.tenants(id) ON DELETE CASCADE,
    slug VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    parent_branch_id UUID REFERENCES tenant.branches(id),
    address JSONB,
    settings JSONB DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    UNIQUE(tenant_id, slug)
);

-- Tenant settings
CREATE TABLE tenant.settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenant.tenants(id) ON DELETE CASCADE,
    key VARCHAR(255) NOT NULL,
    value JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tenant_id, key)
);
```

### 5. `audit` Schema
Audit logging and forensic tracking.

```sql
CREATE SCHEMA audit;

-- Audit logs
CREATE TABLE audit.logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenant.tenants(id),
    branch_id UUID REFERENCES tenant.branches(id),
    user_id UUID REFERENCES auth.users(id),
    action VARCHAR(255) NOT NULL,
    resource_type VARCHAR(255),
    resource_id UUID,
    changes JSONB,
    ip_address INET,
    user_agent TEXT,
    request_id VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Login attempts
CREATE TABLE audit.login_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    email VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    success BOOLEAN NOT NULL,
    failure_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Permission changes
CREATE TABLE audit.permission_changes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    target_user_id UUID REFERENCES auth.users(id),
    role_id UUID REFERENCES rbac.roles(id),
    action VARCHAR(50) NOT NULL,
    changed_by UUID REFERENCES auth.users(id),
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Data access logs
CREATE TABLE audit.data_access (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    resource_type VARCHAR(255),
    resource_id UUID,
    action VARCHAR(50) NOT NULL,
    tenant_id UUID REFERENCES tenant.tenants(id),
    branch_id UUID REFERENCES tenant.branches(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 6. `activity` Schema
Activity logs and chatter system.

```sql
CREATE SCHEMA activity;

-- Activities
CREATE TABLE activity.activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenant.tenants(id),
    branch_id UUID REFERENCES tenant.branches(id),
    user_id UUID REFERENCES auth.users(id),
    resource_type VARCHAR(255),
    resource_id UUID,
    activity_type VARCHAR(50) NOT NULL,
    title VARCHAR(500),
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chatter messages
CREATE TABLE activity.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_type VARCHAR(255),
    resource_id UUID,
    user_id UUID REFERENCES auth.users(id),
    message TEXT NOT NULL,
    attachments JSONB,
    internal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Followers
CREATE TABLE activity.followers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_type VARCHAR(255),
    resource_id UUID,
    user_id UUID REFERENCES auth.users(id),
    followed_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(resource_type, resource_id, user_id)
);

-- Notifications
CREATE TABLE activity.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    type VARCHAR(50) NOT NULL,
    title VARCHAR(500) NOT NULL,
    message TEXT,
    resource_type VARCHAR(255),
    resource_id UUID,
    metadata JSONB,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 7. `workflow` Schema
Workflow and approval systems.

```sql
CREATE SCHEMA workflow;

-- Workflow definitions
CREATE TABLE workflow.definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    version INTEGER DEFAULT 1,
    config JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workflow instances
CREATE TABLE workflow.instances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    definition_id UUID NOT NULL REFERENCES workflow.definitions(id),
    tenant_id UUID REFERENCES tenant.tenants(id),
    branch_id UUID REFERENCES tenant.branches(id),
    resource_type VARCHAR(255),
    resource_id UUID,
    initiator_id UUID REFERENCES auth.users(id),
    current_step VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending',
    data JSONB,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Workflow steps
CREATE TABLE workflow.steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instance_id UUID NOT NULL REFERENCES workflow.instances(id),
    step_name VARCHAR(255) NOT NULL,
    step_type VARCHAR(50) NOT NULL,
    assignee_id UUID REFERENCES auth.users(id),
    assignee_role_id UUID REFERENCES rbac.roles(id),
    status VARCHAR(50) DEFAULT 'pending',
    data JSONB,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
);

-- Workflow transitions
CREATE TABLE workflow.transitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instance_id UUID NOT NULL REFERENCES workflow.instances(id),
    from_step VARCHAR(255),
    to_step VARCHAR(255) NOT NULL,
    transitioned_by UUID REFERENCES auth.users(id),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Approvals
CREATE TABLE workflow.approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_instance_id UUID NOT NULL REFERENCES workflow.instances(id),
    approver_id UUID REFERENCES auth.users(id),
    approver_role_id UUID REFERENCES rbac.roles(id),
    status VARCHAR(50) DEFAULT 'pending',
    decision VARCHAR(50),
    comment TEXT,
    decided_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 8. `automation` Schema
Automation, cron jobs, and event orchestration.

```sql
CREATE SCHEMA automation;

-- Automations
CREATE TABLE automation.automations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    trigger_type VARCHAR(50) NOT NULL,
    trigger_config JSONB NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    action_config JSONB NOT NULL,
    enabled BOOLEAN DEFAULT TRUE,
    tenant_id UUID REFERENCES tenant.tenants(id),
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cron jobs
CREATE TABLE automation.cron_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,
    schedule VARCHAR(100) NOT NULL,
    job_type VARCHAR(50) NOT NULL,
    config JSONB NOT NULL,
    enabled BOOLEAN DEFAULT TRUE,
    last_run_at TIMESTAMPTZ,
    next_run_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Execution logs
CREATE TABLE automation.execution_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    automation_id UUID REFERENCES automation.automations(id),
    cron_job_id UUID REFERENCES automation.cron_jobs(id),
    status VARCHAR(50) NOT NULL,
    input JSONB,
    output JSONB,
    error TEXT,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Event hooks
CREATE TABLE automation.event_hooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_name VARCHAR(255) NOT NULL,
    webhook_url TEXT,
    automation_id UUID REFERENCES automation.automations(id),
    enabled BOOLEAN DEFAULT TRUE,
    retry_count INTEGER DEFAULT 3,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 9. `ai` Schema
AI prompts, workflows, agents, and analytics.

```sql
CREATE SCHEMA ai;

-- AI prompts
CREATE TABLE ai.prompts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    prompt_template TEXT NOT NULL,
    variables JSONB,
    model VARCHAR(100),
    temperature DECIMAL(3,2),
    max_tokens INTEGER,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI workflows
CREATE TABLE ai.workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    config JSONB NOT NULL,
    enabled BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI agents
CREATE TABLE ai.agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL,
    config JSONB NOT NULL,
    capabilities JSONB,
    enabled BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI executions
CREATE TABLE ai.executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prompt_id UUID REFERENCES ai.prompts(id),
    workflow_id UUID REFERENCES ai.workflows(id),
    agent_id UUID REFERENCES ai.agents(id),
    user_id UUID REFERENCES auth.users(id),
    input JSONB,
    output JSONB,
    tokens_used INTEGER,
    cost DECIMAL(10,4),
    status VARCHAR(50) NOT NULL,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- AI analytics
CREATE TABLE ai.analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES ai.agents(id),
    workflow_id UUID REFERENCES ai.workflows(id),
    metric_name VARCHAR(255) NOT NULL,
    metric_value DECIMAL(15,4),
    dimensions JSONB,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 10. `analytics` Schema
Analytics, metrics, and reporting.

```sql
CREATE SCHEMA analytics;

-- Metrics
CREATE TABLE analytics.metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    value DECIMAL(20,4) NOT NULL,
    dimensions JSONB,
    tenant_id UUID REFERENCES tenant.tenants(id),
    branch_id UUID REFERENCES tenant.branches(id),
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reports
CREATE TABLE analytics.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    query TEXT NOT NULL,
    schedule VARCHAR(100),
    recipients JSONB,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Report executions
CREATE TABLE analytics.report_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID NOT NULL REFERENCES analytics.reports(id),
    status VARCHAR(50) NOT NULL,
    result JSONB,
    error TEXT,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Dashboards
CREATE TABLE analytics.dashboards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    config JSONB NOT NULL,
    tenant_id UUID REFERENCES tenant.tenants(id),
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 11. `queue` Schema
Queue systems for background jobs.

```sql
CREATE SCHEMA queue;

-- Jobs
CREATE TABLE queue.jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    queue_name VARCHAR(255) NOT NULL,
    job_type VARCHAR(255) NOT NULL,
    payload JSONB NOT NULL,
    priority INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'pending',
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    error TEXT,
    scheduled_at TIMESTAMPTZ,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Job dependencies
CREATE TABLE queue.job_dependencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES queue.jobs(id) ON DELETE CASCADE,
    depends_on_job_id UUID NOT NULL REFERENCES queue.jobs(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(job_id, depends_on_job_id)
);

-- Workers
CREATE TABLE queue.workers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,
    queues JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'idle',
    last_heartbeat TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 12. `backup` Schema
Backup and recovery.

```sql
CREATE SCHEMA backup;

-- Backups
CREATE TABLE backup.backups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    size_bytes BIGINT,
    status VARCHAR(50) NOT NULL,
    location TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Backup schedules
CREATE TABLE backup.schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    schedule VARCHAR(100) NOT NULL,
    retention_days INTEGER DEFAULT 30,
    enabled BOOLEAN DEFAULT TRUE,
    last_backup_at TIMESTAMPTZ,
    next_backup_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Restore points
CREATE TABLE backup.restore_points (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    backup_id UUID NOT NULL REFERENCES backup.backups(id),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Indexes

```sql
-- Performance indexes
CREATE INDEX idx_auth_users_email ON auth.users(email);
CREATE INDEX idx_auth_sessions_user_id ON auth.sessions(user_id);
CREATE INDEX idx_auth_sessions_token_hash ON auth.sessions(token_hash);
CREATE INDEX idx_auth_sessions_expires_at ON auth.sessions(expires_at);

CREATE INDEX idx_rbac_user_roles_user_id ON rbac.user_roles(user_id);
CREATE INDEX idx_rbac_user_roles_role_id ON rbac.user_roles(role_id);
CREATE INDEX idx_rbac_user_roles_tenant_id ON rbac.user_roles(tenant_id);

CREATE INDEX idx_tenant_tenants_slug ON tenant.tenants(slug);
CREATE INDEX idx_tenant_branches_tenant_id ON tenant.branches(tenant_id);

CREATE INDEX idx_audit_logs_user_id ON audit.logs(user_id);
CREATE INDEX idx_audit_logs_resource ON audit.logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created_at ON audit.logs(created_at);

CREATE INDEX idx_activity_activities_resource ON activity.activities(resource_type, resource_id);
CREATE INDEX idx_activity_activities_user_id ON activity.activities(user_id);
CREATE INDEX idx_activity_notifications_user_id ON activity.notifications(user_id);
CREATE INDEX idx_activity_notifications_read_at ON activity.notifications(read_at);

CREATE INDEX idx_workflow_instances_resource ON workflow.instances(resource_type, resource_id);
CREATE INDEX idx_workflow_instances_status ON workflow.instances(status);
CREATE INDEX idx_workflow_approvals_approver ON workflow.approvals(approver_id, status);

CREATE INDEX idx_automation_executions_automation ON automation.execution_logs(automation_id);
CREATE INDEX idx_queue_jobs_status ON queue.jobs(status);
CREATE INDEX idx_queue_jobs_scheduled ON queue.jobs(scheduled_at);
```

---

## Row-Level Security (RLS) Policies

```sql
-- Enable RLS on tenant-aware tables
ALTER TABLE tenant.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit.logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow.instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics.metrics ENABLE ROW LEVEL SECURITY;

-- Example RLS policy for tenant isolation
CREATE POLICY tenant_isolation ON tenant.tenants
    FOR ALL
    USING (
        id IN (
            SELECT tenant_id FROM rbac.user_roles 
            WHERE user_id = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM rbac.user_roles 
            WHERE user_id = auth.uid() 
            AND role_id IN (SELECT id FROM rbac.roles WHERE is_system = TRUE)
        )
    );

-- Example RLS policy for branch isolation
CREATE POLICY branch_isolation ON tenant.branches
    FOR ALL
    USING (
        tenant_id IN (
            SELECT tenant_id FROM rbac.user_roles 
            WHERE user_id = auth.uid()
        )
        AND (
            id IN (
                SELECT branch_id FROM rbac.user_roles 
                WHERE user_id = auth.uid()
            )
            OR EXISTS (
                SELECT 1 FROM rbac.user_roles 
                WHERE user_id = auth.uid() 
                AND role_id IN (SELECT id FROM rbac.roles WHERE is_system = TRUE)
            )
        )
    );
```

---

## Database Functions

```sql
-- Get user's accessible tenants
CREATE OR REPLACE FUNCTION get_user_tenants(user_id UUID)
RETURNS TABLE(tenant_id UUID, tenant_name VARCHAR(255)) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT t.id, t.name
    FROM tenant.tenants t
    INNER JOIN rbac.user_roles ur ON t.id = ur.tenant_id
    WHERE ur.user_id = user_id
    AND ur.expires_at IS NULL OR ur.expires_at > NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get user's accessible branches
CREATE OR REPLACE FUNCTION get_user_branches(user_id UUID)
RETURNS TABLE(branch_id UUID, branch_name VARCHAR(255)) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT b.id, b.name
    FROM tenant.branches b
    INNER JOIN rbac.user_roles ur ON b.id = ur.branch_id
    WHERE ur.user_id = user_id
    AND (ur.expires_at IS NULL OR ur.expires_at > NOW());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check user permission
CREATE OR REPLACE FUNCTION has_permission(user_id UUID, resource VARCHAR, action VARCHAR)
RETURNS BOOLEAN AS $$
DECLARE
    has_perm BOOLEAN;
BEGIN
    SELECT EXISTS(
        SELECT 1 FROM rbac.user_roles ur
        INNER JOIN rbac.role_permissions rp ON ur.role_id = rp.role_id
        INNER JOIN rbac.permissions p ON rp.permission_id = p.id
        WHERE ur.user_id = user_id
        AND p.resource = resource
        AND p.action = action
        AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
    ) INTO has_perm;
    RETURN has_perm;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## Triggers

```sql
-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to relevant tables
CREATE TRIGGER update_auth_users_updated_at BEFORE UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_rbac_roles_updated_at BEFORE UPDATE ON rbac.roles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_tenant_tenants_updated_at BEFORE UPDATE ON tenant.tenants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Audit log trigger
CREATE OR REPLACE FUNCTION log_audit()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit.logs (user_id, action, resource_type, resource_id, changes)
        VALUES (NEW.created_by, 'create', TG_TABLE_NAME, NEW.id, to_jsonb(NEW));
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit.logs (user_id, action, resource_type, resource_id, changes)
        VALUES (NEW.updated_by, 'update', TG_TABLE_NAME, NEW.id, jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW)));
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit.logs (user_id, action, resource_type, resource_id, changes)
        VALUES (NEW.deleted_by, 'delete', TG_TABLE_NAME, NEW.id, to_jsonb(OLD));
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;
```

---

## Database Extensions

```sql
-- Required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";
CREATE EXTENSION IF NOT EXISTS "btree_gist";
```

---

## Partitioning Strategy

```sql
-- Partition audit logs by month (example)
CREATE TABLE audit.logs_partitioned (
    LIKE audit.logs INCLUDING ALL
) PARTITION BY RANGE (created_at);

-- Create partitions
CREATE TABLE audit.logs_2026_01 PARTITION OF audit.logs_partitioned
    FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');

CREATE TABLE audit.logs_2026_02 PARTITION OF audit.logs_partitioned
    FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');

-- Function to create monthly partitions automatically
CREATE OR REPLACE FUNCTION create_monthly_partition()
RETURNS VOID AS $$
DECLARE
    start_date DATE;
    end_date DATE;
    partition_name TEXT;
BEGIN
    start_date := date_trunc('month', NOW() + INTERVAL '1 month');
    end_date := start_date + INTERVAL '1 month';
    partition_name := 'audit.logs_' || to_char(start_date, 'YYYY_MM');
    
    EXECUTE format(
        'CREATE TABLE IF NOT EXISTS %I PARTITION OF audit.logs_partitioned FOR VALUES FROM (%L) TO (%L)',
        partition_name, start_date, end_date
    );
END;
$$ LANGUAGE plpgsql;
```

---

## Connection Pooling

Recommended configuration for production:

```ini
max_connections = 200
shared_buffers = 4GB
effective_cache_size = 12GB
maintenance_work_mem = 1GB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
work_mem = 16MB
min_wal_size = 2GB
max_wal_size = 8GB
```

---

## Backup Strategy

- **Full backups:** Daily at 2 AM UTC
- **WAL archiving:** Continuous
- **Retention:** 30 days for daily backups, 90 days for weekly backups
- **Off-site:** Replicate to secondary region

---

## Migration Strategy

1. Version control all schema changes
2. Use database migration tool (Flyway or Liquibase)
3. All migrations must be reversible
4. Test migrations on staging before production
5. Maintain backward compatibility for at least 2 versions

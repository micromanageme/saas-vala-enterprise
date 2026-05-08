# SaaS Vala Enterprise - Franchises End-to-End Audit

**Audit Date:** 2026-05-07  
**Scope:** Complete Franchises system audit (Frontend → API → Database → RBAC)  
**Status:** ❌ CRITICAL ISSUE FOUND

---

## Executive Summary

**Franchise System Status:** ❌ **MISSING DATABASE MODEL**  
**Critical Issue:** Franchise model does not exist in Prisma schema  
**RBAC:** ✅ Properly configured  
**Frontend:** ✅ Production ready  
**API:** ⚠️ Returns mock data (cannot use database - model missing)

---

## Component Audit

### 1. Frontend Route: `/franchises` ✅
**File:** `src/routes/franchises.tsx`  
**Status:** ✅ PRODUCTION READY

**Implementation:**
- Uses TanStack Query for data fetching
- Proper loading and error states
- Dynamic KPI display with deltas
- Table rows mapped from API data
- Consistent with other module patterns

**Data Fetching:**
```typescript
const { data: franchisesData, isLoading, error } = useQuery({
  queryKey: ["franchises"],
  queryFn: async () => {
    const response = await fetch("/api/franchises?type=all");
    if (!response.ok) throw new Error("Failed to fetch Franchises data");
    return response.json();
  },
});
```

**KPIs Displayed:**
- Franchises count
- Locations count
- Royalties
- Open tickets

**Table Columns:**
- Franchisee name
- Region
- Locations
- Status

---

### 2. API Endpoint: `/api/franchises` ⚠️
**File:** `src/routes/api/franchises.ts`  
**Status:** ⚠️ **USES MOCK DATA** - Cannot use database (model missing)

**Current Implementation:**
- ✅ Authentication via AuthMiddleware
- ✅ Logging via Logger
- ✅ Type parameter support (all, kpis, franchises, regions)
- ✅ Consistent response structure
- ❌ **Returns hardcoded mock data**
- ❌ **Cannot query database - Franchise model missing from schema**

**Mock Data Being Returned:**
```typescript
data.kpis = {
  franchises: 64,
  locations: 148,
  royalties: 248000,
  openTickets: 12,
  // deltas...
};

data.franchises = [
  { id: 'FRN-001', name: 'Vala East', region: 'East', locations: 24, ... },
  // more mock data...
];

data.regions = [
  { region: 'East', franchises: 12, locations: 38, revenue: 89000 },
  // more mock data...
];
```

---

### 3. Database Schema ❌
**File:** `prisma/schema.prisma`  
**Status:** ❌ **FRACTURE MODEL DOES NOT EXIST**

**Issue:** No Franchise model found in Prisma schema  
**Impact:** Cannot store or retrieve franchise data from database

**Required Model Structure:**
```prisma
model Franchise {
  id            String   @id @default(uuid())
  userId        String   @unique
  code          String   @unique
  name          String
  region        String
  locations     Int      @default(0)
  status        FranchiseStatus @default(PENDING)
  joinedDate    DateTime @default(now())
  royaltyRate   Decimal  @default(0)
  metadata      Json?
  
  // Relations
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  locations     FranchiseLocation[]
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@index([code])
  @@index([status])
  @@index([region])
  @@map("franchises")
}

model FranchiseLocation {
  id           String   @id @default(uuid())
  franchiseId  String
  name         String
  address      String
  city         String
  state        String
  country      String
  postalCode   String
  status       LocationStatus @default(ACTIVE)
  metadata     Json?
  
  // Relations
  franchise    Franchise @relation(fields: [franchiseId], references: [id], onDelete: Cascade)
  
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  @@index([franchiseId])
  @@index([status])
  @@map("franchise_locations")
}

enum FranchiseStatus {
  PENDING
  ACTIVE
  SUSPENDED
  TERMINATED
}

enum LocationStatus {
  ACTIVE
  INACTIVE
  CLOSED
}
```

---

### 4. RBAC Permissions ✅
**Files:** 
- `src/lib/rbac/permissions.ts`
- `src/lib/rbac/module-permissions.ts`
- `src/lib/rbac/rbac.ts`

**Permissions Defined:**
```typescript
FRANCHISES: {
  VIEW: 'franchises.view',
  CREATE: 'franchises.create',
  EDIT: 'franchises.edit',
  DELETE: 'franchises.delete',
}
```

**Roles with Access:**
- ✅ `super_admin` - Full access
- ✅ `erp_admin` - Full access
- ✅ `admin` - Full access
- ✅ `sales_manager` - View access
- ✅ `sales` - View access
- ✅ `reseller` - View access

**Route Guarding:**
```typescript
'/franchises': [PERMISSIONS.FRANCHISES.VIEW]
```

**Status:** ✅ PROPERLY CONFIGURED

---

## Critical Issues Found

### ❌ Issue #1: Missing Franchise Database Model
**Severity:** CRITICAL  
**Location:** `prisma/schema.prisma`  
**Impact:** Cannot store or retrieve franchise data

**Current State:** No Franchise model exists in the database schema  
**Required Action:** Add Franchise and FranchiseLocation models to schema

### ⚠️ Issue #2: API Returns Mock Data
**Severity:** HIGH  
**Location:** `src/routes/api/franchises.ts`  
**Impact:** Franchise data is not dynamic

**Root Cause:** Cannot use database queries because model is missing

### ⚠️ Issue #3: No CRUD Endpoints
**Severity:** MEDIUM  
**Location:** API routes  
**Impact:** Cannot create, update, or delete franchises via API

**Current:** Only GET endpoint exists  
**Required:** POST, PUT, DELETE endpoints for franchise management

---

## Recommendations

### CRITICAL - Must Fix Before Production
1. **Add Franchise model to Prisma schema** - Required for any functionality
2. **Run database migration** - Create tables
3. **Replace API mock data with database queries**

### High Priority
4. **Add FranchiseLocation model** - Track franchise locations
5. **Implement CRUD endpoints** - Full franchise management
6. **Add royalty calculation logic** - Commission for franchises

### Medium Priority
7. **Add franchise approval workflow** - Use FranchiseStatus enum
8. **Implement region-based reporting** - Regional analytics
9. **Add franchise performance metrics** - KPI tracking per franchise

---

## Data Flow Verification

### Current Flow (Broken)
```
Frontend → API (mock) → Display ❌ (no database, model missing)
```

### Required Flow (After Fix)
```
Frontend → API (Prisma) → Database → Display ✅
                ↓
        AuthMiddleware
                ↓
            RBAC Check
```

---

## Security Audit

### Authentication ✅
- ✅ JWT token validation via AuthMiddleware
- ✅ User context extraction
- ✅ Error handling for missing auth

### Authorization ✅
- ✅ RBAC permission check
- ✅ Role-based access control
- ✅ Only authorized roles can view franchises

### Data Protection ✅
- ✅ No sensitive data in logs
- ✅ Proper error messages
- ✅ SQL injection protected via Prisma (when model exists)

---

## Conclusion

**Overall Status:** ❌ **CANNOT FUNCTION WITHOUT DATABASE MODEL**

**What Works:**
- ✅ Frontend route is production-ready
- ✅ RBAC permissions are properly configured
- ✅ Security is properly implemented

**What's Missing:**
- ❌ Franchise database model (CRITICAL)
- ❌ FranchiseLocation model (for tracking locations)
- ❌ Database integration in API
- ❌ CRUD endpoints

**Recommendation:** Must add Franchise model to Prisma schema before any functionality can work.

---

## Next Steps

1. ❌ Add Franchise model to Prisma schema
2. ❌ Add FranchiseLocation model to Prisma schema
3. ❌ Run database migration
4. ❌ Update API to use database queries
5. ❌ Add CRUD endpoints
6. ❌ Test end-to-end with real data

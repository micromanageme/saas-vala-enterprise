# SaaS Vala Enterprise - Backend Setup Guide

This guide will help you set up the enterprise backend foundation for SaaS Vala.

## Prerequisites

- Node.js 18+ installed
- A package manager (Bun, pnpm, Yarn, or npm)
- Supabase account with PostgreSQL database

## Quick Setup

### 1. Install Dependencies

Run the setup script to automatically detect your package manager and install dependencies:

**Windows (PowerShell):**
```powershell
.\setup-backend.ps1
```

**Or manually install:**

```bash
# Using Bun
bun add @prisma/client prisma jsonwebtoken bcryptjs zod @types/jsonwebtoken @types/bcryptjs better-sqlite3

# Using pnpm
pnpm add @prisma/client prisma jsonwebtoken bcryptjs zod @types/jsonwebtoken @types/bcryptjs better-sqlite3

# Using Yarn
yarn add @prisma/client prisma jsonwebtoken bcryptjs zod @types/jsonwebtoken @types/bcryptjs better-sqlite3

# Using npm
npm install @prisma/client prisma jsonwebtoken bcryptjs zod @types/jsonwebtoken @types/bcryptjs better-sqlite3
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

Update the following variables in `.env`:

```env
# Database - Supabase PostgreSQL
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@svdjnytyjdjvtfjcupnx.aws-0-us-east-1.pooler.supabase.com:6543/postgres"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@svdjnytyjdjvtfjcupnx.aws-0-us-east-1.pooler.supabase.com:5432/postgres"

# JWT Secrets (generate secure random strings)
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-min-32-chars"

# Session Secret
SESSION_SECRET="your-session-secret-min-32-chars"

# CSRF Secret
CSRF_SECRET="your-csrf-secret-min-32-chars"
```

### 3. Generate Prisma Client

```bash
bun run db:generate
# or
pnpm run db:generate
# or
yarn db:generate
# or
npm run db:generate
```

### 4. Run Database Migrations

```bash
bun run db:migrate --name init
# or
pnpm run db:migrate --name init
# or
yarn db:migrate --name init
# or
npm run db:migrate --name init
```

### 5. Seed the Database

```bash
bun run db:seed
# or
pnpm run db:seed
# or
yarn db:seed
# or
npm run db:seed
```

This will create:
- Default permissions for all modules
- 21 predefined roles (Super Admin, ERP Admin, Admin, Sales, CRM, HR, etc.)
- Default enterprise plan
- Default company
- Super admin user (admin@saasvala.com / Admin123!)
- System settings

### 6. Start Development Server

```bash
bun run dev
# or
pnpm run dev
# or
yarn dev
# or
npm run dev
```

## Database Management

### View Database with Prisma Studio

```bash
bun run db:studio
# or
pnpm run db:studio
# or
yarn db:studio
# or
npm run db:studio
```

### Reset Database

```bash
bun run db:reset
# or
pnpm run db:reset
# or
yarn db:reset
# or
npm run db:reset
```

### Push Schema Changes (Development Only)

```bash
bun run db:push
# or
pnpm run db:push
# or
yarn db:push
# or
npm run db:push
```

## Backend Architecture

### Database Schema

The enterprise schema includes:

- **Identity & Auth**: Users, Roles, Permissions, Sessions, Devices
- **Multi-tenancy**: Companies, Branches, Workspaces
- **Billing**: Plans, Subscriptions, Wallets, Transactions
- **Products**: Products, Licenses, Downloads
- **Partners**: Resellers, Affiliates
- **Support**: Support Tickets
- **Audit & Observability**: Audit Logs, Activities, Notifications, API Keys, Settings

### Authentication System

- JWT-based authentication with access and refresh tokens
- Multi-device session management
- Session invalidation and timeout
- Password hashing with bcrypt
- Failed login attempt tracking with account lockout
- Device fingerprinting support

### RBAC Engine

- Dynamic role-based access control
- Permission matrix engine
- Role hierarchy support
- Multi-role support
- Permission caching for performance
- Route and API guards
- Sidebar permission filtering

### API Foundation

- RESTful API with TanStack Start
- Structured error responses
- Request validation with Zod
- Middleware pipeline
- Rate limiting
- Security headers
- Request tracing with correlation IDs

### Security

- CSRF protection
- XSS protection
- SQL injection protection
- Rate limiting
- Input sanitization
- Security event logging
- Audit trail

### Observability

- Structured logging
- Correlation ID tracking
- Request tracing
- Audit logging
- Error tracking
- Health checks

## Default Credentials

After seeding the database, you can login with:

```
Email: admin@saasvala.com
Password: Admin123!
```

**Important:** Change this password in production!

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token

### RBAC

- Protected routes require JWT authentication
- Permission-based access control
- Role-based access control

## Project Structure

```
src/
├── lib/
│   ├── auth/              # Authentication services
│   │   ├── jwt.ts         # JWT token management
│   │   ├── password.ts    # Password hashing/validation
│   │   └── session.ts     # Session management
│   ├── rbac/              # RBAC engine
│   │   ├── permissions.ts # Permission definitions
│   │   └── rbac.ts        # RBAC service
│   ├── middleware/        # Middleware
│   │   ├── auth.ts        # Authentication middleware
│   │   └── security.ts    # Security middleware
│   ├── audit.ts           # Audit logging
│   ├── db.ts              # Prisma client
│   ├── env.ts             # Environment configuration
│   ├── logger.ts          # Structured logging
│   └── role-switch.ts     # Role switch/impersonation
├── routes/
│   └── api/
│       └── auth/          # Auth API routes
prisma/
├── schema.prisma          # Database schema
└── seed.ts                # Database seed
```

## Troubleshooting

### Prisma Client Not Found

After installing dependencies, run:
```bash
bun run db:generate
```

### Database Connection Errors

Check your `.env` file and ensure:
- DATABASE_URL is correct
- Your Supabase project is active
- Your database password is correct

### Migration Errors

If migrations fail, you can reset the database:
```bash
bun run db:reset
```

### TypeScript Errors

Ensure all dependencies are installed:
```bash
bun install
```

## Production Deployment

1. Set strong, random secrets for:
   - JWT_SECRET
   - JWT_REFRESH_SECRET
   - SESSION_SECRET
   - CSRF_SECRET

2. Enable SSL/TLS for all database connections

3. Set up proper backup strategy for PostgreSQL

4. Configure rate limiting appropriately

5. Enable audit logging

6. Set up monitoring and alerting

7. Configure CORS for your domain

8. Review and update security headers

## Support

For issues or questions, refer to:
- Prisma documentation: https://www.prisma.io/docs
- Supabase documentation: https://supabase.com/docs
- TanStack Start documentation: https://tanstack.com/start/latest

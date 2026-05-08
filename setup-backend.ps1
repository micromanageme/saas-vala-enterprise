# SaaS Vala Enterprise - Backend Setup Script
# Enterprise backend dependency installation and setup

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SaaS Vala Enterprise - Backend Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check for package managers
$packageManager = $null

if (Get-Command bun -ErrorAction SilentlyContinue) {
    $packageManager = "bun"
    Write-Host "✅ Detected Bun package manager" -ForegroundColor Green
} elseif (Get-Command pnpm -ErrorAction SilentlyContinue) {
    $packageManager = "pnpm"
    Write-Host "✅ Detected pnpm package manager" -ForegroundColor Green
} elseif (Get-Command yarn -ErrorAction SilentlyContinue) {
    $packageManager = "yarn"
    Write-Host "✅ Detected Yarn package manager" -ForegroundColor Green
} elseif (Get-Command npm -ErrorAction SilentlyContinue) {
    $packageManager = "npm"
    Write-Host "✅ Detected npm package manager" -ForegroundColor Green
} else {
    Write-Host "❌ No package manager found!" -ForegroundColor Red
    Write-Host "Please install one of the following:" -ForegroundColor Yellow
    Write-Host "  - Bun: https://bun.sh" -ForegroundColor White
    Write-Host "  - pnpm: https://pnpm.io" -ForegroundColor White
    Write-Host "  - Yarn: https://yarnpkg.com" -ForegroundColor White
    Write-Host "  - npm: https://docs.npmjs.com" -ForegroundColor White
    exit 1
}

Write-Host ""

# Install dependencies
Write-Host "📦 Installing backend dependencies..." -ForegroundColor Cyan
Write-Host ""

$dependencies = @(
    "@prisma/client",
    "prisma",
    "jsonwebtoken",
    "bcryptjs",
    "zod",
    "@types/jsonwebtoken",
    "@types/bcryptjs",
    "better-sqlite3"
)

try {
    switch ($packageManager) {
        "bun" {
            bun add $dependencies
        }
        "pnpm" {
            pnpm add $dependencies
        }
        "yarn" {
            yarn add $dependencies
        }
        "npm" {
            npm install $dependencies
        }
    }
    Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

Write-Host ""

# Generate Prisma client
Write-Host "🔧 Generating Prisma client..." -ForegroundColor Cyan
try {
    switch ($packageManager) {
        "bun" {
            bun run prisma generate
        }
        "pnpm" {
            pnpm run prisma generate
        }
        "yarn" {
            yarn run prisma generate
        }
        "npm" {
            npx prisma generate
        }
    }
    Write-Host "✅ Prisma client generated" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to generate Prisma client" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

Write-Host ""

# Check if .env exists
if (-not (Test-Path .env)) {
    Write-Host "⚠️  .env file not found" -ForegroundColor Yellow
    Write-Host "Please create .env file with your Supabase credentials" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Required environment variables:" -ForegroundColor Cyan
    Write-Host "  DATABASE_URL - Your Supabase PostgreSQL connection string" -ForegroundColor White
    Write-Host "  DIRECT_URL - Your Supabase direct connection string" -ForegroundColor White
    Write-Host "  JWT_SECRET - Your JWT secret (min 32 characters)" -ForegroundColor White
    Write-Host "  JWT_REFRESH_SECRET - Your JWT refresh secret (min 32 characters)" -ForegroundColor White
    Write-Host "  SESSION_SECRET - Your session secret (min 32 characters)" -ForegroundColor White
    Write-Host "  CSRF_SECRET - Your CSRF secret (min 32 characters)" -ForegroundColor White
    Write-Host ""
    Write-Host "Copy .env.example to .env and fill in your values" -ForegroundColor Yellow
} else {
    Write-Host "✅ .env file found" -ForegroundColor Green
}

Write-Host ""

# Instructions for database setup
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Next Steps" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Update .env with your Supabase credentials" -ForegroundColor Yellow
Write-Host "2. Run database migrations:" -ForegroundColor Yellow
Write-Host "   $packageManager run prisma migrate dev --name init" -ForegroundColor White
Write-Host ""
Write-Host "3. Seed the database:" -ForegroundColor Yellow
Write-Host "   $packageManager run prisma db seed" -ForegroundColor White
Write-Host ""
Write-Host "4. Start the development server:" -ForegroundColor Yellow
Write-Host "   $packageManager run dev" -ForegroundColor White
Write-Host ""
Write-Host "Default admin credentials:" -ForegroundColor Green
Write-Host "  Email: admin@saasvala.com" -ForegroundColor White
Write-Host "  Password: Admin123!" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan

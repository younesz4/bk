# PostgreSQL Setup Script for Windows PowerShell
# This script helps you set up PostgreSQL connection and test it

Write-Host "🗄️  PostgreSQL Setup Helper" -ForegroundColor Cyan
Write-Host ""

# Check if DATABASE_URL is set
if ($env:DATABASE_URL) {
    Write-Host "✅ DATABASE_URL is already set" -ForegroundColor Green
    Write-Host "Current value: $($env:DATABASE_URL.Substring(0, [Math]::Min(50, $env:DATABASE_URL.Length)))..." -ForegroundColor Gray
    Write-Host ""
} else {
    Write-Host "⚠️  DATABASE_URL is not set" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please set your PostgreSQL connection string:" -ForegroundColor Yellow
    Write-Host "  Example: postgresql://user:password@host:5432/database" -ForegroundColor Gray
    Write-Host ""
    
    $dbUrl = Read-Host "Enter your DATABASE_URL"
    if ($dbUrl) {
        $env:DATABASE_URL = $dbUrl
        Write-Host "✅ DATABASE_URL set for this session" -ForegroundColor Green
        Write-Host ""
    }
}

# Check if Prisma is installed
Write-Host "Checking Prisma installation..." -ForegroundColor Cyan
try {
    $prismaVersion = npx prisma --version 2>&1
    Write-Host "✅ Prisma is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Prisma not found. Installing..." -ForegroundColor Red
    npm install prisma @prisma/client
}

Write-Host ""

# Menu
Write-Host "What would you like to do?" -ForegroundColor Cyan
Write-Host "1. Generate Prisma Client" -ForegroundColor White
Write-Host "2. Push schema to database (creates tables)" -ForegroundColor White
Write-Host "3. Run migrations" -ForegroundColor White
Write-Host "4. Open Prisma Studio (view/edit data)" -ForegroundColor White
Write-Host "5. Seed database (create admin user)" -ForegroundColor White
Write-Host "6. Test connection" -ForegroundColor White
Write-Host "0. Exit" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter your choice (0-6)"

switch ($choice) {
    "1" {
        Write-Host "Generating Prisma Client..." -ForegroundColor Cyan
        npx prisma generate
        Write-Host "✅ Done!" -ForegroundColor Green
    }
    "2" {
        Write-Host "Pushing schema to database..." -ForegroundColor Cyan
        Write-Host "⚠️  This will create all tables in your database" -ForegroundColor Yellow
        $confirm = Read-Host "Continue? (y/n)"
        if ($confirm -eq "y") {
            npx prisma db push
            Write-Host "✅ Done!" -ForegroundColor Green
        }
    }
    "3" {
        Write-Host "Running migrations..." -ForegroundColor Cyan
        npx prisma migrate deploy
        Write-Host "✅ Done!" -ForegroundColor Green
    }
    "4" {
        Write-Host "Opening Prisma Studio..." -ForegroundColor Cyan
        Write-Host "This will open in your browser at http://localhost:5555" -ForegroundColor Gray
        Start-Process "http://localhost:5555"
        npx prisma studio
    }
    "5" {
        Write-Host "Seeding database..." -ForegroundColor Cyan
        npx prisma db seed
        Write-Host "✅ Done! Admin user created:" -ForegroundColor Green
        Write-Host "   Email: admin@bk-agencements.com" -ForegroundColor Gray
        Write-Host "   Password: AdminPassword123!" -ForegroundColor Gray
        Write-Host "   ⚠️  Change this password after first login!" -ForegroundColor Yellow
    }
    "6" {
        Write-Host "Testing database connection..." -ForegroundColor Cyan
        try {
            npx prisma db pull --schema=prisma/schema.prisma 2>&1 | Out-Null
            Write-Host "✅ Connection successful!" -ForegroundColor Green
        } catch {
            Write-Host "❌ Connection failed. Check your DATABASE_URL" -ForegroundColor Red
        }
    }
    "0" {
        Write-Host "Goodbye!" -ForegroundColor Cyan
        exit
    }
    default {
        Write-Host "Invalid choice" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "💡 Tip: Set DATABASE_URL permanently in your .env file" -ForegroundColor Yellow
Write-Host "   Or set it in Vercel dashboard for production" -ForegroundColor Yellow


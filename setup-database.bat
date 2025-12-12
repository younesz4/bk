@echo off
echo ========================================
echo Database Setup for BK Agencements
echo ========================================
echo.

echo Step 1: Generating Prisma Client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Prisma generate failed!
    echo.
    echo This is usually a Windows file permission issue.
    echo Please try:
    echo   1. Close VS Code completely
    echo   2. Close all terminals
    echo   3. Run this script as Administrator
    echo   4. Or restart your computer and try again
    echo.
    pause
    exit /b 1
)

echo.
echo Step 2: Creating database and tables...
call npx prisma migrate dev --name add_products
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Migration failed!
    echo Check the error message above.
    pause
    exit /b 1
)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo   1. Open Prisma Studio: npx prisma studio
echo   2. Add categories and products
echo   3. Visit http://localhost:3000/boutique
echo.
pause


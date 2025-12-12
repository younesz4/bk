# Luxury Furniture E-commerce & Interior Design Portfolio

A Next.js 16 project with App Router, Prisma, and TailwindCSS for a luxury furniture e-commerce and interior design portfolio website.

## Features

- **Home Page**: Hero section, category showcase, featured products, and projects
- **Shop Page**: Product catalog with category filtering
- **Product Detail Pages**: Full product information with image galleries
- **Projects Page**: Portfolio of interior design projects
- **Project Detail Pages**: Detailed project showcases with image galleries
- **About Page**: Studio philosophy and mission
- **Contact Page**: Contact form and information
- **Admin Dashboard**: Product and order management
- **E-commerce**: Shopping cart, checkout, and order processing

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- TailwindCSS
- React 18
- Prisma (PostgreSQL)
- Stripe (Payments)
- Vercel (Hosting)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp env.template .env
# Edit .env with your configuration
```

3. Set up the database:
```bash
npm run db:setup
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

### Quick Deploy

1. **Install Git** (if not installed):
   - Download from: https://git-scm.com/download/win
   - Or use GitHub Desktop: https://desktop.github.com/

2. **Initialize Git repository**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

3. **Create GitHub repository**:
   - Go to https://github.com/new
   - Create a new repository (public or private)
   - Copy the repository URL

4. **Push to GitHub**:
   ```bash
   git remote add origin <your-repo-url>
   git branch -M main
   git push -u origin main
   ```

5. **Deploy to Vercel**:
   - Go to https://vercel.com
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings
   - Add environment variables in Vercel dashboard
   - Deploy!

### Environment Variables for Vercel

Add these in Vercel Dashboard → Settings → Environment Variables:

- `DATABASE_URL` - PostgreSQL connection string
- `ADMIN_EMAIL` - Admin login email
- `ADMIN_PASSWORD` - Admin login password
- `ADMIN_SESSION_SECRET` - Random secret for sessions
- `NEXT_PUBLIC_BASE_URL` - Your Vercel deployment URL
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` - Email configuration
- `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` - Stripe keys (if using payments)

### Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

## Project Structure

```
/app
  /api - API routes (App Router)
  /(routes) - All page routes
/components
  - Reusable UI components
/lib
  - prisma.ts - Prisma client instance
  - Database utilities
/prisma
  - schema.prisma - Database schema
  - seed.ts - Database seeding script
/styles
  - globals.css - Global styles and Tailwind directives
```

## Database Setup

1. Create a PostgreSQL database (Vercel Postgres, Supabase, or any PostgreSQL provider)
2. Update `DATABASE_URL` in `.env`
3. Run migrations:
   ```bash
   npm run prisma:migrate:deploy
   ```
4. Seed the database (optional):
   ```bash
   npm run prisma:seed
   ```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

## License

Private project - All rights reserved

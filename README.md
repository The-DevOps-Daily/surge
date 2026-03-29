# SaaS Starter Kit

Production-ready SaaS starter kit built with Next.js 14+, TypeScript, Tailwind CSS, Prisma, NextAuth, and Stripe.

## What's Included

### Authentication
- Email/password login with NextAuth
- Registration with toggle (REGISTRATION_ENABLED env var)
- Forgot password flow
- Password change in settings
- Account deletion with confirmation
- Rate limiting on auth endpoints

### Payments (Stripe)
- Checkout sessions for Pro/Team tiers
- Customer portal for subscription management
- Webhooks: checkout.session.completed, subscription.updated, subscription.deleted, invoice.payment_failed, invoice.payment_succeeded
- Tier-based feature gating
- Upgrade prompts when limits are hit

### Marketing
- Landing page with hero, features, testimonials, pricing, newsletter capture
- Blog engine (markdown files with frontmatter)
- Free tools template (public pages that drive signups)
- Comparison page template
- SEO: sitemap, robots.txt, JSON-LD, OG images, Twitter cards
- Terms of Service and Privacy Policy

### App Features
- Dark/light theme toggle
- Multi-currency support
- Email notifications (Resend)
- Data export (CSV/JSON)
- PWA support (installable)

### Infrastructure
- Docker + Docker Compose (app + PostgreSQL + Nginx + Certbot)
- GitHub Actions CI/CD (test, build, deploy on push to main)
- Server setup script for DigitalOcean

### UI Components
- Premium dark glassmorphism theme
- Mobile-first responsive design
- Bottom nav (mobile) + sidebar (desktop)
- Cards, buttons, inputs, modals, toasts, loading buttons, confirm dialogs

## Quick Start

```bash
# Clone
git clone <repo-url> my-saas-app
cd my-saas-app

# Install
bun install

# Set up database
cp .env.example .env
bunx prisma migrate dev --name init
bunx prisma db seed

# Run
bun run dev
```

## Customization Guide

### 1. Update branding
- Edit `src/app/layout.tsx` (title, description)
- Replace favicon in `public/`
- Update landing page content in `src/app/landing/page.tsx`
- Update `public/manifest.json`

### 2. Add your data models
- Edit `prisma/schema.prisma`
- Run `bunx prisma migrate dev --name your-change`

### 3. Create API routes
- Add routes in `src/app/api/your-feature/`
- Follow existing patterns for auth checks and validation

### 4. Build your pages
- Add pages in `src/app/(app)/your-page/`
- Add nav items in `src/components/layout/sidebar.tsx` and `mobile-nav.tsx`

### 5. Set up Stripe
- Create products/prices in Stripe dashboard
- Add price IDs to `.env`
- Test with Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe/webhook`

### 6. Deploy
- Create a DigitalOcean droplet
- Run `scripts/setup-server.sh`
- Push to GitHub with deploy secrets configured

## Tech Stack
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Prisma + SQLite (dev) / PostgreSQL (prod)
- NextAuth v5
- Stripe
- Recharts
- Resend
- Vitest

## Project Structure
```
src/
  app/
    (app)/          # Authenticated pages
    (marketing)/    # Public pages (blog, tools, legal)
    api/            # API routes
    landing/        # Landing page
    login/          # Auth pages
  components/
    layout/         # Sidebar, mobile nav, app shell
    ui/             # Reusable UI components
    blog/           # Blog components
  lib/              # Utilities, auth, Stripe, email
prisma/             # Database schema and migrations
content/
  blog/             # Markdown blog posts
```

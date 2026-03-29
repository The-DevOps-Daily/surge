# :rocket: SaaS Starter Kit

**Ship your SaaS in days, not months.**

A production-ready starter kit with authentication, Stripe payments, admin dashboard, blog engine, and more. Built with Next.js 14+, TypeScript, Tailwind CSS, and a premium dark glassmorphism UI.

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3+-38bdf8.svg)](https://tailwindcss.com/)

> **Add a screenshot:** Place a screenshot of the dashboard at `public/screenshot.png` and uncomment the image below.
> <!-- ![Dashboard Screenshot](public/screenshot.png) -->

---

## Features

### :lock: Authentication
- Email/password login with NextAuth v5
- User registration with toggle (`REGISTRATION_ENABLED`)
- Forgot password and reset flow
- Password change in settings
- Account deletion with confirmation dialog
- Rate limiting on auth endpoints

### :credit_card: Stripe Payments
- Checkout sessions for Pro and Team tiers
- Customer portal for subscription management
- Webhook handling (checkout completed, subscription updated/deleted, invoice paid/failed)
- Tier-based feature gating with upgrade prompts
- Configurable pricing via environment variables

### :crown: Admin Dashboard
- Overview with user stats, MRR, and growth charts
- User management (search, filter, role/tier changes, disable accounts)
- Blog content inventory
- System health monitoring (database, Stripe, email, registration status)
- Environment variable audit

### :pencil: Blog Engine
- Markdown files with frontmatter metadata
- Reading progress bar
- Auto-generated table of contents
- Social share buttons
- OG image generation
- Tag-based organization

### :art: Premium UI
- Dark glassmorphism design system
- Mobile-first responsive layout
- Bottom nav (mobile) + sidebar (desktop)
- Dark/light theme toggle
- PWA support (installable on mobile)
- Smooth animations and transitions

### :package: Infrastructure
- Docker + Docker Compose (app + PostgreSQL + Nginx + Certbot SSL)
- GitHub Actions CI/CD (test, build, deploy on push to main)
- Server setup script for DigitalOcean
- 135+ tests with Vitest
- SQLite (dev) / PostgreSQL (prod)

---

## Quick Start

### Prerequisites

- [Bun](https://bun.sh/) (or Node.js 18+)
- [Stripe CLI](https://stripe.com/docs/stripe-cli) (for webhook testing)

### Setup

```bash
# 1. Clone the repository
git clone <your-repo-url> my-saas-app
cd my-saas-app

# 2. Install dependencies
bun install

# 3. Configure environment
cp .env.example .env
# Edit .env with your values (see Environment Variables below)

# 4. Set up database
bunx prisma migrate dev --name init
bunx prisma db seed

# 5. Start development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) and log in with the seed user credentials.

### Stripe Webhook Testing

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

---

## Customization Guide

### 1. Update Branding

- Edit `src/app/layout.tsx` for title and description
- Replace favicon in `public/`
- Update `public/manifest.json` for PWA name and colors
- Customize the landing page in `src/app/landing/page.tsx`

### 2. Add Your Data Models

```bash
# Edit the schema
vi prisma/schema.prisma

# Create and apply migration
bunx prisma migrate dev --name add-your-model
```

### 3. Create API Routes

Add routes in `src/app/api/your-feature/route.ts`. Follow existing patterns for auth checks:

```typescript
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  // Your logic here
}
```

### 4. Build Your Pages

Add pages in `src/app/(app)/your-page/page.tsx` and register nav items in:
- `src/components/layout/sidebar.tsx` (desktop)
- `src/components/layout/mobile-nav.tsx` (mobile)

### 5. Add Blog Posts

Create markdown files in `content/blog/` with frontmatter:

```markdown
---
title: "Your Post Title"
excerpt: "A short description"
date: "2024-01-15"
author: "Your Name"
tags: ["tag1", "tag2"]
coverEmoji: "🚀"
---

Your content here...
```

---

## Project Structure

```
src/
  app/
    (admin)/        # Admin dashboard (role-gated)
    (app)/          # Authenticated app pages
    (marketing)/    # Public pages (blog, tools, legal)
    api/            # API routes
      admin/        # Admin API endpoints
      auth/         # NextAuth routes
      stripe/       # Stripe webhook + checkout
    landing/        # Landing page
    login/          # Login page
    register/       # Registration page
    forgot-password/
    reset-password/
  components/
    admin/          # Admin sidebar and mobile nav
    layout/         # App shell, sidebar, mobile nav
    ui/             # Reusable UI components (buttons, cards, modals, etc.)
    blog/           # Blog components (progress bar, TOC, share)
  lib/              # Utilities (auth, prisma, stripe, email, rate-limit)
prisma/             # Database schema, migrations, seed
content/
  blog/             # Markdown blog posts
public/             # Static assets, manifest, favicon
scripts/            # Server setup and deployment scripts
docker/             # Docker and Nginx configuration
.github/
  workflows/        # CI/CD pipeline
```

---

## Tech Stack

| Category       | Technology                          |
|----------------|-------------------------------------|
| Framework      | Next.js 14+ (App Router)            |
| Language       | TypeScript                          |
| Styling        | Tailwind CSS                        |
| Database       | Prisma + SQLite (dev) / PostgreSQL  |
| Authentication | NextAuth v5                         |
| Payments       | Stripe                              |
| Email          | Resend                              |
| Charts         | Recharts                            |
| Testing        | Vitest                              |
| Containerization | Docker + Docker Compose           |
| CI/CD          | GitHub Actions                      |
| Web Server     | Nginx + Certbot (SSL)               |

---

## Environment Variables

| Variable                          | Description                              | Required |
|-----------------------------------|------------------------------------------|----------|
| `DATABASE_URL`                    | Database connection string               | Yes      |
| `NEXTAUTH_SECRET`                 | Random string for session encryption     | Yes      |
| `NEXTAUTH_URL`                    | Your app URL (e.g., http://localhost:3000)| Yes      |
| `AUTH_TRUST_HOST`                 | Set to `true` for production             | Yes      |
| `REGISTRATION_ENABLED`           | `true` or `false` to toggle signups      | No       |
| `STRIPE_SECRET_KEY`               | Stripe secret key                        | For payments |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key                | For payments |
| `STRIPE_WEBHOOK_SECRET`           | Stripe webhook signing secret            | For payments |
| `STRIPE_PRO_PRICE_ID`             | Stripe price ID for Pro tier             | For payments |
| `STRIPE_FAMILY_PRICE_ID`          | Stripe price ID for Family tier          | For payments |
| `RESEND_API_KEY`                  | Resend API key for emails                | For emails |
| `NEXT_PUBLIC_ANALYTICS_ID`        | Analytics tracking ID                    | No       |

---

## Deployment

### DigitalOcean Droplet

1. **Create a droplet** with Ubuntu 22.04+ (minimum 1 GB RAM)

2. **Run the setup script:**
   ```bash
   scp scripts/setup-server.sh root@your-server:/root/
   ssh root@your-server
   bash setup-server.sh
   ```

3. **Configure GitHub secrets** for CI/CD:
   - `SERVER_HOST` - Your server IP
   - `SERVER_USER` - SSH user
   - `SERVER_SSH_KEY` - SSH private key

4. **Push to main** to trigger automatic deployment:
   ```bash
   git push origin main
   ```

The GitHub Actions workflow will build, test, and deploy your app automatically.

### Docker (Manual)

```bash
docker compose up -d
```

This starts the app, PostgreSQL, Nginx, and Certbot for SSL.

---

## Testing

```bash
# Run all tests
bun run test

# Run with coverage
bun run test -- --coverage

# Run in watch mode
bun run test -- --watch
```

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "feat: add your feature"`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

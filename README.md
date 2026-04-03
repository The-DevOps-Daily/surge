# Surge

**Ship your SaaS in days, not months.**

Surge is a production-ready Next.js SaaS starter kit with authentication, payments, an admin dashboard, a blog engine, and a premium dark glassmorphism UI. Clone it, configure it, and start building your product.

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3+-38bdf8.svg)](https://tailwindcss.com/)

---

## ✨ Features

- **Authentication** - NextAuth v5 with credentials provider, JWT sessions, registration toggle, forgot/reset password, account deletion, and rate limiting
- **Stripe Payments** - Checkout sessions, customer portal, webhook handling, tier-based feature gating, and configurable pricing
- **Admin Dashboard** - User stats, MRR tracking, growth charts, user management, blog content inventory, and system health monitoring
- **Blog Engine** - Markdown with frontmatter, reading progress bar, table of contents, social sharing, OG image generation, and tag organization
- **Dark Glassmorphism Theme** - Premium dark UI with mobile-first responsive layout, bottom nav (mobile) + sidebar (desktop), and dark/light toggle
- **Prisma ORM** - SQLite for local development, PostgreSQL for production, with migrations and seed data
- **Docker Ready** - Docker Compose setup with PostgreSQL, Nginx, and Certbot SSL out of the box
- **CI/CD** - GitHub Actions workflows for testing, building, and deploying on push to main
- **Testing** - 135+ tests with Vitest
- **PWA Support** - Installable on mobile devices

---

## 🧰 Tech Stack

| Category         | Technology                         |
|------------------|------------------------------------|
| Framework        | Next.js 14+ (App Router)           |
| Language         | TypeScript                         |
| Styling          | Tailwind CSS                       |
| Database         | Prisma + SQLite (dev) / PostgreSQL |
| Authentication   | NextAuth v5                        |
| Payments         | Stripe                             |
| Email            | Resend                             |
| Charts           | Recharts                           |
| Testing          | Vitest                             |
| Containerization | Docker + Docker Compose            |
| CI/CD            | GitHub Actions                     |
| Web Server       | Nginx + Certbot (SSL)              |

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ (or [Bun](https://bun.sh/))
- [Stripe CLI](https://stripe.com/docs/stripe-cli) (optional, for webhook testing)

### Setup

```bash
# Clone the repository
git clone https://github.com/The-DevOps-Daily/surge.git
cd surge

# Install dependencies
npm install
# or: bun install

# Configure environment
cp .env.example .env
# Edit .env with your values (see Environment Variables below)

# Set up the database
npx prisma migrate dev --name init
npx prisma db seed

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and log in with the seed credentials (`admin@example.com` / `changeme123`).

### Stripe Webhook Testing

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

---

## 🔐 Environment Variables

Copy `.env.example` to `.env` and fill in your values:

| Variable                             | Description                            | Required     |
|--------------------------------------|----------------------------------------|--------------|
| `DATABASE_URL`                       | Database connection string             | Yes          |
| `NEXTAUTH_SECRET`                    | Random string for session encryption   | Yes          |
| `NEXTAUTH_URL`                       | Your app URL                           | Yes          |
| `AUTH_TRUST_HOST`                    | Set to `true` for production           | Yes          |
| `REGISTRATION_ENABLED`              | `true` or `false` to toggle signups    | No           |
| `STRIPE_SECRET_KEY`                  | Stripe secret key                      | For payments |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key                 | For payments |
| `STRIPE_WEBHOOK_SECRET`             | Stripe webhook signing secret          | For payments |
| `STRIPE_PRO_PRICE_ID`               | Stripe price ID for Pro tier           | For payments |
| `STRIPE_FAMILY_PRICE_ID`            | Stripe price ID for Family tier        | For payments |
| `RESEND_API_KEY`                     | Resend API key for transactional email | For emails   |
| `NEXT_PUBLIC_ANALYTICS_ID`           | Analytics tracking ID                  | No           |

---

## 📁 Project Structure

```
src/
  app/
    (admin)/        # Admin dashboard (role-gated)
    (app)/          # Authenticated app pages
    (marketing)/    # Public pages (blog, tools, legal)
    api/            # API routes (auth, stripe, admin, user)
    landing/        # Landing page
    login/          # Login page
    register/       # Registration page
  components/
    admin/          # Admin sidebar and mobile nav
    layout/         # App shell, sidebar, mobile nav
    ui/             # Reusable UI components
    blog/           # Blog components (progress bar, TOC, share)
  lib/              # Utilities (auth, prisma, stripe, email, rate-limit)
prisma/             # Database schema, migrations, seed
content/blog/       # Markdown blog posts
public/             # Static assets, manifest, favicon
scripts/            # Server setup and deployment scripts
.github/workflows/  # CI/CD pipeline
```

---

## 🚢 Deployment

### Docker Compose

```bash
# Development (builds locally)
docker compose up -d

# Production (uses pre-built image)
docker compose -f docker-compose.prod.yml up -d
```

This starts the app, PostgreSQL, Nginx, and Certbot for SSL.

### DigitalOcean / VPS

1. Create a droplet with Ubuntu 22.04+ (minimum 1 GB RAM)
2. Run the setup script:
   ```bash
   scp scripts/setup-server.sh root@your-server:/root/
   ssh root@your-server bash setup-server.sh
   ```
3. Configure GitHub Actions secrets (`DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_SSH_KEY`)
4. Push to `main` to trigger automatic deployment

### Vercel

Deploy with one click or connect your GitHub repository. Set the environment variables in the Vercel dashboard and use a hosted PostgreSQL provider (e.g., Neon, Supabase) for the database.

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

Copyright 2026 [The DevOps Daily](https://github.com/The-DevOps-Daily)

# Surge

**An AI-first SaaS starter kit.**

Surge ships with Claude Code skills, auto-trigger subagents, an MCP server, an OpenAPI spec, `.md` content routes, an `llms.txt` index, and a comprehensive `CLAUDE.md` — so when you (or your AI agent) extend it, you spend prompts shipping features instead of rediscovering conventions.

Under the hood it's a production-ready Next.js 16 + Stripe + Prisma + NextAuth + smtpfa.st stack with auth, payments, admin, blog, docs, and a dark-mode-first design system. Clone it, customize it, ship.

[![License: MIT](https://img.shields.io/badge/License-MIT-18181b.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8.svg)](https://tailwindcss.com/)

---

## AI-first, what does that mean

Pure starter kits dump 10,000 lines on you and call it done. Three weeks later, when you ask Claude to add a feature, it burns 50k tokens grepping for the auth pattern, the design tokens, and the right primitive. Surge is built so that doesn't happen.

| Feature | What it does for you |
|---|---|
| [`CLAUDE.md`](./CLAUDE.md) | Conventions, primitives, helpers, rules — read automatically by every Claude session |
| [`AGENTS.md`](./AGENTS.md) | Same content, cross-tool format (Cursor, Aider, Continue, Codex) |
| `.claude/skills/` | Five invokable skills: `/customize`, `/add-page`, `/add-api-route`, `/add-stripe-tier`, `/add-email` |
| `.claude/agents/` | Three auto-trigger subagents: route-auditor, migration-reviewer, token-enforcer |
| `examples/` | Six canonical snippets the skills reference — no boilerplate re-derivation |
| `mcp/server.ts` | Local MCP server with read-only tools (`list_users`, `subscription_stats`, etc.) — query your app data in chat |
| `/api/openapi.json` | Auto-generated OpenAPI 3 spec so agents can introspect your API surface |
| `/llms.txt` + `/llms-full.txt` | AI-crawler link tree and full content bundle |
| `/blog/*.md`, `/docs/*.md` | Append `.md` to any URL for raw markdown — no HTML parsing |
| `robots.txt` | Explicit `Allow` for GPTBot, ClaudeBot, PerplexityBot, etc. |
| `docs/prompts/` | Prompt cookbook of proven recipes (add usage-based tier, OAuth, team seats, public API) |

The result: features that used to take a 30k-token back-and-forth become 3k-token one-shots.

---

## Quickstart

```bash
git clone https://github.com/The-DevOps-Daily/surge.git
cd surge
npm install
cp .env.example .env
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

Then, in Claude Code (in the same directory):

```
/customize
```

Walks you through making the starter yours — product name, pricing, branding, env vars. Done in a few minutes instead of a few hours.

For a one-shot brand-only pass: `/customize --quick`.

---

## What's in the box

### App surfaces
- **Authentication** — NextAuth v5 credentials, JWT sessions, rate-limited register/forgot/reset, password change, account delete
- **Stripe** — checkout, customer portal, webhook handler, tier-based feature gating, configurable pricing
- **Admin dashboard** — user stats, MRR, growth chart, user management, blog content inventory, system health
- **Blog engine** — markdown frontmatter, reading progress, TOC, share buttons, dynamic OG images, raw `.md` routes
- **Docs engine** — same engine pointed at `content/docs/`, with prev/next navigation
- **Dark-mode-first design system** — CSS-variable tokens, primitive components (Button, Input, Modal, ConfirmDialog, Toast), responsive
- **Email** — smtpfa.st, light-friendly transactional templates with a shared scaffold

### Stack
- Next.js 16 (App Router) · TypeScript · Tailwind 4 · Prisma + SQLite (dev) / Postgres (prod)
- NextAuth v5 · Stripe · smtpfa.st · Recharts · Vitest · Docker Compose · GitHub Actions

### MCP server

Connect the read-only MCP server and ask your AI client about your app state directly:

```bash
claude mcp add saas-starter -- npx tsx mcp/server.ts
```

Then in chat:
- "How many Pro subscribers do we have?"
- "Show me the last 5 signups."
- "What's MRR right now?"
- "Any paid users with expired tier?"

See [docs/mcp](/docs/mcp) for the full tool list.

---

## Environment

Copy `.env.example` to `.env` and fill in:

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | yes | SQLite `file:./dev.db` for local, Postgres URL for prod |
| `NEXTAUTH_SECRET` | yes | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | yes | `http://localhost:3000` locally |
| `AUTH_TRUST_HOST` | prod | `true` behind a proxy |
| `REGISTRATION_ENABLED` | optional | `true` (default) or `false` |
| `STRIPE_SECRET_KEY` | for payments | from Stripe dashboard |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | for payments | from Stripe dashboard |
| `STRIPE_WEBHOOK_SECRET` | for payments | from Stripe dashboard |
| `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID` | for payments | monthly Pro price |
| `NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID` | for payments | yearly Pro price |
| `NEXT_PUBLIC_STRIPE_FAMILY_PRICE_ID` | for payments | monthly Team price |
| `NEXT_PUBLIC_STRIPE_FAMILY_YEARLY_PRICE_ID` | for payments | yearly Team price |
| `SMTPFAST_API_KEY` | for email | from https://smtpfa.st/api-keys with `email:send` scope |
| `SMTPFAST_API_URL` | optional | defaults to `https://smtpfa.st`, override for staging/self-hosted |
| `SMTPFAST_FROM_EMAIL` | for email | `Your App <noreply@your-verified-domain.com>` |

---

## Project layout

```
.claude/                # skills, agents, settings
  skills/<name>/SKILL.md
  agents/<name>.md
  settings.json
examples/               # canonical snippets the skills reference
mcp/                    # read-only MCP server (stdio)
content/
  blog/                 # markdown blog posts
  docs/                 # markdown docs
docs/prompts/           # prompt cookbook
src/
  app/                  # Next.js App Router
    (admin)/            # admin pages (role-gated)
    (app)/              # authed app pages
    (marketing)/        # public marketing pages
    api/                # route handlers (auto-introspected by openapi.json)
    llms-full.txt/      # dynamic AI ingest bundle
  components/
    admin/              # admin chrome
    blog/, docs/        # content rendering
    layout/             # app shell, sidebar, mobile nav
    marketing/          # marketing chrome
    ui/                 # design system primitives
  lib/                  # auth, prisma, stripe, email, rate-limit, etc.
prisma/                 # schema, migrations, seed
public/                 # static assets, manifest, llms.txt, robots.txt
CLAUDE.md               # conventions for Claude — primes every session
AGENTS.md               # cross-tool agent summary
```

---

## Deployment

**Docker Compose** (recommended for self-hosting):

```bash
docker compose up -d                                # dev (builds locally)
docker compose -f docker-compose.prod.yml up -d     # prod (uses pre-built image)
```

Bundles the app, Postgres, Nginx, and Certbot for SSL.

**Vercel**: connect the repo, set env vars, point `DATABASE_URL` at Neon/Supabase/Railway.

**VPS**: `scripts/setup-server.sh` provisions Ubuntu 22.04+ with Docker. GitHub Actions deploy on push to main when `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_SSH_KEY` secrets are configured.

---

## Stripe webhook (local)

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

---

## Tests

```bash
npm test          # vitest run
npx tsc --noEmit  # type-check
```

Don't run `npm run dev` or `npm run build` on a low-RAM dev box — CI handles full builds.

---

## License

MIT. See [LICENSE](LICENSE).

Copyright 2026 [The DevOps Daily](https://github.com/The-DevOps-Daily).

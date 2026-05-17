---
title: Quickstart
description: Get the starter running locally in five minutes.
order: 1
updatedAt: 2026-05-17
---

# Quickstart

Five-minute setup, assuming you already have Node 18+ and git.

```bash
git clone https://github.com/The-DevOps-Daily/surge.git
cd surge
npm install
cp .env.example .env
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

Open <http://localhost:3000>. Sign in with the seed credentials shown in your terminal.

## What you get

- Landing page + pricing + comparison + privacy + terms + sample tool
- Auth flow: register, login, forgot/reset password
- Authed dashboard with sidebar + mobile nav
- Stripe checkout + customer portal + webhook
- Admin dashboard (users, content, system health) gated by `role: admin`
- Blog engine reading from `content/blog/*.md`
- Docs engine reading from `content/docs/*.md` (you are here)
- AI-first scaffolding: skills, subagents, MCP server, CLAUDE.md

## Next steps

1. Run `/customize` in Claude Code to brand-swap the starter for your product.
2. Read [Conventions](/docs/conventions) to learn the rules every change should follow.
3. Read [AI-first features](/docs/ai-first) to see what skills, agents, and the MCP server can do.

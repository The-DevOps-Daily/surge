---
title: "Built for Claude Code: how we made Surge an AI-first SaaS starter"
excerpt: "Most starter kits dump 10k lines on you and call it done. Surge ships skills, subagents, an MCP server, and a CLAUDE.md so your agent stops re-deriving conventions every session."
date: "2026-05-17"
author: "Surge Team"
tags: ["ai-first", "claude-code", "starter-kit", "developer-tools"]
coverEmoji: "🛠️"
---

If you've used Claude Code (or Cursor, Aider, Continue) on a fresh starter kit, you know the pattern. Day one: agent reads everything, builds a mental model, ships fast. Week three: you ask for a "billing-locked admin page" and watch it burn 30k tokens grepping for `auth()`, the right primitive, the design tokens, the rate-limit helper — every. single. time.

We built Surge to make that pattern go away.

## The problem isn't capability, it's context

Modern coding agents are good. The bottleneck isn't reasoning — it's context. Every time you start a new session, the agent has to re-learn:

- Where the auth check lives
- Which primitive to use for forms
- Whether you have a Toast component or do `window.alert`
- What rate limit pattern you've adopted
- What your design tokens are
- Which subdirectory the marketing pages go in

That's a lot of grepping. A 30-second feature request becomes a 5-minute conversation because the agent has to rebuild context from scratch.

## What Surge ships

Eight files (plus a few directories) that collapse that overhead:

### `CLAUDE.md` — primed conventions

Claude Code reads this automatically on every session start. It documents:
- The full primitive registry (Button, Input, Modal, ConfirmDialog, Toast, etc.) with import paths
- The helper registry (prisma, auth, requireAdmin, rateLimit, getStripe, emailLayout)
- Hard rules (no hardcoded colors, no raw form controls, no `npm run dev` on low-RAM hosts)
- The code style preferences (server components by default, no any, inline SVG icons in chrome)

If the agent already knows where everything lives, it doesn't need to look.

### `AGENTS.md` and `.cursorrules`

Same content, repackaged for cross-tool reach. AGENTS.md is the emerging standard (Cursor, Aider, Continue, Codex all pick it up). `.cursorrules` covers Cursor's older path.

### `.claude/skills/`

Five invokable skills that scaffold common SaaS tasks:

| Skill | Output |
|---|---|
| `/customize` | Brand-swap the starter for your product |
| `/add-page` | Scaffold app/admin/marketing page with nav wiring |
| `/add-api-route` | Authed/admin/public route with auth + rate limit + validation |
| `/add-stripe-tier` | Wire a new tier across env, pricing, billing, settings, pricing page, webhook |
| `/add-email` | Transactional email using the shared light-friendly scaffold |

Each skill references a canonical snippet in `examples/`. The agent doesn't generate boilerplate from scratch — it copies a known-good template and adapts the specifics.

### `.claude/agents/` — auto-trigger reviewers

Three subagents that fire on the relevant change types:

- **`route-auditor`** runs on changes under `src/app/api/`. Flags missing auth checks, missing rate limits, missing validation, leaked error details.
- **`migration-reviewer`** runs on `prisma/schema.prisma` changes. Flags destructive operations, missing indexes on foreign keys, missing cascade wiring in user-delete.
- **`token-enforcer`** runs on `.tsx` changes. Flags hardcoded colors, raw form controls, `window.confirm`/`alert`, emoji icons in chrome.

You don't ask for them. They just show up when relevant.

### `mcp/server.ts` — read-only MCP server

```bash
claude mcp add saas-starter -- npx tsx mcp/server.ts
```

After that, your AI client can answer questions about app state directly. "How many Pro subscribers do we have?" returns a number, not a "you should run `SELECT COUNT...` in the admin UI". The six built-in tools (`list_users`, `get_user`, `recent_signups`, `subscription_stats`, `tier_distribution`, `count_content`) cover the common SaaS-dev questions.

It's read-only by design. No write surface. Even if your agent goes rogue, the worst it can do is print your user list.

### `/api/openapi.json` — auto-introspected API spec

Walks `src/app/api/` at request time and returns OpenAPI 3.1 JSON. The agent introspects your API without grepping route files.

### `/blog/*.md` and `/docs/*.md`

Append `.md` to any blog or doc URL to get raw markdown. Lets AI agents pull canonical content without parsing HTML.

### `/llms.txt` and `/llms-full.txt`

Following the [llmstxt.org](https://llmstxt.org) convention. The first is a link tree. The second bundles every doc and post inline for one-shot ingestion.

## What this changes

Before: "add a billing-locked admin page that shows trial-ending users" was a ~30k-token conversation with five "let me look at the existing patterns" detours.

After: same prompt, ~3k tokens, one shot. The agent reads CLAUDE.md (already cached), uses `/add-page` for the admin scaffold, uses `/add-api-route` for the data endpoint, and the route-auditor verifies the auth/rate-limit pattern as a passive check.

That difference compounds. Over a week of building, you spend prompts shipping features instead of negotiating context.

## How to use it

```bash
git clone https://github.com/The-DevOps-Daily/surge.git
cd surge
npm install
cp .env.example .env
npx prisma migrate dev --name init
npx prisma db seed
```

Then in Claude Code (or your agent of choice):

```
/customize
```

It'll walk you through making the starter yours — name, branding, pricing, env vars — in a few minutes. From there, use the other skills as needed.

## Open questions

A few things we're still working out:

- **MCP write tools.** The current MCP server is read-only on purpose. Should we ship optional write tools (gated behind a `--writable` flag), or keep that as a separate package the user opts into?
- **Per-component skills.** Right now skills are about scaffolding. Would per-component skills (e.g. `/refactor-to-tokens` to migrate a legacy component to the design system) be useful?
- **Prompt analytics.** The `docs/prompts/` cookbook captures patterns that work. Want a way to share what worked for you?

If any of these matter to you, [open an issue](https://github.com/The-DevOps-Daily/surge/issues). The kit gets better when the people building on it tell us what's missing.

---

Surge is MIT, free forever. The whole point is that you ship faster. Grab it, customize it, build the SaaS you actually wanted to build instead of the boilerplate around it.

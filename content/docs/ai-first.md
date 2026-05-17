---
title: AI-first features
description: What ships in the box for Claude Code, Cursor, Aider, and other agentic IDEs.
order: 3
updatedAt: 2026-05-17
---

# AI-first features

This starter is designed to be edited by an AI coding agent. Every file you'll see below exists to save tokens (no rediscovery), enforce conventions (no drift), and give the agent privileged access to app state (no manual data entry).

## CLAUDE.md + AGENTS.md

The two convention docs at the repo root. Every Claude session reads `CLAUDE.md` automatically. `AGENTS.md` is the cross-tool summary that Cursor, Aider, Continue, Codex all pick up.

Both list the design tokens, primitives, helper modules, hard rules (no hardcoded colors, no raw form controls, no `npm run dev` on low-RAM boxes), and code-style preferences.

## Skills

Invokable commands under `.claude/skills/<name>/SKILL.md`. Each scaffolds a common task using a canonical example, so the agent doesn't re-derive structure each time.

| Skill | What it does |
|---|---|
| `/customize` | Brand-swap the starter for your product. Conversational. Supports a `--quick` flag for one-shot brand-only changes. |
| `/add-page` | Scaffold an authed app page, admin page, or marketing page. Wires nav, layout, SEO. |
| `/add-api-route` | Scaffold a new API route with the right auth + rate limit + validation pattern. |
| `/add-stripe-tier` | Wire a new Stripe pricing tier across env, lib/pricing, billing, settings, pricing page, webhook. |
| `/add-email` | Scaffold a new transactional email using the shared light-friendly scaffold. |

## Subagents

Auto-trigger reviewers under `.claude/agents/<name>.md`:

- **`route-auditor`** — on any change under `src/app/api/`. Flags missing auth, missing rate limit, missing validation, leaked errors.
- **`migration-reviewer`** — on any change to `prisma/schema.prisma`. Flags destructive operations, missing indexes on foreign keys, missing cascade wiring in user/delete.
- **`token-enforcer`** — on any .tsx change. Flags hardcoded colors, raw form controls, `window.confirm`/`alert`, emoji icons in chrome.

## examples/

Six canonical snippets the skills reference:

- `authed-api-route.ts` — POST handler with session + rate limit + validation
- `admin-api-route.ts` — admin-gated route via `requireAdmin()`
- `tier-gated-page.tsx` — page that nudges free users
- `admin-table-page.tsx` — list page with search/filter/pagination/modal/confirm
- `stripe-webhook-handler.ts` — adding a new webhook event case
- `transactional-email.ts` — sending an email via the shared scaffold

## .md routes

Append `.md` to any blog post or doc URL to get the raw markdown:

- `/blog/getting-started` → `/blog/getting-started.md`
- `/docs/quickstart` → `/docs/quickstart.md`

Lets AI agents pull canonical content without parsing HTML.

## llms.txt

`/llms.txt` follows the [llms.txt convention](https://llmstxt.org) — a link tree for AI crawlers. `/llms-full.txt` bundles the whole content set inline for one-shot ingestion.

## /api/openapi.json

Auto-generated OpenAPI 3 spec describing every API route. Lets Claude introspect the API surface without grepping route files.

## MCP server

Local Model Context Protocol server at `mcp/server.ts`. Exposes read-only tools that wrap Prisma queries — `list_users`, `recent_signups`, `subscription_stats`, etc. Connect via:

```bash
claude mcp add saas-starter -- node ./mcp/server.js
```

Then in chat: "what's MRR right now?" or "show me the last 5 signups". Beats opening the admin UI and clicking around.

See [Using the MCP server](/docs/mcp) for the full tool list.

## Hooks

`.claude/settings.json` registers a `PostToolUse` hook that runs `tsc --noEmit` on every TypeScript file write. Catches type errors before the next prompt cycle, no manual checking needed.

## robots.txt

Explicitly allows GPTBot, ClaudeBot, PerplexityBot, GoogleOther, Applebot-Extended, and others. Many sites default to blocking these. If you want to opt out of training, flip the relevant lines to `Disallow`.

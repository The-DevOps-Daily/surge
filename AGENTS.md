# AGENTS.md

This repo is **AI-first** — primed for Claude Code, Cursor, Aider, Continue, Codex CLI, and any other agentic IDE that reads conventions from a markdown file. See `CLAUDE.md` for the canonical, detailed version; this file is the cross-tool summary.

## What lives where

- **`CLAUDE.md`** — full conventions, primitives, rules, helpers. Read first.
- **`.claude/skills/`** — invokable skills (`/customize`, `/add-page`, `/add-api-route`, `/add-stripe-tier`, `/add-email`). Each scaffolds a common SaaS task without re-deriving structure.
- **`.claude/agents/`** — subagents that auto-review specific change types (route auditor, migration reviewer, design-token enforcer).
- **`.claude/settings.json`** — Claude Code hooks (auto-tsc on save, etc.).
- **`examples/`** — canonical snippets that the skills copy from. Reference these first instead of writing boilerplate.
- **`mcp/`** — read-only MCP server that exposes app data (users, subscriptions, signups) to any MCP-capable client.
- **`docs/prompts/`** — prompt cookbook of proven prompts for common extensions.

## Hard rules (full list in `CLAUDE.md`)

1. No hardcoded colors — use CSS variables from `globals.css`.
2. All form controls use the `Input`/`Select`/`Textarea` primitives.
3. All confirms use `<ConfirmDialog>`, not `window.confirm()`.
4. All toasts use `useToast()`, not `window.alert()`.
5. All emails use `emailLayout()` from `lib/email-layout.ts`.
6. Rate-limit every auth-adjacent route.
7. Don't run `npm run dev`/`build` locally — use `npx tsc --noEmit` and `npm test`.

## Quickstart for agents

```bash
# Type-check (cheap)
npx tsc --noEmit

# Tests
npm test

# Inspect what API routes exist (no grep needed)
curl http://localhost:3000/api/openapi.json | jq

# Inspect app data via MCP (after `claude mcp add saas-starter -- node ./mcp/server.js`)
# Then in chat: list_users, recent_signups, subscription_stats
```

## Scaffolding new things

| Task | Skill |
|---|---|
| Make this starter "yours" (brand, copy, env) | `/customize` |
| Add a new authed page | `/add-page` |
| Add a new API route | `/add-api-route` |
| Add a new Stripe plan tier | `/add-stripe-tier` |
| Add a new transactional email | `/add-email` |

Each skill points at a snippet in `examples/` and lists the files to touch. If you're using an agent that doesn't support invokable skills, open the SKILL.md file and follow the steps manually.

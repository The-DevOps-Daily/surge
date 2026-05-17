---
title: Using the MCP server
description: Connect the local Model Context Protocol server to your AI client and query app state in chat.
order: 4
updatedAt: 2026-05-17
---

# Using the MCP server

The starter ships a read-only MCP server at `mcp/server.ts`. It wraps your Prisma database in a few safe tools so an AI client can answer questions like "what was MRR last week" or "show me the most recent five signups" without you opening the admin UI.

## Install

In your terminal, in the project root:

```bash
# Claude Code
claude mcp add saas-starter -- npx tsx mcp/server.ts

# Claude Desktop (claude_desktop_config.json)
{
  "mcpServers": {
    "saas-starter": {
      "command": "npx",
      "args": ["tsx", "mcp/server.ts"],
      "cwd": "/absolute/path/to/your/clone"
    }
  }
}
```

Restart your client. The server reads `DATABASE_URL` from your `.env`.

## Available tools

| Tool | Returns |
|---|---|
| `list_users(limit, search)` | Up to N users, optionally filtered by email/name substring. |
| `get_user(id)` | One user record with tier, role, Stripe IDs. |
| `recent_signups(days)` | Users created in the last N days. |
| `subscription_stats()` | Counts per tier, MRR, churn-ready (paid users with expired `tierExpiresAt`). |
| `tier_distribution()` | Bucket counts for charting. |
| `count_blog_posts()` | Total blog posts on disk. |
| `count_docs()` | Total docs on disk. |

All tools are **read-only**. The server never writes to the database. There's no way to add a `delete_user` tool by accident — it just doesn't exist.

## Example prompts

After installing, try these in your Claude chat:

- "How many active Pro subscribers do we have?"
- "Who signed up in the last 24 hours?"
- "What's our churn — any paid users with expired tierExpiresAt?"
- "Give me a quick health check of the user base."

## Why this is useful

Without the MCP server, asking Claude "how many Pro users are there?" requires:

1. Open the admin UI
2. Navigate to Users
3. Filter by tier
4. Count

With it, Claude runs the query directly. For a SaaS in active development, that's the difference between a 10-second answer and a 60-second context switch.

## Safety

- Read-only by design. No write tools.
- Runs locally — never exposes the DB over the network.
- Lives in `mcp/server.ts`. Easy to audit. Easy to add more tools (just add a `server.tool()` call following the existing pattern).

## Disabling

```bash
claude mcp remove saas-starter
```

Or delete the entry from your client's config and restart.

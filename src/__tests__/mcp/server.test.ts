/**
 * Smoke test for the MCP server.
 *
 * We can't fully exercise the server in the vitest jsdom env — `@modelcontextprotocol/sdk`
 * pulls in Node-only stdio APIs and the server connects over a real transport.
 * Instead this is a static check: read the source and verify the expected tools
 * are registered. Catches accidental deletions and SDK migration breakage where
 * tool names get renamed.
 */

import fs from "fs";
import path from "path";
import { describe, it, expect } from "vitest";

const SERVER_PATH = path.join(process.cwd(), "mcp/server.ts");

describe("mcp/server.ts", () => {
  it("exists at the documented path", () => {
    expect(fs.existsSync(SERVER_PATH)).toBe(true);
  });

  const source = fs.existsSync(SERVER_PATH)
    ? fs.readFileSync(SERVER_PATH, "utf-8")
    : "";

  it("imports the MCP SDK and Prisma client", () => {
    expect(source).toContain('@modelcontextprotocol/sdk');
    expect(source).toContain('@prisma/client');
  });

  it("uses stdio transport (not http or sse)", () => {
    expect(source).toContain('StdioServerTransport');
    expect(source).not.toContain('SSEServerTransport');
  });

  it("registers all expected read-only tools", () => {
    const expectedTools = [
      "list_users",
      "get_user",
      "recent_signups",
      "subscription_stats",
      "tier_distribution",
      "count_content",
    ];
    for (const tool of expectedTools) {
      expect(source).toMatch(
        new RegExp(`server\\.tool\\(\\s*["']${tool}["']`),
      );
    }
  });

  it("does not register any write tools (read-only by design)", () => {
    const writeVerbs = [
      "create_user",
      "delete_user",
      "update_user",
      "drop_",
      "set_tier",
      "promote_to_admin",
    ];
    for (const verb of writeVerbs) {
      expect(source).not.toContain(`"${verb}"`);
      expect(source).not.toContain(`'${verb}'`);
    }
  });

  it("logs to stderr, not stdout (avoids corrupting stdio protocol)", () => {
    // Allowed stdout: nothing. Allowed stderr: console.error.
    // The protocol uses stdout for JSON-RPC frames; logging to stdout would
    // corrupt the channel.
    expect(source).not.toMatch(/console\.log\(/);
  });
});

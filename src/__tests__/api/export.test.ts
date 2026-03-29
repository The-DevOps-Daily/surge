import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock auth
vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

// Mock prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

import { GET } from "@/app/api/export/route";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const mockAuth = vi.mocked(auth);
const mockPrisma = vi.mocked(prisma);

describe("GET /api/export", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 for unauthenticated requests", async () => {
    mockAuth.mockResolvedValue(null as never);
    const req = new Request("http://localhost/api/export");
    const res = await GET(req);
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe("Unauthorized");
  });

  it("returns 403 for free tier users", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user1" } } as never);
    mockPrisma.user.findUnique.mockResolvedValue({ id: "user1", tier: "free" } as never);

    const req = new Request("http://localhost/api/export");
    const res = await GET(req);
    expect(res.status).toBe(403);
  });

  it("returns CSV with correct headers for pro tier", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user1" } } as never);
    mockPrisma.user.findUnique.mockResolvedValue({ id: "user1", tier: "pro" } as never);

    const req = new Request("http://localhost/api/export?format=csv");
    const res = await GET(req);
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("text/csv");
    expect(res.headers.get("Content-Disposition")).toContain("attachment");
  });

  it("returns JSON with correct structure for pro tier", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user1" } } as never);
    mockPrisma.user.findUnique.mockResolvedValue({ id: "user1", tier: "pro" } as never);

    const req = new Request("http://localhost/api/export?format=json");
    const res = await GET(req);
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("application/json");
    expect(res.headers.get("Content-Disposition")).toContain("attachment");

    const body = JSON.parse(await res.text());
    expect(body.exportedAt).toBeDefined();
  });
});

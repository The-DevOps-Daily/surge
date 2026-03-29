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
      update: vi.fn(),
    },
  },
}));

import { GET, PUT } from "@/app/api/user/currency/route";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const mockAuth = vi.mocked(auth);
const mockPrisma = vi.mocked(prisma);

describe("GET /api/user/currency", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null as never);
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it("returns current currency", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user1" } } as never);
    mockPrisma.user.findUnique.mockResolvedValue({ currency: "USD" } as never);

    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.currency).toBe("USD");
  });

  it("defaults to EUR when no currency set", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user1" } } as never);
    mockPrisma.user.findUnique.mockResolvedValue({ currency: null } as never);

    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.currency).toBe("EUR");
  });
});

describe("PUT /api/user/currency", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null as never);
    const req = new Request("http://localhost/api/user/currency", {
      method: "PUT",
      body: JSON.stringify({ currency: "USD" }),
    });
    const res = await PUT(req);
    expect(res.status).toBe(401);
  });

  it("updates currency", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user1" } } as never);
    mockPrisma.user.update.mockResolvedValue({ currency: "GBP" } as never);

    const req = new Request("http://localhost/api/user/currency", {
      method: "PUT",
      body: JSON.stringify({ currency: "GBP" }),
    });
    const res = await PUT(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.currency).toBe("GBP");
  });

  it("validates currency code", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user1" } } as never);

    const req = new Request("http://localhost/api/user/currency", {
      method: "PUT",
      body: JSON.stringify({ currency: "INVALID" }),
    });
    const res = await PUT(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain("Invalid currency");
  });

  it("rejects empty currency", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user1" } } as never);

    const req = new Request("http://localhost/api/user/currency", {
      method: "PUT",
      body: JSON.stringify({ currency: "" }),
    });
    const res = await PUT(req);
    expect(res.status).toBe(400);
  });
});

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

// Mock bcryptjs
vi.mock("bcryptjs", () => ({
  default: {
    compare: vi.fn(),
    hash: vi.fn(),
  },
}));

import { PUT } from "@/app/api/user/password/route";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const mockAuth = vi.mocked(auth);
const mockPrisma = vi.mocked(prisma);
const mockBcrypt = vi.mocked(bcrypt);

describe("PUT /api/user/password", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null as never);
    const req = new Request("http://localhost/api/user/password", {
      method: "PUT",
      body: JSON.stringify({ currentPassword: "old", newPassword: "newpass123" }),
    });
    const res = await PUT(req);
    expect(res.status).toBe(401);
  });

  it("returns 400 when current password is missing", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user1" } } as never);
    const req = new Request("http://localhost/api/user/password", {
      method: "PUT",
      body: JSON.stringify({ newPassword: "newpass123" }),
    });
    const res = await PUT(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain("Current password");
  });

  it("returns 400 when new password is too short", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user1" } } as never);
    const req = new Request("http://localhost/api/user/password", {
      method: "PUT",
      body: JSON.stringify({ currentPassword: "oldpass123", newPassword: "short" }),
    });
    const res = await PUT(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain("8 characters");
  });

  it("returns 400 when current password is wrong", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user1" } } as never);
    mockPrisma.user.findUnique.mockResolvedValue({
      id: "user1",
      password: "hashedpassword",
    } as never);
    mockBcrypt.compare.mockResolvedValue(false as never);

    const req = new Request("http://localhost/api/user/password", {
      method: "PUT",
      body: JSON.stringify({ currentPassword: "wrongpass", newPassword: "newpass123" }),
    });
    const res = await PUT(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain("incorrect");
  });

  it("successfully changes password", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user1" } } as never);
    mockPrisma.user.findUnique.mockResolvedValue({
      id: "user1",
      password: "hashedpassword",
    } as never);
    mockBcrypt.compare.mockResolvedValue(true as never);
    mockBcrypt.hash.mockResolvedValue("newhashedpassword" as never);
    mockPrisma.user.update.mockResolvedValue({} as never);

    const req = new Request("http://localhost/api/user/password", {
      method: "PUT",
      body: JSON.stringify({ currentPassword: "oldpass123", newPassword: "newpass123" }),
    });
    const res = await PUT(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.message).toContain("Password updated");
    expect(mockPrisma.user.update).toHaveBeenCalled();
  });
});

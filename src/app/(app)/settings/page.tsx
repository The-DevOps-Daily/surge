"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { useTheme } from "next-themes";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { Modal } from "@/components/ui/modal";
import { CURRENCIES, type CurrencyCode } from "@/lib/currencies";
import { TIER_LABELS } from "@/lib/pricing";

interface TierInfo {
  tier: string;
  tierExpiresAt: string | null;
  hasStripeSubscription: boolean;
  hasStripeCustomer: boolean;
  emailReports?: boolean;
}

const themeOptions = [
  {
    value: "dark" as const,
    label: "Dark",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.75 15A9.75 9.75 0 1 1 9 2.25a7.5 7.5 0 0 0 12.75 12.75Z"
      />
    ),
  },
  {
    value: "light" as const,
    label: "Light",
    icon: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path
          strokeLinecap="round"
          d="M12 3v2M12 19v2M5 12H3M21 12h-2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"
        />
      </>
    ),
  },
  {
    value: "system" as const,
    label: "System",
    icon: (
      <>
        <rect x="3" y="4" width="18" height="13" rx="2" />
        <path strokeLinecap="round" d="M8 21h8M12 17v4" />
      </>
    ),
  },
];

export default function SettingsPage() {
  const { data: session } = useSession();
  const { addToast } = useToast();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [tierInfo, setTierInfo] = useState<TierInfo | null>(null);
  const [loadingPortal, setLoadingPortal] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState<string | null>(null);
  const [currency, setCurrency] = useState<string>("USD");
  const [savingCurrency, setSavingCurrency] = useState(false);
  const [emailReports, setEmailReports] = useState(false);
  const [savingEmailReports, setSavingEmailReports] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchTier = useCallback(async () => {
    try {
      const res = await fetch("/api/user/tier");
      if (res.ok) {
        const data: TierInfo = await res.json();
        setTierInfo(data);
        if (typeof data.emailReports === "boolean") {
          setEmailReports(data.emailReports);
        }
      }
    } catch {
      // Ignore
    }
  }, []);

  const fetchCurrency = useCallback(async () => {
    try {
      const res = await fetch("/api/user/currency");
      if (res.ok) {
        const data = await res.json();
        setCurrency(data.currency || "USD");
      }
    } catch {
      // Ignore
    }
  }, []);

  useEffect(() => {
    fetchTier();
    fetchCurrency();
  }, [fetchTier, fetchCurrency]);

  const initials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : session?.user?.email?.[0]?.toUpperCase() || "?";

  const handleCheckout = async (priceId: string) => {
    if (!priceId) {
      addToast("Stripe price ID is not configured", "error");
      return;
    }
    setLoadingCheckout(priceId);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        addToast("Could not create checkout session", "error");
      }
    } catch {
      addToast("Failed to start checkout", "error");
    } finally {
      setLoadingCheckout(null);
    }
  };

  const handlePortal = async () => {
    setLoadingPortal(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        addToast("Could not open billing portal", "error");
      }
    } catch {
      addToast("Failed to open billing portal", "error");
    } finally {
      setLoadingPortal(false);
    }
  };

  const handleExport = async (format: "csv" | "json") => {
    try {
      const res = await fetch(`/api/export?format=${format}`);
      if (res.status === 403) {
        addToast("Export is available on Pro and Team plans", "error");
        return;
      }
      if (!res.ok) {
        addToast("Export failed", "error");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `export.${format}`;
      a.click();
      URL.revokeObjectURL(url);
      addToast(`Exported as ${format.toUpperCase()}`);
    } catch {
      addToast("Export failed", "error");
    }
  };

  const handleCurrencyChange = async (newCurrency: string) => {
    setSavingCurrency(true);
    try {
      const res = await fetch("/api/user/currency", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currency: newCurrency }),
      });
      if (res.ok) {
        setCurrency(newCurrency);
        addToast(
          `Currency updated to ${
            CURRENCIES[newCurrency as CurrencyCode]?.name || newCurrency
          }`,
        );
      } else {
        addToast("Failed to update currency", "error");
      }
    } catch {
      addToast("Failed to update currency", "error");
    } finally {
      setSavingCurrency(false);
    }
  };

  const handleEmailReportsToggle = async () => {
    setSavingEmailReports(true);
    const newValue = !emailReports;
    try {
      const res = await fetch("/api/user/tier", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailReports: newValue }),
      });
      if (res.ok) {
        setEmailReports(newValue);
        addToast(
          newValue ? "Monthly reports enabled" : "Monthly reports disabled",
        );
      } else {
        addToast("Failed to update email preferences", "error");
      }
    } catch {
      addToast("Failed to update email preferences", "error");
    } finally {
      setSavingEmailReports(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "DELETE") return;
    setDeleting(true);
    try {
      const res = await fetch("/api/user/delete", { method: "DELETE" });
      if (res.ok) {
        addToast("Account deleted successfully");
        signOut({ callbackUrl: "/landing" });
      } else {
        addToast("Failed to delete account", "error");
      }
    } catch {
      addToast("Failed to delete account", "error");
    } finally {
      setDeleting(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      addToast("Please fill in all password fields", "error");
      return;
    }
    if (newPassword.length < 8) {
      addToast("New password must be at least 8 characters", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast("New passwords do not match", "error");
      return;
    }
    setChangingPassword(true);
    try {
      const res = await fetch("/api/user/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        addToast("Password updated successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        addToast(data.error || "Failed to change password", "error");
      }
    } catch {
      addToast("Failed to change password", "error");
    } finally {
      setChangingPassword(false);
    }
  };

  const isPaid = tierInfo?.tier === "pro" || tierInfo?.tier === "family";
  const proPriceId = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || "";
  const familyPriceId = process.env.NEXT_PUBLIC_STRIPE_FAMILY_PRICE_ID || "";

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-semibold tracking-[-0.02em] text-[var(--ink-3)]">
          Settings
        </h1>
        <p className="text-sm text-[var(--ink-1)] mt-1.5">
          Manage your account and subscription.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-[14px] bg-[var(--surface-2)] border border-[var(--line-1)] flex items-center justify-center flex-shrink-0">
            <span className="text-[var(--ink-3)] font-semibold text-base">
              {initials}
            </span>
          </div>
          <div className="space-y-3 flex-1 min-w-0">
            <div>
              <p className="text-[11px] uppercase tracking-[0.06em] text-[var(--ink-1)] font-medium">
                Email
              </p>
              <p className="text-sm font-medium text-[var(--ink-3)] mt-0.5 truncate">
                {session?.user?.email || "Loading..."}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.06em] text-[var(--ink-1)] font-medium">
                Name
              </p>
              <p className="text-sm font-medium text-[var(--ink-3)] mt-0.5">
                {session?.user?.name || "Not set"}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change password</CardTitle>
          <CardDescription>
            Use 8 or more characters with a mix of letters and numbers.
          </CardDescription>
        </CardHeader>
        <div className="space-y-4 max-w-md">
          <Input
            label="Current password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
            autoComplete="current-password"
          />
          <Input
            label="New password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="At least 8 characters"
            autoComplete="new-password"
          />
          <Input
            label="Confirm new password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat new password"
            autoComplete="new-password"
          />
          <Button
            onClick={handlePasswordChange}
            loading={changingPassword}
            disabled={!currentPassword || !newPassword || !confirmPassword}
          >
            Update password
          </Button>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Choose your preferred theme.</CardDescription>
        </CardHeader>
        {mounted && (
          <div
            role="radiogroup"
            aria-label="Theme"
            className="inline-flex items-center gap-1 rounded-[12px] border border-[var(--line-1)] bg-[var(--surface-1)] p-1"
          >
            {themeOptions.map((option) => {
              const active = theme === option.value;
              return (
                <button
                  key={option.value}
                  role="radio"
                  aria-checked={active}
                  onClick={() => setTheme(option.value)}
                  className={`inline-flex items-center gap-2 h-9 px-3.5 rounded-[10px] text-sm font-medium transition-colors focus-ring ${
                    active
                      ? "bg-[var(--surface-3)] text-[var(--ink-3)]"
                      : "text-[var(--ink-1)] hover:text-[var(--ink-3)] hover:bg-[var(--surface-2)]"
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.6}
                  >
                    {option.icon}
                  </svg>
                  {option.label}
                </button>
              );
            })}
          </div>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
        </CardHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div
              className={`inline-flex items-center gap-2 px-3 h-7 rounded-full text-xs font-medium border ${
                isPaid
                  ? "bg-[var(--accent-soft)] text-[var(--accent)] border-transparent"
                  : "bg-[var(--surface-2)] text-[var(--ink-2)] border-[var(--line-1)]"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isPaid ? "bg-[var(--accent)]" : "bg-[var(--ink-1)]"
                }`}
              />
              {TIER_LABELS[tierInfo?.tier || "free"] || "Free"} plan
            </div>
            {tierInfo?.tierExpiresAt && (
              <span className="text-xs text-[var(--ink-1)]">
                Renews{" "}
                {new Date(tierInfo.tierExpiresAt).toLocaleDateString()}
              </span>
            )}
          </div>

          {isPaid && tierInfo?.hasStripeSubscription ? (
            <Button
              variant="secondary"
              onClick={handlePortal}
              loading={loadingPortal}
            >
              Manage subscription
            </Button>
          ) : (
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => handleCheckout(proPriceId)}
                loading={loadingCheckout === proPriceId}
                disabled={!proPriceId}
              >
                Upgrade to Pro
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleCheckout(familyPriceId)}
                loading={loadingCheckout === familyPriceId}
                disabled={!familyPriceId}
              >
                Get Team
              </Button>
            </div>
          )}
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Export data</CardTitle>
          <CardDescription>
            Download all your data in CSV or JSON.
          </CardDescription>
        </CardHeader>
        {isPaid ? (
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => handleExport("csv")}>
              Download CSV
            </Button>
            <Button variant="secondary" onClick={() => handleExport("json")}>
              Download JSON
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3 px-4 py-3 rounded-[12px] bg-[var(--surface-2)] border border-[var(--line-1)]">
            <svg
              className="w-5 h-5 text-[var(--ink-1)] flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.6}
            >
              <rect x="5" y="11" width="14" height="9" rx="2" />
              <path d="M8 11V8a4 4 0 1 1 8 0v3" />
            </svg>
            <span className="text-sm text-[var(--ink-1)]">
              Export is available on Pro and Team plans.
            </span>
          </div>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Currency</CardTitle>
          <CardDescription>
            Used everywhere amounts are displayed.
          </CardDescription>
        </CardHeader>
        <div className="max-w-xs">
          <Select
            value={currency}
            onChange={(e) => handleCurrencyChange(e.target.value)}
            disabled={savingCurrency}
            options={Object.entries(CURRENCIES).map(([code, info]) => ({
              value: code,
              label: `${info.symbol} ${info.name} (${code})`,
            }))}
          />
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email notifications</CardTitle>
          <CardDescription>
            Receive a monthly summary in your inbox.
          </CardDescription>
        </CardHeader>
        <div className="flex items-center justify-between gap-4 rounded-[12px] border border-[var(--line-1)] bg-[var(--surface-2)] px-4 py-3">
          <div>
            <p className="text-sm font-medium text-[var(--ink-3)]">
              Monthly report
            </p>
            <p className="text-xs text-[var(--ink-1)] mt-0.5">
              {emailReports
                ? "You will receive a monthly summary."
                : "Monthly reports are disabled."}
            </p>
          </div>
          <button
            role="switch"
            aria-checked={emailReports}
            aria-label="Toggle monthly reports"
            onClick={handleEmailReportsToggle}
            disabled={savingEmailReports}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-ring flex-shrink-0 ${
              emailReports
                ? "bg-[var(--accent)]"
                : "bg-[var(--surface-3)] border border-[var(--line-2)]"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                emailReports ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Legal</CardTitle>
        </CardHeader>
        <div className="flex flex-wrap gap-4 text-sm">
          <a
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--ink-2)] hover:text-[var(--accent)] underline-offset-4 hover:underline transition-colors focus-ring rounded-md"
          >
            Terms of Service
          </a>
          <a
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--ink-2)] hover:text-[var(--accent)] underline-offset-4 hover:underline transition-colors focus-ring rounded-md"
          >
            Privacy Policy
          </a>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danger zone</CardTitle>
        </CardHeader>
        <div className="space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-[var(--ink-3)]">
                Sign out
              </p>
              <p className="text-xs text-[var(--ink-1)] mt-0.5">
                End your session on this device.
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              Sign out
            </Button>
          </div>
          <div className="h-px bg-[var(--line-1)]" />
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-[var(--ink-3)]">
                Delete account
              </p>
              <p className="text-xs text-[var(--ink-1)] mt-0.5">
                Permanently delete your account and data. Cannot be undone.
              </p>
            </div>
            <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
              Delete account
            </Button>
          </div>
        </div>
      </Card>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteConfirmation("");
        }}
        title="Delete account"
        description="This action is permanent and cannot be undone."
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setShowDeleteModal(false);
                setDeleteConfirmation("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteAccount}
              loading={deleting}
              disabled={deleteConfirmation !== "DELETE"}
            >
              Delete my account
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="rounded-[12px] border border-[var(--line-1)] bg-[var(--danger-soft)] px-4 py-3">
            <p className="text-sm text-[var(--danger)] font-medium">
              This is permanent
            </p>
            <p className="text-xs text-[var(--ink-1)] mt-1">
              All your data will be permanently deleted within 30 days.
            </p>
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="delete-confirmation"
              className="block text-xs font-medium uppercase tracking-[0.04em] text-[var(--ink-1)]"
            >
              Type{" "}
              <span className="font-mono text-[var(--danger)]">DELETE</span> to
              confirm
            </label>
            <Input
              id="delete-confirmation"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder="DELETE"
              className="font-mono"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

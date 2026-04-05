"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { useTheme } from "next-themes";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Modal } from "@/components/ui/modal";
import { CURRENCIES, type CurrencyCode } from "@/lib/currencies";

interface TierInfo {
  tier: string;
  tierExpiresAt: string | null;
  hasStripeSubscription: boolean;
  hasStripeCustomer: boolean;
}

const TIER_LABELS: Record<string, string> = {
  free: "Free",
  pro: "Pro",
  family: "Family",
};

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
        setTierInfo(await res.json());
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

  const fetchEmailReports = useCallback(async () => {
    try {
      const res = await fetch("/api/user/tier");
      if (res.ok) {
        const data = await res.json();
        setEmailReports(data.emailReports || false);
      }
    } catch {
      // Ignore
    }
  }, []);

  useEffect(() => {
    fetchTier();
    fetchCurrency();
    fetchEmailReports();
  }, [fetchTier, fetchCurrency, fetchEmailReports]);

  const initials = session?.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : session?.user?.email?.[0]?.toUpperCase() || "?";

  const handleCheckout = async (priceId: string) => {
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
        addToast(`Currency updated to ${CURRENCIES[newCurrency as CurrencyCode]?.name || newCurrency}`);
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
        addToast(newValue ? "Monthly reports enabled" : "Monthly reports disabled");
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

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-100">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your account and subscription
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/20">
            <span className="text-white font-bold text-lg">{initials}</span>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</p>
              <p className="font-medium text-gray-100">
                {session?.user?.email || "Loading..."}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Name</p>
              <p className="font-medium text-gray-100">
                {session?.user?.name || "Not set"}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <div className="space-y-4 max-w-md">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-400">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.05] px-4 py-2.5 text-gray-100 placeholder-gray-500 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all duration-200 min-h-[44px]"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-400">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.05] px-4 py-2.5 text-gray-100 placeholder-gray-500 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all duration-200 min-h-[44px]"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-400">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat new password"
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.05] px-4 py-2.5 text-gray-100 placeholder-gray-500 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all duration-200 min-h-[44px]"
            />
          </div>
          <Button
            onClick={handlePasswordChange}
            disabled={changingPassword || !currentPassword || !newPassword || !confirmPassword}
          >
            {changingPassword ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </Card>

      {/* Theme Preference */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <p className="text-sm text-gray-400 mb-4">
          Choose your preferred theme.
        </p>
        {mounted && (
          <div className="flex gap-3">
            {(["dark", "light", "system"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 min-h-[44px] capitalize ${
                  theme === t
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-white/[0.06] text-gray-400 border border-white/[0.08] hover:bg-white/[0.1]"
                }`}
              >
                {t === "dark" && (
                  <span className="inline-flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                    </svg>
                    Dark
                  </span>
                )}
                {t === "light" && (
                  <span className="inline-flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                    </svg>
                    Light
                  </span>
                )}
                {t === "system" && (
                  <span className="inline-flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
                    </svg>
                    System
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </Card>

      {/* Subscription */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
        </CardHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
              isPaid
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-white/[0.06] text-gray-400 border border-white/[0.08]"
            }`}>
              <span className={`w-2 h-2 rounded-full ${isPaid ? "bg-emerald-400" : "bg-gray-500"}`} />
              {TIER_LABELS[tierInfo?.tier || "free"] || "Free"} Plan
            </div>
            {tierInfo?.tierExpiresAt && (
              <span className="text-xs text-gray-500">
                Renews {new Date(tierInfo.tierExpiresAt).toLocaleDateString()}
              </span>
            )}
          </div>

          {isPaid && tierInfo?.hasStripeSubscription ? (
            <Button
              variant="secondary"
              onClick={handlePortal}
              disabled={loadingPortal}
            >
              {loadingPortal ? "Loading..." : "Manage Subscription"}
            </Button>
          ) : (
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => handleCheckout("price_pro_placeholder")}
                disabled={!!loadingCheckout}
              >
                {loadingCheckout === "price_pro_placeholder" ? "Loading..." : "Upgrade to Pro"}
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleCheckout("price_family_placeholder")}
                disabled={!!loadingCheckout}
              >
                {loadingCheckout === "price_family_placeholder" ? "Loading..." : "Get Team"}
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Export Data */}
      <Card>
        <CardHeader>
          <CardTitle>Export Data</CardTitle>
        </CardHeader>
        <p className="text-sm text-gray-400 mb-4">
          Download all your data.
        </p>
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
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
            <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="text-sm text-gray-400">Export is available on Pro and Team plans.</span>
          </div>
        )}
      </Card>

      {/* Currency */}
      <Card>
        <CardHeader>
          <CardTitle>Currency</CardTitle>
        </CardHeader>
        <p className="text-sm text-gray-400 mb-4">
          Select your preferred display currency.
        </p>
        <select
          value={currency}
          onChange={(e) => handleCurrencyChange(e.target.value)}
          disabled={savingCurrency}
          className="w-full max-w-xs rounded-xl border border-white/[0.08] bg-white/[0.05] px-4 py-2.5 text-gray-100 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all duration-200 min-h-[44px]"
        >
          {Object.entries(CURRENCIES).map(([code, info]) => (
            <option key={code} value={code} className="bg-[#0d0d14] text-gray-100">
              {info.symbol} {info.name} ({code})
            </option>
          ))}
        </select>
      </Card>

      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
        </CardHeader>
        <p className="text-sm text-gray-400 mb-4">
          Receive a monthly summary via email.
        </p>
        <div className="flex items-center gap-4">
          <button
            onClick={handleEmailReportsToggle}
            disabled={savingEmailReports}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
              emailReports ? "bg-emerald-500" : "bg-white/[0.12]"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                emailReports ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span className="text-sm text-gray-300">
            {emailReports ? "Monthly reports enabled" : "Monthly reports disabled"}
          </span>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data</CardTitle>
        </CardHeader>
        <p className="text-sm text-gray-400">
          Your data is stored locally in an SQLite database. No data is sent to external services.
        </p>
      </Card>

      {/* Legal */}
      <Card>
        <CardHeader>
          <CardTitle>Legal</CardTitle>
        </CardHeader>
        <div className="flex flex-wrap gap-4">
          <a
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-emerald-400 hover:underline"
          >
            Terms of Service
          </a>
          <a
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-emerald-400 hover:underline"
          >
            Privacy Policy
          </a>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="border-rose-500/20">
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
        </CardHeader>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-400 mb-3">
              Sign out of your account on this device.
            </p>
            <Button
              variant="danger"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              Sign Out
            </Button>
          </div>
          <div className="border-t border-white/[0.06] pt-4">
            <p className="text-sm text-gray-400 mb-3">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <Button
              variant="danger"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </Card>

      {/* Delete Account Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteConfirmation("");
        }}
        title="Delete Account"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
            <p className="text-sm text-rose-300 font-medium mb-1">This is permanent</p>
            <p className="text-sm text-gray-400">
              All your data will be permanently deleted. This cannot be undone.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">
              Type <span className="text-rose-400 font-mono">DELETE</span> to confirm
            </label>
            <input
              type="text"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder="DELETE"
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.05] px-4 py-2.5 text-gray-100 placeholder-gray-500 focus:border-rose-500/50 focus:ring-2 focus:ring-rose-500/20 focus:outline-none transition-all duration-200 min-h-[44px] font-mono"
            />
          </div>
          <div className="flex gap-3 justify-end">
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
              disabled={deleteConfirmation !== "DELETE" || deleting}
            >
              {deleting ? "Deleting..." : "Delete My Account"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

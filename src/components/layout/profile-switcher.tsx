"use client";

import { useEffect, useState, useRef } from "react";

interface Profile {
  id: string;
  name: string;
  isDefault: boolean;
}

export function ProfileSwitcher() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/profiles")
      .then((r) => r.json())
      .then((data: Profile[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setProfiles(data);
          const saved = localStorage.getItem("activeProfileId");
          const match = data.find((p) => p.id === saved);
          setActiveId(match ? match.id : data.find((p) => p.isDefault)?.id || data[0].id);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setShowAdd(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const switchProfile = (id: string) => {
    setActiveId(id);
    localStorage.setItem("activeProfileId", id);
    setOpen(false);
    // Reload the page so data re-fetches for the new profile
    window.location.reload();
  };

  const addProfile = async () => {
    if (!newName.trim()) return;
    try {
      const res = await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() }),
      });
      if (res.ok) {
        const profile = await res.json();
        setProfiles((prev) => [...prev, profile]);
        setNewName("");
        setShowAdd(false);
        switchProfile(profile.id);
      }
    } catch {
      // Ignore
    }
  };

  if (profiles.length === 0) return null;

  const active = profiles.find((p) => p.id === activeId);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full px-3 h-9 rounded-[12px] text-sm font-medium text-[var(--ink-2)] hover:bg-[var(--surface-2)] hover:text-[var(--ink-3)] transition-colors focus-ring"
      >
        <div className="w-6 h-6 rounded-[8px] bg-[var(--accent-soft)] flex items-center justify-center flex-shrink-0">
          <span className="text-[10px] font-semibold text-[var(--accent)]">
            {active?.name?.[0]?.toUpperCase() || "P"}
          </span>
        </div>
        <span className="truncate flex-1 text-left">{active?.name || "Profile"}</span>
        <svg
          className={`w-4 h-4 text-[var(--ink-1)] transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 right-0 mt-2 rounded-[14px] border border-[var(--line-2)] bg-[var(--surface-2)] shadow-[var(--shadow-3)] z-50 overflow-hidden animate-scale-in">
          {profiles.map((p) => (
            <button
              key={p.id}
              onClick={() => switchProfile(p.id)}
              className={`flex items-center gap-2 w-full px-3.5 h-9 text-sm transition-colors ${
                p.id === activeId
                  ? "bg-[var(--accent-soft)] text-[var(--ink-3)]"
                  : "text-[var(--ink-2)] hover:bg-[var(--surface-3)] hover:text-[var(--ink-3)]"
              }`}
            >
              <span className="truncate">{p.name}</span>
              {p.isDefault && (
                <span className="text-[10px] text-[var(--ink-1)] ml-auto">default</span>
              )}
            </button>
          ))}

          {showAdd ? (
            <div className="p-2 border-t border-[var(--line-1)]">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addProfile()}
                  placeholder="Profile name"
                  className="flex-1 h-9 px-3 rounded-[10px] border border-[var(--line-1)] bg-[var(--surface-1)] text-sm text-[var(--ink-3)] placeholder-[var(--ink-1)] focus:outline-none focus:border-[var(--accent)]"
                  autoFocus
                />
                <button
                  onClick={addProfile}
                  className="h-9 px-3 rounded-[10px] bg-[var(--accent)] text-[var(--surface-0)] text-sm hover:bg-[var(--accent-strong)] transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 w-full px-3.5 h-9 text-sm text-[var(--ink-1)] hover:text-[var(--ink-3)] hover:bg-[var(--surface-3)] border-t border-[var(--line-1)] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add profile
            </button>
          )}
        </div>
      )}
    </div>
  );
}

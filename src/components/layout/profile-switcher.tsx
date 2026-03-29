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
        className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/[0.04] transition-all duration-200"
      >
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
          <span className="text-[10px] font-bold text-emerald-400">
            {active?.name?.[0]?.toUpperCase() || "P"}
          </span>
        </div>
        <span className="truncate flex-1 text-left">{active?.name || "Profile"}</span>
        <svg className={`w-4 h-4 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 right-0 mt-1 bg-[#141420] border border-white/[0.08] rounded-xl shadow-xl z-50 overflow-hidden">
          {profiles.map((p) => (
            <button
              key={p.id}
              onClick={() => switchProfile(p.id)}
              className={`flex items-center gap-2 w-full px-4 py-2.5 text-sm transition-colors ${
                p.id === activeId
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "text-gray-400 hover:bg-white/[0.04] hover:text-gray-200"
              }`}
            >
              <span className="truncate">{p.name}</span>
              {p.isDefault && (
                <span className="text-[10px] text-gray-600 ml-auto">default</span>
              )}
            </button>
          ))}

          {showAdd ? (
            <div className="p-2 border-t border-white/[0.06]">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addProfile()}
                  placeholder="Profile name"
                  className="flex-1 px-3 py-1.5 bg-white/[0.06] border border-white/[0.08] rounded-lg text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/40"
                  autoFocus
                />
                <button
                  onClick={addProfile}
                  className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm hover:bg-emerald-500/30 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-500 hover:text-gray-300 hover:bg-white/[0.04] border-t border-white/[0.06] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Profile
            </button>
          )}
        </div>
      )}
    </div>
  );
}

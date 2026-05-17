"use client";

import { useState, useRef, useEffect } from "react";

interface Option {
  value: string;
  label: string;
  icon?: string;
}

interface SearchableSelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
}

export function SearchableSelect({
  label,
  value,
  onChange,
  options,
  placeholder = "Select...",
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);
  const filtered = search
    ? options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
    : options;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="space-y-1.5" ref={ref}>
      {label && (
        <label className="block text-xs font-medium uppercase tracking-[0.04em] text-[var(--ink-1)]">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className="w-full h-11 rounded-[12px] border border-[var(--line-2)] bg-[var(--surface-1)] px-3.5 text-left text-[var(--ink-3)] focus-ring transition-colors duration-150 ease-out hover:border-[var(--line-3)] flex items-center justify-between"
        >
          <span className="flex items-center gap-2 text-sm truncate">
            {selected?.icon && <span aria-hidden>{selected.icon}</span>}
            <span className={selected ? "" : "text-[var(--ink-1)]"}>
              {selected?.label || placeholder}
            </span>
          </span>
          <svg
            aria-hidden
            className={`w-4 h-4 text-[var(--ink-1)] transition-transform duration-150 ${open ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {open && (
          <div
            role="listbox"
            className="absolute z-50 mt-2 w-full rounded-[14px] border border-[var(--line-2)] bg-[var(--surface-2)] shadow-[var(--shadow-3)] overflow-hidden animate-scale-in"
          >
            {options.length > 5 && (
              <div className="p-2 border-b border-[var(--line-1)]">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  autoFocus
                  className="w-full rounded-[10px] border border-[var(--line-1)] bg-[var(--surface-1)] px-3 h-9 text-sm text-[var(--ink-3)] placeholder-[var(--ink-1)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>
            )}
            <div className="max-h-56 overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <p className="px-4 py-3 text-sm text-[var(--ink-1)]">No results</p>
              ) : (
                filtered.map((opt) => {
                  const isSelected = opt.value === value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        onChange(opt.value);
                        setOpen(false);
                        setSearch("");
                      }}
                      className={[
                        "w-full text-left px-3.5 h-9 text-sm flex items-center gap-2 transition-colors duration-100",
                        isSelected
                          ? "bg-[var(--accent-soft)] text-[var(--ink-3)]"
                          : "text-[var(--ink-2)] hover:bg-[var(--surface-3)]",
                      ].join(" ")}
                    >
                      {opt.icon && <span aria-hidden>{opt.icon}</span>}
                      <span className="truncate">{opt.label}</span>
                      {isSelected && (
                        <svg
                          aria-hidden
                          className="ml-auto w-4 h-4 text-[var(--accent)]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

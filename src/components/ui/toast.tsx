"use client";

import React, { createContext, useCallback, useContext, useState } from "react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({ addToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

const typeStyles: Record<
  ToastType,
  { dot: string; aria: "polite" | "assertive" }
> = {
  success: { dot: "bg-[var(--accent)]", aria: "polite" },
  error: { dot: "bg-[var(--danger)]", aria: "assertive" },
  info: { dot: "bg-[var(--ink-1)]", aria: "polite" },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message: string, type: ToastType = "success") => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => dismiss(id), 4000);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Stack toasts bottom-right, room for mobile bottom-nav above the
       * safe-area inset. role/live regions per type so screen readers
       * announce errors immediately and successes at the next quiet moment. */}
      <div
        className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-[100] flex flex-col gap-2 pointer-events-none safe-area-bottom"
        aria-live="polite"
      >
        {toasts.map((toast) => {
          const style = typeStyles[toast.type];
          return (
            <div
              key={toast.id}
              role={toast.type === "error" ? "alert" : "status"}
              aria-live={style.aria}
              className={[
                "pointer-events-auto inline-flex items-center gap-3 max-w-sm",
                "rounded-[14px] border border-[var(--line-2)] bg-[var(--surface-2)]",
                "px-4 py-3 text-sm text-[var(--ink-3)] shadow-[var(--shadow-3)]",
                "animate-slide-up",
              ].join(" ")}
            >
              <span
                aria-hidden
                className={`h-2 w-2 rounded-full shrink-0 ${style.dot}`}
              />
              <span className="flex-1 leading-snug">{toast.message}</span>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                aria-label="Dismiss"
                className="text-[var(--ink-1)] hover:text-[var(--ink-3)] transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

"use client";

import React, { useEffect, useRef, useCallback } from "react";

type Size = "sm" | "md" | "lg" | "xl";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: Size;
  footer?: React.ReactNode;
  // Lets callers opt out of the dismiss-on-overlay-click behaviour for
  // destructive flows where an accidental click shouldn't lose work.
  dismissOnOverlay?: boolean;
}

const sizeStyles: Record<Size, string> = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
  footer,
  dismissOnOverlay = true,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = React.useId();
  const descriptionId = React.useId();

  // Memoize so the effect deps stay stable.
  const handleClose = useCallback(() => onClose(), [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    // Stash the currently-focused element so we can restore it when the
    // modal closes. Without this, closing the dialog drops focus to the
    // document body and the keyboard user has no anchor.
    previouslyFocused.current = (document.activeElement as HTMLElement) || null;
    // Move focus into the modal so screen readers announce it and tab
    // order wraps into the dialog.
    panelRef.current?.focus();

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
      previouslyFocused.current?.focus?.();
    };
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={description ? descriptionId : undefined}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(0,0,0,0.55)] backdrop-blur-[2px] animate-fade-in"
      onClick={(e) => {
        if (dismissOnOverlay && e.target === overlayRef.current) handleClose();
      }}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        className={[
          "relative w-full overflow-hidden outline-none animate-scale-in",
          "rounded-[24px] bg-[var(--surface-1)] border border-[var(--line-1)]",
          "shadow-[var(--shadow-3)]",
          sizeStyles[size],
          "max-h-[90vh] flex flex-col",
        ].join(" ")}
      >
        {(title || description) && (
          <header className="flex items-start justify-between gap-4 px-6 pt-5 pb-4 border-b border-[var(--line-1)]">
            <div className="min-w-0">
              {title && (
                <h2
                  id={titleId}
                  className="text-lg font-semibold text-[var(--ink-3)] tracking-tight"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p
                  id={descriptionId}
                  className="mt-1 text-sm leading-relaxed text-[var(--ink-1)]"
                >
                  {description}
                </p>
              )}
            </div>
            <button
              onClick={handleClose}
              aria-label="Close"
              className="-mr-1.5 -mt-1.5 inline-flex h-9 w-9 items-center justify-center rounded-[10px] text-[var(--ink-1)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--ink-3)] focus-ring"
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
          </header>
        )}
        <div className="px-6 py-5 overflow-y-auto text-sm text-[var(--ink-2)] leading-relaxed">
          {children}
        </div>
        {footer && (
          <footer className="flex items-center justify-end gap-2 px-6 py-4 border-t border-[var(--line-1)] bg-[var(--surface-2)]">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}

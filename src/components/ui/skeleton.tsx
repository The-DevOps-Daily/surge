"use client";

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-[var(--surface-2)] rounded-[10px] ${className}`}
    />
  );
}

const cardShellClasses =
  "rounded-[20px] border border-[var(--line-1)] bg-[var(--surface-1)] p-6";

export function MetricSkeleton() {
  return (
    <div className={cardShellClasses}>
      <Skeleton className="h-3 w-24 mb-3" />
      <Skeleton className="h-8 w-36" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className={cardShellClasses}>
      <Skeleton className="h-4 w-32 mb-4" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

export function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="rounded-[14px] border border-[var(--line-1)] bg-[var(--surface-1)] p-4"
        >
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-6 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

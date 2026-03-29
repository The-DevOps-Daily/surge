"use client";

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-white/[0.06] rounded-xl ${className}`}
    />
  );
}

export function MetricSkeleton() {
  return (
    <div className="bg-white/[0.04] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-6">
      <Skeleton className="h-4 w-24 mb-3" />
      <Skeleton className="h-8 w-36" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-white/[0.04] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-6">
      <Skeleton className="h-5 w-32 mb-4" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

export function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="bg-white/[0.04] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-4"
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

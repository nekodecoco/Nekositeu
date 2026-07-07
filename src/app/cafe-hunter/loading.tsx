export default function CafeHunterLoading() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col gap-12 w-full animate-pulse">
      {/* Header skeleton */}
      <div className="flex flex-col gap-4 border-b border-white/5 pb-8">
        <div className="h-3 w-36 rounded bg-white/5" />
        <div className="h-10 w-64 rounded bg-white/10" />
        <div className="h-4 w-full max-w-xl rounded bg-white/5" />
      </div>

      {/* Toolbar skeleton */}
      <div className="h-16 rounded-2xl border border-white/5 bg-white/[0.02]" />

      {/* Cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
            <div className="h-44 bg-white/5" />
            <div className="p-6 flex flex-col gap-3">
              <div className="h-5 w-32 rounded bg-white/10" />
              <div className="h-3 w-40 rounded bg-white/5" />
              <div className="h-3 w-24 rounded bg-white/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

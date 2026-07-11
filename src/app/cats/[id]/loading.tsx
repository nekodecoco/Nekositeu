export default function CatProfileLoading() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col gap-12 w-full animate-pulse">
      {/* Back nav placeholder */}
      <div className="h-4 w-48 rounded bg-white/5" />

      {/* Profile header skeleton */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 md:p-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-40 h-40 md:w-52 md:h-52 rounded-2xl bg-white/5 flex-shrink-0" />
          <div className="flex flex-col gap-5 flex-grow w-full">
            <div className="h-3 w-28 rounded bg-white/5" />
            <div className="h-10 w-56 rounded bg-white/10" />
            <div className="flex gap-4">
              <div className="h-3 w-24 rounded bg-white/5" />
              <div className="h-3 w-32 rounded bg-white/5" />
            </div>
            <div className="h-16 w-full max-w-2xl rounded bg-white/5" />
          </div>
        </div>
      </div>

      {/* Gallery skeleton */}
      <div className="h-6 w-44 rounded bg-white/5" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="aspect-square rounded-xl bg-white/5" />
        ))}
      </div>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="aspect-square bg-gray-200 animate-pulse" />
      <div className="p-5 space-y-3">
        <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
        <div className="h-5 w-4/5 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-3/5 bg-gray-200 rounded animate-pulse" />
        <div className="h-8 w-full bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

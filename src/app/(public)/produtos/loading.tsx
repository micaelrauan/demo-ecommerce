import { ProductGridSkeleton } from "@/components/skeletons/ProductCardSkeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 pb-6 border-b border-gray-200">
          <div className="h-10 w-40 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-5 w-56 bg-gray-200 rounded animate-pulse" />
        </div>
        <ProductGridSkeleton count={9} />
      </div>
    </div>
  );
}

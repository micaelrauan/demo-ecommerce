import { ProductGridSkeleton } from "@/components/skeletons/ProductCardSkeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <ProductGridSkeleton count={6} />
      </div>
    </div>
  );
}

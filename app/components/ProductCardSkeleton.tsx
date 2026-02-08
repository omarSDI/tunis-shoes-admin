export default function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border-2 border-gray-100 shadow-lg">
      <div className="w-full h-80 skeleton"></div>
      <div className="p-6 space-y-4">
        <div className="skeleton h-6 w-3/4 rounded"></div>
        <div className="skeleton h-4 w-1/2 rounded"></div>
        <div className="skeleton h-8 w-full rounded"></div>
      </div>
    </div>
  );
}

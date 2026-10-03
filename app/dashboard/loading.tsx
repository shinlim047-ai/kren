// app/dashboard/loading.tsx
export default function Loading() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="h-7 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-96 bg-gray-100 rounded mt-2 animate-pulse" />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="h-28 bg-gray-100 rounded-lg animate-pulse" />
        <div className="h-28 bg-gray-100 rounded-lg animate-pulse" />
        <div className="h-28 bg-gray-100 rounded-lg animate-pulse" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 h-[420px] bg-gray-100 rounded-lg animate-pulse" />
        <div className="h-[420px] bg-gray-100 rounded-lg animate-pulse" />
      </div>

      <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />
    </div>
  )
}
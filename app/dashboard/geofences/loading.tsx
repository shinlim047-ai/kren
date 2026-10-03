//app/dashboard/geofences/loading.tsx
// app/dashboard/geofences/loading.tsx
export default function Loading() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="h-7 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-56 bg-gray-100 rounded mt-2 animate-pulse" />
        </div>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="h-[500px] bg-gray-100 rounded-lg animate-pulse" />
        </div>
        <div className="space-y-3">
          <div className="h-24 bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-24 bg-gray-100 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  )
}
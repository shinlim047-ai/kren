// app/dashboard/animals/loading.tsx
export default function Loading() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="h-7 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-72 bg-gray-100 rounded mt-2 animate-pulse" />
        </div>
        <div className="h-9 w-32 bg-gray-100 rounded animate-pulse" />
      </div>

      <div className="h-96 bg-gray-100 rounded-lg animate-pulse" />
    </div>
  )
}
import { Skeleton } from "@/components/ui/skeleton"
import AdminLayout from "@/components/admin/admin-layout"

export default function ShippingSettingsLoading() {
  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div>
          <Skeleton className="h-10 w-[250px]" />
          <Skeleton className="h-4 w-[350px] mt-2" />
        </div>

        <Skeleton className="h-10 w-[400px]" />

        <div className="space-y-6 mt-6">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-[200px]" />
            <Skeleton className="h-10 w-[150px]" />
          </div>

          <div className="rounded-md border">
            <div className="p-4">
              <div className="flex items-center gap-4 py-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} className="h-6 flex-1" />
                ))}
              </div>
              {Array.from({ length: 5 }).map((_, rowIndex) => (
                <div key={rowIndex} className="flex items-center gap-4 py-4">
                  {Array.from({ length: 6 }).map((_, colIndex) => (
                    <Skeleton key={colIndex} className="h-10 flex-1" />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <Skeleton className="h-8 w-[200px] mt-8" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-[250px] w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

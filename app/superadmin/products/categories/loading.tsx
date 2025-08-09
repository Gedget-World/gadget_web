import { Skeleton } from "@/components/ui/skeleton"
import AdminLayout from "@/components/admin/admin-layout"

export default function CategoriesLoading() {
  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-10 w-[250px]" />
            <Skeleton className="h-4 w-[350px] mt-2" />
          </div>
          <Skeleton className="h-10 w-[150px]" />
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <Skeleton className="h-10 w-full md:w-[300px]" />
          <Skeleton className="h-10 w-[150px]" />
        </div>

        <div className="rounded-md border">
          <div className="p-4">
            <div className="flex items-center gap-4 py-4">
              {Array.from({ length: 7 }).map((_, index) => (
                <Skeleton key={index} className="h-6 flex-1" />
              ))}
            </div>
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <div key={rowIndex} className="flex items-center gap-4 py-4">
                {Array.from({ length: 7 }).map((_, colIndex) => (
                  <Skeleton key={colIndex} className="h-10 flex-1" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

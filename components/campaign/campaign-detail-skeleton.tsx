import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function CampaignDetailSkeleton() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="relative flex h-(--header-height) shrink-0 items-center border-b px-4 lg:px-6">
        <Skeleton className="h-7 w-40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Skeleton className="h-8 w-64 rounded-lg" />
        </div>
        <div className="ml-auto flex gap-2">
          <Skeleton className="h-8 w-28 rounded-lg" />
          <Skeleton className="h-8 w-28 rounded-lg" />
          <Skeleton className="h-8 w-32 rounded-lg" />
        </div>
      </div>

      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="@container/card h-full">
              <CardHeader>
                <Skeleton className="h-4 w-28" />
                <Skeleton className="mt-2 h-8 w-20" />
              </CardHeader>
              <CardFooter className="flex-col items-start gap-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-32" />
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-4 lg:px-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent className="flex min-h-55 items-center justify-center">
              <Skeleton className="size-36 rounded-full" />
            </CardContent>
          </Card>
          <Card className="lg:col-span-3">
            <CardHeader>
              <Skeleton className="h-4 w-36" />
            </CardHeader>
            <CardContent className="min-h-55">
              <Skeleton className="h-full min-h-44 w-full rounded-lg" />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:px-6">
          {Array.from({ length: 2 }).map((_, column) => (
            <Card
              key={column}
              className="flex flex-col gap-0 overflow-hidden py-0"
            >
              <div className="flex flex-col gap-3 border-b px-4 py-3">
                {column === 0 ? (
                  <Skeleton className="h-8 w-full rounded-lg" />
                ) : null}
                <Skeleton className="h-8 w-full rounded-lg" />
                <Skeleton className="h-9 w-full rounded-lg" />
              </div>
              <div className="flex flex-col gap-2 p-4">
                {Array.from({ length: 10 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-xl border p-2"
                  >
                    <Skeleton className="size-12 shrink-0 rounded-lg" />
                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                      <Skeleton className="h-4 w-48 max-w-full" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

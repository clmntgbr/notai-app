"use client"

import { ContentAttachment } from "@/components/content/content-attachment"
import { useContents } from "@/lib/content/hooks"
import { Loader2Icon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

export function RecentContents() {
  const { data, isLoading, isError } = useContents(null, {
    page: 1,
    limit: 5,
    sortBy: "created_at",
    orderBy: "desc",
  })

  const contents = data?.members ?? []

  if (contents.length === 0) {
    return null
  }

  return (
    <Card className="@container/card gap-4 px-4">
      <CardHeader className="px-0">
        <CardTitle>Last contents</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2Icon className="size-4 animate-spin" />
            Loading…
          </div>
        ) : isError ? (
          <p className="text-sm text-destructive">Failed to load contents.</p>
        ) : contents.length === 0 ? (
          <p className="text-sm text-muted-foreground">No contents yet.</p>
        ) : (
          <div className="flex w-full flex-col gap-2">
            {contents.map((content) => (
              <ContentAttachment key={content.id} content={content} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

"use client"

import { ContentAttachment } from "@/components/content/content-attachment"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useContents } from "@/lib/content/hooks"
import { ArrowRightIcon, Loader2Icon } from "lucide-react"
import Link from "next/link"

export interface RecentContentsProps {
  showAllLink?: boolean
  limit?: number
}

export function RecentContents({
  showAllLink = true,
  limit = 5,
}: RecentContentsProps) {
  const { data, isLoading, isError } = useContents(null, {
    page: 1,
    limit,
    sortBy: "created_at",
    orderBy: "desc",
  })

  const contents = data?.members ?? []

  if (!isLoading && contents.length === 0) {
    return null
  }

  return (
    <Card className="@container/card gap-4 px-4">
      <CardHeader className="px-0">
        <CardTitle>Last contents</CardTitle>
        {showAllLink ? (
          <CardAction>
            <Link
              href="/contents"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              Show all
              <ArrowRightIcon className="size-3.5" />
            </Link>
          </CardAction>
        ) : null}
      </CardHeader>
      <CardContent className="px-0">
        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2Icon className="size-4 animate-spin" />
            Loading…
          </div>
        ) : isError ? (
          <p className="text-sm text-destructive">Failed to load contents.</p>
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

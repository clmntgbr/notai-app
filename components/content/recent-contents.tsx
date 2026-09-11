"use client"

import { ContentAttachment } from "@/components/content/content-attachment"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { useContents } from "@/lib/content/hooks"
import { ArrowRightIcon, ImageIcon, Loader2Icon } from "lucide-react"
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
  const isEmpty = !isLoading && !isError && contents.length === 0

  return (
    <Card
      className={
        isEmpty
          ? "@container/card h-full min-h-55 gap-4 px-4"
          : "@container/card gap-4 px-4"
      }
    >
      {!isEmpty ? (
        <CardHeader className="px-0">
          <CardTitle>Last contents</CardTitle>
          {showAllLink ? (
            <CardAction>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/contents">
                  Show all
                  <ArrowRightIcon data-icon="inline-end" />
                </Link>
              </Button>
            </CardAction>
          ) : null}
        </CardHeader>
      ) : null}
      <CardContent
        className={
          isEmpty
            ? "flex flex-1 flex-col items-center justify-center px-0"
            : "px-0"
        }
      >
        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2Icon className="size-4 animate-spin" />
            Loading…
          </div>
        ) : isError ? (
          <p className="text-sm text-destructive">Failed to load contents.</p>
        ) : isEmpty ? (
          <Empty className="border-0 p-0">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ImageIcon />
              </EmptyMedia>
              <EmptyTitle>No contents yet</EmptyTitle>
              <EmptyDescription>
                You haven&apos;t uploaded any contents yet. Get started by
                uploading your first image.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
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

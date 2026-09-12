"use client"

import { ContentAttachment } from "@/components/content/content-attachment"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  EmptyErrorState,
  EmptyLoadingState,
  EmptyState,
} from "@/components/ui/empty-state"
import { useContents } from "@/lib/content/hooks"
import { ArrowRightIcon, ImageIcon } from "lucide-react"
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
  const hideHeader = isLoading || isEmpty || isError

  return (
    <Card
      className={
        hideHeader
          ? "@container/card h-full min-h-55 gap-4 px-4"
          : "@container/card gap-4 px-4"
      }
    >
      {!hideHeader ? (
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
          hideHeader
            ? "flex flex-1 flex-col items-center justify-center px-0"
            : "px-0"
        }
      >
        {isLoading ? (
          <EmptyLoadingState />
        ) : isError ? (
          <EmptyErrorState
            title="Failed to load contents"
            description="Something went wrong while loading your contents. Please try again later."
          />
        ) : isEmpty ? (
          <EmptyState
            icon={<ImageIcon />}
            title="No contents yet"
            description="You haven't uploaded any contents yet. Get started by uploading your first image."
          />
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

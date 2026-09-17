"use client"

import { MediaAttachment } from "@/components/media/media-attachment"
import { MediaDetailDrawer } from "@/components/media/media-detail-drawer"
import { RecentMediaDrawer } from "@/components/media/recent-media-drawer"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  EmptyErrorState,
  EmptyLoadingState,
  EmptyState,
} from "@/components/ui/empty-state"
import { useMedia } from "@/lib/media/hooks"
import { Media } from "@/lib/media/types"
import { ArrowRightIcon, ImageIcon } from "lucide-react"
import { useState } from "react"

export interface RecentMediaProps {
  limit?: number
}

export function RecentMedia({ limit = 5 }: RecentMediaProps) {
  const [selected, setSelected] = useState<Media | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { data, isLoading, isError } = useMedia({
    page: 1,
    limit,
    sortBy: "created_at",
    orderBy: "desc",
  })

  const items = data?.members ?? []
  const isEmpty = !isLoading && !isError && items.length === 0

  return (
    <>
      <Card className="@container/card h-full min-h-55 gap-4 px-4">
        <CardHeader className="px-0">
          <CardTitle>Last media</CardTitle>
          <CardDescription>Most recent uploads</CardDescription>
          {!isLoading && !isError && !isEmpty ? (
            <CardAction className="self-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDrawerOpen(true)}
              >
                Show all
                <ArrowRightIcon data-icon="inline-end" />
              </Button>
            </CardAction>
          ) : null}
        </CardHeader>
        <CardContent
          className={
            isLoading || isError || isEmpty
              ? "flex flex-1 flex-col items-center justify-center px-0"
              : "px-0"
          }
        >
          {isLoading ? (
            <EmptyLoadingState />
          ) : isError ? (
            <EmptyErrorState
              title="Failed to load media"
              description="Something went wrong while loading your media. Please try again later."
            />
          ) : isEmpty ? (
            <EmptyState
              icon={<ImageIcon />}
              title="No media yet"
              description="You haven't uploaded any media yet. Get started by uploading your first file."
            />
          ) : (
            <div className="flex w-full flex-col gap-2">
              {items.map((media) => (
                <MediaAttachment
                  key={media.id}
                  media={media}
                  onSelect={setSelected}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <MediaDetailDrawer
        mediaId={selected?.id ?? null}
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) setSelected(null)
        }}
      />

      <RecentMediaDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
    </>
  )
}

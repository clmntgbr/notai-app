"use client"

import { MediaAttachment } from "@/components/media/media-attachment"
import { MediaDetailDrawer } from "@/components/media/media-detail-drawer"
import {
  EmptyErrorState,
  EmptyLoadingState,
  EmptyState,
} from "@/components/ui/empty-state"
import { Spinner } from "@/components/ui/spinner"
import { useInfiniteMedia } from "@/lib/media/hooks"
import { Media } from "@/lib/media/types"
import { ImageIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export interface MediaInfiniteListProps {
  enabled?: boolean
  campaignId?: string | null
}

export function MediaInfiniteList({
  enabled = true,
  campaignId,
}: MediaInfiniteListProps) {
  const [selected, setSelected] = useState<Media | null>(null)
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useInfiniteMedia({ enabled, campaignId })

  const scrollRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const items = data?.pages.flatMap((page) => page.members) ?? []
  const isEmpty = !isLoading && !isError && items.length === 0

  const loadMore = () => {
    if (!hasNextPage || isFetchingNextPage || isFetchNextPageError) return
    void fetchNextPage()
  }

  const retryLoadMore = () => {
    void fetchNextPage()
  }

  useEffect(() => {
    const root = scrollRef.current
    const sentinel = sentinelRef.current
    if (!root || !sentinel || !enabled) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore()
      },
      { root, rootMargin: "120px", threshold: 0 }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [
    enabled,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    items.length,
  ])

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <EmptyLoadingState />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <EmptyErrorState
          title="Failed to load media"
          description="Something went wrong while loading your media. Please try again later."
        />
      </div>
    )
  }

  if (isEmpty) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <EmptyState
          icon={<ImageIcon />}
          title="No media yet"
          description="You haven't uploaded any media yet. Get started by uploading your first file."
        />
      </div>
    )
  }

  return (
    <>
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <div className="flex flex-col gap-2">
          {items.map((media) => (
            <MediaAttachment
              key={media.id}
              media={media}
              onSelect={setSelected}
            />
          ))}
        </div>
        <div ref={sentinelRef} className="flex h-8 items-center justify-center">
          {isFetchingNextPage ? <Spinner /> : null}
          {isFetchNextPageError ? (
            <button
              type="button"
              className="text-muted-foreground text-xs underline"
              onClick={retryLoadMore}
            >
              Failed to load more. Retry
            </button>
          ) : null}
        </div>
      </div>

      <MediaDetailDrawer
        nested
        mediaId={selected?.id ?? null}
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) setSelected(null)
        }}
      />
    </>
  )
}

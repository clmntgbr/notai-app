"use client"

import { ActivityFeedItem } from "@/components/activity/activity-feed-item"
import {
  EmptyErrorState,
  EmptyLoadingState,
  EmptyState,
} from "@/components/ui/empty-state"
import { Spinner } from "@/components/ui/spinner"
import { useInfiniteActivity } from "@/lib/activity/hooks"
import { ActivityIcon } from "lucide-react"
import { useEffect, useRef } from "react"

export interface ActivityFeedInfiniteListProps {
  enabled?: boolean
}

export function ActivityFeedInfiniteList({
  enabled = true,
}: ActivityFeedInfiniteListProps) {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteActivity({ enabled })

  const scrollRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const items = data?.pages.flatMap((page) => page.members) ?? []
  const isEmpty = !isLoading && !isError && items.length === 0

  useEffect(() => {
    const root = scrollRef.current
    const sentinel = sentinelRef.current
    if (!root || !sentinel || !enabled) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage()
        }
      },
      { root, rootMargin: "120px", threshold: 0 }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [enabled, fetchNextPage, hasNextPage, isFetchingNextPage, items.length])

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
          title="Failed to load activity"
          description="Something went wrong while loading the activity feed. Please try again later."
        />
      </div>
    )
  }

  if (isEmpty) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <EmptyState
          icon={<ActivityIcon />}
          title="No activity yet"
          description="Recent events will appear here as your team uploads and reviews contents."
        />
      </div>
    )
  }

  return (
    <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <ActivityFeedItem key={item.id} item={item} wrap />
        ))}
      </div>
      <div ref={sentinelRef} className="flex h-8 items-center justify-center">
        {isFetchingNextPage ? <Spinner /> : null}
      </div>
    </div>
  )
}

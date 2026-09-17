"use client"

import { ActivityFeedItem } from "@/components/activity/activity-feed-item"
import {
  ActivityFilters,
  ActivityFiltersValue,
} from "@/components/activity/activity-filters"
import {
  EmptyErrorState,
  EmptyLoadingState,
  EmptyState,
} from "@/components/ui/empty-state"
import { Spinner } from "@/components/ui/spinner"
import { useDebouncedCallback } from "@/lib/centrifugo/use-debounced-callback"
import { useInfiniteActivity } from "@/lib/activity/hooks"
import { format } from "date-fns"
import { ActivityIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export interface ActivityFeedInfiniteListProps {
  enabled?: boolean
}

const EMPTY_FILTERS: ActivityFiltersValue = {
  search: "",
  campaignIds: [],
  dateRange: undefined,
}

export function ActivityFeedInfiniteList({
  enabled = true,
}: ActivityFeedInfiniteListProps) {
  const [filters, setFilters] = useState<ActivityFiltersValue>(EMPTY_FILTERS)
  const [debouncedSearch, setDebouncedSearch] = useState("")

  const updateSearch = useDebouncedCallback((search: string) => {
    setDebouncedSearch(search)
  }, 300)

  function handleFiltersChange(next: ActivityFiltersValue) {
    setFilters(next)
    if (next.search === filters.search) return
    // Flush immediately on clear so the native search ✕ updates the query.
    if (!next.search.trim()) {
      setDebouncedSearch("")
      return
    }
    updateSearch(next.search)
  }

  const from = filters.dateRange?.from
    ? format(filters.dateRange.from, "yyyy-MM-dd")
    : null
  const to =
    filters.dateRange?.from && filters.dateRange.to
      ? format(filters.dateRange.to, "yyyy-MM-dd")
      : null

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteActivity({
    enabled,
    campaignIds: filters.campaignIds,
    search: debouncedSearch,
    from,
    to,
  })

  const scrollRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const items = data?.pages.flatMap((page) => page.members) ?? []
  const isInitialLoading = isLoading && !data
  const isEmpty = !isInitialLoading && !isError && items.length === 0

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

  return (
    <>
      <ActivityFilters value={filters} onChange={handleFiltersChange} />

      {isInitialLoading ? (
        <div className="flex flex-1 items-center justify-center p-6">
          <EmptyLoadingState />
        </div>
      ) : isError && !data ? (
        <div className="flex flex-1 items-center justify-center p-6">
          <EmptyErrorState
            title="Failed to load activity"
            description="Something went wrong while loading the activity feed. Please try again later."
          />
        </div>
      ) : isEmpty ? (
        <div className="flex flex-1 items-center justify-center p-6">
          <EmptyState
            icon={<ActivityIcon />}
            title="No activity found"
            description="Try adjusting your filters or wait for new events."
          />
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="min-h-0 flex-1 overflow-y-auto px-4 py-4"
        >
          <div className="flex flex-col gap-2">
            {items.map((item) => (
              <ActivityFeedItem key={item.id} item={item} wrap />
            ))}
          </div>
          <div
            ref={sentinelRef}
            className="flex h-8 items-center justify-center"
          >
            {isFetchingNextPage ? <Spinner /> : null}
          </div>
        </div>
      )}
    </>
  )
}

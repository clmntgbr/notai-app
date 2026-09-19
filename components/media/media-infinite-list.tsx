"use client"

import { MediaAttachment } from "@/components/media/media-attachment"
import { MediaDetailDrawer } from "@/components/media/media-detail-drawer"
import {
  MediaFilters,
  MediaFiltersValue,
} from "@/components/media/media-filters"
import {
  EmptyErrorState,
  EmptyLoadingState,
  EmptyState,
} from "@/components/ui/empty-state"
import { Spinner } from "@/components/ui/spinner"
import { useDebouncedCallback } from "@/lib/centrifugo/use-debounced-callback"
import { splitMediaFilterKeys } from "@/lib/media/filters"
import { useInfiniteMedia } from "@/lib/media/hooks"
import { Media } from "@/lib/media/types"
import { format } from "date-fns"
import { ImageIcon } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"

export interface MediaInfiniteListProps {
  enabled?: boolean
  /** Lock queries to this campaign and hide the campaign filter. */
  campaignId?: string
  /** Nest media detail drawer (e.g. when already inside a drawer). */
  nested?: boolean
}

function emptyFilters(campaignId?: string): MediaFiltersValue {
  return {
    statuses: [],
    search: "",
    campaignIds: campaignId ? [campaignId] : [],
    dateRange: undefined,
  }
}

export function MediaInfiniteList({
  enabled = true,
  campaignId,
  nested = false,
}: MediaInfiniteListProps) {
  const [selected, setSelected] = useState<Media | null>(null)
  const [filters, setFilters] = useState<MediaFiltersValue>(() =>
    emptyFilters(campaignId)
  )
  const [debouncedSearch, setDebouncedSearch] = useState("")

  useEffect(() => {
    setFilters(emptyFilters(campaignId))
    setDebouncedSearch("")
  }, [campaignId])

  const updateSearch = useDebouncedCallback((search: string) => {
    setDebouncedSearch(search)
  }, 300)

  function handleFiltersChange(next: MediaFiltersValue) {
    const locked = campaignId
      ? { ...next, campaignIds: [campaignId] }
      : next
    setFilters(locked)
    if (locked.search === filters.search) return
    // Flush immediately on clear so the native search ✕ updates the query.
    if (!locked.search.trim()) {
      setDebouncedSearch("")
      return
    }
    updateSearch(locked.search)
  }

  const { statuses, verdicts } = splitMediaFilterKeys(filters.statuses)
  const from = filters.dateRange?.from
    ? format(filters.dateRange.from, "yyyy-MM-dd")
    : null
  const to =
    filters.dateRange?.from && filters.dateRange.to
      ? format(filters.dateRange.to, "yyyy-MM-dd")
      : null

  const campaignIds = useMemo(
    () => (campaignId ? [campaignId] : filters.campaignIds),
    [campaignId, filters.campaignIds]
  )

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useInfiniteMedia({
    enabled,
    campaignIds,
    search: debouncedSearch,
    statuses,
    verdicts,
    from,
    to,
  })

  const scrollRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const items = data?.pages.flatMap((page) => page.members) ?? []
  const isInitialLoading = isLoading && !data
  const isEmpty = !isInitialLoading && !isError && items.length === 0

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
    loadMore,
  ])

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <MediaFilters
        value={filters}
        onChange={handleFiltersChange}
        hideCampaignFilter={Boolean(campaignId)}
      />

      {isInitialLoading ? (
        <div className="flex flex-1 items-center justify-center p-6">
          <EmptyLoadingState />
        </div>
      ) : isError && !data ? (
        <div className="flex flex-1 items-center justify-center p-6">
          <EmptyErrorState
            title="Failed to load media"
            description="Something went wrong while loading your media. Please try again later."
          />
        </div>
      ) : isEmpty ? (
        <div className="flex flex-1 items-center justify-center p-6">
          <EmptyState
            icon={<ImageIcon />}
            title="No media found"
            description="Try adjusting your filters or upload a new file."
          />
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="min-h-0 flex-1 overflow-y-auto px-4 py-4"
        >
          <div className="flex flex-col gap-2">
            {items.map((media) => (
              <MediaAttachment
                key={media.id}
                media={media}
                onSelect={setSelected}
              />
            ))}
          </div>
          <div
            ref={sentinelRef}
            className="flex h-8 items-center justify-center"
          >
            {isFetchingNextPage ? <Spinner /> : null}
            {isFetchNextPageError ? (
              <button
                type="button"
                className="text-xs text-muted-foreground underline"
                onClick={retryLoadMore}
              >
                Failed to load more. Retry
              </button>
            ) : null}
          </div>
        </div>
      )}

      <MediaDetailDrawer
        nested={nested}
        mediaId={selected?.id ?? null}
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) setSelected(null)
        }}
      />
    </div>
  )
}

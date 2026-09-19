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
import { ListPagination } from "@/components/ui/list-pagination"
import { useDebouncedCallback } from "@/lib/centrifugo/use-debounced-callback"
import { splitMediaFilterKeys } from "@/lib/media/filters"
import { useMedia } from "@/lib/media/hooks"
import { Media } from "@/lib/media/types"
import { format } from "date-fns"
import { ImageIcon } from "lucide-react"
import { useEffect, useState } from "react"

const PAGE_LIMIT = 10

export interface CampaignMediaPanelProps {
  campaignId: string
}

function emptyFilters(campaignId: string): MediaFiltersValue {
  return {
    statuses: [],
    search: "",
    campaignIds: [campaignId],
    dateRange: undefined,
  }
}

export function CampaignMediaPanel({ campaignId }: CampaignMediaPanelProps) {
  const [selected, setSelected] = useState<Media | null>(null)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState<MediaFiltersValue>(() =>
    emptyFilters(campaignId)
  )
  const [debouncedSearch, setDebouncedSearch] = useState("")

  useEffect(() => {
    setFilters(emptyFilters(campaignId))
    setDebouncedSearch("")
    setPage(1)
  }, [campaignId])

  const updateSearch = useDebouncedCallback((search: string) => {
    setDebouncedSearch(search)
    setPage(1)
  }, 300)

  function handleFiltersChange(next: MediaFiltersValue) {
    const locked = { ...next, campaignIds: [campaignId] }
    setFilters(locked)

    const statusChanged =
      locked.statuses.join() !== filters.statuses.join() ||
      locked.dateRange?.from?.getTime() !== filters.dateRange?.from?.getTime() ||
      locked.dateRange?.to?.getTime() !== filters.dateRange?.to?.getTime()

    if (statusChanged) setPage(1)

    if (locked.search === filters.search) return
    // Flush immediately on clear so the native search ✕ updates the query.
    if (!locked.search.trim()) {
      setDebouncedSearch("")
      setPage(1)
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

  const { data, isLoading, isError, isFetching } = useMedia({
    page,
    limit: PAGE_LIMIT,
    campaignIds: [campaignId],
    search: debouncedSearch || undefined,
    statuses: statuses.length ? statuses : undefined,
    verdicts: verdicts.length ? verdicts : undefined,
    from,
    to,
    sortBy: "created_at",
    orderBy: "desc",
  })

  const items = data?.members ?? []
  const total = data?.total ?? 0
  const totalPages =
    data?.totalPages && data.totalPages > 0
      ? data.totalPages
      : total > 0
        ? Math.ceil(total / PAGE_LIMIT)
        : 0
  const isInitialLoading = isLoading && !data
  const isEmpty = !isInitialLoading && !isError && items.length === 0

  return (
    <>
      <MediaFilters
        value={filters}
        onChange={handleFiltersChange}
        hideCampaignFilter
      />

      {isInitialLoading ? (
        <div className="flex items-center justify-center p-6">
          <EmptyLoadingState />
        </div>
      ) : isError && !data ? (
        <div className="flex items-center justify-center p-6">
          <EmptyErrorState
            title="Failed to load media"
            description="Something went wrong while loading your media. Please try again later."
          />
        </div>
      ) : isEmpty ? (
        <div className="flex items-center justify-center p-6">
          <EmptyState
            icon={<ImageIcon />}
            title="No media found"
            description="Try adjusting your filters or upload a new file."
          />
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2 px-4 py-4">
            {items.map((media) => (
              <MediaAttachment
                key={media.id}
                media={media}
                onSelect={setSelected}
              />
            ))}
          </div>
          <ListPagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            disabled={isFetching}
          />
        </>
      )}

      <MediaDetailDrawer
        mediaId={selected?.id ?? null}
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) setSelected(null)
        }}
      />
    </>
  )
}

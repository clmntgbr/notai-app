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
import { ListPagination } from "@/components/ui/list-pagination"
import { useActivity } from "@/lib/activity/hooks"
import { useDebouncedCallback } from "@/lib/centrifugo/use-debounced-callback"
import { format } from "date-fns"
import { ActivityIcon } from "lucide-react"
import { useEffect, useState } from "react"

const PAGE_LIMIT = 10

export interface CampaignActivityPanelProps {
  campaignId: string
}

function emptyFilters(campaignId: string): ActivityFiltersValue {
  return {
    search: "",
    campaignIds: [campaignId],
    dateRange: undefined,
  }
}

export function CampaignActivityPanel({
  campaignId,
}: CampaignActivityPanelProps) {
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState<ActivityFiltersValue>(() =>
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

  function handleFiltersChange(next: ActivityFiltersValue) {
    const locked = { ...next, campaignIds: [campaignId] }
    setFilters(locked)

    const dateChanged =
      locked.dateRange?.from?.getTime() !== filters.dateRange?.from?.getTime() ||
      locked.dateRange?.to?.getTime() !== filters.dateRange?.to?.getTime()

    if (dateChanged) setPage(1)

    if (locked.search === filters.search) return
    // Flush immediately on clear so the native search ✕ updates the query.
    if (!locked.search.trim()) {
      setDebouncedSearch("")
      setPage(1)
      return
    }
    updateSearch(locked.search)
  }

  const from = filters.dateRange?.from
    ? format(filters.dateRange.from, "yyyy-MM-dd")
    : null
  const to =
    filters.dateRange?.from && filters.dateRange.to
      ? format(filters.dateRange.to, "yyyy-MM-dd")
      : null

  const { data, isLoading, isError, isFetching } = useActivity({
    page,
    limit: PAGE_LIMIT,
    campaignIds: [campaignId],
    search: debouncedSearch || undefined,
    from,
    to,
    sortBy: "occurred_at",
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
      <ActivityFilters
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
            title="Failed to load activity"
            description="Something went wrong while loading the activity feed. Please try again later."
          />
        </div>
      ) : isEmpty ? (
        <div className="flex items-center justify-center p-6">
          <EmptyState
            icon={<ActivityIcon />}
            title="No activity found"
            description="Try adjusting your filters or wait for new events."
          />
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2 px-4 py-4">
            {items.map((item) => (
              <ActivityFeedItem key={item.id} item={item} wrap />
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
    </>
  )
}

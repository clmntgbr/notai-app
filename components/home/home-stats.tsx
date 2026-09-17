"use client"

import { MediaStatsSection } from "@/components/media/media-stats-section"
import { StatsDateRangePicker } from "@/components/media/stats-date-range-picker"
import { useMediaStatsDateRange } from "@/components/media/use-media-stats-date-range"
import { Skeleton } from "@/components/ui/skeleton"

export function HomeStats() {
  const { range, from, to, dateReady, userControlled, onRangeChange } =
    useMediaStatsDateRange()

  return (
    <>
      <div className="flex justify-start px-4 lg:px-6">
        {dateReady ? (
          <StatsDateRangePicker
            value={range}
            onChange={onRangeChange}
            clearable={userControlled}
          />
        ) : (
          <Skeleton className="h-8 w-64 rounded-lg" />
        )}
      </div>
      <MediaStatsSection from={from} to={to} />
    </>
  )
}

"use client"

import { HomeSubheader } from "@/components/home/home-subheader"
import { MediaStatsSection } from "@/components/media/media-stats-section"
import { StatsDateRangePicker } from "@/components/media/stats-date-range-picker"
import { useMediaStatsDateRange } from "@/components/media/use-media-stats-date-range"
import { Skeleton } from "@/components/ui/skeleton"
import type { ReactNode } from "react"

export interface HomeStatsProps {
  children?: ReactNode
}

export function HomeStats({ children }: HomeStatsProps) {
  const { range, from, to, dateReady, userControlled, onRangeChange } =
    useMediaStatsDateRange()

  return (
    <>
      <HomeSubheader>
        {dateReady ? (
          <StatsDateRangePicker
            value={range}
            onChange={onRangeChange}
            clearable={userControlled}
          />
        ) : (
          <Skeleton className="h-8 w-64 rounded-lg" />
        )}
      </HomeSubheader>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <MediaStatsSection from={from} to={to} />
        {children}
      </div>
    </>
  )
}

"use client"

import { MediaMonthlyControlsChart } from "@/components/media/media-monthly-controls-chart"
import { MediaStatsPieChart } from "@/components/media/media-stats-pie-chart"
import { useMediaStats } from "@/lib/media/hooks"

export interface MediaStatsChartProps {
  campaignId?: string | null
  from?: string | null
  to?: string | null
}

export function MediaStatsChart({
  campaignId,
  from,
  to,
}: MediaStatsChartProps) {
  // Monthly trend is always unscoped — date range only affects KPIs / breakdown.
  const monthlyStats = useMediaStats({ campaignId })
  const rangedStats = useMediaStats({ campaignId, from, to })

  const monthlyLoading = monthlyStats.isLoading && !monthlyStats.data
  const rangedInitialLoading = rangedStats.isLoading && !rangedStats.data
  const showStale = rangedStats.isFetching && rangedStats.isPlaceholderData
  const counts = showStale ? undefined : rangedStats.data
  const pieLoading = rangedInitialLoading || showStale

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
      <div className="lg:col-span-1">
        <MediaStatsPieChart
          counts={counts}
          isLoading={pieLoading}
          isError={rangedStats.isError && !rangedStats.data}
        />
      </div>
      <div className="lg:col-span-3">
        <MediaMonthlyControlsChart
          months={monthlyStats.data?.monthlyControls}
          isLoading={monthlyLoading}
          isError={monthlyStats.isError && !monthlyStats.data}
        />
      </div>
    </div>
  )
}

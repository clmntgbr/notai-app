"use client"

import { MediaDailyControlsChart } from "@/components/media/media-daily-controls-chart"
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
  const { data, isLoading, isError, isPlaceholderData, isFetching } =
    useMediaStats({
      campaignId,
      from,
      to,
    })

  const isInitialLoading = isLoading && !data
  // Avoid painting previous-range series while the new range is loading.
  const showStale = isFetching && isPlaceholderData
  const days = showStale ? undefined : data?.dailyControls
  const counts = showStale ? undefined : data
  const chartsLoading = isInitialLoading || showStale

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
      <div className="lg:col-span-1">
        <MediaStatsPieChart
          counts={counts}
          isLoading={chartsLoading}
          isError={isError && !data}
        />
      </div>
      <div className="lg:col-span-3">
        <MediaDailyControlsChart
          days={days}
          from={from ?? data?.from}
          to={to ?? data?.to}
          isLoading={chartsLoading}
          isError={isError && !data}
        />
      </div>
    </div>
  )
}

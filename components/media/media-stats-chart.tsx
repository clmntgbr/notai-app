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
  const { data, isLoading, isError } = useMediaStats({
    campaignId,
    from,
    to,
  })
  const isInitialLoading = isLoading && !data

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
      <div className="lg:col-span-3">
        <MediaMonthlyControlsChart
          months={data?.monthlyControls}
          isLoading={isInitialLoading}
          isError={isError && !data}
        />
      </div>
      <div className="lg:col-span-1">
        <MediaStatsPieChart
          counts={data}
          isLoading={isInitialLoading}
          isError={isError && !data}
        />
      </div>
    </div>
  )
}

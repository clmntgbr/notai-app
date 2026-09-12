"use client"

import { MediaMonthlyControlsChart } from "@/components/media/media-monthly-controls-chart"
import { MediaStatsPieChart } from "@/components/media/media-stats-pie-chart"
import { useMediaStats } from "@/lib/media/hooks"

export function MediaStatsChart() {
  const { data, isLoading, isError } = useMediaStats()

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
      <div className="lg:col-span-3">
        <MediaMonthlyControlsChart
          months={data?.monthlyControls}
          isLoading={isLoading}
          isError={isError}
        />
      </div>
      <div className="lg:col-span-1">
        <MediaStatsPieChart
          counts={data}
          isLoading={isLoading}
          isError={isError}
        />
      </div>
    </div>
  )
}

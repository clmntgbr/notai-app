"use client"

import { ContentMonthlyControlsChart } from "@/components/content/content-monthly-controls-chart"
import { ContentStatsPieChart } from "@/components/content/content-stats-pie-chart"
import { useContentStats } from "@/lib/content/hooks"

export function ContentStatsChart() {
  const { data, isLoading, isError } = useContentStats()

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
      <div className="lg:col-span-3">
        <ContentMonthlyControlsChart
          months={data?.monthlyControls}
          isLoading={isLoading}
          isError={isError}
        />
      </div>
      <div className="lg:col-span-1">
        <ContentStatsPieChart
          counts={data}
          isLoading={isLoading}
          isError={isError}
        />
      </div>
    </div>
  )
}

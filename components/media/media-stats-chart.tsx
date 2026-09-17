"use client"

import { MediaMonthlyControlsChart } from "@/components/media/media-monthly-controls-chart"
import { MediaStatsPieChart } from "@/components/media/media-stats-pie-chart"
import { useMediaStats } from "@/lib/media/hooks"

export interface MediaStatsChartProps {
  campaignId?: string | null
  from?: string | null
  to?: string | null
  /**
   * When true (default), monthly controls fetch without from/to (all-time trend).
   * When false, reuse the same ranged stats query (e.g. campaign createdAt→today).
   */
  unscopedMonthly?: boolean
}

export function MediaStatsChart({
  campaignId,
  from,
  to,
  unscopedMonthly = true,
}: MediaStatsChartProps) {
  const monthlyStats = useMediaStats({
    campaignId,
    from: unscopedMonthly ? null : from,
    to: unscopedMonthly ? null : to,
  })
  const rangedStats = useMediaStats({ campaignId, from, to })

  // Unscoped key only changes on campaign/client switch — hide keepPreviousData bleed.
  const monthlyStale = monthlyStats.isPlaceholderData
  const monthlyLoading =
    (monthlyStats.isLoading && !monthlyStats.data) || monthlyStale

  // Same policy as SectionCards: keep previous values while a new range loads.
  const pieLoading = rangedStats.isLoading && !rangedStats.data

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
      <div className="lg:col-span-1">
        <MediaStatsPieChart
          counts={rangedStats.data}
          isLoading={pieLoading}
          isError={rangedStats.isError && !rangedStats.data}
        />
      </div>
      <div className="lg:col-span-3">
        <MediaMonthlyControlsChart
          months={monthlyStale ? undefined : monthlyStats.data?.monthlyControls}
          isLoading={monthlyLoading}
          isError={monthlyStats.isError && !monthlyStats.data}
        />
      </div>
    </div>
  )
}

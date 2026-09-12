"use client"

import {
  mediaResultChartConfig,
  MEDIA_RESULT_KEYS,
} from "@/components/media/media-result-chart-config"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  EmptyErrorState,
  EmptyLoadingState,
  EmptyState,
} from "@/components/ui/empty-state"
import { MediaStatsCounts } from "@/lib/media/types"
import { ChartPieIcon } from "lucide-react"
import { Pie, PieChart } from "recharts"

function toPieData(counts: MediaStatsCounts) {
  return MEDIA_RESULT_KEYS.map((key) => ({
    key,
    value: counts[key],
    fill: `var(--color-${key})`,
  }))
}

export interface MediaStatsPieChartProps {
  counts?: MediaStatsCounts | null
  isLoading?: boolean
  isError?: boolean
}

export function MediaStatsPieChart({
  counts,
  isLoading,
  isError,
}: MediaStatsPieChartProps) {
  const chartData = counts ? toPieData(counts) : []
  const total = counts
    ? MEDIA_RESULT_KEYS.reduce((sum, key) => sum + counts[key], 0)
    : 0

  return (
    <Card className="@container/card h-full gap-4 px-4">
      <CardHeader className="px-0">
        <CardTitle>Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="flex min-h-55 flex-1 flex-col items-center justify-center px-0">
        {isLoading ? (
          <EmptyLoadingState />
        ) : isError ? (
          <EmptyErrorState
            title="Failed to load stats"
            description="Something went wrong while loading media stats. Please try again later."
          />
        ) : total === 0 ? (
          <EmptyState
            icon={<ChartPieIcon />}
            title="No analyzed media yet"
            description="You haven't analyzed any media yet. Get started by uploading your first file."
          />
        ) : (
          <ChartContainer
            config={mediaResultChartConfig}
            className="mx-auto aspect-square max-h-65 w-full"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel nameKey="key" />}
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="key"
                innerRadius={45}
                strokeWidth={2}
              />
              <ChartLegend
                content={<ChartLegendContent nameKey="key" />}
                className="flex-wrap gap-2"
              />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}

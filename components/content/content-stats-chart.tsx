"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { EmptyErrorState, EmptyLoadingState, EmptyState } from "@/components/ui/empty-state"
import { useContentStats } from "@/lib/content/hooks"
import { ContentStats } from "@/lib/content/types"
import { ChartPieIcon } from "lucide-react"
import { Pie, PieChart } from "recharts"

const chartConfig = {
  human: {
    label: "Human",
    color: "oklch(0.55 0.15 163)",
  },
  uncertain: {
    label: "Review",
    color: "oklch(0.7 0.15 70)",
  },
  aiGenerated: {
    label: "AI",
    color: "oklch(0.6 0.2 20)",
  },
  failed: {
    label: "Failed",
    color: "oklch(0.65 0.14 230)",
  },
} satisfies ChartConfig

const STAT_KEYS = [
  "human",
  "uncertain",
  "aiGenerated",
  "failed",
] as const satisfies ReadonlyArray<keyof ContentStats>

function toChartData(stats: ContentStats) {
  return STAT_KEYS.map((key) => ({
    key,
    value: stats[key],
    fill: `var(--color-${key})`,
  })).filter((item) => item.value > 0)
}

export function ContentStatsChart() {
  const { data, isLoading, isError } = useContentStats()
  const chartData = data ? toChartData(data) : []
  const total = data ? STAT_KEYS.reduce((sum, key) => sum + data[key], 0) : 0

  return (
    <Card className="@container/card h-full gap-4 px-4">
      <CardHeader className="sr-only px-0">
        <CardTitle>Content breakdown</CardTitle>
      </CardHeader>
      <CardContent className="flex min-h-55 flex-1 flex-col items-center justify-center px-0">
        {isLoading ? (
          <EmptyLoadingState />
        ) : isError ? (
          <EmptyErrorState
            title="Failed to load stats"
            description="Something went wrong while loading content stats. Please try again later."
          />
        ) : total === 0 ? (
          <EmptyState
            icon={<ChartPieIcon />}
            title="No analyzed contents yet"
            description="You haven't analyzed any contents yet. Get started by analyzing your first content."
          />
        ) : (
          <ChartContainer
            config={chartConfig}
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
                innerRadius={50}
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

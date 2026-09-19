"use client"

import {
  fillDailyControlsToRange,
  formatControlDay,
  MEDIA_CONTROLS_SERIES_KEYS,
  MEDIA_RESULT_KEYS,
  mediaControlsTotal,
  mediaResultChartConfig,
} from "@/components/media/media-result-chart-config"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import { MediaDailyControls } from "@/lib/media/types"
import { ChartLineIcon } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

export interface MediaDailyControlsChartProps {
  days?: MediaDailyControls[] | null
  from?: string | null
  to?: string | null
  isLoading?: boolean
  isError?: boolean
}

export function MediaDailyControlsChart({
  days,
  from,
  to,
  isLoading,
  isError,
}: MediaDailyControlsChartProps) {
  const filled = fillDailyControlsToRange(days, from, to)
  const chartData = filled.map((entry) => ({
    day: formatControlDay(entry.day),
    total: mediaControlsTotal(entry),
    human: entry.human,
    uncertain: entry.uncertain,
    aiGenerated: entry.aiGenerated,
    failed: entry.failed,
  }))

  const hasData = chartData.some(
    (entry) =>
      entry.total > 0 || MEDIA_RESULT_KEYS.some((key) => entry[key] > 0)
  )

  return (
    <Card className="@container/card h-full gap-4 px-4">
      <CardHeader className="px-0">
        <CardTitle>Daily controls</CardTitle>
        <CardDescription>Trend by day</CardDescription>
      </CardHeader>
      <CardContent className="flex min-h-55 flex-1 flex-col items-center justify-center px-0">
        {isLoading ? (
          <EmptyLoadingState />
        ) : isError ? (
          <EmptyErrorState
            title="Failed to load daily controls"
            description="Something went wrong while loading daily controls. Please try again later."
          />
        ) : !hasData ? (
          <EmptyState
            icon={<ChartLineIcon />}
            title="No daily controls yet"
            description="Analyzed media will appear here by day."
          />
        ) : (
          <ChartContainer
            config={mediaResultChartConfig}
            className="aspect-auto h-65 w-full"
          >
            <AreaChart data={chartData} margin={{ left: 0, right: 8, top: 8 }}>
              <defs>
                {MEDIA_CONTROLS_SERIES_KEYS.map((key) => (
                  <linearGradient
                    key={key}
                    id={`fill-${key}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={`var(--color-${key})`}
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="95%"
                      stopColor={`var(--color-${key})`}
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                width={32}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
              />
              <ChartLegend
                content={<ChartLegendContent />}
                verticalAlign="bottom"
              />
              {MEDIA_CONTROLS_SERIES_KEYS.map((key) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={`var(--color-${key})`}
                  strokeWidth={key === "total" ? 2.5 : 2}
                  fill={`url(#fill-${key})`}
                  fillOpacity={1}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              ))}
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}

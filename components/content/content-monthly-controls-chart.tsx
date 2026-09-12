"use client"

import {
  CONTENT_MONTHLY_SERIES_KEYS,
  CONTENT_RESULT_KEYS,
  contentMonthTotal,
  contentResultChartConfig,
  formatControlMonth,
} from "@/components/content/content-result-chart-config"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { EmptyErrorState, EmptyLoadingState, EmptyState } from "@/components/ui/empty-state"
import { ContentMonthlyControls } from "@/lib/content/types"
import { ChartLineIcon } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

export interface ContentMonthlyControlsChartProps {
  months?: ContentMonthlyControls[] | null
  isLoading?: boolean
  isError?: boolean
}

export function ContentMonthlyControlsChart({
  months,
  isLoading,
  isError,
}: ContentMonthlyControlsChartProps) {
  const chartData = (months ?? []).map((entry) => ({
    month: formatControlMonth(entry.month),
    total: contentMonthTotal(entry),
    human: entry.human,
    uncertain: entry.uncertain,
    aiGenerated: entry.aiGenerated,
    failed: entry.failed,
  }))

  const hasData = chartData.some(
    (entry) =>
      entry.total > 0 || CONTENT_RESULT_KEYS.some((key) => entry[key] > 0)
  )

  return (
    <Card className="@container/card h-full gap-4 px-4">
      <CardHeader className="px-0">
        <CardTitle>Monthly controls</CardTitle>
      </CardHeader>
      <CardContent className="flex min-h-55 flex-1 flex-col items-center justify-center px-0">
        {isLoading ? (
          <EmptyLoadingState />
        ) : isError ? (
          <EmptyErrorState
            title="Failed to load monthly controls"
            description="Something went wrong while loading monthly controls. Please try again later."
          />
        ) : !hasData ? (
          <EmptyState
            icon={<ChartLineIcon />}
            title="No monthly controls yet"
            description="Analyzed contents will appear here by month."
          />
        ) : (
          <ChartContainer
            config={contentResultChartConfig}
            className="aspect-auto h-65 w-full"
          >
            <AreaChart data={chartData} margin={{ left: 0, right: 8, top: 8 }}>
              <defs>
                {CONTENT_MONTHLY_SERIES_KEYS.map((key) => (
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
                dataKey="month"
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
              {CONTENT_MONTHLY_SERIES_KEYS.map((key) => (
                <Area
                  key={key}
                  type="linear"
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

"use client"

import {
  contentResultChartConfig,
  CONTENT_RESULT_KEYS,
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
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

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
    human: entry.human,
    uncertain: entry.uncertain,
    aiGenerated: entry.aiGenerated,
    failed: entry.failed,
  }))

  const hasData = chartData.some((entry) =>
    CONTENT_RESULT_KEYS.some((key) => entry[key] > 0)
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
            <LineChart data={chartData} margin={{ left: 0, right: 8 }}>
              <CartesianGrid vertical={false} />
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
                width={28}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
              />
              <ChartLegend content={<ChartLegendContent />} />
              {CONTENT_RESULT_KEYS.map((key) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={`var(--color-${key})`}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}

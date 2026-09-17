"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useMediaStats } from "@/lib/media/hooks"
import type { MediaKpis } from "@/lib/media/types"
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"

function formatCount(value: number) {
  return new Intl.NumberFormat("en-US").format(value)
}

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`
}

function formatSignedPercent(value: number) {
  const sign = value > 0 ? "+" : ""
  return `${sign}${value.toFixed(1)}%`
}

function formatSignedPoints(value: number) {
  const sign = value > 0 ? "+" : ""
  return `${sign}${value.toFixed(1)} pts`
}

function changeFooter(
  value: number | null,
  comparisonLabel: string,
  format: "percent" | "points" = "percent"
) {
  if (value == null) return ""
  const label =
    format === "points" ? formatSignedPoints(value) : formatSignedPercent(value)
  return `${label} ${comparisonLabel}`
}

function TrendBadge({
  value,
  format = "percent",
  higherIsBetter = true,
}: {
  value: number
  format?: "percent" | "points"
  higherIsBetter?: boolean
}) {
  const isUp = value > 0
  const isFlat = value === 0
  const Icon = isUp ? TrendingUpIcon : TrendingDownIcon
  const label =
    format === "points" ? formatSignedPoints(value) : formatSignedPercent(value)
  const isGood = higherIsBetter ? value >= 0 : value <= 0

  return (
    <Badge
      variant="outline"
      className={isGood || isFlat ? undefined : "text-destructive"}
    >
      {!isFlat ? <Icon /> : null}
      {label}
    </Badge>
  )
}

function KpiCard({
  description,
  title,
  trend,
  trendFormat,
  higherIsBetter,
  footerPrimary,
  footerSecondary,
}: {
  description: string
  title: string
  trend?: number | null
  trendFormat?: "percent" | "points"
  higherIsBetter?: boolean
  footerPrimary: string
  footerSecondary?: string
}) {
  return (
    <Card className="@container/card h-full">
      <CardHeader>
        <CardDescription>{description}</CardDescription>
        <CardTitle className="min-h-[1.2em] text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {title}
        </CardTitle>
        <CardAction className={trend == null ? "invisible" : undefined}>
          <TrendBadge
            value={trend ?? 0}
            format={trendFormat}
            higherIsBetter={higherIsBetter}
          />
        </CardAction>
      </CardHeader>
      <CardFooter className="mt-auto flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 min-h-5 font-medium">
          {footerPrimary || "\u00a0"}
        </div>
        {footerSecondary ? (
          <div className="text-muted-foreground">{footerSecondary}</div>
        ) : null}
      </CardFooter>
    </Card>
  )
}

function KpiCardsSkeleton() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} className="@container/card h-full">
          <CardHeader>
            <div className="h-4 w-28 animate-pulse rounded bg-muted" />
            <div className="mt-2 h-8 w-20 animate-pulse rounded bg-muted" />
          </CardHeader>
          <CardFooter className="flex-col items-start gap-2">
            <div className="h-4 w-40 animate-pulse rounded bg-muted" />
            <div className="h-3 w-32 animate-pulse rounded bg-muted" />
          </CardFooter>
        </Card>
      ))}
    </>
  )
}

function MediaKpiCards({
  kpis,
  customRange,
}: {
  kpis: MediaKpis
  customRange: boolean
}) {
  const hasVerifications = kpis.verifications > 0
  const comparisonLabel = customRange ? "vs previous period" : "vs last month"
  const verificationsLabel = customRange
    ? "Verifications"
    : "Verifications this month"

  return (
    <>
      <KpiCard
        description={verificationsLabel}
        title={formatCount(kpis.verifications)}
        trend={kpis.verificationsChangePercent}
        footerPrimary={changeFooter(
          kpis.verificationsChangePercent,
          comparisonLabel
        )}
      />
      <KpiCard
        description="Authenticity rate"
        title={
          hasVerifications ? formatPercent(kpis.authenticityRatePercent) : "—"
        }
        trend={hasVerifications ? kpis.authenticityChangePoints : null}
        trendFormat="points"
        footerPrimary={
          hasVerifications
            ? `${formatCount(kpis.validatedCount)} classified human`
            : "\u00a0"
        }
      />
      <KpiCard
        description="AI rate"
        title={
          hasVerifications ? formatPercent(kpis.aiGeneratedSharePercent) : "—"
        }
        footerPrimary={
          hasVerifications
            ? `${formatCount(kpis.aiGeneratedCount)} classified AI`
            : "\u00a0"
        }
      />
      <KpiCard
        description="To review"
        title={formatCount(kpis.toReviewCount)}
        trend={kpis.toReviewChangePercent}
        higherIsBetter={false}
        footerPrimary={changeFooter(
          kpis.toReviewChangePercent,
          comparisonLabel
        )}
      />
    </>
  )
}

export interface SectionCardsProps {
  campaignId?: string | null
  from?: string | null
  to?: string | null
}

export function SectionCards({ campaignId, from, to }: SectionCardsProps) {
  const { data, isLoading, isError } = useMediaStats({
    campaignId,
    from,
    to,
  })
  const kpis = data?.kpis
  const customRange = Boolean(from)
  const isInitialLoading = isLoading && !data

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      {isInitialLoading ? (
        <KpiCardsSkeleton />
      ) : isError && !kpis ? (
        <Card className="@container/card @5xl/main:col-span-4">
          <CardHeader>
            <CardDescription>Media KPIs</CardDescription>
            <CardTitle className="text-base font-medium">
              Failed to load KPIs
            </CardTitle>
          </CardHeader>
          <CardFooter className="text-sm text-muted-foreground">
            Something went wrong while loading your media stats.
          </CardFooter>
        </Card>
      ) : kpis ? (
        <MediaKpiCards kpis={kpis} customRange={customRange} />
      ) : null}
    </div>
  )
}

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
  format: "percent" | "points" = "percent"
) {
  if (value == null) return ""
  const label =
    format === "points" ? formatSignedPoints(value) : formatSignedPercent(value)
  return `${label} vs last month`
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
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{description}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {title}
        </CardTitle>
        {trend != null ? (
          <CardAction>
            <TrendBadge
              value={trend}
              format={trendFormat}
              higherIsBetter={higherIsBetter}
            />
          </CardAction>
        ) : null}
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        {footerPrimary ? (
          <div className="line-clamp-1 flex gap-2 font-medium">
            {footerPrimary}
          </div>
        ) : null}
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
        <Card key={index} className="@container/card">
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

function MediaKpiCards({ kpis }: { kpis: MediaKpis }) {
  const hasVerifications = kpis.verifications > 0

  return (
    <>
      <KpiCard
        description="Verifications this month"
        title={formatCount(kpis.verifications)}
        trend={kpis.verificationsChangePercent}
        footerPrimary={changeFooter(kpis.verificationsChangePercent)}
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
            : ""
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
            : ""
        }
      />
      <KpiCard
        description="To review"
        title={formatCount(kpis.toReviewCount)}
        trend={kpis.toReviewChangePercent}
        higherIsBetter={false}
        footerPrimary={changeFooter(kpis.toReviewChangePercent)}
      />
    </>
  )
}

export interface SectionCardsProps {
  campaignId?: string | null
}

export function SectionCards({ campaignId }: SectionCardsProps) {
  const { data, isPending, isError } = useMediaStats(campaignId)
  const kpis = data?.kpis

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      {isPending ? (
        <KpiCardsSkeleton />
      ) : isError || !kpis ? (
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
      ) : (
        <MediaKpiCards kpis={kpis} />
      )}
    </div>
  )
}

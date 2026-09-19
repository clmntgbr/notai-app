"use client"

import { CampaignHeader } from "@/components/campaign/campaign-header"
import { CampaignMediaList } from "@/components/media/campaign-media-list"
import { MediaStatsSection } from "@/components/media/media-stats-section"
import { StatsDateRangePicker } from "@/components/media/stats-date-range-picker"
import { useMediaStatsDateRange } from "@/components/media/use-media-stats-date-range"
import { Skeleton } from "@/components/ui/skeleton"
import { useCampaignDetail } from "@/lib/campaign/hooks"
import { Loader2Icon } from "lucide-react"
import { useParams } from "next/navigation"

export function CampaignDetail() {
  const params = useParams<{ id: string }>()
  const campaignId = params.id
  const { data: campaign, isLoading, isError } = useCampaignDetail(campaignId)
  const { range, from, to, dateReady, onRangeChange } =
    useMediaStatsDateRange(campaignId, {
      defaultFrom: campaign?.createdAt,
      enabled: Boolean(campaign?.createdAt),
    })

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-4 text-sm text-muted-foreground lg:px-6">
        <Loader2Icon className="size-4 animate-spin" />
        Loading campaign…
      </div>
    )
  }

  if (isError || !campaign) {
    return (
      <p className="px-4 text-sm text-destructive lg:px-6">
        Failed to load campaign.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div className="px-4 lg:px-6">
        <CampaignHeader
          campaign={campaign}
          dateRangePicker={
            dateReady ? (
              <StatsDateRangePicker
                value={range}
                onChange={onRangeChange}
                clearable={false}
                disabled
              />
            ) : (
              <Skeleton className="h-8 w-64 rounded-lg" />
            )
          }
        />
      </div>
      <MediaStatsSection
        campaignId={campaign.id}
        from={from}
        to={to}
      />
      <div className="px-4 lg:px-6">
        <CampaignMediaList campaignId={campaign.id} />
      </div>
    </div>
  )
}

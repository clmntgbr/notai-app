"use client"

import { CampaignHeader } from "@/components/campaign/campaign-header"
import { CampaignSubheader } from "@/components/campaign/campaign-subheader"
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
      <div className="flex flex-1 flex-col">
        <CampaignSubheader>
          <Skeleton className="h-8 w-64 rounded-lg" />
        </CampaignSubheader>
        <div className="flex items-center gap-2 px-4 py-4 text-sm text-muted-foreground lg:px-6 md:py-6">
          <Loader2Icon className="size-4 animate-spin" />
          Loading campaign…
        </div>
      </div>
    )
  }

  if (isError || !campaign) {
    return (
      <div className="flex flex-1 flex-col">
        <CampaignSubheader />
        <p className="px-4 py-4 text-sm text-destructive lg:px-6 md:py-6">
          Failed to load campaign.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col">
      <CampaignSubheader>
        {dateReady ? (
          <StatsDateRangePicker
            value={range}
            onChange={onRangeChange}
            clearable={false}
            disabled
          />
        ) : (
          <Skeleton className="h-8 w-64 rounded-lg" />
        )}
      </CampaignSubheader>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <CampaignHeader campaign={campaign} />
        </div>
        <MediaStatsSection campaignId={campaign.id} from={from} to={to} />
        <div className="px-4 lg:px-6">
          <CampaignMediaList campaignId={campaign.id} />
        </div>
      </div>
    </div>
  )
}

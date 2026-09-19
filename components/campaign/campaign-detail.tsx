"use client"

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
  const { data: campaign, isPending, isError } = useCampaignDetail(campaignId)
  const { range, from, to, dateReady, onRangeChange } = useMediaStatsDateRange(
    campaignId,
    {
      defaultFrom: campaign?.startAt ?? campaign?.createdAt,
      defaultTo: campaign?.endAt,
      enabled: Boolean(campaign?.startAt ?? campaign?.createdAt),
    }
  )

  if (isPending) {
    return (
      <div className="flex flex-1 flex-col">
        <CampaignSubheader campaign={campaign}>
          <Skeleton className="h-8 w-64 rounded-lg" />
        </CampaignSubheader>
        <div className="flex items-center gap-2 px-4 py-4 text-sm text-muted-foreground md:py-6 lg:px-6">
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
        <p className="px-4 py-4 text-sm text-destructive md:py-6 lg:px-6">
          Failed to load campaign.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col">
      <CampaignSubheader campaign={campaign}>
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
        <MediaStatsSection campaignId={campaign.id} from={from} to={to} />
        <div className="px-4 lg:px-6">
          <CampaignMediaList campaignId={campaign.id} />
        </div>
      </div>
    </div>
  )
}

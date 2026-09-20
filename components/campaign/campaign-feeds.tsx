"use client"

import { ActivityFeed } from "@/components/activity/activity-feed"
import { RecentMedia } from "@/components/media/recent-media"

export interface CampaignFeedsProps {
  campaignId: string
}

export function CampaignFeeds({ campaignId }: CampaignFeedsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:px-6">
      <RecentMedia campaignId={campaignId} />
      <ActivityFeed campaignId={campaignId} />
    </div>
  )
}

"use client"

import { CampaignActivityPanel } from "@/components/campaign/campaign-activity-panel"
import { CampaignMediaPanel } from "@/components/campaign/campaign-media-panel"
import { Card } from "@/components/ui/card"

export interface CampaignFeedsProps {
  campaignId: string
}

export function CampaignFeeds({ campaignId }: CampaignFeedsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:px-6">
      <Card className="flex flex-col gap-0 overflow-hidden py-0">
        <CampaignMediaPanel key={campaignId} campaignId={campaignId} />
      </Card>
      <Card className="flex flex-col gap-0 overflow-hidden py-0">
        <CampaignActivityPanel key={campaignId} campaignId={campaignId} />
      </Card>
    </div>
  )
}

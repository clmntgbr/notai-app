"use client"

import { useCampaignDetail } from "@/lib/campaign/hooks"
import { Loader2Icon } from "lucide-react"
import { useParams } from "next/navigation"

export function CampaignDetail() {
  const params = useParams<{ id: string }>()
  const campaignId = params.id
  const { data: campaign, isLoading, isError } = useCampaignDetail(campaignId)

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
    <div className="space-y-2 px-4 lg:px-6">
      <h1 className="text-xl font-semibold">{campaign.name}</h1>
      <p className="text-sm text-muted-foreground">
        Status: {campaign.backgroundStatus}
      </p>
    </div>
  )
}

"use client"

import { CampaignMediaList } from "@/components/media/campaign-media-list"
import { ImageUploadButton } from "@/components/image-upload/image-upload-button"
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
    <div className="space-y-6 px-4 lg:px-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">{campaign.name}</h1>
          <p className="text-sm text-muted-foreground">
            Status: {campaign.backgroundStatus}
          </p>
        </div>
        <ImageUploadButton campaignId={campaign.id} />
      </div>
      <CampaignMediaList campaignId={campaign.id} />
    </div>
  )
}

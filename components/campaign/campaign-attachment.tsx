"use client"

import { CampaignContentCountBadges } from "@/components/campaign/campaign-content-count-badges"
import { ImageUploadButton } from "@/components/image-upload/image-upload-button"
import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from "@/components/ui/attachment"
import {
  Campaign,
  campaignHasContentActivity,
  EMPTY_CAMPAIGN_CONTENT_COUNTS,
} from "@/lib/campaign/types"
import { format } from "date-fns"
import { ImageIcon } from "lucide-react"
import Link from "next/link"

function scheduleLabel(campaign: Campaign): string {
  const start = campaign.startAt
    ? format(new Date(campaign.startAt), "PP")
    : null
  const end = campaign.endAt ? format(new Date(campaign.endAt), "PP") : null

  if (start && end) return `${start} → ${end}`
  if (start) return `From ${start}`
  if (end) return `Until ${end}`
  return "No schedule"
}

export interface CampaignAttachmentProps {
  campaign: Campaign
}

export function CampaignAttachment({ campaign }: CampaignAttachmentProps) {
  const hasThumbnail = Boolean(campaign.backgroundThumbnailUrl)
  const counts = campaign.contentCounts ?? EMPTY_CAMPAIGN_CONTENT_COUNTS
  const showUploadCta = !campaignHasContentActivity(counts)

  return (
    <Attachment
      orientation="vertical"
      className="w-78! max-w-none has-data-[slot=attachment-content]:w-78!"
    >
      <AttachmentMedia variant={hasThumbnail ? "image" : "icon"}>
        {hasThumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={campaign.backgroundThumbnailUrl} alt="" />
        ) : (
          <ImageIcon />
        )}
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>{campaign.name}</AttachmentTitle>
        <AttachmentDescription>{scheduleLabel(campaign)}</AttachmentDescription>
        {showUploadCta ? (
          <div
            className="relative z-20 mt-2 flex justify-center pt-1"
            onClick={(event) => event.stopPropagation()}
            onPointerDown={(event) => event.stopPropagation()}
          >
            <ImageUploadButton campaignId={campaign.id} />
          </div>
        ) : (
          <CampaignContentCountBadges counts={counts} />
        )}
      </AttachmentContent>
      <AttachmentTrigger asChild>
        <Link
          href={`/campaign/${campaign.id}`}
          aria-label={`Open ${campaign.name}`}
        />
      </AttachmentTrigger>
    </Attachment>
  )
}

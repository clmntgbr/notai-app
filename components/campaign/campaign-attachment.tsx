"use client"

import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from "@/components/ui/attachment"
import { Campaign } from "@/lib/campaign/types"
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

  return (
    <Attachment
      orientation="vertical"
      className="w-72! max-w-none has-data-[slot=attachment-content]:w-56!"
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

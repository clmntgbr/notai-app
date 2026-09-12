"use client"

import { CampaignContentCountBadges } from "@/components/campaign/campaign-content-count-badges"
import { CampaignDrawer } from "@/components/campaign/campaign-drawer"
import { ImageUploadButton } from "@/components/image-upload/image-upload-button"
import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from "@/components/ui/attachment"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  CAMPAIGN_SCHEDULE_STATUS_LABEL,
  getCampaignScheduleStatus,
  type CampaignScheduleStatus,
} from "@/lib/campaign/schedule-status"
import {
  Campaign,
  campaignHasContentActivity,
  EMPTY_CAMPAIGN_CONTENT_COUNTS,
} from "@/lib/campaign/types"
import { cn } from "cn"
import { format } from "date-fns"
import { ImageIcon, PencilIcon } from "lucide-react"
import Link from "next/link"
import * as React from "react"

const STATUS_BADGE_CLASS: Record<CampaignScheduleStatus, string> = {
  active:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400",
  upcoming:
    "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950/50 dark:text-sky-400",
  ended: "border-border bg-muted text-muted-foreground",
  unscheduled: "border-border bg-background text-muted-foreground",
}

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
  const [editOpen, setEditOpen] = React.useState(false)
  const hasThumbnail = Boolean(campaign.backgroundThumbnailUrl)
  const counts = campaign.contentCounts ?? EMPTY_CAMPAIGN_CONTENT_COUNTS
  const showUploadCta = !campaignHasContentActivity(counts)
  const status = getCampaignScheduleStatus(campaign)

  return (
    <>
      <Attachment
        orientation="vertical"
        className="w-78! max-w-none has-data-[slot=attachment-content]:w-78!"
      >
        <Badge
          variant="outline"
          className={cn(
            "absolute inset-s-4 top-4 z-20 h-5 px-1.5 text-[10px]",
            STATUS_BADGE_CLASS[status]
          )}
        >
          {CAMPAIGN_SCHEDULE_STATUS_LABEL[status]}
        </Badge>
        <div
          className="absolute inset-e-4 top-4 z-20"
          onClick={(event) => event.stopPropagation()}
          onPointerDown={(event) => event.stopPropagation()}
        >
          <Button
            type="button"
            variant="outline"
            size="icon-xs"
            className="size-7 rounded-full border-border bg-background shadow-none"
            aria-label={`Edit ${campaign.name}`}
            onClick={() => setEditOpen(true)}
          >
            <PencilIcon className="size-3.5" />
          </Button>
        </div>
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
          <AttachmentDescription>
            {scheduleLabel(campaign)}
          </AttachmentDescription>
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
      <CampaignDrawer
        open={editOpen}
        onOpenChange={setEditOpen}
        campaign={campaign}
      />
    </>
  )
}

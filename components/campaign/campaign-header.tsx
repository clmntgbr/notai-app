"use client"

import { ImageUploadButton } from "@/components/image-upload/image-upload-button"
import { Button } from "@/components/ui/button"
import { type CampaignScheduleStatus } from "@/lib/campaign/schedule-status"
import { Campaign } from "@/lib/campaign/types"
import { format } from "date-fns"
import { FileIcon } from "lucide-react"
import type { ReactNode } from "react"
import { ButtonGroup } from "../ui/button-group"

const STATUS_BADGE_CLASS: Record<CampaignScheduleStatus, string> = {
  active:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400",
  upcoming:
    "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950/50 dark:text-sky-400",
  ended: "border-border bg-muted text-muted-foreground",
  unscheduled: "border-border bg-background text-muted-foreground",
}

function formatDay(value: string) {
  return format(new Date(value), "PP")
}

function scheduleMeta(campaign: Campaign): string {
  const start = campaign.startAt ? formatDay(campaign.startAt) : null
  const end = campaign.endAt ? formatDay(campaign.endAt) : null
  if (start && end) return `${start} → ${end}`
  if (start) return `From ${start}`
  if (end) return `Until ${end}`
  return `Created ${formatDay(campaign.createdAt)}`
}

export interface CampaignHeaderProps {
  campaign: Campaign
  /** Optional control rendered next to the title (e.g. stats date range). */
  dateRangePicker?: ReactNode
}

export function CampaignHeader({
  campaign,
  dateRangePicker,
}: CampaignHeaderProps) {
  return (
    <section className="rounded-xl bg-card p-0 shadow-none">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="truncate text-xl font-bold tracking-tight">
                {campaign.name}
              </h1>
              <span className="flex items-center gap-1.5">
                {dateRangePicker}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 pl-12 lg:pl-0">
          <ButtonGroup>
            <Button variant="outline">
              <FileIcon className="size-4" /> Export as PDF
            </Button>
            <Button variant="outline">
              <FileIcon className="size-4" /> Export as CSV
            </Button>
            <ImageUploadButton
              campaignId={campaign.id}
              title="Upload media"
              size="default"
              className="gap-2"
            />
          </ButtonGroup>
        </div>
      </div>
    </section>
  )
}

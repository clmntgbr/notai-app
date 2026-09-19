"use client"

import { ImageUploadButton } from "@/components/image-upload/image-upload-button"
import { Button } from "@/components/ui/button"
import { Campaign } from "@/lib/campaign/types"
import { FileIcon } from "lucide-react"
import { ButtonGroup } from "../ui/button-group"

export interface CampaignHeaderProps {
  campaign: Campaign
}

export function CampaignHeader({ campaign }: CampaignHeaderProps) {
  return (
    <section className="rounded-xl bg-card p-0 shadow-none">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold tracking-tight">
              {campaign.name}
            </h1>
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

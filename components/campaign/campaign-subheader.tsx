import { Campaign } from "@/lib/campaign/types"
import { FileIcon } from "lucide-react"
import type { ReactNode } from "react"
import { ImageUploadButton } from "../image-upload/image-upload-button"
import { Button } from "../ui/button"
import { ButtonGroup } from "../ui/button-group"

export interface CampaignSubheaderProps {
  children?: ReactNode
  campaign?: Campaign
}

export function CampaignSubheader({
  children,
  campaign,
}: CampaignSubheaderProps) {
  return (
    <div className="relative flex h-(--header-height) shrink-0 items-center border-b px-4 lg:px-6">
      {campaign ? (
        <h1 className="truncate text-xl font-bold tracking-tight">
          {campaign.name}
        </h1>
      ) : null}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {children}
      </div>
      {campaign ? (
        <div className="ml-auto">
          <ButtonGroup>
            <Button variant="outline" size="sm">
              <FileIcon className="size-4" /> Export as PDF
            </Button>
            <Button variant="outline" size="sm">
              <FileIcon className="size-4" /> Export as CSV
            </Button>
            <ImageUploadButton
              campaignId={campaign.id}
              title="Upload media"
              size="sm"
            />
          </ButtonGroup>
        </div>
      ) : null}
    </div>
  )
}

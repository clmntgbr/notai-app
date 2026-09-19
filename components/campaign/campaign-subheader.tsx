"use client"

import { ImageUploadButton } from "@/components/image-upload/image-upload-button"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Campaign } from "@/lib/campaign/types"
import {
  DownloadIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  SheetIcon,
} from "lucide-react"
import type { ReactNode } from "react"

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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" aria-label="Export options">
                  <DownloadIcon className="size-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <FileTextIcon />
                    export as pdf
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <SheetIcon />
                    export as csv
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileSpreadsheetIcon />
                    export as xls
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
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

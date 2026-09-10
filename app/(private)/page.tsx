"use client"

import { Campaigns } from "@/components/campaigns"
import { ImageUploadButton } from "@/components/image-upload/image-upload-button"
import { SectionCards } from "@/components/section-cards"
import { AppSidebar } from "@/components/sidebar"
import { SidebarHeader } from "@/components/sidebar-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

export default function Page() {
  // No current campaign on the home page yet — backend will use the default campaign.
  const currentCampaignId: string | null = null

  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SidebarHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <div className="flex items-center justify-end px-4 lg:px-6">
                  <ImageUploadButton campaignId={currentCampaignId} />
                </div>
                <SectionCards />
                <Campaigns />
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}

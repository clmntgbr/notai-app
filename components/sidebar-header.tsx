"use client"

import { AppBreadcrumb } from "@/components/app-breadcrumb"
import { openSubscriptionDrawer } from "@/components/billing/subscription-drawer-host"
import { CreateCampaignButton } from "@/components/campaign/create-campaign-button"
import { ImageUploadButton } from "@/components/image-upload/image-upload-button"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { CreditCardIcon } from "lucide-react"
import Link from "next/link"

export function SidebarHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ms-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <AppBreadcrumb />
      </div>

      <div className="flex items-center justify-end gap-2 px-4 lg:px-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/pricing">Pricing</Link>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => openSubscriptionDrawer()}
        >
          <CreditCardIcon className="size-4" />
          Subscription
        </Button>
        <ImageUploadButton />
        <CreateCampaignButton />
      </div>
    </header>
  )
}

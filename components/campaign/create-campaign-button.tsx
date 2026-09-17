"use client"

import { CampaignDrawer } from "@/components/campaign/campaign-drawer"
import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { PlusIcon } from "lucide-react"
import * as React from "react"

export function CreateCampaignButton({
  className,
  size = "sm",
}: {
  className?: string
  size?: "default" | "sm" | "lg" | "xs"
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <HoverCard openDelay={10} closeDelay={100}>
        <HoverCardTrigger asChild>
          <Button
            type="button"
            size={size}
            className={className}
            onClick={() => setOpen(true)}
          >
            <PlusIcon className="size-4" />
            New campaign
          </Button>
        </HoverCardTrigger>
        <HoverCardContent
          align="end"
          className="flex w-64 flex-col gap-0.5"
        >
          <div className="font-semibold">New campaign</div>
          <div>
            Create a campaign to organize contents. You can set a name and an
            optional background image.
          </div>
        </HoverCardContent>
      </HoverCard>
      <CampaignDrawer open={open} onOpenChange={setOpen} campaign={null} />
    </>
  )
}

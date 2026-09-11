"use client"

import { CampaignDrawer } from "@/components/campaign/campaign-drawer"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import * as React from "react"

export function CreateCampaignButton() {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Button type="button" size="sm" onClick={() => setOpen(true)}>
        <PlusIcon className="size-4" />
        New campaign
      </Button>
      <CampaignDrawer open={open} onOpenChange={setOpen} campaign={null} />
    </>
  )
}

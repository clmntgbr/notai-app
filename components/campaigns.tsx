"use client"

import { CampaignDrawer } from "@/components/campaign/campaign-drawer"
import { Button } from "@/components/ui/button"
import { useCampaigns } from "@/lib/campaign/hooks"
import { Campaign } from "@/lib/campaign/types"
import { Loader2Icon, PlusIcon } from "lucide-react"
import * as React from "react"

export function Campaigns() {
  const { data, isLoading } = useCampaigns()
  const campaigns = data?.members ?? []
  const [open, setOpen] = React.useState(false)
  const [selected, setSelected] = React.useState<Campaign | null>(null)

  function openCreate() {
    setSelected(null)
    setOpen(true)
  }

  function openEdit(campaign: Campaign) {
    setSelected(campaign)
    setOpen(true)
  }

  return (
    <div className="space-y-3 px-4 lg:px-6">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-base font-medium">Campaigns</h2>
        <Button type="button" size="sm" onClick={openCreate}>
          <PlusIcon className="size-4" />
          New campaign
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2Icon className="size-4 animate-spin" />
          Loading…
        </div>
      ) : campaigns.length === 0 ? (
        <p className="text-sm text-muted-foreground">No campaigns yet.</p>
      ) : (
        <ul className="divide-y rounded-lg border">
          {campaigns.map((campaign) => (
            <li key={campaign.id}>
              <button
                type="button"
                className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-muted/50"
                onClick={() => openEdit(campaign)}
              >
                <div className="bg-muted flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md border">
                  {campaign.backgroundThumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={campaign.backgroundThumbnailUrl}
                      alt=""
                      className="size-full object-cover"
                    />
                  ) : (
                    <span className="text-[10px] text-muted-foreground">
                      {campaign.backgroundStatus}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{campaign.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Background: {campaign.backgroundStatus}
                  </p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      <CampaignDrawer
        open={open}
        onOpenChange={setOpen}
        campaign={selected}
      />
    </div>
  )
}

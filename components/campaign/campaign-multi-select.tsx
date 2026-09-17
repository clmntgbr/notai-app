"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useCampaigns } from "@/lib/campaign/hooks"
import { cn } from "cn"
import { ChevronsUpDownIcon } from "lucide-react"
import { useState } from "react"

export interface CampaignMultiSelectProps {
  value: string[]
  onValueChange: (campaignIds: string[]) => void
  disabled?: boolean
  className?: string
  triggerClassName?: string
}

export function CampaignMultiSelect({
  value,
  onValueChange,
  disabled = false,
  className,
  triggerClassName,
}: CampaignMultiSelectProps) {
  const [open, setOpen] = useState(false)
  const { data, isLoading } = useCampaigns({
    page: 1,
    limit: 100,
    sortBy: "name",
    orderBy: "asc",
  })

  const campaigns = data?.members ?? []
  const selected = campaigns.filter((campaign) => value.includes(campaign.id))

  function toggle(campaignId: string) {
    if (value.includes(campaignId)) {
      onValueChange(value.filter((id) => id !== campaignId))
      return
    }
    onValueChange([...value, campaignId])
  }

  const label =
    selected.length === 0
      ? ""
      : selected.length === 1
        ? selected[0].name
        : `${selected.length} campaigns`

  return (
    <Popover open={open} onOpenChange={setOpen} modal={false}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled || isLoading}
          className={cn(
            "h-8 w-full justify-between border border-input bg-transparent px-3 font-normal text-sm shadow-xs",
            "hover:bg-transparent hover:text-foreground",
            triggerClassName
          )}
        >
          <span className="min-w-0 truncate">{label}</span>
          <ChevronsUpDownIcon className="size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className={cn("w-(--radix-popover-trigger-width) p-1", className)}
      >
        {campaigns.length === 0 ? (
          <p className="px-2 py-3 text-center text-muted-foreground text-xs">
            {isLoading ? "Loading…" : "No campaigns"}
          </p>
        ) : (
          <div className="max-h-64 overflow-y-auto">
            {campaigns.map((campaign) => {
              const checked = value.includes(campaign.id)
              const checkboxId = `campaign-multi-${campaign.id}`

              return (
                <div
                  key={campaign.id}
                  role="option"
                  aria-selected={checked}
                  className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
                  onClick={() => toggle(campaign.id)}
                >
                  <Checkbox
                    id={checkboxId}
                    checked={checked}
                    tabIndex={-1}
                    className="pointer-events-none"
                  />
                  <span className="min-w-0 truncate">{campaign.name}</span>
                </div>
              )
            })}
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

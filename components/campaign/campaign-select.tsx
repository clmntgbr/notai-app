"use client"

import { RadioDropdown } from "@/components/radio-dropdown"
import { useCampaigns } from "@/lib/campaign/hooks"
import { Campaign } from "@/lib/campaign/types"

const ALL_CAMPAIGNS_VALUE = "__all__"

type CampaignOption = {
  id: string
  name: string
}

export interface CampaignSelectProps {
  value: string | null
  onValueChange: (campaignId: string | null) => void
  disabled?: boolean
  id?: string
  className?: string
  triggerClassName?: string
  placeholder?: string
  /** Keep the menu interactive inside drawers / dialogs. */
  modal?: boolean
}

export function CampaignSelect({
  value,
  onValueChange,
  disabled = false,
  id,
  className,
  triggerClassName,
  placeholder = "All campaigns",
  modal = false,
}: CampaignSelectProps) {
  const { data, isLoading } = useCampaigns({
    page: 1,
    limit: 100,
    sortBy: "name",
    orderBy: "asc",
  })

  const campaigns = data?.members ?? []
  const options: CampaignOption[] = [
    { id: ALL_CAMPAIGNS_VALUE, name: placeholder },
    ...campaigns.map((campaign: Campaign) => ({
      id: campaign.id,
      name: campaign.name,
    })),
  ]

  const selected =
    options.find((option) =>
      value ? option.id === value : option.id === ALL_CAMPAIGNS_VALUE
    ) ?? options[0]

  return (
    <RadioDropdown
      id={id}
      options={options}
      value={selected}
      onValueChange={(option) => {
        onValueChange(
          option.id === ALL_CAMPAIGNS_VALUE ? null : option.id
        )
      }}
      getValue={(option) => option.id}
      getLabel={(option) => option.name}
      placeholder={placeholder}
      groupLabel="Campaign"
      disabled={disabled || isLoading}
      className={className}
      triggerClassName={triggerClassName}
      contentClassName="min-w-(--radix-dropdown-menu-trigger-width)"
      modal={modal}
    />
  )
}

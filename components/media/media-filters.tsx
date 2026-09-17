"use client"

import { CampaignSelect } from "@/components/campaign/campaign-select"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { MEDIA_FILTER_OPTIONS, MediaFilterKey } from "@/lib/media/filters"
import { cn } from "cn"

export interface MediaFiltersValue {
  statuses: MediaFilterKey[]
  search: string
  campaignId: string | null
}

export interface MediaFiltersProps {
  value: MediaFiltersValue
  onChange: (value: MediaFiltersValue) => void
}

export function MediaFilters({ value, onChange }: MediaFiltersProps) {
  function setStatus(key: MediaFilterKey, checked: boolean) {
    const has = value.statuses.includes(key)
    if (checked && !has) {
      onChange({ ...value, statuses: [...value.statuses, key] })
      return
    }
    if (!checked && has) {
      onChange({
        ...value,
        statuses: value.statuses.filter((item) => item !== key),
      })
    }
  }

  return (
    <div className="flex w-full flex-col gap-3 border-b px-4 py-3">
      <div className="grid w-full grid-cols-7 gap-1.5">
        {MEDIA_FILTER_OPTIONS.map((option) => {
          const checked = value.statuses.includes(option.key)
          const checkboxId = `media-filter-${option.key}`

          return (
            <div
              key={option.key}
              className={cn(
                "inline-flex cursor-pointer items-center justify-center gap-1 rounded-full border px-1.5 py-1 text-[11px] font-medium whitespace-nowrap transition-opacity",
                option.className
              )}
              onClick={() => setStatus(option.key, !checked)}
            >
              <Checkbox
                id={checkboxId}
                checked={checked}
                tabIndex={-1}
                className="pointer-events-none size-3 shrink-0"
              />
              <span>{option.label}</span>
            </div>
          )
        })}
      </div>

      <div className="grid w-full gap-2 sm:grid-cols-2">
        <Input
          type="search"
          value={value.search}
          onChange={(event) =>
            onChange({ ...value, search: event.target.value })
          }
          placeholder="Search by filename"
          aria-label="Search by filename"
          className="w-full"
        />
        <CampaignSelect
          value={value.campaignId}
          onValueChange={(campaignId) => onChange({ ...value, campaignId })}
          className="w-full"
          triggerClassName="h-8 w-full"
        />
      </div>
    </div>
  )
}

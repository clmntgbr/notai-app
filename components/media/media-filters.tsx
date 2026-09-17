"use client"

import { CampaignMultiSelect } from "@/components/campaign/campaign-multi-select"
import { StatsDateRangePicker } from "@/components/media/stats-date-range-picker"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { MEDIA_FILTER_OPTIONS, MediaFilterKey } from "@/lib/media/filters"
import { cn } from "cn"
import type { DateRange } from "react-day-picker"

export interface MediaFiltersValue {
  statuses: MediaFilterKey[]
  search: string
  campaignIds: string[]
  dateRange?: DateRange
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
                className={cn(
                  "pointer-events-none size-3.5 shrink-0 rounded-[3px] bg-transparent shadow-none",
                  "data-checked:text-white dark:data-checked:text-white",
                  "[&_[data-slot=checkbox-indicator]>svg]:size-2.5",
                  option.checkboxClassName
                )}
              />
              <span>{option.label}</span>
            </div>
          )
        })}
      </div>

      <div className="grid w-full gap-2 sm:grid-cols-2">
        <CampaignMultiSelect
          value={value.campaignIds}
          onValueChange={(campaignIds) =>
            onChange({ ...value, campaignIds })
          }
        />
        <StatsDateRangePicker
          value={value.dateRange}
          onChange={(dateRange) => onChange({ ...value, dateRange })}
          placeholder=""
          clearable
        />
      </div>

      <Input
        type="search"
        value={value.search}
        onChange={(event) =>
          onChange({ ...value, search: event.target.value })
        }
        onSearch={(event) =>
          onChange({ ...value, search: event.currentTarget.value })
        }
        placeholder="Search by filename"
        aria-label="Search by filename"
        className="w-full"
      />
    </div>
  )
}

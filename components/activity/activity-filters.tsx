"use client"

import { CampaignMultiSelect } from "@/components/campaign/campaign-multi-select"
import { StatsDateRangePicker } from "@/components/media/stats-date-range-picker"
import { Input } from "@/components/ui/input"
import type { DateRange } from "react-day-picker"

export interface ActivityFiltersValue {
  search: string
  campaignIds: string[]
  dateRange?: DateRange
}

export interface ActivityFiltersProps {
  value: ActivityFiltersValue
  onChange: (value: ActivityFiltersValue) => void
}

export function ActivityFilters({ value, onChange }: ActivityFiltersProps) {
  return (
    <div className="flex w-full flex-col gap-3 border-b px-4 py-3">
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
        placeholder="Search by message"
        aria-label="Search by message"
        className="w-full"
      />
    </div>
  )
}

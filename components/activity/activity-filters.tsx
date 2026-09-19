"use client"

import { CampaignMultiSelect } from "@/components/campaign/campaign-multi-select"
import { StatsDateRangePicker } from "@/components/media/stats-date-range-picker"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "cn"
import { XIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

export interface ActivityFiltersValue {
  search: string
  campaignIds: string[]
  dateRange?: DateRange
}

export interface ActivityFiltersProps {
  value: ActivityFiltersValue
  onChange: (value: ActivityFiltersValue) => void
  /** Hide campaign multi-select (e.g. when scoped to one campaign). */
  hideCampaignFilter?: boolean
}

export function ActivityFilters({
  value,
  onChange,
  hideCampaignFilter = false,
}: ActivityFiltersProps) {
  return (
    <div className="flex w-full flex-col gap-3 border-b px-4 py-3">
      <div
        className={cn(
          "grid w-full gap-2",
          hideCampaignFilter ? "grid-cols-1" : "sm:grid-cols-2"
        )}
      >
        {hideCampaignFilter ? null : (
          <CampaignMultiSelect
            value={value.campaignIds}
            onValueChange={(campaignIds) =>
              onChange({ ...value, campaignIds })
            }
          />
        )}
        <StatsDateRangePicker
          value={value.dateRange}
          onChange={(dateRange) => onChange({ ...value, dateRange })}
          placeholder=""
          clearable
        />
      </div>

      <div className="flex min-w-0 items-center gap-2">
        <Input
          type="text"
          value={value.search}
          onChange={(event) =>
            onChange({ ...value, search: event.target.value })
          }
          placeholder="Search by message"
          aria-label="Search by message"
          className="min-w-0 flex-1"
        />
        {value.search ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0"
            aria-label="Clear search"
            onClick={() => onChange({ ...value, search: "" })}
          >
            <XIcon className="size-4" />
          </Button>
        ) : null}
      </div>
    </div>
  )
}

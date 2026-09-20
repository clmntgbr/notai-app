"use client"

import { CampaignMultiSelect } from "@/components/campaign/campaign-multi-select"
import { MediaStatusMultiSelect } from "@/components/media/media-status-multi-select"
import { StatsDateRangePicker } from "@/components/media/stats-date-range-picker"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MediaFilterKey } from "@/lib/media/filters"
import { XIcon } from "lucide-react"
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
  /** Hide campaign multi-select (e.g. when scoped to one campaign). */
  hideCampaignFilter?: boolean
}

export function MediaFilters({
  value,
  onChange,
  hideCampaignFilter = false,
}: MediaFiltersProps) {
  return (
    <div className="flex w-full flex-col gap-3 border-b px-4 py-3">
      <div className="grid w-full grid-cols-2 gap-2">
        <MediaStatusMultiSelect
          value={value.statuses}
          onValueChange={(statuses) => onChange({ ...value, statuses })}
        />
        {hideCampaignFilter ? (
          <StatsDateRangePicker
            value={value.dateRange}
            onChange={(dateRange) => onChange({ ...value, dateRange })}
            placeholder=""
            clearable
          />
        ) : (
          <CampaignMultiSelect
            value={value.campaignIds}
            onValueChange={(campaignIds) =>
              onChange({ ...value, campaignIds })
            }
          />
        )}
        {hideCampaignFilter ? null : (
          <StatsDateRangePicker
            value={value.dateRange}
            onChange={(dateRange) => onChange({ ...value, dateRange })}
            placeholder=""
            clearable
          />
        )}
        <div className="flex min-w-0 items-center gap-2">
          <Input
            type="text"
            value={value.search}
            onChange={(event) =>
              onChange({ ...value, search: event.target.value })
            }
            placeholder="Search by filename"
            aria-label="Search by filename"
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
    </div>
  )
}

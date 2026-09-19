"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "cn"
import { format } from "date-fns"
import { CalendarIcon, XIcon } from "lucide-react"
import { useState } from "react"
import type { DateRange } from "react-day-picker"

export interface StatsDateRangePickerProps {
  value?: DateRange
  onChange: (range: DateRange | undefined) => void
  className?: string
  /** Button label when no range is selected. Empty string = icon only. */
  placeholder?: string
  /** Show clear control (e.g. only after the user overrides the default). */
  clearable?: boolean
  /** Read-only display — no calendar / clear. */
  disabled?: boolean
}

export function StatsDateRangePicker({
  value,
  onChange,
  className,
  placeholder = "Date range",
  clearable = true,
  disabled = false,
}: StatsDateRangePickerProps) {
  const [open, setOpen] = useState(false)

  const label = (() => {
    if (!value?.from) return placeholder
    if (!value.to) return format(value.from, "LLL d, y")
    return `${format(value.from, "LLL d, y")} – ${format(value.to, "LLL d, y")}`
  })()

  if (disabled) {
    return (
      <div className={cn("flex min-w-0 items-center gap-2", className)}>
        <Button
          type="button"
          variant="outline"
          disabled
          className={cn(
            "min-w-0 flex-1 justify-start gap-2 font-normal",
            !value?.from && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="size-4 shrink-0 opacity-70" />
          {label ? <span className="truncate">{label}</span> : null}
        </Button>
      </div>
    )
  }

  return (
    <div className={cn("flex min-w-0 items-center gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "min-w-0 flex-1 justify-start gap-2 font-normal",
              !value?.from && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="size-4 shrink-0 opacity-70" />
            {label ? <span className="truncate">{label}</span> : null}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            numberOfMonths={2}
            selected={value}
            defaultMonth={value?.from}
            onSelect={onChange}
          />
        </PopoverContent>
      </Popover>
      {clearable && value?.from ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0"
          aria-label="Clear date range"
          onClick={() => onChange(undefined)}
        >
          <XIcon className="size-4" />
        </Button>
      ) : null}
    </div>
  )
}

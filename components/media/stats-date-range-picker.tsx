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
  /** Show clear control (e.g. only after the user overrides the default). */
  clearable?: boolean
}

export function StatsDateRangePicker({
  value,
  onChange,
  className,
  clearable = true,
}: StatsDateRangePickerProps) {
  const [open, setOpen] = useState(false)

  const label = (() => {
    if (!value?.from) return "Date range"
    if (!value.to) return format(value.from, "LLL d, y")
    return `${format(value.from, "LLL d, y")} – ${format(value.to, "LLL d, y")}`
  })()

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "justify-start gap-2 font-normal",
              !value?.from && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="size-4 opacity-70" />
            <span className="truncate">{label}</span>
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
          aria-label="Clear date range"
          onClick={() => onChange(undefined)}
        >
          <XIcon className="size-4" />
        </Button>
      ) : null}
    </div>
  )
}

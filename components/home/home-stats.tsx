"use client"

import { StatsDateRangePicker } from "@/components/media/stats-date-range-picker"
import { MediaStatsChart } from "@/components/media/media-stats-chart"
import { SectionCards } from "@/components/section-cards"
import { Skeleton } from "@/components/ui/skeleton"
import { useMediaStats } from "@/lib/media/hooks"
import { format } from "date-fns"
import { useEffect, useState } from "react"
import type { DateRange } from "react-day-picker"

/** Parse API ISO / date string as a local calendar day (avoid TZ day-shift). */
function parseApiDate(value: string): Date {
  const day = value.slice(0, 10)
  const [year, month, date] = day.split("-").map(Number)
  return new Date(year, month - 1, date)
}

export function HomeStats() {
  const [range, setRange] = useState<DateRange | undefined>()
  const [userControlled, setUserControlled] = useState(false)

  const from =
    userControlled && range?.from ? format(range.from, "yyyy-MM-dd") : null
  const to =
    userControlled && range?.from && range.to
      ? format(range.to, "yyyy-MM-dd")
      : null

  const { data } = useMediaStats({ from, to })
  const dateReady = Boolean(range?.from)

  useEffect(() => {
    if (userControlled || !data?.from) return
    setRange({
      from: parseApiDate(data.from),
      to: data.to ? parseApiDate(data.to) : undefined,
    })
  }, [data?.from, data?.to, userControlled])

  function handleRangeChange(next: DateRange | undefined) {
    if (!next?.from) {
      setUserControlled(false)
      setRange(undefined)
      return
    }
    setUserControlled(true)
    setRange(next)
  }

  return (
    <>
      <div className="flex justify-start px-4 lg:px-6">
        {dateReady ? (
          <StatsDateRangePicker
            value={range}
            onChange={handleRangeChange}
            clearable={userControlled}
          />
        ) : (
          <Skeleton className="h-8 w-64 rounded-lg" />
        )}
      </div>
      <SectionCards from={from} to={to} />
      <div className="px-4 lg:px-6">
        <MediaStatsChart from={from} to={to} />
      </div>
    </>
  )
}

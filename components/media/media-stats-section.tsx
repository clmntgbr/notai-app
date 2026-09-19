"use client"

import { MediaStatsChart } from "@/components/media/media-stats-chart"
import { SectionCards } from "@/components/section-cards"

export interface MediaStatsSectionProps {
  campaignId?: string | null
  from?: string | null
  to?: string | null
}

export function MediaStatsSection({
  campaignId,
  from = null,
  to = null,
}: MediaStatsSectionProps) {
  return (
    <>
      <SectionCards campaignId={campaignId} from={from} to={to} />
      <div className="px-4 lg:px-6">
        <MediaStatsChart campaignId={campaignId} from={from} to={to} />
      </div>
    </>
  )
}

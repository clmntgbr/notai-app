"use client"

import { CampaignContentCounts } from "@/lib/campaign/types"
import { cn } from "cn"
import {
  BanIcon,
  CircleXIcon,
  ShieldCheckIcon,
  TriangleAlertIcon,
} from "lucide-react"

const badgeClassName =
  "inline-flex h-5 items-center gap-0.5 rounded-full border px-1.5 text-[10px] font-medium"

const COUNT_BADGES = [
  {
    key: "human",
    label: "Human",
    icon: ShieldCheckIcon,
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400",
  },
  {
    key: "uncertain",
    label: "Review",
    icon: TriangleAlertIcon,
    className:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-400",
  },
  {
    key: "aiGenerated",
    label: "AI",
    icon: CircleXIcon,
    className:
      "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-400",
  },
  {
    key: "failed",
    label: "Failed",
    icon: BanIcon,
    className:
      "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950/50 dark:text-sky-400",
  },
] as const satisfies ReadonlyArray<{
  key: keyof CampaignContentCounts
  label: string
  icon: typeof ShieldCheckIcon
  className: string
}>

export interface CampaignContentCountBadgesProps {
  counts: CampaignContentCounts
  className?: string
}

export function CampaignContentCountBadges({
  counts,
  className,
}: CampaignContentCountBadgesProps) {
  return (
    <div className={cn("relative z-20 mt-1.5 flex flex-wrap justify-center gap-1.5", className)}>
      {COUNT_BADGES.map(({ key, label, icon: Icon, className: tone }) => (
        <span key={key} className={cn(badgeClassName, tone)} title={label}>
          <Icon className="size-3" />
          {label} {counts[key]}
        </span>
      ))}
    </div>
  )
}

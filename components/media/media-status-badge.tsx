"use client"

import { Media, MediaVerdictLabel } from "@/lib/media/types"
import { cn } from "cn"
import {
  BanIcon,
  CircleXIcon,
  ClockIcon,
  FilmIcon,
  LoaderCircleIcon,
  ShieldCheckIcon,
  TriangleAlertIcon,
  UploadIcon,
  type LucideIcon,
} from "lucide-react"

const badgeClassName =
  "inline-flex h-5 shrink-0 items-center gap-0.5 rounded-full border px-1.5 text-[10px] font-medium"

const RESULT_BADGES: Record<
  MediaVerdictLabel | "failed",
  { label: string; icon: LucideIcon; className: string }
> = {
  human: {
    label: "Human",
    icon: ShieldCheckIcon,
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400",
  },
  uncertain: {
    label: "To review",
    icon: TriangleAlertIcon,
    className:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-400",
  },
  ai_generated: {
    label: "AI",
    icon: CircleXIcon,
    className:
      "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-400",
  },
  failed: {
    label: "Failed",
    icon: BanIcon,
    className:
      "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950/50 dark:text-sky-400",
  },
}

const STATUS_BADGES: Partial<
  Record<Media["status"], { label: string; icon: LucideIcon; className: string }>
> = {
  pending_upload: {
    label: "Waiting",
    icon: ClockIcon,
    className: "border-border bg-muted text-muted-foreground",
  },
  uploaded: {
    label: "Uploaded",
    icon: UploadIcon,
    className: "border-border bg-muted text-muted-foreground",
  },
  processing: {
    label: "Processing",
    icon: LoaderCircleIcon,
    className:
      "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950/50 dark:text-sky-400",
  },
}

function resolveBadge(media: Media) {
  if (media.status === "failed") {
    return RESULT_BADGES.failed
  }

  if (media.verdict?.label && media.verdict.label in RESULT_BADGES) {
    const base = RESULT_BADGES[media.verdict.label]
    if (media.mediaType === "video" && media.verdict.totalCount > 0) {
      return {
        ...base,
        label: `${base.label} · ${media.verdict.flaggedCount}/${media.verdict.totalCount}`,
      }
    }
    return base
  }

  return STATUS_BADGES[media.status] ?? null
}

export interface MediaStatusBadgeProps {
  media: Media
  className?: string
}

export function MediaStatusBadge({ media, className }: MediaStatusBadgeProps) {
  const badge = resolveBadge(media)
  if (!badge) return null

  const Icon = badge.icon

  return (
    <span
      className={cn(badgeClassName, badge.className, className)}
      title={badge.label}
    >
      {media.mediaType === "video" ? (
        <FilmIcon className="size-3" />
      ) : (
        <Icon
          className={cn(
            "size-3",
            media.status === "processing" && !media.verdict && "animate-spin"
          )}
        />
      )}
      {badge.label}
    </span>
  )
}

"use client"

import { DeleteMediaDialog } from "@/components/media/delete-media-dialog"
import { MediaStatusBadge } from "@/components/media/media-status-badge"
import { Media } from "@/lib/media/types"
import { format } from "date-fns"
import { CirclePlayIcon, Trash2Icon } from "lucide-react"
import { useState, type MouseEvent } from "react"

function canRelaunch(status: Media["status"]) {
  return status === "failed" || status === "uploaded" || status === "analyzed"
}

export interface MediaAttachmentActionsProps {
  media: Media
}

export function MediaAttachmentActions({ media }: MediaAttachmentActionsProps) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const createdAt = media.createdAt ? new Date(media.createdAt) : null
  const dateLabel =
    createdAt && !Number.isNaN(createdAt.getTime())
      ? format(createdAt, "MMM d, yyyy")
      : null

  function handleRelaunch(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation()
  }

  return (
    <>
      <div className="relative ms-auto h-6 min-w-22 shrink-0 self-center pe-1">
        <div className="absolute inset-y-0 right-0 flex items-center gap-1.5 transition-opacity duration-200 group-hover/attachment:opacity-0">
          <MediaStatusBadge media={media} />
        </div>

        <div className="absolute inset-y-0 -right-1 flex items-center gap-px rounded-full border border-border bg-background p-px opacity-0 transition-opacity duration-200 ease-out group-hover/attachment:opacity-100">
          <button
            type="button"
            aria-label={`Relaunch ${media.filename}`}
            title={
              canRelaunch(media.status)
                ? "Relaunch analysis"
                : "Relaunch unavailable for this status"
            }
            disabled={!canRelaunch(media.status)}
            className="grid size-6 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-sky-50 hover:text-sky-600 disabled:pointer-events-none disabled:opacity-40 dark:hover:bg-sky-500/10 dark:hover:text-sky-400"
            onClick={handleRelaunch}
          >
            <CirclePlayIcon className="size-3" strokeWidth={1.6} />
          </button>
          <button
            type="button"
            aria-label={`Delete ${media.filename}`}
            title="Delete media"
            className="grid size-6 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400"
            onClick={(event) => {
              event.stopPropagation()
              setIsDeleteOpen(true)
            }}
          >
            <Trash2Icon className="size-3" strokeWidth={1.6} />
          </button>
        </div>
      </div>

      <DeleteMediaDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        filename={media.filename}
        onConfirm={() => setIsDeleteOpen(false)}
      />
    </>
  )
}

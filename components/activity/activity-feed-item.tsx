"use client"

import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"
import { ActivityItem } from "@/lib/activity/types"
import { format } from "date-fns"
import { ActivityIcon } from "lucide-react"

export interface ActivityFeedItemProps {
  item: ActivityItem
  /** When true, message wraps fully (drawer). Otherwise title is capped at 2 lines. */
  wrap?: boolean
}

export function ActivityFeedItem({
  item,
  wrap = false,
}: ActivityFeedItemProps) {
  return (
    <Attachment className="w-full items-center border-0">
      <AttachmentMedia>
        <ActivityIcon />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle
          className={
            wrap
              ? "overflow-visible font-normal wrap-break-word whitespace-normal"
              : "line-clamp-2 font-normal wrap-break-word whitespace-normal"
          }
        >
          {item.message}
        </AttachmentTitle>
        <AttachmentDescription
          className={
            wrap
              ? "overflow-visible wrap-break-word whitespace-normal"
              : undefined
          }
        >
          {item.actorName} · {format(new Date(item.occurredAt), "d MMM")}
        </AttachmentDescription>
      </AttachmentContent>
    </Attachment>
  )
}

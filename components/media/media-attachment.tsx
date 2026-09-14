"use client"

import { MediaStatusBadge } from "@/components/media/media-status-badge"
import {
  Attachment,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"
import { Spinner } from "@/components/ui/spinner"
import { Media, mediaHasThumbnail } from "@/lib/media/types"
import {
  CheckIcon,
  ClockIcon,
  FileWarningIcon,
  FilmIcon,
  ImageIcon,
} from "lucide-react"

function toAttachmentState(
  status: Media["status"]
): "idle" | "uploading" | "processing" | "error" | "done" {
  switch (status) {
    case "pending_upload":
      return "idle"
    case "processing":
      return "processing"
    case "failed":
    case "uploaded":
    case "analyzed":
      return "done"
    default:
      return "idle"
  }
}

function StatusIcon({ media }: { media: Media }) {
  switch (media.status) {
    case "pending_upload":
      return <ClockIcon />
    case "processing":
      return <Spinner />
    case "failed":
      return <FileWarningIcon />
    case "uploaded":
    case "analyzed":
      return media.mediaType === "video" ? <FilmIcon /> : <CheckIcon />
    default:
      return media.mediaType === "video" ? <FilmIcon /> : <ImageIcon />
  }
}

export interface MediaAttachmentProps {
  media: Media
  onSelect?: (media: Media) => void
}

export function MediaAttachment({ media, onSelect }: MediaAttachmentProps) {
  const state = toAttachmentState(media.status)
  const showThumbnail = mediaHasThumbnail(media)

  return (
    <Attachment
      state={state}
      className={
        onSelect ? "w-full cursor-pointer items-center" : "w-full items-center"
      }
      onClick={onSelect ? () => onSelect(media) : undefined}
    >
      <AttachmentMedia variant={showThumbnail ? "image" : "icon"}>
        {showThumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={media.thumbnailUrl!} alt={media.filename} />
        ) : (
          <StatusIcon media={media} />
        )}
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>{media.filename}</AttachmentTitle>
        <AttachmentDescription>
          {(media.failureReason && (
            <span className="text-red-500">{media.failureReason}</span>
          )) ??
            media.campaign?.name}
        </AttachmentDescription>
      </AttachmentContent>
      <AttachmentActions className="ms-auto self-center pe-1">
        <MediaStatusBadge media={media} />
      </AttachmentActions>
    </Attachment>
  )
}

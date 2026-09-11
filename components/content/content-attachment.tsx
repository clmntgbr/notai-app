"use client"

import { ContentStatusBadge } from "@/components/content/content-status-badge"
import {
  Attachment,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"
import { Spinner } from "@/components/ui/spinner"
import {
  Content,
  ContentStatus,
  contentHasThumbnail,
} from "@/lib/content/types"
import { CheckIcon, ClockIcon, FileWarningIcon, ImageIcon } from "lucide-react"

function toAttachmentState(
  status: ContentStatus
): "idle" | "uploading" | "processing" | "error" | "done" {
  switch (status) {
    case "pending_upload":
      return "idle"
    case "analyzing":
      return "processing"
    case "failed":
      return "error"
    case "flagged":
      return "error"
    case "uploaded":
    case "verified":
      return "done"
    default:
      return "idle"
  }
}

function descriptionFor(content: Content) {
  if (content.label) {
    return content.contentType || "Analyzed"
  }

  switch (content.status) {
    case "pending_upload":
      return "Waiting for upload"
    case "uploaded":
      return "Uploaded"
    case "analyzing":
      return "Analyzing image…"
    case "failed":
      return "Processing failed"
    case "flagged":
      return "Flagged"
    case "verified":
      return "Ready"
    default:
      return content.status
  }
}

function MediaIcon({ content }: { content: Content }) {
  switch (content.status) {
    case "pending_upload":
      return <ClockIcon />
    case "analyzing":
      return <Spinner />
    case "failed":
    case "flagged":
      return <FileWarningIcon />
    case "uploaded":
    case "verified":
      return <CheckIcon />
    default:
      return <ImageIcon />
  }
}

export interface ContentAttachmentProps {
  content: Content
}

export function ContentAttachment({ content }: ContentAttachmentProps) {
  const state = toAttachmentState(content.status)
  const showThumbnail =
    Boolean(content.thumbnailUrl) && contentHasThumbnail(content.status)

  return (
    <Attachment state={state} className="w-full items-center">
      <AttachmentMedia variant={showThumbnail ? "image" : "icon"}>
        {showThumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={content.thumbnailUrl} alt={content.filename} />
        ) : (
          <MediaIcon content={content} />
        )}
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>{content.filename}</AttachmentTitle>
        <AttachmentDescription>{content.campaign?.name}</AttachmentDescription>
      </AttachmentContent>
      <AttachmentActions className="ms-auto self-center pe-1">
        <ContentStatusBadge content={content} />
      </AttachmentActions>
    </Attachment>
  )
}

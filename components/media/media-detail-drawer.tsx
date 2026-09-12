"use client"

import {
  EmptyErrorState,
  EmptyLoadingState,
} from "@/components/ui/empty-state"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Spinner } from "@/components/ui/spinner"
import { getMediaContentThumbnailUrl } from "@/lib/media/api"
import { useMediaDetail } from "@/lib/media/hooks"
import {
  formatFrameTimestamp,
  MediaContentChild,
  MediaDetail,
} from "@/lib/media/types"
import { FilmIcon, ImageIcon } from "lucide-react"

function ContentVerdictBlock({
  mediaId,
  content,
  showThumbnail,
}: {
  mediaId: string
  content: MediaContentChild
  showThumbnail: boolean
}) {
  const thumbnailUrl = showThumbnail
    ? getMediaContentThumbnailUrl(mediaId, content.id)
    : null

  return (
    <div className="flex gap-3 rounded-lg border px-3 py-2">
      {thumbnailUrl ? (
        <div className="size-12 shrink-0 overflow-hidden rounded-md bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbnailUrl}
            alt=""
            className="size-full object-cover"
          />
        </div>
      ) : null}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2 text-sm">
          <span className="font-medium capitalize">
            {content.verdict?.label?.replaceAll("_", " ") ?? content.status}
          </span>
          {content.verdict != null ? (
            <span className="text-xs text-muted-foreground">
              {(content.verdict.confidence * 100).toFixed(0)}%
            </span>
          ) : null}
        </div>
        {content.timestampMs != null ? (
          <p className="mt-0.5 text-xs text-muted-foreground">
            Frame {content.frameIndex ?? "—"} ·{" "}
            {formatFrameTimestamp(content.timestampMs)}
          </p>
        ) : null}
      </div>
    </div>
  )
}

function FrameTimeline({
  mediaId,
  contents,
}: {
  mediaId: string
  contents: MediaContentChild[]
}) {
  const sorted = [...contents].sort(
    (a, b) => (a.timestampMs ?? 0) - (b.timestampMs ?? 0)
  )

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-medium">Frames</h3>
      {sorted.map((content) => (
        <ContentVerdictBlock
          key={content.id}
          mediaId={mediaId}
          content={content}
          showThumbnail
        />
      ))}
    </div>
  )
}

function MediaDetailBody({ media }: { media: MediaDetail }) {
  const showFrames = media.mediaType === "video" && media.contents.length > 1
  const single = media.contents[0]

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 py-4">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
          {media.mediaType === "video" ? (
            <FilmIcon className="size-4" />
          ) : media.thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={media.thumbnailUrl}
              alt=""
              className="size-full rounded-lg object-cover"
            />
          ) : (
            <ImageIcon className="size-4" />
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate font-medium">{media.filename}</p>
          <p className="text-xs text-muted-foreground capitalize">
            {media.mediaType} · {media.status.replaceAll("_", " ")}
          </p>
          {media.verdict ? (
            <p className="mt-1 text-sm">
              Verdict:{" "}
              <span className="font-medium capitalize">
                {media.verdict.label.replaceAll("_", " ")}
              </span>
              {media.mediaType === "video"
                ? ` · ${media.verdict.flaggedCount}/${media.verdict.totalCount} frames flagged`
                : null}
            </p>
          ) : null}
        </div>
      </div>

      {showFrames ? (
        <FrameTimeline mediaId={media.id} contents={media.contents} />
      ) : single ? (
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-medium">Analysis</h3>
          <ContentVerdictBlock
            mediaId={media.id}
            content={single}
            showThumbnail={media.mediaType === "video"}
          />
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Analysis details will appear once processing completes.
        </p>
      )}
    </div>
  )
}

export interface MediaDetailDrawerProps {
  mediaId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MediaDetailDrawer({
  mediaId,
  open,
  onOpenChange,
}: MediaDetailDrawerProps) {
  const { data, isLoading, isError } = useMediaDetail(open ? mediaId : null)

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="flex h-full max-w-2xl! flex-col data-[vaul-drawer-direction=right]:w-full sm:max-w-2xl!">
        <DrawerHeader className="border-b text-start">
          <DrawerTitle>Media detail</DrawerTitle>
        </DrawerHeader>
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <EmptyLoadingState icon={<Spinner />} />
          </div>
        ) : isError || !data ? (
          <div className="flex flex-1 items-center justify-center p-6">
            <EmptyErrorState
              title="Failed to load media"
              description="Something went wrong while loading this media."
            />
          </div>
        ) : (
          <MediaDetailBody media={data} />
        )}
      </DrawerContent>
    </Drawer>
  )
}

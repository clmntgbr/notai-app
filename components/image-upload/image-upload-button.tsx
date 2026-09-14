"use client"

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from "@/components/ui/attachment"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { useUploadMedia } from "@/lib/media/hooks"
import { ACCEPTED_MEDIA_TYPES, MAX_MEDIA_FILES } from "@/lib/media/types"
import { useQuota } from "@/lib/quota/hooks"
import { ImageIcon, Loader2Icon, XIcon } from "lucide-react"
import * as React from "react"

const IMAGE_ACCEPT = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
] as const

const VIDEO_ACCEPT = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
  ".mp4",
  ".webm",
  ".mov",
] as const

export type SelectedImage = {
  id: string
  file: File
  previewUrl: string
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function fileExtensionLabel(file: File) {
  const fromName = file.name.split(".").pop()?.toUpperCase()
  if (fromName) return fromName
  return file.type.split("/")[1]?.toUpperCase() || "FILE"
}

function isAcceptedMedia(file: File) {
  return ACCEPTED_MEDIA_TYPES.includes(
    file.type as (typeof ACCEPTED_MEDIA_TYPES)[number]
  )
}

function revokePreviews(images: SelectedImage[]) {
  for (const image of images) {
    URL.revokeObjectURL(image.previewUrl)
  }
}

export interface ImageUploadDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  images: SelectedImage[]
  onImagesChange: (images: SelectedImage[]) => void
  campaignId?: string | null
}

export function ImageUploadDrawer({
  open,
  onOpenChange,
  images,
  onImagesChange,
  campaignId,
}: ImageUploadDrawerProps) {
  const uploadMedia = useUploadMedia()
  const [error, setError] = React.useState<string | null>(null)
  const [fileProgress, setFileProgress] = React.useState<
    Record<number, number>
  >({})

  const isUploading = uploadMedia.isPending

  function handleRemove(id: string) {
    if (isUploading) return
    const next = images.filter((image) => image.id !== id)
    const removed = images.find((image) => image.id === id)
    if (removed) URL.revokeObjectURL(removed.previewUrl)
    onImagesChange(next)
    if (next.length === 0) onOpenChange(false)
  }

  function handleCancel() {
    if (isUploading) return
    revokePreviews(images)
    onImagesChange([])
    setError(null)
    setFileProgress({})
    onOpenChange(false)
  }

  async function handleUpload() {
    if (images.length === 0 || isUploading) return

    try {
      setError(null)
      setFileProgress({})
      await uploadMedia.mutateAsync({
        campaignId,
        files: images.map((image) => image.file),
        onFileProgress: (fileIndex, percent) => {
          setFileProgress((current) => ({
            ...current,
            [fileIndex]: percent,
          }))
        },
      })
      revokePreviews(images)
      onImagesChange([])
      setFileProgress({})
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload media")
    }
  }

  function handleOpenChange(nextOpen: boolean) {
    if (isUploading) return
    if (!nextOpen) {
      revokePreviews(images)
      onImagesChange([])
      setError(null)
      setFileProgress({})
    }
    onOpenChange(nextOpen)
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange} direction="right">
      <DrawerContent
        className="flex h-full w-[80vw]! max-w-[80vw]! flex-col"
        style={{ width: "80vw", maxWidth: "80vw", backgroundColor: "#f9f9f9" }}
      >
        <DrawerHeader className="sr-only">
          <DrawerTitle>Upload media</DrawerTitle>
        </DrawerHeader>

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex min-h-0 flex-1 items-center overflow-auto px-6 py-8">
            <div className="w-full">
              {images.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground">
                  No files selected.
                </p>
              ) : (
                <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] gap-4">
                  {images.map((image, index) => {
                    const progress = fileProgress[index]
                    const state =
                      isUploading && progress !== undefined && progress < 100
                        ? "uploading"
                        : isUploading
                          ? "processing"
                          : "done"
                    const isVideo = image.file.type.startsWith("video/")

                    return (
                      <Attachment
                        key={image.id}
                        orientation="vertical"
                        state={state}
                        className="w-full! max-w-none has-data-[slot=attachment-content]:w-full!"
                      >
                        <AttachmentMedia variant="image">
                          {isVideo ? (
                            // eslint-disable-next-line jsx-a11y/media-has-caption
                            <video
                              src={image.previewUrl}
                              className="size-full object-cover"
                              muted
                              playsInline
                            />
                          ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={image.previewUrl}
                              alt={image.file.name}
                            />
                          )}
                        </AttachmentMedia>
                        <AttachmentContent>
                          <AttachmentTitle>{image.file.name}</AttachmentTitle>
                          <AttachmentDescription>
                            {isUploading && progress !== undefined
                              ? `Uploading… ${progress}%`
                              : `${fileExtensionLabel(image.file)} · ${formatBytes(image.file.size)}`}
                          </AttachmentDescription>
                        </AttachmentContent>
                        {!isUploading ? (
                          <AttachmentActions className="group-data-[orientation=vertical]/attachment:-inset-e-2.5 group-data-[orientation=vertical]/attachment:-top-2.5">
                            <AttachmentAction
                              type="button"
                              variant="outline"
                              size="icon-xs"
                              aria-label={`Remove ${image.file.name}`}
                              className="size-7 rounded-full border border-border bg-white text-foreground shadow-none hover:bg-white"
                              onClick={(event) => {
                                event.preventDefault()
                                event.stopPropagation()
                                handleRemove(image.id)
                              }}
                            >
                              <XIcon className="size-3.5" />
                            </AttachmentAction>
                          </AttachmentActions>
                        ) : null}
                        <AttachmentTrigger asChild>
                          <a
                            href={image.previewUrl}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`Open ${image.file.name}`}
                          />
                        </AttachmentTrigger>
                      </Attachment>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="shrink-0 border-t bg-background px-6 py-4">
            {error ? (
              <p className="mb-3 text-xs text-destructive">{error}</p>
            ) : null}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={handleCancel}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="w-full sm:w-auto"
                disabled={images.length === 0 || isUploading}
                onClick={() => void handleUpload()}
              >
                {isUploading ? (
                  <Loader2Icon className="size-4 animate-spin" />
                ) : null}
                {isUploading ? "Uploading…" : "Upload"}
              </Button>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export interface ImageUploadButtonProps {
  className?: string
  campaignId?: string | null
  disabled?: boolean
}

export function ImageUploadButton({
  className,
  campaignId = null,
  disabled,
}: ImageUploadButtonProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const { data: quota } = useQuota()
  const [open, setOpen] = React.useState(false)
  const [images, setImages] = React.useState<SelectedImage[]>([])
  const [pickError, setPickError] = React.useState<string | null>(null)

  const allowsVideo = quota?.limits.allowsVideoAnalysis ?? false
  const maxFileSizeMb = quota?.limits.maxFileSizeMb ?? null
  const accept = allowsVideo
    ? [...IMAGE_ACCEPT, ...VIDEO_ACCEPT].join(",")
    : IMAGE_ACCEPT.join(",")

  function handlePick() {
    if (disabled) return
    setPickError(null)
    inputRef.current?.click()
  }

  function handleFilesSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const raw = Array.from(event.target.files ?? [])
    event.target.value = ""

    const accepted = raw.filter((file) => {
      if (!isAcceptedMedia(file)) return false
      if (!allowsVideo && file.type.startsWith("video/")) return false
      return true
    })

    if (accepted.length === 0) {
      if (raw.some((file) => file.type.startsWith("video/")) && !allowsVideo) {
        setPickError("Video analysis is not included in your plan.")
      }
      return
    }

    const maxBytes =
      maxFileSizeMb != null && maxFileSizeMb > 0
        ? maxFileSizeMb * 1024 * 1024
        : null
    const oversized = maxBytes
      ? accepted.filter((file) => file.size > maxBytes)
      : []
    const sizedOk = maxBytes
      ? accepted.filter((file) => file.size <= maxBytes)
      : accepted

    if (sizedOk.length === 0) {
      setPickError(
        maxFileSizeMb
          ? `Files must be under ${maxFileSizeMb} MB on your plan.`
          : "Unable to upload these files."
      )
      return
    }

    if (oversized.length > 0) {
      setPickError(
        `${oversized.length} file(s) exceed the ${maxFileSizeMb} MB plan limit and were skipped.`
      )
    } else {
      setPickError(null)
    }

    const limited = sizedOk.slice(0, MAX_MEDIA_FILES)
    const next: SelectedImage[] = limited.map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}-${crypto.randomUUID()}`,
      file,
      previewUrl: URL.createObjectURL(file),
    }))

    setImages(next)
    setOpen(true)
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        className="hidden"
        onChange={handleFilesSelected}
      />
      <HoverCard openDelay={10} closeDelay={100}>
        <HoverCardTrigger asChild>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className={className}
            onClick={handlePick}
            disabled={disabled}
          >
            <ImageIcon className="size-4" />
            Upload media
          </Button>
        </HoverCardTrigger>
        <HoverCardContent align="end" className="flex w-64 flex-col gap-0.5">
          <div className="font-semibold">Upload media</div>
          <div>
            Select up to {MAX_MEDIA_FILES} files
            {allowsVideo ? " (images or videos)" : " (images)"}.
            {maxFileSizeMb ? ` Max ${maxFileSizeMb} MB each.` : null}
            {campaignId
              ? " They will be uploaded to this campaign."
              : " They will be uploaded to the default campaign."}
          </div>
          {pickError ? (
            <div className="mt-1 text-destructive">{pickError}</div>
          ) : null}
        </HoverCardContent>
      </HoverCard>
      <ImageUploadDrawer
        open={open}
        onOpenChange={setOpen}
        images={images}
        onImagesChange={setImages}
        campaignId={campaignId}
      />
    </>
  )
}

export { MAX_MEDIA_FILES as MAX_IMAGES }

"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  ACCEPTED_BACKGROUND_EXTENSIONS,
  ACCEPTED_BACKGROUND_TYPES,
  BackgroundStatus,
  MAX_BACKGROUND_BYTES,
} from "@/lib/campaign/types"
import { CloudUploadIcon, Loader2Icon, XIcon } from "lucide-react"
import * as React from "react"

function isAcceptedFile(file: File) {
  const typeOk = ACCEPTED_BACKGROUND_TYPES.includes(
    file.type as (typeof ACCEPTED_BACKGROUND_TYPES)[number]
  )
  const name = file.name.toLowerCase()
  const extOk = ACCEPTED_BACKGROUND_EXTENSIONS.some((ext) => name.endsWith(ext))
  return typeOk || extOk
}

export interface CampaignBackgroundUploadProps {
  status: BackgroundStatus
  thumbnailUrl?: string | null
  disabled?: boolean
  isUploading?: boolean
  uploadProgress?: number
  error?: string | null
  onSelectFile: (file: File) => void
  onRemove?: () => void
}

export function CampaignBackgroundUpload({
  status,
  thumbnailUrl,
  disabled,
  isUploading,
  uploadProgress = 0,
  error,
  onSelectFile,
  onRemove,
}: CampaignBackgroundUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const [localError, setLocalError] = React.useState<string | null>(null)

  const previewUrl = thumbnailUrl || null
  const showPreview = Boolean(previewUrl) && !isUploading
  const showEmpty = !isUploading && !previewUrl

  function validateAndSelect(file: File | undefined) {
    if (!file) return
    setLocalError(null)

    if (!isAcceptedFile(file)) {
      setLocalError("Use a JPG, PNG, or WebP image")
      return
    }

    if (file.size > MAX_BACKGROUND_BYTES) {
      setLocalError("Image must be under 5 MiB")
      return
    }

    onSelectFile(file)
  }

  function handleFiles(files: FileList | File[] | null) {
    const file = files?.[0]
    validateAndSelect(file)
  }

  return (
    <div className="space-y-3">
      <div
        className={cn(
          "relative flex h-56 w-full flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed p-6 transition-colors",
          isDragging
            ? "border-primary bg-muted/60"
            : "border-muted-foreground/30 bg-muted/30 hover:bg-muted/50",
          disabled && "pointer-events-none opacity-50"
        )}
        onDragEnter={(event) => {
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragOver={(event) => {
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={(event) => {
          event.preventDefault()
          setIsDragging(false)
        }}
        onDrop={(event) => {
          event.preventDefault()
          setIsDragging(false)
          if (disabled || isUploading) return
          handleFiles(event.dataTransfer.files)
        }}
      >
        <label
          htmlFor="campaign-background-file"
          className="flex h-full w-full cursor-pointer flex-col items-center justify-center text-center"
        >
          {isUploading ? (
            <div className="max-w-md space-y-2">
              <Loader2Icon className="mx-auto size-8 animate-spin text-muted-foreground" />
              <p className="text-sm font-semibold">Uploading picture</p>
              <p className="text-xs text-muted-foreground">
                {uploadProgress > 0 ? `${uploadProgress}%` : "Starting…"}
              </p>
              <p className="text-xs text-muted-foreground">
                Do not refresh while the picture is being uploaded
              </p>
            </div>
          ) : null}

          {showEmpty ? (
            <div className="space-y-2">
              <div className="mx-auto w-fit rounded-md border bg-background p-2">
                <CloudUploadIcon className="size-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">
                  Drag an image
                </span>
              </p>
              <p className="text-xs text-muted-foreground">
                JPG, PNG or WebP — under 5 MiB
              </p>
            </div>
          ) : null}

          {showPreview ? (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl!}
                alt="Campaign background"
                className="max-h-32 w-full object-contain opacity-90"
              />
              <div className="space-y-1">
                <p className="text-sm font-semibold">
                  {status === "pending"
                    ? "Processing…"
                    : status === "failed"
                      ? "Upload failed"
                      : "Background ready"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {status === "failed"
                    ? "Click to upload a new image"
                    : status === "pending"
                      ? "Keeping previous preview while processing"
                      : "Click or drop to replace"}
                </p>
              </div>
              {status === "pending" ? (
                <Loader2Icon className="mx-auto size-4 animate-spin text-muted-foreground" />
              ) : null}
            </div>
          ) : null}
        </label>

        <Input
          ref={inputRef}
          id="campaign-background-file"
          type="file"
          accept={ACCEPTED_BACKGROUND_EXTENSIONS.join(",")}
          className="hidden"
          disabled={disabled || isUploading}
          onChange={(event) => {
            handleFiles(event.target.files)
            event.target.value = ""
          }}
        />
      </div>

      {(localError || error) && (
        <p className="text-xs text-destructive">{localError || error}</p>
      )}

      {previewUrl && onRemove && status !== "none" ? (
        <div className="flex justify-end">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={disabled || isUploading || status === "pending"}
            onClick={onRemove}
          >
            <XIcon className="size-3.5" />
            Remove
          </Button>
        </div>
      ) : null}
    </div>
  )
}

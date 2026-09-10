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
import { ImageIcon, XIcon } from "lucide-react"
import * as React from "react"

const MAX_IMAGES = 20

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
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
  return file.type.split("/")[1]?.toUpperCase() || "IMG"
}

function isAcceptedImage(file: File) {
  return ACCEPTED_IMAGE_TYPES.includes(
    file.type as (typeof ACCEPTED_IMAGE_TYPES)[number]
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
}

export function ImageUploadDrawer({
  open,
  onOpenChange,
  images,
  onImagesChange,
}: ImageUploadDrawerProps) {
  function handleRemove(id: string) {
    const next = images.filter((image) => image.id !== id)
    const removed = images.find((image) => image.id === id)
    if (removed) URL.revokeObjectURL(removed.previewUrl)
    onImagesChange(next)
    if (next.length === 0) onOpenChange(false)
  }

  function handleCancel() {
    console.log(
      "image upload cancelled",
      images.map((image) => image.file.name)
    )
    revokePreviews(images)
    onImagesChange([])
    onOpenChange(false)
  }

  function handleUpload() {
    console.log(
      "image upload",
      images.map((image) => ({
        name: image.file.name,
        type: image.file.type,
        size: image.file.size,
      }))
    )
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      revokePreviews(images)
      onImagesChange([])
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
          <DrawerTitle>Upload images</DrawerTitle>
        </DrawerHeader>

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex min-h-0 flex-1 items-center overflow-auto px-6 py-8">
            <div className="w-full">
              {images.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground">
                  No images selected.
                </p>
              ) : (
                <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] gap-4">
                  {images.map((image) => (
                    <Attachment
                      key={image.id}
                      orientation="vertical"
                      className="w-full! max-w-none has-data-[slot=attachment-content]:w-full!"
                    >
                      <AttachmentMedia variant="image">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={image.previewUrl} alt={image.file.name} />
                      </AttachmentMedia>
                      <AttachmentContent>
                        <AttachmentTitle>{image.file.name}</AttachmentTitle>
                        <AttachmentDescription>
                          {fileExtensionLabel(image.file)} ·{" "}
                          {formatBytes(image.file.size)}
                        </AttachmentDescription>
                      </AttachmentContent>
                      <AttachmentActions className="group-data-[orientation=vertical]/attachment:-top-2.5 group-data-[orientation=vertical]/attachment:-end-2.5">
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
                      <AttachmentTrigger asChild>
                        <a
                          href={image.previewUrl}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Open ${image.file.name}`}
                        />
                      </AttachmentTrigger>
                    </Attachment>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="shrink-0 border-t bg-background px-6 py-4">
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="w-full sm:w-auto"
                disabled={images.length === 0}
                onClick={handleUpload}
              >
                Upload
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
}

export function ImageUploadButton({ className }: ImageUploadButtonProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [open, setOpen] = React.useState(false)
  const [images, setImages] = React.useState<SelectedImage[]>([])

  function handlePick() {
    inputRef.current?.click()
  }

  function handleFilesSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []).filter(isAcceptedImage)
    event.target.value = ""

    if (files.length === 0) return

    const limited = files.slice(0, MAX_IMAGES)
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
        accept={ACCEPTED_IMAGE_TYPES.join(",")}
        multiple
        className="hidden"
        onChange={handleFilesSelected}
      />
      <Button
        type="button"
        size="sm"
        variant="outline"
        className={className}
        onClick={handlePick}
      >
        <ImageIcon className="size-4" />
        Upload images
      </Button>
      <ImageUploadDrawer
        open={open}
        onOpenChange={setOpen}
        images={images}
        onImagesChange={setImages}
      />
    </>
  )
}

export { MAX_IMAGES }

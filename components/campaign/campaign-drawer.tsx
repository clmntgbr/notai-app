"use client"

import { CampaignBackgroundUpload } from "@/components/campaign/background-upload"
import { DeleteCampaignDialog } from "@/components/campaign/delete-campaign-dialog"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ApiError } from "@/lib/api-error"
import {
  useCampaignDetail,
  useCreateCampaign,
  useDeleteCampaign,
  useDeleteCampaignBackground,
  useUpdateCampaign,
  useUploadCampaignBackground,
} from "@/lib/campaign/hooks"
import { Campaign } from "@/lib/campaign/types"
import { Loader2Icon } from "lucide-react"
import * as React from "react"

export interface CampaignDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  campaign?: Campaign | null
}

export function CampaignDrawer({
  open,
  onOpenChange,
  campaign,
}: CampaignDrawerProps) {
  const isEdit = Boolean(campaign?.id)
  const detailQuery = useCampaignDetail(open && isEdit ? campaign?.id : null)
  const activeCampaign = detailQuery.data ?? campaign ?? null

  const createCampaign = useCreateCampaign()
  const updateCampaign = useUpdateCampaign()
  const deleteCampaign = useDeleteCampaign()
  const uploadBackground = useUploadCampaignBackground()
  const deleteBackground = useDeleteCampaignBackground()

  const [name, setName] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = React.useState(0)
  const [pendingFile, setPendingFile] = React.useState<File | null>(null)
  const [localPreviewUrl, setLocalPreviewUrl] = React.useState<string | null>(
    null
  )
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)

  React.useEffect(() => {
    if (!open) return
    setName(campaign?.name ?? "")
    setError(null)
    setUploadProgress(0)
    setPendingFile(null)
    setLocalPreviewUrl(null)
    setDeleteDialogOpen(false)
  }, [open, campaign?.id, campaign?.name])

  React.useEffect(() => {
    return () => {
      if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl)
    }
  }, [localPreviewUrl])

  const isSaving =
    createCampaign.isPending ||
    updateCampaign.isPending ||
    uploadBackground.isPending ||
    deleteBackground.isPending ||
    deleteCampaign.isPending

  const status = activeCampaign?.backgroundStatus ?? "none"
  const thumbnailUrl =
    localPreviewUrl || activeCampaign?.backgroundThumbnailUrl || null

  async function uploadFile(campaignId: string, file: File) {
    setUploadProgress(0)
    await uploadBackground.mutateAsync({
      campaignId,
      file,
      onProgress: setUploadProgress,
    })
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed || isSaving) return

    try {
      setError(null)

      if (isEdit && activeCampaign) {
        if (trimmed !== activeCampaign.name) {
          await updateCampaign.mutateAsync({
            id: activeCampaign.id,
            input: { name: trimmed },
          })
        }

        if (pendingFile) {
          await uploadFile(activeCampaign.id, pendingFile)
          setPendingFile(null)
          if (localPreviewUrl) {
            URL.revokeObjectURL(localPreviewUrl)
            setLocalPreviewUrl(null)
          }
        }

        onOpenChange(false)
        return
      }

      const created = await createCampaign.mutateAsync({ name: trimmed })

      if (pendingFile) {
        await uploadFile(created.id, pendingFile)
        setPendingFile(null)
        if (localPreviewUrl) {
          URL.revokeObjectURL(localPreviewUrl)
          setLocalPreviewUrl(null)
        }
      }

      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save campaign")
    }
  }

  function handleSelectFile(file: File) {
    setError(null)
    setPendingFile(file)
    if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl)
    setLocalPreviewUrl(URL.createObjectURL(file))
  }

  async function handleRemoveBackground() {
    if (!activeCampaign || isSaving) return

    try {
      setError(null)
      setPendingFile(null)
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl)
        setLocalPreviewUrl(null)
      }
      await deleteBackground.mutateAsync(activeCampaign.id)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to remove background"
      )
    }
  }

  async function handleDeleteCampaign() {
    if (!activeCampaign || isSaving) return

    try {
      setError(null)
      await deleteCampaign.mutateAsync(activeCampaign.id)
      setDeleteDialogOpen(false)
      onOpenChange(false)
    } catch (err) {
      const message =
        err instanceof ApiError && err.status === 409
          ? err.message || "The default campaign cannot be deleted"
          : err instanceof Error
            ? err.message
            : "Failed to delete campaign"
      setError(message)
      setDeleteDialogOpen(false)
    }
  }

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange} direction="right">
        <DrawerContent className="data-[vaul-drawer-direction=right]:w-full sm:max-w-2xl data-[vaul-drawer-direction=right]:sm:max-w-2xl">
          <form onSubmit={handleSubmit} className="flex h-full flex-col">
            <DrawerHeader>
              <DrawerTitle>
                {isEdit ? "Edit campaign" : "New campaign"}
              </DrawerTitle>
              <DrawerDescription>
                {isEdit
                  ? "Update the name or replace the background image."
                  : "Create a campaign and optionally upload a background."}
              </DrawerDescription>
            </DrawerHeader>

            <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4">
              <div className="space-y-2">
                <Label htmlFor="campaign-name">Name</Label>
                <Input
                  id="campaign-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Campaign name"
                  disabled={isSaving}
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <CampaignBackgroundUpload
                  status={pendingFile ? "ready" : status}
                  thumbnailUrl={thumbnailUrl}
                  disabled={isSaving}
                  isUploading={uploadBackground.isPending}
                  uploadProgress={uploadProgress}
                  error={null}
                  onSelectFile={handleSelectFile}
                  onRemove={
                    isEdit && status !== "none" && !pendingFile
                      ? () => void handleRemoveBackground()
                      : pendingFile
                        ? () => {
                            setPendingFile(null)
                            if (localPreviewUrl) {
                              URL.revokeObjectURL(localPreviewUrl)
                              setLocalPreviewUrl(null)
                            }
                          }
                        : undefined
                  }
                />
              </div>

              {error ? (
                <p className="text-xs text-destructive">{error}</p>
              ) : null}
            </div>

            <DrawerFooter className="flex-row items-center gap-2">
              {isEdit ? (
                <Button
                  type="button"
                  variant="destructive"
                  disabled={isSaving}
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  Delete
                </Button>
              ) : (
                <div />
              )}
              <div className="ml-auto flex gap-2">
                <DrawerClose asChild>
                  <Button type="button" variant="outline" disabled={isSaving}>
                    Cancel
                  </Button>
                </DrawerClose>
                <Button type="submit" disabled={isSaving || !name.trim()}>
                  {isSaving && !deleteCampaign.isPending ? (
                    <Loader2Icon className="size-4 animate-spin" />
                  ) : null}
                  {isSaving && !deleteCampaign.isPending
                    ? "Saving…"
                    : isEdit
                      ? "Save changes"
                      : "Create"}
                </Button>
              </div>
            </DrawerFooter>
          </form>
        </DrawerContent>
      </Drawer>

      {isEdit && activeCampaign ? (
        <DeleteCampaignDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          campaignName={activeCampaign.name}
          isDeleting={deleteCampaign.isPending}
          onConfirm={() => void handleDeleteCampaign()}
        />
      ) : null}
    </>
  )
}

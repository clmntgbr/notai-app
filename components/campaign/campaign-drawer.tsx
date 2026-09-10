"use client"

import { CampaignBackgroundUpload } from "@/components/campaign/background-upload"
import { DeleteCampaignDialog } from "@/components/campaign/delete-campaign-dialog"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
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
import { Loader2Icon, Trash2Icon } from "lucide-react"
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

  function handleClose() {
    onOpenChange(false)
  }

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

        handleClose()
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

      handleClose()
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
      handleClose()
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
        <DrawerContent
          className="flex h-full w-[80vw]! max-w-[80vw]! flex-col"
          style={{ width: "80vw", maxWidth: "80vw" }}
        >
          <DrawerHeader className="sr-only">
            <DrawerTitle>
              {isEdit ? "Edit campaign" : "New campaign"}
            </DrawerTitle>
          </DrawerHeader>

          <div className="flex min-h-0 flex-1 flex-col">
            <form
              id="campaign-form"
              onSubmit={handleSubmit}
              className="flex min-h-0 flex-1 flex-col"
            >
              <div className="min-h-0 flex-1 overflow-auto px-6 py-8">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
                  <div className="space-y-1">
                    <h2 className="font-semibold">General</h2>
                    <p className="text-sm text-muted-foreground">
                      {isEdit
                        ? "Update the campaign name or replace the background image."
                        : "Define the campaign name and optionally upload a background."}
                    </p>
                  </div>

                  <div className="flex flex-col gap-6 md:col-span-2">
                    <div className="space-y-2">
                      <Label htmlFor="campaign-name">
                        Name
                        <span className="ml-1 text-destructive">*</span>
                      </Label>
                      <Input
                        id="campaign-name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        disabled={isSaving}
                        autoFocus
                        className="h-9"
                      />
                    </div>

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

                    {error ? (
                      <p className="text-xs text-destructive">{error}</p>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="shrink-0 border-t bg-background px-6 py-4">
                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    {isEdit ? (
                      <Button
                        type="button"
                        variant="destructive"
                        disabled={isSaving}
                        onClick={() => setDeleteDialogOpen(true)}
                      >
                        <Trash2Icon className="h-4 w-4" />
                        Delete
                      </Button>
                    ) : null}
                  </div>
                  <div className="flex flex-col-reverse gap-3 sm:flex-row">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full sm:w-auto"
                      onClick={handleClose}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="w-full sm:w-auto"
                      disabled={isSaving || !name.trim()}
                    >
                      {isEdit ? "Update" : "Create"}
                      {isSaving && !deleteCampaign.isPending ? (
                        <Loader2Icon className="ml-2 h-4 w-4 animate-spin" />
                      ) : null}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </div>
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

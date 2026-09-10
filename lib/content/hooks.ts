"use client"

import { queryKeys } from "@/lib/query/keys"
import { useUser } from "@/lib/user/hooks"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { uploadContents } from "./api"

export function useUploadCampaignContents() {
  const queryClient = useQueryClient()
  const { currentClientId } = useUser()

  return useMutation({
    mutationFn: ({
      campaignId,
      files,
      onFileProgress,
    }: {
      campaignId?: string | null
      files: File[]
      onFileProgress?: (fileIndex: number, percent: number) => void
    }) => uploadContents(campaignId, files, onFileProgress),
    onSuccess: async (result) => {
      if (!currentClientId || !result.campaignId) return
      await queryClient.invalidateQueries({
        queryKey: queryKeys.contents.all(currentClientId, result.campaignId),
      })
      await queryClient.invalidateQueries({
        queryKey: queryKeys.campaigns.detail(
          currentClientId,
          result.campaignId
        ),
      })
    },
  })
}

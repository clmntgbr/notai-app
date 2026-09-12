"use client"

import { PaginateParams } from "@/lib/paginate"
import { queryKeys } from "@/lib/query/keys"
import { useUser } from "@/lib/user/hooks"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getMedia, getMediaStats, listCampaignMedia, uploadMedia } from "./api"
import { isMediaProcessing } from "./types"

async function invalidateMediaQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  clientId: string | null | undefined,
  campaignId?: string,
  mediaId?: string
) {
  if (!clientId) return

  const tasks = [
    queryClient.invalidateQueries({
      queryKey: queryKeys.media.all(clientId),
    }),
    queryClient.invalidateQueries({
      queryKey: queryKeys.campaigns.all(clientId),
    }),
  ]

  if (campaignId) {
    tasks.push(
      queryClient.invalidateQueries({
        queryKey: queryKeys.media.lists(clientId, campaignId),
      }),
      queryClient.invalidateQueries({
        queryKey: queryKeys.campaigns.detail(clientId, campaignId),
      })
    )
  }

  if (mediaId) {
    tasks.push(
      queryClient.invalidateQueries({
        queryKey: queryKeys.media.detail(clientId, mediaId),
      })
    )
  }

  await Promise.all(tasks)
}

export function useCampaignMedia(
  campaignId: string | null | undefined,
  params?: PaginateParams
) {
  const { currentClientId } = useUser()

  return useQuery({
    queryKey: queryKeys.media.list(
      currentClientId ?? "none",
      campaignId ?? "",
      params
    ),
    queryFn: () => listCampaignMedia(campaignId!, params),
    enabled: Boolean(currentClientId) && Boolean(campaignId),
    refetchInterval: (query) => {
      const members = query.state.data?.members ?? []
      return members.some((media) => isMediaProcessing(media.status))
        ? 2000
        : false
    },
  })
}

export function useMediaDetail(mediaId: string | null | undefined) {
  const { currentClientId } = useUser()

  return useQuery({
    queryKey: queryKeys.media.detail(currentClientId ?? "none", mediaId ?? ""),
    queryFn: () => getMedia(mediaId!),
    enabled: Boolean(mediaId) && Boolean(currentClientId),
    refetchInterval: (query) => {
      const status = query.state.data?.status
      return status && isMediaProcessing(status) ? 2000 : false
    },
  })
}

export function useMediaStats() {
  const { currentClientId } = useUser()

  return useQuery({
    queryKey: queryKeys.media.stats(currentClientId ?? "none"),
    queryFn: getMediaStats,
    enabled: Boolean(currentClientId),
  })
}

export function useUploadMedia() {
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
    }) => uploadMedia(campaignId, files, onFileProgress),
    onSuccess: async (result) => {
      if (currentClientId) {
        queryClient.setQueryData(
          queryKeys.campaigns.default(currentClientId),
          { id: result.campaignId }
        )
      }
      await invalidateMediaQueries(
        queryClient,
        currentClientId,
        result.campaignId
      )
    },
  })
}

"use client"

import { queryKeys } from "@/lib/query/keys"
import { useUser } from "@/lib/user/hooks"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  deleteContent,
  getContent,
  getContentStats,
  listContents,
  ListContentsParams,
  uploadContents,
} from "./api"
import { isContentProcessing } from "./types"

async function invalidateContentQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  clientId: string | null | undefined,
  contentId?: string
) {
  if (!clientId) return

  const tasks = [
    queryClient.invalidateQueries({
      queryKey: queryKeys.contents.all(clientId),
    }),
  ]

  if (contentId) {
    tasks.push(
      queryClient.invalidateQueries({
        queryKey: queryKeys.contents.detail(clientId, contentId),
      })
    )
  }

  await Promise.all(tasks)
}

export function useContents(
  campaignId?: string | null,
  params?: Omit<ListContentsParams, "campaignId">
) {
  const { currentClientId } = useUser()
  const listParams = {
    ...params,
    campaignId: campaignId?.trim() || undefined,
  }

  return useQuery({
    queryKey: queryKeys.contents.list(currentClientId ?? "none", listParams),
    queryFn: () => listContents(listParams),
    enabled: Boolean(currentClientId),
    refetchInterval: (query) => {
      const members = query.state.data?.members ?? []
      return members.some((content) => isContentProcessing(content.status))
        ? 2000
        : false
    },
  })
}

export function useContentDetail(contentId: string | null | undefined) {
  const { currentClientId } = useUser()

  return useQuery({
    queryKey: queryKeys.contents.detail(
      currentClientId ?? "none",
      contentId ?? ""
    ),
    queryFn: () => getContent(contentId!),
    enabled: Boolean(contentId) && Boolean(currentClientId),
    refetchInterval: (query) => {
      const status = query.state.data?.status
      return status && isContentProcessing(status) ? 2000 : false
    },
  })
}

export function useContentStats() {
  const { currentClientId } = useUser()

  return useQuery({
    queryKey: queryKeys.contents.stats(currentClientId ?? "none"),
    queryFn: getContentStats,
    enabled: Boolean(currentClientId),
  })
}

export function useDeleteContent() {
  const queryClient = useQueryClient()
  const { currentClientId } = useUser()

  return useMutation({
    mutationFn: deleteContent,
    onSuccess: async (_void, contentId) => {
      if (currentClientId) {
        queryClient.removeQueries({
          queryKey: queryKeys.contents.detail(currentClientId, contentId),
        })
      }
      await invalidateContentQueries(queryClient, currentClientId)
    },
  })
}

export function useUploadContents() {
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
      await invalidateContentQueries(queryClient, currentClientId)
      if (currentClientId && result.campaignId) {
        await queryClient.invalidateQueries({
          queryKey: queryKeys.campaigns.detail(
            currentClientId,
            result.campaignId
          ),
        })
      }
    },
  })
}

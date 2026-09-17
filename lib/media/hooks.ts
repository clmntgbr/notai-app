"use client"

import { queryKeys } from "@/lib/query/keys"
import { useUser } from "@/lib/user/hooks"
import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { getMedia, getMediaStats, listMedia, ListMediaParams, uploadMedia } from "./api"

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

export function useMedia(params?: ListMediaParams) {
  const { currentClientId } = useUser()
  const listParams = {
    ...params,
    campaignId: params?.campaignId?.trim() || undefined,
  }

  return useQuery({
    queryKey: queryKeys.media.list(currentClientId ?? "none", listParams),
    queryFn: () => listMedia(listParams),
    enabled: Boolean(currentClientId),
  })
}

export function useCampaignMedia(
  campaignId: string | null | undefined,
  params?: Omit<ListMediaParams, "campaignId">
) {
  const { currentClientId } = useUser()
  const trimmed = campaignId?.trim()

  return useQuery({
    queryKey: queryKeys.media.list(currentClientId ?? "none", {
      ...params,
      campaignId: trimmed,
    }),
    queryFn: () => listMedia({ ...params, campaignId: trimmed }),
    enabled: Boolean(currentClientId) && Boolean(trimmed),
  })
}

export function useInfiniteMedia(options?: {
  enabled?: boolean
  limit?: number
  campaignIds?: string[]
  search?: string | null
  statuses?: string[]
  verdicts?: string[]
}) {
  const { currentClientId } = useUser()
  const limit = options?.limit ?? 20
  const enabled = options?.enabled ?? true
  const campaignIds = options?.campaignIds?.length
    ? options.campaignIds
    : undefined
  const search = options?.search?.trim() || undefined
  const statuses = options?.statuses?.length ? options.statuses : undefined
  const verdicts = options?.verdicts?.length ? options.verdicts : undefined

  return useInfiniteQuery({
    queryKey: queryKeys.media.infinite(currentClientId ?? "none", {
      limit,
      campaignIds,
      search,
      statuses,
      verdicts,
    }),
    queryFn: ({ pageParam }) =>
      listMedia({
        page: pageParam,
        limit,
        campaignIds,
        search,
        statuses,
        verdicts,
        sortBy: "created_at",
        orderBy: "desc",
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    enabled: Boolean(currentClientId) && enabled,
    placeholderData: keepPreviousData,
  })
}

export function useMediaDetail(mediaId: string | null | undefined) {
  const { currentClientId } = useUser()

  return useQuery({
    queryKey: queryKeys.media.detail(currentClientId ?? "none", mediaId ?? ""),
    queryFn: () => getMedia(mediaId!),
    enabled: Boolean(mediaId) && Boolean(currentClientId),
  })
}

export function useMediaStats(options?: {
  campaignId?: string | null
  from?: string | null
  to?: string | null
  enabled?: boolean
}) {
  const { currentClientId } = useUser()
  const campaignId = options?.campaignId?.trim() || null
  const from = options?.from?.trim() || null
  const to = options?.to?.trim() || null
  // API rejects `to` without `from`.
  const rangeValid = !(to && !from)
  const enabled =
    Boolean(currentClientId) &&
    rangeValid &&
    (options?.enabled ?? true)

  return useQuery({
    queryKey: queryKeys.media.stats(currentClientId ?? "none", {
      campaignId,
      from,
      to: from ? to : null,
    }),
    queryFn: () =>
      getMediaStats({
        campaignId,
        from,
        to: from ? to : null,
      }),
    enabled,
    placeholderData: keepPreviousData,
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
      await invalidateMediaQueries(
        queryClient,
        currentClientId,
        result.campaignId
      )
    },
  })
}

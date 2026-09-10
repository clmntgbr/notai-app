"use client"

import { PaginateParams } from "@/lib/paginate"
import { queryKeys } from "@/lib/query/keys"
import { useUser } from "@/lib/user/hooks"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createCampaign,
  deleteCampaign,
  deleteCampaignBackground,
  getCampaign,
  listCampaigns,
  updateCampaign,
  uploadCampaignBackground,
} from "./api"
import { CampaignInput } from "./types"

async function invalidateCampaignQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  clientId: string | null | undefined,
  campaignId?: string
) {
  if (!clientId) return

  const tasks = [
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

  await Promise.all(tasks)
}

export function useCampaigns(params?: PaginateParams) {
  const { currentClientId } = useUser()

  return useQuery({
    queryKey: queryKeys.campaigns.list(currentClientId ?? "none", params),
    queryFn: () => listCampaigns(params),
    enabled: Boolean(currentClientId),
  })
}

export function useCampaignDetail(
  campaignId: string | null | undefined,
  clientId?: string | null
) {
  const { currentClientId } = useUser()
  const resolvedClientId = clientId ?? currentClientId

  return useQuery({
    queryKey: queryKeys.campaigns.detail(
      resolvedClientId ?? "none",
      campaignId ?? ""
    ),
    queryFn: () => getCampaign(campaignId!),
    enabled: Boolean(campaignId) && Boolean(resolvedClientId),
    refetchInterval: (query) =>
      query.state.data?.backgroundStatus === "pending" ? 2000 : false,
  })
}

export function useCreateCampaign() {
  const queryClient = useQueryClient()
  const { currentClientId } = useUser()

  return useMutation({
    mutationFn: createCampaign,
    onSuccess: async (campaign) => {
      const clientId = campaign.clientId || currentClientId
      await invalidateCampaignQueries(queryClient, clientId, campaign.id)
    },
  })
}

export function useUpdateCampaign() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: CampaignInput }) =>
      updateCampaign(id, input),
    onSuccess: async (campaign) => {
      queryClient.setQueryData(
        queryKeys.campaigns.detail(campaign.clientId, campaign.id),
        campaign
      )
      await invalidateCampaignQueries(queryClient, campaign.clientId, campaign.id)
    },
  })
}

export function useDeleteCampaign() {
  const queryClient = useQueryClient()
  const { currentClientId } = useUser()

  return useMutation({
    mutationFn: deleteCampaign,
    onSuccess: async () => {
      await invalidateCampaignQueries(queryClient, currentClientId)
    },
  })
}

export function useUploadCampaignBackground() {
  const queryClient = useQueryClient()
  const { currentClientId } = useUser()

  return useMutation({
    mutationFn: ({
      campaignId,
      file,
      onProgress,
    }: {
      campaignId: string
      file: File
      onProgress?: (percent: number) => void
    }) => uploadCampaignBackground(campaignId, file, onProgress),
    onSuccess: async (_void, variables) => {
      await invalidateCampaignQueries(
        queryClient,
        currentClientId,
        variables.campaignId
      )
    },
  })
}

export function useDeleteCampaignBackground() {
  const queryClient = useQueryClient()
  const { currentClientId } = useUser()

  return useMutation({
    mutationFn: deleteCampaignBackground,
    onSuccess: async (_void, campaignId) => {
      await invalidateCampaignQueries(queryClient, currentClientId, campaignId)
    },
  })
}

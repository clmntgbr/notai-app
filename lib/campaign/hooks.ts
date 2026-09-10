"use client"

import { PaginateParams } from "@/lib/paginate"
import { queryKeys } from "@/lib/query/keys"
import { useUser } from "@/lib/user/hooks"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createCampaign,
  deleteCampaign,
  getCampaign,
  listCampaigns,
  updateCampaign,
} from "./api"
import { CampaignInput } from "./types"

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
  })
}

export function useCreateCampaign() {
  const queryClient = useQueryClient()
  const { currentClientId } = useUser()

  return useMutation({
    mutationFn: createCampaign,
    onSuccess: async (campaign) => {
      const clientId = campaign.clientId || currentClientId
      if (!clientId) return
      await queryClient.invalidateQueries({
        queryKey: queryKeys.campaigns.all(clientId),
      })
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
      await queryClient.invalidateQueries({
        queryKey: queryKeys.campaigns.all(campaign.clientId),
      })
    },
  })
}

export function useDeleteCampaign() {
  const queryClient = useQueryClient()
  const { currentClientId } = useUser()

  return useMutation({
    mutationFn: deleteCampaign,
    onSuccess: async () => {
      if (!currentClientId) return
      await queryClient.invalidateQueries({
        queryKey: queryKeys.campaigns.all(currentClientId),
      })
    },
  })
}

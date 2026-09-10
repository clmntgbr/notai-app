"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { PaginateParams } from "@/lib/paginate"
import { queryKeys } from "@/lib/query/keys"
import { useUser } from "@/lib/user/hooks"
import {
  createClient,
  deleteClient,
  getClient,
  listClients,
  removeClientMember,
  updateClient,
} from "./api"
import { ClientInput } from "./types"

export function useClients(params?: PaginateParams) {
  return useQuery({
    queryKey: queryKeys.clients.list(params),
    queryFn: () => listClients(params),
  })
}

export function useClientDetail(clientId: string | null | undefined) {
  return useQuery({
    queryKey: queryKeys.clients.detail(clientId ?? ""),
    queryFn: () => getClient(clientId!),
    enabled: Boolean(clientId),
  })
}

export function useCreateClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createClient,
    onSuccess: async (client) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.user.me }),
        queryClient.invalidateQueries({ queryKey: queryKeys.clients.all }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.campaigns.all(client.id),
        }),
      ])
    },
  })
}

export function useUpdateClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ClientInput }) =>
      updateClient(id, input),
    onSuccess: async (client) => {
      queryClient.setQueryData(queryKeys.clients.detail(client.id), client)
      await queryClient.invalidateQueries({ queryKey: queryKeys.clients.all })
    },
  })
}

export function useDeleteClient() {
  const queryClient = useQueryClient()
  const { currentClientId } = useUser()

  return useMutation({
    mutationFn: deleteClient,
    onSuccess: async (_void, deletedId) => {
      const invalidations = [
        queryClient.invalidateQueries({ queryKey: queryKeys.user.me }),
        queryClient.invalidateQueries({ queryKey: queryKeys.clients.all }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.campaigns.all(deletedId),
        }),
      ]

      if (currentClientId && currentClientId !== deletedId) {
        invalidations.push(
          queryClient.invalidateQueries({
            queryKey: queryKeys.campaigns.all(currentClientId),
          })
        )
      }

      await Promise.all(invalidations)
    },
  })
}

export function useRemoveClientMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      clientId,
      userId,
    }: {
      clientId: string
      userId: string
    }) => removeClientMember(clientId, userId),
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.clients.detail(variables.clientId),
        }),
        queryClient.invalidateQueries({ queryKey: queryKeys.clients.all }),
      ])
    },
  })
}

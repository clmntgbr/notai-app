import { PaginateParams } from "@/lib/paginate"

export const queryKeys = {
  user: {
    all: ["user"] as const,
    me: ["user", "me"] as const,
  },

  clients: {
    all: ["clients"] as const,
    lists: () => [...queryKeys.clients.all, "list"] as const,
    list: (params?: PaginateParams) =>
      [...queryKeys.clients.lists(), params ?? {}] as const,
    detail: (clientId: string) => ["clients", clientId] as const,
  },

  campaigns: {
    all: (clientId: string) =>
      [...queryKeys.clients.detail(clientId), "campaigns"] as const,
    list: (clientId: string, params?: PaginateParams) =>
      [...queryKeys.campaigns.all(clientId), "list", params ?? {}] as const,
    detail: (clientId: string, campaignId: string) =>
      [...queryKeys.campaigns.all(clientId), campaignId] as const,
  },

  contents: {
    all: (clientId: string) =>
      [...queryKeys.clients.detail(clientId), "contents"] as const,
    lists: (clientId: string) =>
      [...queryKeys.contents.all(clientId), "list"] as const,
    list: (
      clientId: string,
      params?: PaginateParams & { campaignId?: string | null }
    ) => [...queryKeys.contents.lists(clientId), params ?? {}] as const,
    detail: (clientId: string, contentId: string) =>
      [...queryKeys.contents.all(clientId), contentId] as const,
  },

  checks: {
    all: (campaignId: string) => ["campaigns", campaignId, "checks"] as const,
  },
} as const

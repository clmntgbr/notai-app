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
    all: (clientId: string, campaignId: string) =>
      [
        ...queryKeys.campaigns.detail(clientId, campaignId),
        "contents",
      ] as const,
    list: (clientId: string, campaignId: string, params?: PaginateParams) =>
      [
        ...queryKeys.contents.all(clientId, campaignId),
        "list",
        params ?? {},
      ] as const,
    detail: (clientId: string, campaignId: string, contentId: string) =>
      [...queryKeys.contents.all(clientId, campaignId), contentId] as const,
  },

  checks: {
    all: (campaignId: string) => ["campaigns", campaignId, "checks"] as const,
  },
} as const

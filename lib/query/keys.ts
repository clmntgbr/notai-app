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
    /** Cached after a default-campaign media upload (no GET endpoint). */
    default: (clientId: string) =>
      [...queryKeys.campaigns.all(clientId), "default"] as const,
  },

  media: {
    all: (clientId: string) =>
      [...queryKeys.clients.detail(clientId), "media"] as const,
    lists: (clientId: string, campaignId: string) =>
      [...queryKeys.media.all(clientId), campaignId, "list"] as const,
    list: (clientId: string, campaignId: string, params?: PaginateParams) =>
      [...queryKeys.media.lists(clientId, campaignId), params ?? {}] as const,
    detail: (clientId: string, mediaId: string) =>
      [...queryKeys.media.all(clientId), mediaId] as const,
    stats: (clientId: string) =>
      [...queryKeys.media.all(clientId), "stats"] as const,
  },

  activity: {
    all: (clientId: string) =>
      [...queryKeys.clients.detail(clientId), "activity"] as const,
    list: (clientId: string, params?: PaginateParams) =>
      [...queryKeys.activity.all(clientId), "list", params ?? {}] as const,
    infinite: (clientId: string, limit = 20) =>
      [...queryKeys.activity.all(clientId), "infinite", { limit }] as const,
  },

  checks: {
    all: (campaignId: string) => ["campaigns", campaignId, "checks"] as const,
  },
} as const

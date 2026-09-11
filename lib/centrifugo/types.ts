export type RealtimeResource = "user" | "client" | "campaign" | "content"

export type RealtimeVerb =
  | "created"
  | "updated"
  | "deleted"
  | "current_client_changed"
  | "member_added"
  | "member_removed"
  | "background_updated"
  | "status_changed"

export type RealtimeEventType = `${RealtimeResource}.${RealtimeVerb}`

/** Centrifugo user-channel payload: `{resource}.{action}` (optional `.vN` suffix). */
export interface UserStreamEvent {
  type: string
  userId?: string
  clientId?: string
  campaignId?: string
  contentId?: string
  name?: string
  status?: string
  backgroundStatus?: string
  /** Present on content.updated (ContentUploaded). */
  thumbnailKey?: string
  sizeBytes?: number
  objectKey?: string
}

const RESOURCES = new Set<string>(["user", "client", "campaign", "content"])

const VERBS = new Set<string>([
  "created",
  "updated",
  "deleted",
  "current_client_changed",
  "member_added",
  "member_removed",
  "background_updated",
  "status_changed",
])

export function canonicalizeRealtimeType(type: string): string {
  return type.replace(/\.v\d+$/, "")
}

export function parseRealtimeType(
  type: string
): { resource: RealtimeResource; verb: RealtimeVerb } | null {
  const canonical = canonicalizeRealtimeType(type)
  const [resource, verb] = canonical.split(".")
  if (!resource || !verb) return null
  if (!RESOURCES.has(resource) || !VERBS.has(verb)) return null
  return {
    resource: resource as RealtimeResource,
    verb: verb as RealtimeVerb,
  }
}

export function isUserStreamEvent(data: unknown): data is UserStreamEvent {
  if (!data || typeof data !== "object") return false
  const type = (data as { type?: unknown }).type
  if (typeof type !== "string") return false
  return parseRealtimeType(type) !== null
}

export function eventTypeEquals(
  event: UserStreamEvent,
  type: RealtimeEventType
): boolean {
  return canonicalizeRealtimeType(event.type) === type
}

/** Thumbnail processing finished (ready) or failed — refresh campaign cache. */
export function shouldRefreshCampaignBackground(event: UserStreamEvent): boolean {
  return (
    eventTypeEquals(event, "campaign.background_updated") &&
    typeof event.clientId === "string" &&
    typeof event.campaignId === "string"
  )
}

/**
 * Content cache refresh (mirrors campaign.background_updated for media).
 * - content.created → presign / pending_upload (row appears)
 * - content.updated → thumbnail ready (ContentUploaded)
 * - content.status_changed → status uploaded / analyzing / …
 */
export function shouldRefreshContent(event: UserStreamEvent): boolean {
  return (
    (eventTypeEquals(event, "content.created") ||
      eventTypeEquals(event, "content.updated") ||
      eventTypeEquals(event, "content.status_changed") ||
      eventTypeEquals(event, "content.deleted")) &&
    typeof event.clientId === "string"
  )
}

/** Thumbnail ready after MinIO process — same role as campaign.background_updated. */
export function shouldRefreshContentThumbnail(event: UserStreamEvent): boolean {
  return (
    eventTypeEquals(event, "content.updated") &&
    typeof event.clientId === "string" &&
    typeof event.contentId === "string"
  )
}

export type RealtimeResource = "user" | "client" | "campaign"

export type RealtimeVerb =
  | "created"
  | "updated"
  | "deleted"
  | "current_client_changed"
  | "member_added"
  | "member_removed"

export type RealtimeEventType = `${RealtimeResource}.${RealtimeVerb}`

/** Centrifugo user-channel payload: `{resource}.{action}` (optional `.vN` suffix). */
export interface UserStreamEvent {
  type: string
  userId?: string
  clientId?: string
  campaignId?: string
  name?: string
}

const RESOURCES = new Set<string>(["user", "client", "campaign"])

const VERBS = new Set<string>([
  "created",
  "updated",
  "deleted",
  "current_client_changed",
  "member_added",
  "member_removed",
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

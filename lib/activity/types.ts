export type ActivityType =
  | "content.ai_flagged"
  | "content.manual_review"
  | "campaign.created"
  | "client.member_added"

export type ActivityActorType = "system" | "user"

export interface ActivityItem {
  id: string
  type: ActivityType | string
  message: string
  actorType: ActivityActorType | string
  actorName: string
  actorUserId?: string
  payload?: Record<string, unknown>
  occurredAt: string
}

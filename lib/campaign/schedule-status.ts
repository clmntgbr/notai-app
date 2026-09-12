import { Campaign } from "@/lib/campaign/types"

export type CampaignScheduleStatus =
  | "active"
  | "upcoming"
  | "ended"
  | "unscheduled"

export function getCampaignScheduleStatus(
  campaign: Pick<Campaign, "startAt" | "endAt">,
  now = Date.now()
): CampaignScheduleStatus {
  const start = campaign.startAt ? new Date(campaign.startAt).getTime() : null
  const end = campaign.endAt ? new Date(campaign.endAt).getTime() : null

  if (start == null && end == null) return "unscheduled"
  if (start != null && now < start) return "upcoming"
  if (end != null && now > end) return "ended"
  return "active"
}

export const CAMPAIGN_SCHEDULE_STATUS_LABEL: Record<
  CampaignScheduleStatus,
  string
> = {
  active: "Active",
  upcoming: "Upcoming",
  ended: "Ended",
  unscheduled: "No schedule",
}

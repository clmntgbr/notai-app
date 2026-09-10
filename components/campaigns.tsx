"use client"

import { useCampaigns } from "@/lib/campaign/hooks"

export function Campaigns() {
  const { data: campaigns, isLoading } = useCampaigns()

  return (
    <div>
      <h1>Campaigns</h1>
      {isLoading ? (
        <p>Loading…</p>
      ) : (
        <ul>
          {campaigns?.members.map((campaign) => (
            <li key={campaign.id}>{campaign.name}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

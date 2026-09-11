"use client"

import { CampaignAttachment } from "@/components/campaign/campaign-attachment"
import { AttachmentGroup } from "@/components/ui/attachment"
import { useCampaigns } from "@/lib/campaign/hooks"
import { Loader2Icon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

export function Campaigns() {
  const { data, isLoading } = useCampaigns()
  const campaigns = data?.members ?? []

  return (
    <Card className="@container/card gap-0 space-y-0">
      <CardHeader>
        <CardTitle className="sr-only">Campaigns</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2Icon className="size-4 animate-spin" />
            Loading…
          </div>
        ) : campaigns.length === 0 ? (
          <p className="text-sm text-destructive">Failed to load campaigns.</p>
        ) : campaigns.length === 0 ? (
          <p className="text-sm text-muted-foreground">No campaigns yet.</p>
        ) : (
          <AttachmentGroup className="w-full">
            {campaigns.map((campaign) => (
              <CampaignAttachment key={campaign.id} campaign={campaign} />
            ))}
          </AttachmentGroup>
        )}
      </CardContent>
    </Card>
  )
}

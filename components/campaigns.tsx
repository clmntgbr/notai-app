"use client"

import { useCampaigns } from "@/lib/campaign/hooks"
import { Loader2Icon } from "lucide-react"
import Link from "next/link"

export function Campaigns() {
  const { data, isLoading } = useCampaigns()
  const campaigns = data?.members ?? []

  return (
    <div className="space-y-3 px-4 lg:px-6">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-base font-medium">Campaigns</h2>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2Icon className="size-4 animate-spin" />
          Loading…
        </div>
      ) : campaigns.length === 0 ? (
        <p className="text-sm text-muted-foreground">No campaigns yet.</p>
      ) : (
        <ul className="divide-y rounded-lg border">
          {campaigns.map((campaign) => (
            <li key={campaign.id}>
              <Link
                href={`/campaign/${campaign.id}`}
                className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-muted/50"
              >
                <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted">
                  {campaign.backgroundThumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={campaign.backgroundThumbnailUrl}
                      alt=""
                      className="size-full object-cover"
                    />
                  ) : (
                    <span className="text-[10px] text-muted-foreground">
                      {campaign.backgroundStatus}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {campaign.name}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

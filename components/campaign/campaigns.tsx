"use client"

import { CampaignAttachment } from "@/components/campaign/campaign-attachment"
import { AttachmentGroup } from "@/components/ui/attachment"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { useCampaigns } from "@/lib/campaign/hooks"
import { ArrowRightIcon, FileExclamationPoint, Loader2Icon } from "lucide-react"
import Link from "next/link"

export interface CampaignsProps {
  showAllLink?: boolean
}

export function Campaigns({ showAllLink = true }: CampaignsProps) {
  const { data, isLoading, isError } = useCampaigns()
  const campaigns = data?.members ?? []

  return (
    <Card className="@container/card gap-4 px-4">
      <CardHeader className="px-0">
        <CardTitle>Campaigns</CardTitle>
        {showAllLink ? (
          <CardAction>
            <Link
              href="/campaigns"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              Show all
              <ArrowRightIcon className="size-3.5" />
            </Link>
          </CardAction>
        ) : null}
      </CardHeader>
      <CardContent className="px-0">
        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2Icon className="size-4 animate-spin" />
            Loading…
          </div>
        ) : isError ? (
          <p className="text-sm text-destructive">Failed to load campaigns.</p>
        ) : campaigns.length === 0 ? (
          <Empty className="border-0 p-0">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileExclamationPoint />
              </EmptyMedia>
              <EmptyTitle>No campaigns yet</EmptyTitle>
              <EmptyDescription>
                You haven&apos;t created any campaigns yet. Get started by
                creating your first campaign.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
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

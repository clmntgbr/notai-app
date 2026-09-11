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
  const isEmpty = !isLoading && !isError && campaigns.length === 0

  return (
    <Card
      className={
        isEmpty
          ? "@container/card min-h-55 gap-4 px-4"
          : "@container/card gap-4 px-4"
      }
    >
      {!isEmpty ? (
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
      ) : null}
      <CardContent
        className={
          isEmpty
            ? "flex flex-1 flex-col items-center justify-center px-0"
            : "px-0"
        }
      >
        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2Icon className="size-4 animate-spin" />
            Loading…
          </div>
        ) : isError ? (
          <p className="text-sm text-destructive">Failed to load campaigns.</p>
        ) : isEmpty ? (
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

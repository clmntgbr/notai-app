"use client"

import { CampaignAttachment } from "@/components/campaign/campaign-attachment"
import { AttachmentGroup } from "@/components/ui/attachment"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  EmptyErrorState,
  EmptyLoadingState,
  EmptyState,
} from "@/components/ui/empty-state"
import { useCampaigns } from "@/lib/campaign/hooks"
import { ArrowRightIcon, FileExclamationPoint } from "lucide-react"
import Link from "next/link"

export interface CampaignsProps {
  showAllLink?: boolean
}

export function Campaigns({ showAllLink = true }: CampaignsProps) {
  const { data, isLoading, isError } = useCampaigns()
  const campaigns = data?.members ?? []
  const isEmpty = !isLoading && !isError && campaigns.length === 0
  const showAll = showAllLink && !isLoading && !isError && !isEmpty

  return (
    <Card className="@container/card min-h-55 gap-4 px-4">
      {!isEmpty ? (
        <CardHeader className="px-0">
          <CardTitle>Campaigns</CardTitle>
          <CardDescription>Organize your media</CardDescription>
          {showAll ? (
            <CardAction className="self-center">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/campaigns">
                  Show all
                  <ArrowRightIcon data-icon="inline-end" />
                </Link>
              </Button>
            </CardAction>
          ) : null}
        </CardHeader>
      ) : null}
      <CardContent
        className={
          isLoading || isError || isEmpty
            ? "flex flex-1 flex-col items-center justify-center px-0"
            : "px-0"
        }
      >
        {isLoading ? (
          <EmptyLoadingState />
        ) : isError ? (
          <EmptyErrorState
            title="Failed to load campaigns"
            description="Something went wrong while loading your campaigns. Please try again later."
          />
        ) : isEmpty ? (
          <EmptyState
            icon={<FileExclamationPoint />}
            title="No campaigns yet"
            description="You haven't created any campaigns yet. Get started by creating your first campaign."
          />
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

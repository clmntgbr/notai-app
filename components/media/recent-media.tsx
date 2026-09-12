"use client"

import { MediaAttachment } from "@/components/media/media-attachment"
import { MediaDetailDrawer } from "@/components/media/media-detail-drawer"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  EmptyErrorState,
  EmptyLoadingState,
  EmptyState,
} from "@/components/ui/empty-state"
import { useCampaigns } from "@/lib/campaign/hooks"
import { listCampaignMedia } from "@/lib/media/api"
import { Media } from "@/lib/media/types"
import { queryKeys } from "@/lib/query/keys"
import { useUser } from "@/lib/user/hooks"
import { useQueries, useQuery } from "@tanstack/react-query"
import { ArrowRightIcon, ImageIcon } from "lucide-react"
import { useMemo, useState } from "react"

export interface RecentMediaProps {
  limit?: number
}

export function RecentMedia({ limit = 5 }: RecentMediaProps) {
  const { currentClientId } = useUser()
  const [selected, setSelected] = useState<Media | null>(null)

  const campaignsQuery = useCampaigns({ page: 1, limit: 50 })
  const defaultCampaignQuery = useQuery({
    queryKey: queryKeys.campaigns.default(currentClientId ?? "none"),
    queryFn: async () => null as { id: string } | null,
    enabled: false,
    staleTime: Infinity,
  })

  const campaignIds = useMemo(() => {
    const ids = new Set<string>()
    for (const campaign of campaignsQuery.data?.members ?? []) {
      ids.add(campaign.id)
    }
    if (defaultCampaignQuery.data?.id) ids.add(defaultCampaignQuery.data.id)
    return [...ids]
  }, [campaignsQuery.data?.members, defaultCampaignQuery.data?.id])

  const mediaQueries = useQueries({
    queries: campaignIds.map((campaignId) => ({
      queryKey: queryKeys.media.list(currentClientId ?? "none", campaignId, {
        page: 1,
        limit,
        sortBy: "created_at",
        orderBy: "desc",
      }),
      queryFn: () =>
        listCampaignMedia(campaignId, {
          page: 1,
          limit,
          sortBy: "created_at",
          orderBy: "desc",
        }),
      enabled: Boolean(currentClientId) && Boolean(campaignId),
    })),
  })

  const isLoading =
    campaignsQuery.isLoading || mediaQueries.some((query) => query.isLoading)
  const isError =
    campaignsQuery.isError || mediaQueries.some((query) => query.isError)

  const items = useMemo(() => {
    const merged = mediaQueries.flatMap((query) => query.data?.members ?? [])
    return [...merged]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, limit)
  }, [mediaQueries, limit])

  const isEmpty = !isLoading && !isError && items.length === 0
  const hideHeader = isLoading || isEmpty || isError

  return (
    <>
      <Card
        className={
          hideHeader
            ? "@container/card h-full min-h-55 gap-4 px-4"
            : "@container/card h-full gap-4 px-4"
        }
      >
        {!hideHeader ? (
          <CardHeader className="px-0">
            <CardTitle>Last media</CardTitle>
            <CardAction>
              <Button variant="ghost" size="sm" disabled>
                Show all
                <ArrowRightIcon data-icon="inline-end" />
              </Button>
            </CardAction>
          </CardHeader>
        ) : null}
        <CardContent
          className={
            hideHeader
              ? "flex flex-1 flex-col items-center justify-center px-0"
              : "px-0"
          }
        >
          {isLoading ? (
            <EmptyLoadingState />
          ) : isError ? (
            <EmptyErrorState
              title="Failed to load media"
              description="Something went wrong while loading your media. Please try again later."
            />
          ) : isEmpty ? (
            <EmptyState
              icon={<ImageIcon />}
              title="No media yet"
              description="You haven't uploaded any media yet. Get started by uploading your first file."
            />
          ) : (
            <div className="flex w-full flex-col gap-2">
              {items.map((media) => (
                <MediaAttachment
                  key={media.id}
                  media={media}
                  onSelect={setSelected}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <MediaDetailDrawer
        mediaId={selected?.id ?? null}
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) setSelected(null)
        }}
      />
    </>
  )
}

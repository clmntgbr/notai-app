"use client"

import { MediaAttachment } from "@/components/media/media-attachment"
import { MediaDetailDrawer } from "@/components/media/media-detail-drawer"
import {
  EmptyErrorState,
  EmptyLoadingState,
  EmptyState,
} from "@/components/ui/empty-state"
import { useCampaignMedia } from "@/lib/media/hooks"
import { Media } from "@/lib/media/types"
import { ImageIcon } from "lucide-react"
import { useState } from "react"

export interface CampaignMediaListProps {
  campaignId: string
  limit?: number
}

export function CampaignMediaList({
  campaignId,
  limit = 20,
}: CampaignMediaListProps) {
  const [selected, setSelected] = useState<Media | null>(null)
  const { data, isLoading, isError } = useCampaignMedia(campaignId, {
    page: 1,
    limit,
    sortBy: "created_at",
    orderBy: "desc",
  })

  const items = data?.members ?? []

  if (isLoading) return <EmptyLoadingState />
  if (isError) {
    return (
      <EmptyErrorState
        title="Failed to load media"
        description="Something went wrong while loading media for this campaign."
      />
    )
  }
  if (items.length === 0) {
    return (
      <EmptyState
        icon={<ImageIcon />}
        title="No media yet"
        description="Upload images or videos to this campaign to get started."
      />
    )
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        {items.map((media) => (
          <MediaAttachment
            key={media.id}
            media={media}
            onSelect={setSelected}
          />
        ))}
      </div>
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

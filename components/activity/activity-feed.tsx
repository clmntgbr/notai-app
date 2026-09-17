"use client"

import { ActivityFeedDrawer } from "@/components/activity/activity-feed-drawer"
import { ActivityFeedItem } from "@/components/activity/activity-feed-item"
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
import { useActivity } from "@/lib/activity/hooks"
import { ActivityIcon, ArrowRightIcon } from "lucide-react"
import { useState } from "react"

export interface ActivityFeedProps {
  limit?: number
  showAllLink?: boolean
}

export function ActivityFeed({
  limit = 5,
  showAllLink = true,
}: ActivityFeedProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { data, isLoading, isError } = useActivity({
    page: 1,
    limit,
  })

  const items = data?.members ?? []
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
            <CardTitle className="hidden">Activity feed</CardTitle>
            {showAllLink ? (
              <CardAction>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDrawerOpen(true)}
                >
                  Show all
                  <ArrowRightIcon data-icon="inline-end" />
                </Button>
              </CardAction>
            ) : null}
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
              title="Failed to load activity"
              description="Something went wrong while loading the activity feed. Please try again later."
            />
          ) : isEmpty ? (
            <EmptyState
              icon={<ActivityIcon />}
              title="No activity yet"
              description="Recent events will appear here as your team uploads and reviews contents."
            />
          ) : (
            <div className="flex w-full flex-col gap-2">
              {items.map((item) => (
                <ActivityFeedItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ActivityFeedDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
    </>
  )
}

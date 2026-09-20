"use client"

import { ActivityFeedInfiniteList } from "@/components/activity/activity-feed-infinite-list"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"

export interface ActivityFeedDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  campaignId?: string
}

export function ActivityFeedDrawer({
  open,
  onOpenChange,
  campaignId,
}: ActivityFeedDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="flex h-full max-w-2xl! flex-col data-[vaul-drawer-direction=right]:w-full sm:max-w-2xl!">
        <DrawerHeader className="border-b text-start">
          <DrawerTitle>Activity feed</DrawerTitle>
          <DrawerDescription>
            {campaignId ? "Events for this campaign" : "Latest events"}
          </DrawerDescription>
        </DrawerHeader>
        <ActivityFeedInfiniteList enabled={open} campaignId={campaignId} />
      </DrawerContent>
    </Drawer>
  )
}

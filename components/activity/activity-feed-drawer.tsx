"use client"

import { ActivityFeedInfiniteList } from "@/components/activity/activity-feed-infinite-list"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"

export interface ActivityFeedDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ActivityFeedDrawer({
  open,
  onOpenChange,
}: ActivityFeedDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="flex h-full max-w-2xl! flex-col data-[vaul-drawer-direction=right]:w-full sm:max-w-2xl!">
        <DrawerHeader className="border-b text-start">
          <DrawerTitle>Activity feed</DrawerTitle>
        </DrawerHeader>
        <ActivityFeedInfiniteList enabled={open} />
      </DrawerContent>
    </Drawer>
  )
}

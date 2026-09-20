"use client"

import { MediaInfiniteList } from "@/components/media/media-infinite-list"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"

export interface RecentMediaDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  campaignId?: string
}

export function RecentMediaDrawer({
  open,
  onOpenChange,
  campaignId,
}: RecentMediaDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="flex h-full max-w-2xl! flex-col data-[vaul-drawer-direction=right]:w-full sm:max-w-2xl!">
        <DrawerHeader className="border-b text-start">
          <DrawerTitle>All media</DrawerTitle>
          <DrawerDescription>
            {campaignId ? "Media for this campaign" : "Most recent uploads"}
          </DrawerDescription>
        </DrawerHeader>
        <MediaInfiniteList
          enabled={open}
          nested
          campaignId={campaignId}
        />
      </DrawerContent>
    </Drawer>
  )
}

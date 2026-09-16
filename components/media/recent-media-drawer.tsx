"use client"

import { MediaInfiniteList } from "@/components/media/media-infinite-list"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"

export interface RecentMediaDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RecentMediaDrawer({
  open,
  onOpenChange,
}: RecentMediaDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="flex h-full max-w-2xl! flex-col data-[vaul-drawer-direction=right]:w-full sm:max-w-2xl!">
        <DrawerHeader className="hidden border-b text-start">
          <DrawerTitle>All media</DrawerTitle>
        </DrawerHeader>
        <MediaInfiniteList enabled={open} />
      </DrawerContent>
    </Drawer>
  )
}

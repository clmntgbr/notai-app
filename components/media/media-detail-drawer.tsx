"use client"

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { EmptyErrorState, EmptyLoadingState } from "@/components/ui/empty-state"
import { Spinner } from "@/components/ui/spinner"
import { useMediaDetail } from "@/lib/media/hooks"
import { MediaDetail } from "@/lib/media/types"

function MediaDetailBody({ media }: { media: MediaDetail }) {
  return <></>
}

export interface MediaDetailDrawerProps {
  mediaId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Use when opened from inside another drawer (vaul NestedRoot). */
  nested?: boolean
}

export function MediaDetailDrawer({
  mediaId,
  open,
  onOpenChange,
  nested = false,
}: MediaDetailDrawerProps) {
  const { data, isLoading, isError } = useMediaDetail(open ? mediaId : null)

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      direction="right"
      nested={nested}
    >
      <DrawerContent className="flex h-full max-w-2xl! flex-col data-[vaul-drawer-direction=right]:w-full sm:max-w-2xl!">
        <DrawerHeader className="hidden border-b text-start">
          <DrawerTitle className="hidden">Media detail</DrawerTitle>
        </DrawerHeader>
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <EmptyLoadingState icon={<Spinner />} />
          </div>
        ) : isError || !data ? (
          <div className="flex flex-1 items-center justify-center p-6">
            <EmptyErrorState
              title="Failed to load media"
              description="Something went wrong while loading this media."
            />
          </div>
        ) : (
          <MediaDetailBody media={data} />
        )}
      </DrawerContent>
    </Drawer>
  )
}

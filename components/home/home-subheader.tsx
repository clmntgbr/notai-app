"use client"

import { ImageUploadButton } from "@/components/image-upload/image-upload-button"
import type { ReactNode } from "react"

export interface HomeSubheaderProps {
  children?: ReactNode
}

export function HomeSubheader({ children }: HomeSubheaderProps) {
  return (
    <div className="relative flex h-(--header-height) shrink-0 items-center border-b px-4 lg:px-6">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {children}
      </div>
      <div className="ml-auto">
        <ImageUploadButton title="Upload media" size="sm" />
      </div>
    </div>
  )
}

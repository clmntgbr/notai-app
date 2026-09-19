"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

export interface ListPaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  disabled?: boolean
}

export function ListPagination({
  page,
  totalPages,
  onPageChange,
  disabled = false,
}: ListPaginationProps) {
  if (totalPages <= 1) return null

  const safePage = Math.min(Math.max(1, page), totalPages)

  return (
    <div className="flex items-center justify-between gap-3 border-t px-4 py-3">
      <Button
        variant="outline"
        size="sm"
        disabled={disabled || safePage <= 1}
        onClick={() => onPageChange(Math.max(1, safePage - 1))}
      >
        <ChevronLeftIcon className="size-3.5" aria-hidden="true" />
        Previous
      </Button>
      <span className="text-xs text-muted-foreground tabular-nums">
        Page {safePage} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={disabled || safePage >= totalPages}
        onClick={() => onPageChange(Math.min(totalPages, safePage + 1))}
      >
        Next
        <ChevronRightIcon className="size-3.5" aria-hidden="true" />
      </Button>
    </div>
  )
}

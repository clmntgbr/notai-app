"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { MEDIA_FILTER_OPTIONS, MediaFilterKey } from "@/lib/media/filters"
import { cn } from "cn"
import { ChevronsUpDownIcon } from "lucide-react"
import { useState } from "react"

export interface MediaStatusMultiSelectProps {
  value: MediaFilterKey[]
  onValueChange: (statuses: MediaFilterKey[]) => void
  disabled?: boolean
  className?: string
  triggerClassName?: string
}

export function MediaStatusMultiSelect({
  value,
  onValueChange,
  disabled = false,
  className,
  triggerClassName,
}: MediaStatusMultiSelectProps) {
  const [open, setOpen] = useState(false)

  const selected = MEDIA_FILTER_OPTIONS.filter((option) =>
    value.includes(option.key)
  )

  function toggle(key: MediaFilterKey) {
    if (value.includes(key)) {
      onValueChange(value.filter((item) => item !== key))
      return
    }
    onValueChange([...value, key])
  }

  const label =
    selected.length === 0
      ? ""
      : selected.length === 1
        ? selected[0].label
        : `${selected.length} statuses`

  return (
    <Popover open={open} onOpenChange={setOpen} modal={false}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "h-8 w-full justify-between border border-input bg-transparent px-3 font-normal text-sm shadow-xs",
            "hover:bg-transparent hover:text-foreground",
            triggerClassName
          )}
        >
          <span className="min-w-0 truncate">{label}</span>
          <ChevronsUpDownIcon className="size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className={cn("w-(--radix-popover-trigger-width) p-1", className)}
      >
        <div className="max-h-64 overflow-y-auto">
          {MEDIA_FILTER_OPTIONS.map((option) => {
            const checked = value.includes(option.key)
            const checkboxId = `media-status-${option.key}`

            return (
              <div
                key={option.key}
                role="option"
                aria-selected={checked}
                className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
                onClick={() => toggle(option.key)}
              >
                <Checkbox
                  id={checkboxId}
                  checked={checked}
                  tabIndex={-1}
                  className={cn(
                    "pointer-events-none",
                    option.checkboxClassName
                  )}
                />
                <span
                  className={cn(
                    "min-w-0 truncate rounded-full border px-1.5 py-0.5 text-[11px] font-medium",
                    option.className
                  )}
                >
                  {option.label}
                </span>
              </div>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}

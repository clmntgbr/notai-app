"use client"

import { AppSidebar } from "@/components/sidebar"
import { SidebarHeader } from "@/components/sidebar-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SidebarHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              {children}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}

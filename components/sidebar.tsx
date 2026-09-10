"use client"

import * as React from "react"

import { ClientSwitcher } from "@/components/client-switcher"
import { SidebarUser } from "@/components/sidebar-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { useUser } from "@/lib/user/hooks"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser()

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <ClientSwitcher />
      </SidebarHeader>
      <SidebarContent />
      <SidebarFooter>{user ? <SidebarUser user={user} /> : null}</SidebarFooter>
    </Sidebar>
  )
}

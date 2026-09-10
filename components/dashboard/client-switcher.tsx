"use client"

import {
  Building2Icon,
  CheckIcon,
  ChevronsUpDownIcon,
  PlusIcon,
} from "lucide-react"
import * as React from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useClient } from "@/lib/client/context"

export function ClientSwitcher() {
  const { isMobile } = useSidebar()
  const { clients, currentClient, isLoading, switchClient, createClient } =
    useClient()

  const [isCreating, setIsCreating] = React.useState(false)
  const [newClientName, setNewClientName] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const activeClient = currentClient ?? clients[0] ?? null

  const handleSwitch = React.useCallback(
    async (clientId: string) => {
      if (clientId === currentClient?.id || isSubmitting) return

      try {
        setIsSubmitting(true)
        setError(null)
        await switchClient(clientId)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to switch client")
      } finally {
        setIsSubmitting(false)
      }
    },
    [currentClient?.id, isSubmitting, switchClient]
  )

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (!(event.metaKey || event.ctrlKey) || event.altKey || event.shiftKey) {
        return
      }

      const index = Number(event.key)
      if (!Number.isInteger(index) || index < 1 || index > 9) {
        return
      }

      const client = clients[index - 1]
      if (!client || client.id === currentClient?.id) {
        return
      }

      event.preventDefault()
      void handleSwitch(client.id)
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [clients, currentClient?.id, handleSwitch])

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault()
    const name = newClientName.trim()
    if (!name || isSubmitting) return

    try {
      setIsSubmitting(true)
      setError(null)
      await createClient({ name })
      setNewClientName("")
      setIsCreating(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create client")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading && !activeClient) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" className="animate-pulse">
            <div className="flex aspect-square size-8 rounded-lg bg-sidebar-primary/20" />
            <div className="grid flex-1 gap-1">
              <div className="h-3 w-24 rounded bg-sidebar-foreground/10" />
              <div className="h-2.5 w-16 rounded bg-sidebar-foreground/10" />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  if (!activeClient) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <form onSubmit={handleCreate} className="flex flex-col gap-2 p-2">
            <div className="flex items-center gap-2">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <PlusIcon className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Create a client</span>
                <span className="truncate text-xs text-muted-foreground">
                  Required to continue
                </span>
              </div>
            </div>
            <Input
              autoFocus
              value={newClientName}
              onChange={(event) => setNewClientName(event.target.value)}
              placeholder="Client name"
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={isSubmitting || !newClientName.trim()}
              className="rounded-md bg-sidebar-primary px-2 py-1.5 text-xs font-medium text-sidebar-primary-foreground disabled:opacity-50"
            >
              Create client
            </button>
            {error ? <p className="text-xs text-destructive">{error}</p> : null}
          </form>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu
          onOpenChange={(open) => {
            if (!open) {
              setIsCreating(false)
              setNewClientName("")
              setError(null)
            }
          }}
        >
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              disabled={isSubmitting}
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Building2Icon className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {activeClient.name}
                </span>
              </div>
              <ChevronsUpDownIcon className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Clients
            </DropdownMenuLabel>
            {clients.map((client, index) => (
              <DropdownMenuItem
                key={client.id}
                onClick={() => handleSwitch(client.id)}
                className="gap-2 p-2"
                disabled={isSubmitting}
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <Building2Icon className="size-3.5 shrink-0" />
                </div>
                <span className="flex-1 truncate">{client.name}</span>
                {client.isActive ? (
                  <CheckIcon className="size-4 text-sidebar-primary" />
                ) : index < 9 ? (
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                ) : null}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            {isCreating ? (
              <form onSubmit={handleCreate} className="flex flex-col gap-2 p-2">
                <Input
                  autoFocus
                  value={newClientName}
                  onChange={(event) => setNewClientName(event.target.value)}
                  placeholder="Client name"
                  disabled={isSubmitting}
                />
                <button
                  type="submit"
                  disabled={isSubmitting || !newClientName.trim()}
                  className="rounded-md bg-sidebar-primary px-2 py-1.5 text-xs font-medium text-sidebar-primary-foreground disabled:opacity-50"
                >
                  Create client
                </button>
              </form>
            ) : (
              <DropdownMenuItem
                className="gap-2 p-2"
                onSelect={(event) => {
                  event.preventDefault()
                  setIsCreating(true)
                }}
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <PlusIcon className="size-4" />
                </div>
                <div className="font-medium text-muted-foreground">
                  Add client
                </div>
              </DropdownMenuItem>
            )}
            {error ? (
              <p className="px-2 pb-2 text-xs text-destructive">{error}</p>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

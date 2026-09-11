import { AppShell } from "@/components/app-shell"
import { UserCentrifugeListener } from "@/lib/centrifugo/user-centrifuge-listener"
import { ThemeProvider } from "@/lib/theme/theme-provider"

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <UserCentrifugeListener />
      <AppShell>{children}</AppShell>
    </ThemeProvider>
  )
}

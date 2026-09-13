import { AppShell } from "@/components/app-shell"
import { UserCentrifugeListener } from "@/lib/centrifugo/user-centrifuge-listener"

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <UserCentrifugeListener />
      <AppShell>{children}</AppShell>
    </>
  )
}

import { createAuthHeaders } from "@/lib/create-auth-headers"
import { requireAuth } from "@/lib/require-auth"
import { NextResponse } from "next/server"

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL

export async function GET(request: Request) {
  try {
    const auth = await requireAuth()
    if ("error" in auth) return auth.error

    const { searchParams } = new URL(request.url)
    const campaignId = searchParams.get("campaignId")?.trim()
    const from = searchParams.get("from")?.trim()
    const to = searchParams.get("to")?.trim()

    // Backend returns 400 when `to` is set without `from`.
    if (to && !from) {
      return NextResponse.json(
        { message: "from is required when to is provided" },
        { status: 400 }
      )
    }

    const query = new URLSearchParams()
    if (campaignId) query.set("campaignId", campaignId)
    if (from) query.set("from", from)
    if (from && to) query.set("to", to)
    const suffix = query.toString() ? `?${query}` : ""

    const response = await fetch(`${BACKEND_API_URL}/api/medias/stats${suffix}`, {
      method: "GET",
      headers: createAuthHeaders(auth.token),
    })

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ success: false }))
      return NextResponse.json(errorBody, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

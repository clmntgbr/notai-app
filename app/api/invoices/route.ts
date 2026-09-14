import { createAuthHeaders } from "@/lib/create-auth-headers"
import { requireAuth } from "@/lib/require-auth"
import { NextResponse } from "next/server"

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL

export async function GET(request: Request) {
  try {
    const auth = await requireAuth()
    if ("error" in auth) return auth.error

    const { searchParams } = new URL(request.url)
    const query = searchParams.toString()
    const response = await fetch(
      `${BACKEND_API_URL}/api/invoices${query ? `?${query}` : ""}`,
      {
        method: "GET",
        headers: createAuthHeaders(auth.token),
      }
    )

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

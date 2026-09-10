import { createAuthHeaders } from "@/lib/create-auth-headers"
import { requireAuth } from "@/lib/require-auth"
import { NextResponse } from "next/server"

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const auth = await requireAuth()
    if ("error" in auth) return auth.error

    const { id } = await context.params

    const response = await fetch(
      `${BACKEND_API_URL}/api/campaigns/${id}/background`,
      {
        method: "DELETE",
        headers: createAuthHeaders(auth.token),
      }
    )

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ success: false }))
      return NextResponse.json(errorBody, { status: response.status })
    }

    return new NextResponse(null, { status: 204 })
  } catch {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

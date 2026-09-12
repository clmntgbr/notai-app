import { requireAuth } from "@/lib/require-auth"
import { NextRequest, NextResponse } from "next/server"

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const auth = await requireAuth()
    if ("error" in auth) return auth.error

    const { id } = await context.params
    const version = request.nextUrl.searchParams.get("v")
    const query = version ? `?v=${encodeURIComponent(version)}` : ""

    const response = await fetch(
      `${BACKEND_API_URL}/api/medias/${id}/thumbnail${query}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      }
    )

    if (!response.ok) {
      return NextResponse.json(
        { success: false },
        { status: response.status }
      )
    }

    return new NextResponse(response.body, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("Content-Type") || "image/jpeg",
        "Cache-Control": "private, max-age=3600",
      },
    })
  } catch {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

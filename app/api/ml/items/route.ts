import { NextResponse, type NextRequest } from "next/server"
import { getSessionUserId, getSessionAccessToken } from "@/lib/ml-session"
import { getUserItems } from "@/lib/mercadolivre"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const userId = await getSessionUserId()
  if (userId === null) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  }

  // Renova o token automaticamente se estiver expirado.
  const accessToken = await getSessionAccessToken()
  if (!accessToken) {
    return NextResponse.json(
      { error: "Não foi possível obter um token válido. Refaça a conexão." },
      { status: 401 },
    )
  }

  const { searchParams } = request.nextUrl
  const limit = Number(searchParams.get("limit") ?? "20")
  const offset = Number(searchParams.get("offset") ?? "0")

  try {
    const { items, total } = await getUserItems(accessToken, userId, {
      limit: Number.isFinite(limit) ? limit : 20,
      offset: Number.isFinite(offset) ? offset : 0,
    })
    return NextResponse.json({ total, count: items.length, items })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro ao consultar a API do Mercado Livre"
    return NextResponse.json({ error: message }, { status: 502 })
  }
}

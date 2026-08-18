// app/api/ml/items/route.ts
import { NextResponse } from "next/server"
import { getSessionUserId, getSessionAccessToken } from "@/lib/ml-session"
import { getUserItems } from "@/lib/mercadolivre"

export async function GET(request: Request) {
  const userId = await getSessionUserId()
  if (userId === null) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  }

  const accessToken = await getSessionAccessToken()
  if (!accessToken) {
    return NextResponse.json({ error: "Sessão expirada, reconecte sua conta" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const limit = Number(searchParams.get("limit") ?? "20")

  try {
    const { items, total } = await getUserItems(accessToken, userId, { limit })
    return NextResponse.json({ items, total })
  } catch (err) {
    console.log("[v0] Erro ao buscar itens do ML:", err)
    return NextResponse.json({ error: "Erro ao consultar anúncios no Mercado Livre" }, { status: 502 })
  }
}

import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getSessionUserId } from "@/lib/ml-session"
import { deleteAccount } from "@/lib/ml-store"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const origin = new URL(request.url).origin
  const cookieStore = await cookies()

  // Remove os tokens armazenados no banco para esta conta.
  const userId = await getSessionUserId()
  if (userId !== null) {
    try {
      await deleteAccount(userId)
    } catch (err) {
      console.log("[v0] Falha ao remover conta no logout:", err)
    }
  }

  cookieStore.delete("ml_session")
  return NextResponse.redirect(`${origin}/`)
}

import { cookies } from "next/headers"
import { getAccount, getValidAccessToken } from "@/lib/ml-store"
import type { MLAccount } from "@/lib/db/schema"

/** Lê o user_id da sessão a partir do cookie httpOnly. */
export async function getSessionUserId(): Promise<number | null> {
  const cookieStore = await cookies()
  const raw = cookieStore.get("ml_session")?.value
  if (!raw) return null
  const id = Number(raw)
  return Number.isFinite(id) ? id : null
}

/** Retorna a conta conectada da sessão atual, ou null. */
export async function getSessionAccount(): Promise<MLAccount | null> {
  const userId = await getSessionUserId()
  if (userId === null) return null
  return getAccount(userId)
}

/**
 * Retorna um access token válido para a sessão atual, renovando
 * automaticamente quando necessário. Use isto antes de chamar a API do ML.
 */
export async function getSessionAccessToken(): Promise<string | null> {
  const userId = await getSessionUserId()
  if (userId === null) return null
  return getValidAccessToken(userId)
}

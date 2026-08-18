// lib/ml-session.ts
import { cookies } from "next/headers"
import { getAccount, getValidAccessToken } from "@/lib/ml-store"
import type { MLAccount } from "@/lib/db/schema"

const SESSION_COOKIE_NAME = "ml_session"

/** Lê o user_id da sessão a partir do cookie httpOnly. */
export async function getSessionUserId(): Promise<number | null> {
  const cookieStore = await cookies()
  const raw = cookieStore.get(SESSION_COOKIE_NAME)?.value
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

/** Remove o cookie de sessão (logout). */
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { mlAccounts, type MLAccount } from "@/lib/db/schema"
import { getMe, refreshAccessToken, type MLTokenResponse } from "@/lib/mercadolivre"

// Margem de segurança: renova o token se faltar menos de 60s para expirar.
const EXPIRY_SKEW_MS = 60 * 1000

function expiresAtFromNow(expiresInSeconds: number) {
  return new Date(Date.now() + expiresInSeconds * 1000)
}

/**
 * Salva (ou atualiza) a conta do Mercado Livre a partir de uma resposta de token.
 * Também busca nickname/email para exibição.
 */
export async function saveTokens(token: MLTokenResponse): Promise<MLAccount> {
  let nickname: string | null = null
  let email: string | null = null
  try {
    const me = await getMe(token.access_token)
    nickname = me?.nickname ?? null
    email = me?.email ?? null
  } catch {
    // Dados de perfil são opcionais; não bloqueiam a conexão.
  }

  const values = {
    mlUserId: token.user_id,
    nickname,
    email,
    accessToken: token.access_token,
    refreshToken: token.refresh_token,
    scope: token.scope,
    tokenType: token.token_type,
    expiresAt: expiresAtFromNow(token.expires_in),
    updatedAt: new Date(),
  }

  const [account] = await db
    .insert(mlAccounts)
    .values(values)
    .onConflictDoUpdate({
      target: mlAccounts.mlUserId,
      set: {
        nickname: values.nickname,
        email: values.email,
        accessToken: values.accessToken,
        refreshToken: values.refreshToken,
        scope: values.scope,
        tokenType: values.tokenType,
        expiresAt: values.expiresAt,
        updatedAt: values.updatedAt,
      },
    })
    .returning()

  return account
}

/** Retorna a conta armazenada, ou null se não existir. */
export async function getAccount(mlUserId: number): Promise<MLAccount | null> {
  const [account] = await db
    .select()
    .from(mlAccounts)
    .where(eq(mlAccounts.mlUserId, mlUserId))
    .limit(1)
  return account ?? null
}

/** Remove a conta armazenada (logout / revogação local). */
export async function deleteAccount(mlUserId: number): Promise<void> {
  await db.delete(mlAccounts).where(eq(mlAccounts.mlUserId, mlUserId))
}

/**
 * Retorna um access token válido para a conta, renovando automaticamente
 * via refresh token quando estiver expirado (ou perto de expirar).
 *
 * O Mercado Livre emite refresh tokens de uso único: cada refresh devolve
 * um novo refresh_token, por isso persistimos o resultado a cada renovação.
 */
export async function getValidAccessToken(mlUserId: number): Promise<string | null> {
  const account = await getAccount(mlUserId)
  if (!account) return null

  const isExpired = account.expiresAt.getTime() - EXPIRY_SKEW_MS <= Date.now()
  if (!isExpired) {
    return account.accessToken
  }

  try {
    const refreshed = await refreshAccessToken(account.refreshToken)
    const updated = await saveTokens(refreshed)
    return updated.accessToken
  } catch (err) {
    console.log("[v0] Falha ao renovar token do ML para", mlUserId, err)
    return null
  }
}

// lib/ml-store.ts

import { refreshAccessToken, type MLTokenResponse } from "./mercadolivre"

export interface MLAccount {
  userId: string
  accessToken: string
  refreshToken: string
  expiresAt: number // timestamp em ms
}

// Armazenamento em memória (troque por banco de dados em produção)
const accounts = new Map<string, MLAccount>()

export function saveAccount(sessionUserId: string, tokenData: MLTokenResponse) {
  const account: MLAccount = {
    userId: String(tokenData.user_id),
    accessToken: tokenData.access_token,
    refreshToken: tokenData.refresh_token,
    expiresAt: Date.now() + tokenData.expires_in * 1000,
  }
  accounts.set(sessionUserId, account)
  return account
}

export function getAccount(sessionUserId: string): MLAccount | undefined {
  return accounts.get(sessionUserId)
}

export function deleteAccount(sessionUserId: string) {
  accounts.delete(sessionUserId)
}

export async function getValidAccessToken(sessionUserId: string): Promise<string | null> {
  const account = accounts.get(sessionUserId)
  if (!account) return null

  const isExpired = Date.now() >= account.expiresAt - 60_000 // margem de 1 min

  if (!isExpired) {
    return account.accessToken
  }

  try {
    const refreshed = await refreshAccessToken(account.refreshToken)
    const updatedAccount: MLAccount = {
      userId: String(refreshed.user_id),
      accessToken: refreshed.access_token,
      refreshToken: refreshed.refresh_token,
      expiresAt: Date.now() + refreshed.expires_in * 1000,
    }
    accounts.set(sessionUserId, updatedAccount)
    return updatedAccount.accessToken
  } catch (error) {
    console.error("Erro ao renovar token do Mercado Livre:", error)
    accounts.delete(sessionUserId)
    return null
  }
}

// lib/ml-session.ts
import { cookies } from "next/headers"

const SESSION_COOKIE_NAME = "ml_session"

interface MLSession {
  user_id: number
  access_token: string
  refresh_token: string
  expires_at: number // timestamp em ms
}

function getRawSession(): MLSession | null {
  const cookieStore = cookies()
  const raw = cookieStore.get(SESSION_COOKIE_NAME)?.value
  if (!raw) return null

  try {
    return JSON.parse(raw) as MLSession
  } catch {
    return null
  }
}

export async function getSessionUserId(): Promise<number | null> {
  const session = getRawSession()
  return session?.user_id ?? null
}

export async function getSessionAccessToken(): Promise<string | null> {
  const session = getRawSession()
  if (!session) return null

  const isExpired = Date.now() >= session.expires_at
  if (!isExpired) {
    return session.access_token
  }

  // Token expirado -> renova usando refresh_token
  const newTokens = await refreshAccessToken(session.refresh_token)
  if (!newTokens) return null

  // Atualiza o cookie com os novos tokens
  const cookieStore = cookies()
  const updatedSession: MLSession = {
    user_id: session.user_id,
    access_token: newTokens.access_token,
    refresh_token: newTokens.refresh_token,
    expires_at: Date.now() + newTokens.expires_in * 1000,
  }

  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(updatedSession), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 180, // 180 dias (refresh_token do ML dura ~6 meses)
  })

  return newTokens.access_token
}

async function refreshAccessToken(refreshToken: string) {
  try {
    const res = await fetch("https://api.mercadolibre.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        client_id: process.env.ML_CLIENT_ID!,
        client_secret: process.env.ML_CLIENT_SECRET!,
        refresh_token: refreshToken,
      }),
    })

    if (!res.ok) return null
    const data = await res.json()
    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: data.expires_in,
    }
  } catch {
    return null
  }
}

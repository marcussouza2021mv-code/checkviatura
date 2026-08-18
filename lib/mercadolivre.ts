// lib/mercadolivre.ts
import crypto from "crypto"

const CLIENT_ID = process.env.MERCADOLIVRE_CLIENT_ID
const CLIENT_SECRET = process.env.MERCADOLIVRE_CLIENT_SECRET

export function isConfigured(): boolean {
  return !!(CLIENT_ID && CLIENT_SECRET)
}

export function getRedirectUri(origin: string): string {
  return (
    process.env.MERCADOLIVRE_REDIRECT_URI ||
    `${origin}/api/auth/mercadolivre/callback`
  )
}

export function generateState(): string {
  return crypto.randomBytes(16).toString("hex")
}

export function generateCodeVerifier(): string {
  return crypto.randomBytes(32).toString("base64url")
}

export function generateCodeChallenge(verifier: string): string {
  return crypto.createHash("sha256").update(verifier).digest("base64url")
}

export function buildAuthorizationUrl({
  redirectUri,
  state,
  codeChallenge,
}: {
  redirectUri: string
  state: string
  codeChallenge: string
}): string {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: CLIENT_ID || "",
    redirect_uri: redirectUri,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  })

  return `https://auth.mercadolivre.com.br/authorization?${params.toString()}`
}

export async function exchangeCodeForToken({
  code,
  redirectUri,
  codeVerifier,
}: {
  code: string
  redirectUri: string
  codeVerifier: string
}) {
  const response = await fetch("https://api.mercadolibre.com/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: CLIENT_ID || "",
      client_secret: CLIENT_SECRET || "",
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }).toString(),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to exchange code for token: ${errorText}`)
  }

  return response.json()
}

export async function refreshAccessToken(refreshToken: string) {
  const response = await fetch("https://api.mercadolibre.com/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: CLIENT_ID || "",
      client_secret: CLIENT_SECRET || "",
      refresh_token: refreshToken,
    }).toString(),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to refresh token: ${errorText}`)
  }

  return response.json()
}

export async function getMe(accessToken: string) {
  const response = await fetch("https://api.mercadolibre.com/users/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to get user info: ${errorText}`)
  }

  return response.json()
}

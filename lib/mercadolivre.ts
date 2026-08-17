import { createHash, randomBytes } from "crypto"

/**
 * Configuração e helpers para o OAuth 2.0 do Mercado Livre.
 * Documentação: https://developers.mercadolivre.com.br/pt_br/autenticacao-e-autorizacao
 */

// Domínio de autorização por país. Brasil = com.br.
// Outros: com.ar, com.mx, com.co, com.cl, etc.
export const ML_AUTH_DOMAIN =
  process.env.ML_AUTH_DOMAIN?.trim() || "https://auth.mercadolivre.com.br"

export const ML_API_BASE = "https://api.mercadolibre.com"

// O projeto pode ter as credenciais sob dois nomes diferentes.
// Aceitamos ambos para evitar inconsistência entre ML_* e MERCADOLIVRE_*.
export const ML_CLIENT_ID = (process.env.ML_CLIENT_ID || process.env.MERCADOLIVRE_CLIENT_ID)?.trim()
export const ML_CLIENT_SECRET = (process.env.ML_CLIENT_SECRET || process.env.MERCADOLIVRE_CLIENT_SECRET)?.trim()

/**
 * A redirect_uri precisa ser IDÊNTICA à cadastrada na sua aplicação
 * no painel de desenvolvedores do Mercado Livre.
 * Se ML_REDIRECT_URI não estiver definida, derivamos da origem da requisição.
 */
export function getRedirectUri(origin: string) {
  return process.env.ML_REDIRECT_URI?.trim() || `${origin}/api/auth/mercadolivre/callback`
}

export function isConfigured() {
  return Boolean(ML_CLIENT_ID && ML_CLIENT_SECRET)
}

function base64url(input: Buffer) {
  return input.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

/** Gera um code_verifier aleatório para PKCE. */
export function generateCodeVerifier() {
  return base64url(randomBytes(32))
}

/** Deriva o code_challenge (S256) a partir do code_verifier. */
export function generateCodeChallenge(verifier: string) {
  return base64url(createHash("sha256").update(verifier).digest())
}

/** Gera um valor de state aleatório (proteção contra CSRF). */
export function generateState() {
  return base64url(randomBytes(16))
}

/** Monta a URL de autorização do Mercado Livre. */
export function buildAuthorizationUrl(params: {
  redirectUri: string
  state: string
  codeChallenge: string
}) {
  const url = new URL(`${ML_AUTH_DOMAIN}/authorization`)
  url.searchParams.set("response_type", "code")
  url.searchParams.set("client_id", ML_CLIENT_ID ?? "")
  url.searchParams.set("redirect_uri", params.redirectUri)
  url.searchParams.set("state", params.state)
  url.searchParams.set("code_challenge", params.codeChallenge)
  url.searchParams.set("code_challenge_method", "S256")
  return url.toString()
}

export interface MLTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
  scope: string
  user_id: number
  refresh_token: string
}

/** Troca o authorization code pelo access token. */
export async function exchangeCodeForToken(params: {
  code: string
  redirectUri: string
  codeVerifier: string
}): Promise<MLTokenResponse> {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: ML_CLIENT_ID ?? "",
    client_secret: ML_CLIENT_SECRET ?? "",
    code: params.code,
    redirect_uri: params.redirectUri,
    code_verifier: params.codeVerifier,
  })

  const res = await fetch(`${ML_API_BASE}/oauth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body,
    cache: "no-store",
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Falha ao trocar o code por token (${res.status}): ${text}`)
  }

  return res.json()
}

/** Renova o access token usando o refresh token. */
export async function refreshAccessToken(refreshToken: string): Promise<MLTokenResponse> {
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: ML_CLIENT_ID ?? "",
    client_secret: ML_CLIENT_SECRET ?? "",
    refresh_token: refreshToken,
  })

  const res = await fetch(`${ML_API_BASE}/oauth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body,
    cache: "no-store",
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Falha ao renovar o token (${res.status}): ${text}`)
  }

  return res.json()
}

/** Busca os dados do usuário autenticado. */
export async function getMe(accessToken: string) {
  const res = await fetch(`${ML_API_BASE}/users/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  })
  if (!res.ok) {
    throw new Error(`Falha ao buscar dados do usuário (${res.status})`)
  }
  return res.json()
}

export interface MLItem {
  id: string
  title: string
  price: number
  currency_id: string
  available_quantity: number
  sold_quantity: number
  status: string
  permalink: string
  thumbnail: string
}

/**
 * Lista os anúncios (itens) de um usuário.
 * 1) Busca os IDs em /users/{id}/items/search
 * 2) Busca os detalhes via multiget /items?ids=...
 */
export async function getUserItems(
  accessToken: string,
  userId: number,
  opts: { limit?: number; offset?: number } = {},
): Promise<{ items: MLItem[]; total: number }> {
  const limit = Math.min(opts.limit ?? 20, 50)
  const offset = opts.offset ?? 0

  const searchUrl = new URL(`${ML_API_BASE}/users/${userId}/items/search`)
  searchUrl.searchParams.set("limit", String(limit))
  searchUrl.searchParams.set("offset", String(offset))

  const searchRes = await fetch(searchUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  })
  if (!searchRes.ok) {
    const text = await searchRes.text()
    throw new Error(`Falha ao buscar anúncios (${searchRes.status}): ${text}`)
  }

  const search = (await searchRes.json()) as {
    results: string[]
    paging?: { total?: number }
  }
  const ids = search.results ?? []
  const total = search.paging?.total ?? ids.length

  if (ids.length === 0) {
    return { items: [], total }
  }

  // O multiget aceita no máximo 20 IDs por chamada.
  const attributes = [
    "id",
    "title",
    "price",
    "currency_id",
    "available_quantity",
    "sold_quantity",
    "status",
    "permalink",
    "thumbnail",
  ].join(",")

  const multiUrl = new URL(`${ML_API_BASE}/items`)
  multiUrl.searchParams.set("ids", ids.slice(0, 20).join(","))
  multiUrl.searchParams.set("attributes", attributes)

  const multiRes = await fetch(multiUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  })
  if (!multiRes.ok) {
    const text = await multiRes.text()
    throw new Error(`Falha ao buscar detalhes dos anúncios (${multiRes.status}): ${text}`)
  }

  const multi = (await multiRes.json()) as Array<{ code: number; body: MLItem }>
  const items = multi.filter((entry) => entry.code === 200).map((entry) => entry.body)

  return { items, total }
}

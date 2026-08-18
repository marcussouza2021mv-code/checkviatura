// lib/mercadolivre.ts

const ML_API_BASE = "https://api.mercadolibre.com"

export interface MLTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
  scope: string
  user_id: number
  refresh_token: string
}

export function isConfigured(): boolean {
  return Boolean(process.env.ML_CLIENT_ID && process.env.ML_CLIENT_SECRET)
}

export async function exchangeCodeForToken(code: string, redirectUri: string): Promise<MLTokenResponse> {
  const response = await fetch(`${ML_API_BASE}/oauth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: process.env.ML_CLIENT_ID!,
      client_secret: process.env.ML_CLIENT_SECRET!,
      code,
      redirect_uri: redirectUri,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Erro ao trocar código por token: ${errorText}`)
  }

  return response.json()
}

export async function refreshAccessToken(refreshToken: string): Promise<MLTokenResponse> {
  const response = await fetch(`${ML_API_BASE}/oauth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: process.env.ML_CLIENT_ID!,
      client_secret: process.env.ML_CLIENT_SECRET!,
      refresh_token: refreshToken,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Erro ao renovar token: ${errorText}`)
  }

  return response.json()
}

export async function getMe(accessToken: string) {
  const response = await fetch(`${ML_API_BASE}/users/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!response.ok) {
    throw new Error("Erro ao buscar dados do usuário no Mercado Livre")
  }

  return response.json()
}

interface GetUserItemsOptions {
  limit?: number
  offset?: number
}

export async function getUserItems(
  accessToken: string,
  userId: string | number,
  options: GetUserItemsOptions = {},
) {
  const { limit = 20, offset = 0 } = options

  const searchUrl = `${ML_API_BASE}/users/${userId}/items/search?limit=${limit}&offset=${offset}`
  const searchResponse = await fetch(searchUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!searchResponse.ok) {
    const errorText = await searchResponse.text()
    throw new Error(`Erro ao buscar itens do usuário: ${errorText}`)
  }

  const searchData = await searchResponse.json()
  const itemIds: string[] = searchData.results ?? []
  const total: number = searchData.paging?.total ?? 0

  if (itemIds.length === 0) {
    return { items: [], total }
  }

  const itemsUrl = `${ML_API_BASE}/items?ids=${itemIds.join(",")}`
  const itemsResponse = await fetch(itemsUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!itemsResponse.ok) {
    const errorText = await itemsResponse.text()
    throw new Error(`Erro ao buscar detalhes dos itens: ${errorText}`)
  }

  const itemsData = await itemsResponse.json()
  const items = itemsData
    .filter((entry: any) => entry.code === 200)
    .map((entry: any) => entry.body)

  return { items, total }
}

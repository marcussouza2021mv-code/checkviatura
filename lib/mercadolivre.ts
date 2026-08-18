// lib/mercadolivre.ts

const CLIENT_ID = process.env.MERCADOLIVRE_CLIENT_ID;
const CLIENT_SECRET = process.env.MERCADOLIVRE_CLIENT_SECRET;
const REDIRECT_URI =
  process.env.MERCADOLIVRE_REDIRECT_URI ||
  "https://mlintegra-marcos2026.vercel.app/api/auth/mercadolivre/callback";

export function isConfigured(): boolean {
  return !!(CLIENT_ID && CLIENT_SECRET);
}

export function getRedirectUri(): string {
  return REDIRECT_URI;
}

export function getAuthUrl(state?: string): string {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: CLIENT_ID || "",
    redirect_uri: getRedirectUri(),
  });

  if (state) {
    params.append("state", state);
  }

  return `https://auth.mercadolivre.com.br/authorization?${params.toString()}`;
}

export async function exchangeCodeForToken(code: string) {
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
      redirect_uri: getRedirectUri(),
    }).toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to exchange code for token: ${errorText}`);
  }

  return response.json();
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
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to refresh token: ${errorText}`);
  }

  return response.json();
}

export async function getMe(accessToken: string) {
  const response = await fetch("https://api.mercadolibre.com/users/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to get user info: ${errorText}`);
  }

  return response.json();
}

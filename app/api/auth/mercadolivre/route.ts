import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import {
  buildAuthorizationUrl,
  generateCodeChallenge,
  generateCodeVerifier,
  generateState,
  getRedirectUri,
  isConfigured,
} from "@/lib/mercadolivre"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  if (!isConfigured()) {
    const origin = new URL(request.url).origin
    return NextResponse.redirect(`${origin}/?erro=config`)
  }

  const origin = new URL(request.url).origin
  const redirectUri = getRedirectUri(origin)

  const state = generateState()
  const codeVerifier = generateCodeVerifier()
  const codeChallenge = generateCodeChallenge(codeVerifier)

  const authUrl = buildAuthorizationUrl({ redirectUri, state, codeChallenge })

  const cookieStore = await cookies()
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 10, // 10 minutos para concluir o login
  }
  cookieStore.set("ml_oauth_state", state, cookieOptions)
  cookieStore.set("ml_oauth_verifier", codeVerifier, cookieOptions)

  return NextResponse.redirect(authUrl)
}

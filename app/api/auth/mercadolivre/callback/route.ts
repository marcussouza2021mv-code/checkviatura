import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { exchangeCodeForToken, getRedirectUri } from "@/lib/mercadolivre"
import { saveTokens } from "@/lib/ml-store"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const origin = url.origin
  const code = url.searchParams.get("code")
  const state = url.searchParams.get("state")
  const error = url.searchParams.get("error")

  // O Mercado Livre pode retornar um erro (ex.: usuário negou o acesso)
  if (error) {
    return NextResponse.redirect(`${origin}/?erro=${encodeURIComponent(error)}`)
  }

  const cookieStore = await cookies()
  const savedState = cookieStore.get("ml_oauth_state")?.value
  const codeVerifier = cookieStore.get("ml_oauth_verifier")?.value

  // Validação de segurança: state e code precisam existir e bater
  if (!code || !state || !savedState || state !== savedState || !codeVerifier) {
    return NextResponse.redirect(`${origin}/?erro=state_invalido`)
  }

  try {
    const token = await exchangeCodeForToken({
      code,
      redirectUri: getRedirectUri(origin),
      codeVerifier,
    })

    // Limpa os cookies temporários do fluxo OAuth
    cookieStore.delete("ml_oauth_state")
    cookieStore.delete("ml_oauth_verifier")

    // Persiste os tokens no banco de dados (Neon), indexados pelo user_id do ML.
    await saveTokens(token)

    // O único dado guardado em cookie é a referência de sessão (o user_id do ML).
    // O access/refresh token nunca trafega para o cliente.
    cookieStore.set("ml_session", String(token.user_id), {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 180, // 180 dias
    })

    return NextResponse.redirect(`${origin}/conectado`)
  } catch (err) {
    console.log("[v0] Erro no callback do Mercado Livre:", err)
    return NextResponse.redirect(`${origin}/?erro=token`)
  }
}

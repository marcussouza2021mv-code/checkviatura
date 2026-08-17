import Link from "next/link"
import { cookies } from "next/headers"
import { isConfigured } from "@/lib/mercadolivre"
import { ConnectButton } from "@/components/connect-button"
import { StatusAlert } from "@/components/status-alert"

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>
}) {
  const { erro } = await searchParams
  const cookieStore = await cookies()
  const jaConectado = Boolean(cookieStore.get("ml_session"))
  const configurado = isConfigured()

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center gap-2 text-center">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl font-bold"
            style={{ backgroundColor: "#FFE600", color: "#2D3277" }}
            aria-hidden="true"
          >
            ML
          </div>
          <h1 className="text-balance text-2xl font-semibold tracking-tight text-foreground">
            Conectar com o Mercado Livre
          </h1>
          <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
            Autorize sua conta para gerar o token de acesso via OAuth 2.0 com PKCE.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-4">
          <StatusAlert erro={erro} configurado={configurado} />

          {jaConectado ? (
            <Link
              href="/conectado"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Ver conexão
            </Link>
          ) : (
            <ConnectButton disabled={!configurado} />
          )}

          <p className="text-center text-xs leading-relaxed text-muted-foreground">
            A <code className="rounded bg-muted px-1 py-0.5">redirect_uri</code> usada é{" "}
            <code className="rounded bg-muted px-1 py-0.5">/api/auth/mercadolivre/callback</code>.
            Cadastre-a exatamente igual no painel do desenvolvedor.
          </p>
        </div>
      </div>
    </main>
  )
}

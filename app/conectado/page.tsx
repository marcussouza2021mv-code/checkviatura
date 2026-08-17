import Link from "next/link"
import { redirect } from "next/navigation"
import { getSessionAccount, getSessionAccessToken } from "@/lib/ml-session"
import { getMe } from "@/lib/mercadolivre"
import { ItemsList } from "@/components/items-list"

export const dynamic = "force-dynamic"

export default async function ConectadoPage() {
  const account = await getSessionAccount()

  if (!account) {
    redirect("/")
  }

  // Garante um token válido (renova automaticamente se estiver expirado)
  // e reconsulta os dados atualizados do usuário.
  let me: { nickname?: string; email?: string; id?: number } | null = null
  let erroApi: string | null = null
  try {
    const accessToken = await getSessionAccessToken()
    if (!accessToken) throw new Error("Não foi possível renovar o token")
    me = await getMe(accessToken)
  } catch (err) {
    erroApi = err instanceof Error ? err.message : "Erro ao consultar a API"
  }

  const userId = account.mlUserId

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
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Conta conectada</h1>
          <p className="text-sm text-muted-foreground">
            Tokens salvos no banco de dados e renovados automaticamente.
          </p>
        </div>

        <dl className="mt-8 divide-y divide-border rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between gap-4 p-4">
            <dt className="text-sm text-muted-foreground">User ID</dt>
            <dd className="font-mono text-sm text-card-foreground">{me?.id ?? userId ?? "-"}</dd>
          </div>
          <div className="flex items-center justify-between gap-4 p-4">
            <dt className="text-sm text-muted-foreground">Apelido</dt>
            <dd className="font-mono text-sm text-card-foreground">{me?.nickname ?? account.nickname ?? "-"}</dd>
          </div>
          <div className="flex items-center justify-between gap-4 p-4">
            <dt className="text-sm text-muted-foreground">E-mail</dt>
            <dd className="font-mono text-sm text-card-foreground">{me?.email ?? account.email ?? "-"}</dd>
          </div>
        </dl>

        {erroApi && (
          <p role="alert" className="mt-4 text-center text-xs text-destructive">
            {erroApi}
          </p>
        )}

        <ItemsList />

        <div className="mt-6 flex justify-center">
          <Link
            href="/api/auth/mercadolivre/logout"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-border px-5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Desconectar
          </Link>
        </div>
      </div>
    </main>
  )
}

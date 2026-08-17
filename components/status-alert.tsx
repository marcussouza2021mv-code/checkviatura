const MENSAGENS: Record<string, string> = {
  config: "Configure as variáveis ML_CLIENT_ID e ML_CLIENT_SECRET para habilitar a conexão.",
  state_invalido: "A validação de segurança falhou (state inválido). Tente conectar novamente.",
  token: "Não foi possível trocar o código pelo token de acesso. Tente novamente.",
  access_denied: "Você não autorizou o acesso à sua conta do Mercado Livre.",
}

export function StatusAlert({ erro, configurado }: { erro?: string; configurado: boolean }) {
  if (!configurado) {
    return (
      <div
        role="alert"
        className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm leading-relaxed text-destructive"
      >
        Defina <code className="font-mono">ML_CLIENT_ID</code> e{" "}
        <code className="font-mono">ML_CLIENT_SECRET</code> nas variáveis de ambiente do projeto
        para habilitar a conexão.
      </div>
    )
  }

  if (!erro) return null

  const mensagem = MENSAGENS[erro] ?? `Ocorreu um erro: ${erro}`

  return (
    <div
      role="alert"
      className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm leading-relaxed text-destructive"
    >
      {mensagem}
    </div>
  )
}

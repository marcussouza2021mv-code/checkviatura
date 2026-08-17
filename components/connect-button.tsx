"use client"

export function ConnectButton({ disabled }: { disabled?: boolean }) {
  return (
    <a
      href={disabled ? undefined : "/api/auth/mercadolivre"}
      aria-disabled={disabled}
      className="inline-flex h-11 items-center justify-center rounded-lg px-6 text-sm font-semibold transition-opacity hover:opacity-90 data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50"
      data-disabled={disabled}
      style={{ backgroundColor: "#FFE600", color: "#2D3277" }}
    >
      Conectar conta do Mercado Livre
    </a>
  )
}

"use client"

import { useState } from "react"

interface MLItem {
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

const statusLabels: Record<string, string> = {
  active: "Ativo",
  paused: "Pausado",
  closed: "Encerrado",
  under_review: "Em revisão",
}

export function ItemsList() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [items, setItems] = useState<MLItem[] | null>(null)
  const [total, setTotal] = useState<number | null>(null)

  async function fetchItems() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/ml/items?limit=20", { cache: "no-store" })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error ?? `Erro ${res.status}`)
      }
      setItems(data.items)
      setTotal(data.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar anúncios")
    } finally {
      setLoading(false)
    }
  }

  function formatPrice(value: number, currency: string) {
    try {
      return new Intl.NumberFormat("pt-BR", { style: "currency", currency }).format(value)
    } catch {
      return `${currency} ${value}`
    }
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-sm font-medium text-foreground">Meus anúncios</h2>
        <button
          type="button"
          onClick={fetchItems}
          disabled={loading}
          className="inline-flex h-9 items-center justify-center rounded-lg px-4 text-sm font-medium transition-colors disabled:opacity-60"
          style={{ backgroundColor: "#FFE600", color: "#2D3277" }}
        >
          {loading ? "Carregando..." : "Listar anúncios"}
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-4 text-center text-xs text-destructive">
          {error}
        </p>
      )}

      {items && total !== null && (
        <p className="mt-4 text-xs text-muted-foreground">
          {total} {total === 1 ? "anúncio encontrado" : "anúncios encontrados"}
          {items.length < total ? ` (exibindo ${items.length})` : ""}
        </p>
      )}

      {items && items.length === 0 && (
        <p className="mt-4 rounded-lg border border-border bg-card p-4 text-center text-sm text-muted-foreground">
          Nenhum anúncio encontrado nesta conta.
        </p>
      )}

      {items && items.length > 0 && (
        <ul className="mt-4 flex flex-col gap-2">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={item.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:bg-muted"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.thumbnail || "/placeholder.svg"}
                  alt=""
                  className="h-12 w-12 shrink-0 rounded-md object-cover"
                  crossOrigin="anonymous"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-card-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatPrice(item.price, item.currency_id)} · {item.available_quantity} disp. ·{" "}
                    {item.sold_quantity} vendidos
                  </p>
                </div>
                <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                  {statusLabels[item.status] ?? item.status}
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

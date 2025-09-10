"use client"

import * as React from "react"

export function StatCard({
  label,
  value,
  Icon,
  delta,
  variant,
  percent,
}: {
  label: string
  value: string | number
  Icon: React.ComponentType<{ className?: string }>
  delta?: string
  variant?: 'occupancy'
  percent?: number
}) {
  const deltaClass = delta?.startsWith("-") ? "text-red-500" : "text-green-600"
  const pct = typeof percent === 'number' && isFinite(percent) ? Math.max(0, Math.min(100, percent)) : null
  // Texto con color según ocupación (sin barra)
  const occupancyTextClass = pct == null
    ? 'text-muted-foreground'
    : pct >= 90
      ? 'text-red-600'
      : pct >= 70
        ? 'text-amber-600'
        : 'text-emerald-600'
  const occupancyLabel = pct == null
    ? ''
    : pct <= 20
      ? 'Vacío'
      : pct <= 60
        ? 'Medio'
        : pct <= 85
          ? 'Alto'
          : 'Crítico'

  return (
    <div className="rounded-xl border bg-muted/50 p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">{label}</div>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <div className="text-3xl font-bold">{value}</div>
        {variant === 'occupancy' && pct != null && (
          <span className={`text-xs font-semibold ${occupancyTextClass}`}>{occupancyLabel}</span>
        )}
      </div>
      {delta && <div className={`mt-1 text-xs ${deltaClass}`}>{delta}</div>}
    </div>
  )
}

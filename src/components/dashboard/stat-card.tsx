"use client"

import * as React from "react"

export function StatCard({
  label,
  value,
  Icon,
  delta,
}: {
  label: string
  value: string | number
  Icon: React.ComponentType<{ className?: string }>
  delta?: string
}) {
  const deltaClass = delta?.startsWith("-") ? "text-red-500" : "text-green-600"
  return (
    <div className="rounded-xl border bg-muted/50 p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">{label}</div>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="mt-2 text-3xl font-bold">{value}</div>
      {delta && <div className={`mt-1 text-xs ${deltaClass}`}>{delta}</div>}
    </div>
  )
}


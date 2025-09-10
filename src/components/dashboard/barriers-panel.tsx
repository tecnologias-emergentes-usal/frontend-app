"use client"

import * as React from "react"
import { StatusPill } from "@/components/dashboard/status-pill"

export function BarriersPanel({
  items,
  connectionNote,
}: {
  items: Array<{ name: string; place: string; status: "open" | "closed" | "ok" }>
  connectionNote?: string
}) {
  return (
    <div className="rounded-2xl border bg-muted/50 p-4">
      <div className="space-y-3">
        {items.map((b) => (
          <div key={b.name} className="rounded-xl border bg-background/60 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{b.name}</div>
                <div className="text-sm text-muted-foreground">{b.place}</div>
              </div>
              <StatusPill status={b.status} />
            </div>
          </div>
        ))}
        {connectionNote && (
          <div className="text-xs text-muted-foreground">{connectionNote}</div>
        )}
      </div>
    </div>
  )
}


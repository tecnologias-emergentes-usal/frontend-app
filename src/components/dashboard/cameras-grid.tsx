"use client"

import * as React from "react"
import { Camera } from "lucide-react"
import { StatusPill } from "@/components/dashboard/status-pill"

type CamStatus = "connected" | "disconnected" | "reconnecting" | "connecting"

export function CamerasGrid({
  items,
}: {
  items: Array<{ name: string; zone: string; status: CamStatus; lastSeen: string }>
}) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((c) => (
        <div key={c.name} className="relative rounded-xl border bg-background/60 p-4">
          <div className="absolute right-3 top-3">
            <StatusPill status={c.status} />
          </div>
          <div className="flex h-24 items-center justify-center rounded-lg bg-muted">
            <Camera className="h-10 w-10 text-muted-foreground" />
          </div>
          <div className="mt-3">
            <div className="font-semibold">{c.name}</div>
            <div className="text-sm text-muted-foreground">{c.zone}</div>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">{c.lastSeen}</div>
        </div>
      ))}
    </div>
  )
}

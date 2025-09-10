"use client"

import * as React from "react"
import { StatusPill } from "@/components/dashboard/status-pill"
import { VideoStream } from "@/components/VideoStream"
import { env } from "@/lib/env"

type CamStatus = "connected" | "disconnected" | "reconnecting" | "connecting"

export function CamerasGrid({
  items,
}: {
  items: Array<{ index: number; name: string; zone: string; status: CamStatus; lastSeen: string }>
}) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((c) => (
        <div key={c.name} className="relative rounded-xl border bg-background/60 p-4">
          <div className="absolute right-3 top-3 z-10">
            <StatusPill status={c.status} />
          </div>
          <VideoStream
            cam_index={c.index}
            cameraName={c.name}
            streamUrl={`${env.STREAMING_BASE_URL}/${c.index}`}
          />
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

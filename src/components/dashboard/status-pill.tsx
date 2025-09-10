"use client"

import * as React from "react"

type Status =
  | "connected"
  | "disconnected"
  | "reconnecting"
  | "connecting"
  | "open"
  | "closed"
  | "ok"

export function StatusPill({ status, className = "" }: { status: Status; className?: string }) {
  const map: Record<Status, { label: string; cls: string }> = {
    connected: { label: "connected", cls: "bg-green-600 text-white" },
    disconnected: { label: "disconnected", cls: "bg-red-600 text-white" },
    reconnecting: { label: "reconnecting", cls: "bg-yellow-500 text-black" },
    connecting: { label: "connecting", cls: "bg-yellow-500 text-black" },
    open: { label: "open", cls: "bg-green-600 text-white" },
    closed: { label: "closed", cls: "bg-zinc-600 text-white" },
    ok: { label: "ok", cls: "bg-green-600 text-white" },
  }

  const { label, cls } = map[status]

  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${cls} ${className}`}>{label}</span>
  )
}

"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { usePredictionsNotificationContext } from "@/context/PredictionsNotificationContext"
import { env } from "@/lib/env"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

type CameraStatus = "online" | "offline" | "connecting"

export function NavCameras({
  cameras,
}: {
  cameras: {
    name: string
    url: string
    subtitle: string
    index: number
    status?: CameraStatus
  }[]
}) {
  const pathname = usePathname()
  const { parkingStatsByCamera, systemStatus } = usePredictionsNotificationContext()

  // Track cambios por cámara para inferir "conexión" (similar al dashboard)
  const [lastUpdateAt, setLastUpdateAt] = React.useState<number[]>(() => Array(env.CAMERA_COUNT).fill(0))
  const prevStats = React.useRef<{ occupiedSpots?: number; availableSpots?: number }[]>([])
  const initializedRef = React.useRef(false)

  React.useEffect(() => {
    // No marcar updates mientras el sistema no esté activo
    if (systemStatus !== "active") return

    // Primera pasada: inicializar prevStats para no contar valores por defecto como "update"
    if (!initializedRef.current) {
      prevStats.current = parkingStatsByCamera.map((s) => ({
        occupiedSpots: s?.occupiedSpots,
        availableSpots: s?.availableSpots,
      }))
      initializedRef.current = true
      return
    }

    const next = [...lastUpdateAt]
    for (let i = 0; i < env.CAMERA_COUNT; i++) {
      const s = parkingStatsByCamera[i]
      const prev = prevStats.current[i] || {}
      if (!s) continue
      if (prev.occupiedSpots !== s.occupiedSpots || prev.availableSpots !== s.availableSpots) {
        next[i] = Date.now()
      }
      prevStats.current[i] = { occupiedSpots: s.occupiedSpots, availableSpots: s.availableSpots }
    }
    setLastUpdateAt(next)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [systemStatus, parkingStatsByCamera.map((s) => `${s?.occupiedSpots}-${s?.availableSpots}`).join("|")])

  const computeStatus = (idx: number): CameraStatus => {
    if (systemStatus === "error") return "offline"
    if (systemStatus !== "active") return "connecting"
    const ts = lastUpdateAt[idx]
    // Antes del primer update, mostrar "connecting"
    if (!ts) return "connecting"
    const age = Date.now() - ts
    if (age < 2 * 60 * 1000) return "online"
    if (age < 5 * 60 * 1000) return "connecting"
    return "offline"
  }
  const statusLabel = (s: CameraStatus) =>
    s === "online" ? "En línea" : s === "offline" ? "Sin conexión" : "Conectando"

  const statusColor = (s: CameraStatus) =>
    s === "online"
      ? "bg-green-500"
      : s === "offline"
      ? "bg-red-500"
      : "bg-yellow-500"

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Cámaras</SidebarGroupLabel>
      <SidebarMenu>
        {cameras.map((cam) => (
          <SidebarMenuItem key={cam.name}>
            <SidebarMenuButton
              asChild
              className="pr-10"
              isActive={pathname === cam.url}
            >
              <Link href={cam.url}>
                <span className="min-w-0">
                  <span className="block truncate font-medium">{cam.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {cam.subtitle}
                  </span>
                </span>
              </Link>
            </SidebarMenuButton>
            <SidebarMenuBadge>
              <span className="flex items-center" title={statusLabel(cam.status ?? computeStatus(cam.index))}>
                <span
                  className={`h-2.5 w-2.5 rounded-full ${statusColor(cam.status ?? computeStatus(cam.index))}`}
                  aria-label={statusLabel(cam.status ?? computeStatus(cam.index))}
                />
                <span className="sr-only">{statusLabel(cam.status ?? computeStatus(cam.index))}</span>
              </span>
            </SidebarMenuBadge>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

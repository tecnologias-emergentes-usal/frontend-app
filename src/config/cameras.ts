import { env } from "@/lib/env"

// DICCIONARIO MAESTRO (array): definí acá las cámaras reales.
// id puede ser string o número convertido a string; index es el índice usado por streams.
export type CameraEntry = {
  id: string | number
  index: number
  title: string
  subtitle: string
}

export const CAMERAS: CameraEntry[] = [
  { id: 0, index: 0, title: "Entrada Principal", subtitle: "Acceso" },
  { id: 1, index: 1, title: "Norte", subtitle: "Estacionamiento" },
  { id: 2, index: 2, title: "Sur", subtitle: "Estacionamiento" },
  { id: 3, index: 3, title: "Pabellón", subtitle: "Campus" },
]

export function getCameraById(id: string): CameraEntry | null {
  return CAMERAS.find((c) => String(c.id) === String(id)) ?? null
}

export function getCameraByIndex(index: number): CameraEntry | null {
  return CAMERAS.find((c) => c.index === index) ?? null
}

export function getSidebarCameras(): Array<{ name: string; subtitle: string; url: string; index: number }> {
  // Mostrar sólo las que existan dentro del rango de CAMERA_COUNT
  return CAMERAS.filter((c) => c.index < env.CAMERA_COUNT).map((c) => ({
    name: c.title,
    subtitle: c.subtitle,
    url: `/camera/${c.id}`,
    index: c.index,
  }))
}

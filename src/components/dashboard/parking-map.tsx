"use client"

import * as React from "react"

export function ParkingMap({
  totalSlots,
  occupiedSet,
  occupancyPct,
  columns = 8,
}: {
  totalSlots: number
  occupiedSet: Set<number>
  occupancyPct: number
  columns?: 4 | 5 | 6 | 7 | 8 | 9 | 10
}) {
  const slots = React.useMemo(
    () => Array.from({ length: Math.max(totalSlots, 1) }, (_, idx) => idx + 1),
    [totalSlots]
  )
  const colClass = {
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
    7: "grid-cols-7",
    8: "grid-cols-8",
    9: "grid-cols-9",
    10: "grid-cols-10",
  }[columns]

  return (
    <div className="rounded-2xl border bg-muted/50 p-4">
      <div className={`grid ${colClass} gap-2`}>
        {slots.map((n) => {
          const isOcc = occupiedSet.has(n)
          return (
            <div
              key={n}
              className={`flex h-10 items-center justify-center rounded-md border text-xs font-medium ${
                isOcc ? "border-red-600 text-red-600" : "border-green-600 text-green-700"
              }`}
            >
              {n}
            </div>
          )
        })}
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-green-600" /> Disponible</span>
          <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-red-600" /> Ocupado</span>
        </div>
        <div>
          {occupancyPct}% ocupado
        </div>
      </div>
    </div>
  )
}


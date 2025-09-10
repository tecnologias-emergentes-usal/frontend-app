"use client";

import * as React from 'react';
import { Camera, Car, ShieldCheck, Activity } from 'lucide-react';
import { usePredictionsNotificationContext } from '@/context/PredictionsNotificationContext';
import { useBarrier } from '@/context/BarrierContext';
import { env } from '@/lib/env';
import { StatCard } from '@/components/dashboard/stat-card';
import { CamerasGrid } from '@/components/dashboard/cameras-grid';
import { ParkingMap } from '@/components/dashboard/parking-map';
import { BarriersPanel } from '@/components/dashboard/barriers-panel';
import { timeAgo } from '@/lib/time';
import { CAMERAS } from '@/config/cameras';

type CamStatus = 'connected' | 'disconnected' | 'reconnecting' | 'connecting';

export default function Page() {
  const { parkingStatsByCamera, systemStatus, totalParkingSpaces } = usePredictionsNotificationContext();
  const { lastActions, connectionStatus: barrierConn } = useBarrier();

  // Track per-camera last update timestamps by observing changes in parking stats
  const [lastUpdateAt, setLastUpdateAt] = React.useState<number[]>(() => Array(env.CAMERA_COUNT).fill(0));
  const prevStats = React.useRef<{ occupiedSpots?: number; availableSpots?: number }[]>([]);

  React.useEffect(() => {
    const next = [...lastUpdateAt];
    for (let i = 0; i < env.CAMERA_COUNT; i++) {
      const s = parkingStatsByCamera[i];
      const prev = prevStats.current[i] || {};
      if (!s) continue;
      if (prev.occupiedSpots !== s.occupiedSpots || prev.availableSpots !== s.availableSpots) {
        next[i] = Date.now();
      }
      prevStats.current[i] = { occupiedSpots: s.occupiedSpots, availableSpots: s.availableSpots };
    }
    setLastUpdateAt(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parkingStatsByCamera.map((s) => `${s?.occupiedSpots}-${s?.availableSpots}`).join('|')]);

  const getCamStatus = (i: number): CamStatus => {
    if (systemStatus === 'error') return 'disconnected';
    if (systemStatus !== 'active') return 'connecting';
    const ts = lastUpdateAt[i];
    if (!ts) return 'connecting';
    const age = Date.now() - ts;
    if (age < 2 * 60 * 1000) return 'connected';
    if (age < 5 * 60 * 1000) return 'connecting';
    return 'disconnected';
  };

  const totalOccupied = parkingStatsByCamera.reduce((acc, s) => acc + (s?.occupiedSpots ?? 0), 0);
  const occupancyPct = totalParkingSpaces > 0 ? Math.round((totalOccupied / totalParkingSpaces) * 100) : 0;
  const availableTotal = Math.max(0, totalParkingSpaces - totalOccupied);

  const activeCams = Array.from({ length: env.CAMERA_COUNT }).filter((_, i) => getCamStatus(i) === 'connected').length;

  const operativeBarriers = Object.keys(lastActions).length;

  const stats = [
    { label: 'Ocupación', value: `${occupancyPct}%`, Icon: Car, variant: 'occupancy' as const, percent: occupancyPct },
    { label: 'Cámaras Activas', value: `${activeCams}/${env.CAMERA_COUNT}`, Icon: Camera },
    { label: 'Barreras Operativas', value: `${operativeBarriers}/${env.CAMERA_COUNT}`, Icon: ShieldCheck },
    { label: 'Espacios Disponibles', value: `${availableTotal}`, Icon: Activity },
  ] as const;

  // Cameras grid derived from configuration (cameras.ts)
  const cameraTiles = CAMERAS
    .filter((c) => c.index < env.CAMERA_COUNT)
    .map((c) => ({
      index: c.index,
      name: c.title,
      zone: c.subtitle,
      status: getCamStatus(c.index) as CamStatus,
      lastSeen: lastUpdateAt[c.index] ? timeAgo(lastUpdateAt[c.index]) : '—',
    }));

  // Parking map: simple distribution based on totalOccupied across totalParkingSpaces
  const totalSlots = Math.max(totalParkingSpaces, 1);
  const occupiedSet = new Set<number>(
    Array.from({ length: totalSlots }, (_, idx) => idx + 1).slice(0, totalOccupied)
  );

  // Barriers list derived from cameras with 4 Spanish states
  const barriers = Array.from({ length: env.CAMERA_COUNT }).map((_, i) => {
    const info = lastActions[i];
    let status: 'open' | 'closed' | 'opening' | 'closing' = 'closed';
    if (info) {
      if (info.event === 'command_sent') {
        status = info.barrier_action === 'abrir' ? 'opening' : 'closing';
      } else {
        status = info.barrier_state === 'abrir' ? 'open' : 'closed';
      }
    }
    return {
      name: i === 0 ? 'Barrera Principal' : i === 1 ? 'Barrera Salida' : `Barrera ${i + 1}`,
      place: i === 0 ? 'Entrada' : i === 1 ? 'Salida' : `Zona ${String.fromCharCode(65 + i)}`,
      status,
    } as const;
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <StatCard
            key={s.label}
            label={s.label}
            value={s.value}
            Icon={s.Icon}
            // occupancy visuals
            variant={(s as any).variant}
            percent={(s as any).percent}
          />
        ))}
      </div>

      {/* Cameras view */}
      <div className="rounded-2xl border bg-muted/50 p-4">
        <div className="mb-3 flex items-center gap-2">
          <Camera className="h-4 w-4" />
          <h2 className="text-sm font-semibold">Vista de Cámaras</h2>
        </div>
        <CamerasGrid items={cameraTiles} />
      </div>

      {/* Bottom grid: parking map + barriers */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Parking map */}
        <div className="rounded-2xl border bg-muted/50 p-4">
          <div className="mb-3 flex items-center gap-2">
            <Car className="h-4 w-4" />
            <h2 className="text-sm font-semibold">Mapa del Estacionamiento</h2>
          </div>
          <ParkingMap totalSlots={totalSlots} occupiedSet={occupiedSet} occupancyPct={occupancyPct} />
        </div>

        {/* Barriers status */}
        <div className="rounded-2xl border bg-muted/50 p-4">
          <div className="mb-3 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            <h2 className="text-sm font-semibold">Estado de Barreras</h2>
          </div>
          <BarriersPanel
            items={barriers}
            connectionNote={barrierConn !== 'connected' ? 'Conectando con servicio de barreras...' : undefined}
          />
        </div>
      </div>
    </div>
  );
}

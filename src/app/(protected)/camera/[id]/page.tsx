"use client";

import * as React from 'react';
import { use as usePromise } from 'react';
import { notFound } from 'next/navigation';
import { Camera, Activity, LockOpen, Lock, Gauge } from 'lucide-react';
import { usePredictionsNotificationContext } from '@/context/PredictionsNotificationContext';
import { useBarrier } from '@/context/BarrierContext';
import { env } from '@/lib/env';
import { VideoStream } from '@/components/VideoStream';
import { getCameraById, getCameraByIndex } from '@/config/cameras';
import { AnimatedList } from '@/components/magicui/animated-list';

export default function CameraPage({ params }: { params: { id: string } | Promise<{ id: string }> }) {
  // Buscar por ID de diccionario maestro; si no existe, intentar por índice numérico.
  const maybePromise: any = params as any;
  const resolvedParams = typeof maybePromise?.then === 'function' ? usePromise(maybePromise) : maybePromise;
  const paramId = String(resolvedParams?.id ?? '');
  const camFromId = getCameraById(paramId);
  const camIndex = camFromId?.index ?? (Number.isFinite(Number(paramId)) ? Number(paramId) : NaN);
  if (!Number.isFinite(camIndex) || camIndex < 0 || camIndex >= env.CAMERA_COUNT) {
    return notFound();
  }

  const { predictionsByCamera, parkingStatsByCamera, systemStatus, lastPredictionsTimestampByCamera } =
    usePredictionsNotificationContext();
  const { lastActions, connectionStatus: barrierConn } = useBarrier();

  const stats = parkingStatsByCamera?.[camIndex];
  const preds = predictionsByCamera?.[camIndex] ?? [];
  const lastPredsAt = lastPredictionsTimestampByCamera?.[camIndex] ?? '';

  const occupied = stats?.occupiedSpots ?? 0;
  const total = stats?.totalSpots ?? env.PARKING_SPACES_PER_CAMERA[camIndex] ?? 0;
  const available = Math.max(0, total - occupied);
  const pct = total > 0 ? Math.round((occupied / total) * 100) : 0;

  const barrier = lastActions?.[camIndex] || null;
  const barrierOpen = barrier?.barrier_state === 'abrir';
  const meta = camFromId ?? getCameraByIndex(camIndex) ?? null;

  const classCounts = React.useMemo(() => {
    const map = new Map<string, number>();
    for (const p of preds) {
      map.set(p.class_name, (map.get(p.class_name) || 0) + 1);
    }
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [preds]);

  // Etiquetas amigables para clases detectadas
  const getFriendlyLabel = React.useCallback((raw: string) => {
    const key = raw.toLowerCase();
    const dict: Record<string, string> = {
      car: 'Auto',
      person: 'Persona',
      bicycle: 'Bicicleta',
      motorcycle: 'Moto',
      bus: 'Colectivo',
      truck: 'Camión',
      van: 'Camioneta',
      pickup: 'Pickup',
      'license plate': 'Patente',
      license_plate: 'Patente',
    };
    if (dict[key]) return dict[key];
    // Fallback: reemplazar guiones bajos y capitalizar
    const pretty = key.replace(/_/g, ' ');
    return pretty.charAt(0).toUpperCase() + pretty.slice(1);
  }, []);

  // Eventos locales de entradas/salidas (sacados de notificaciones globales)
  const [events, setEvents] = React.useState<Array<{
    id: string;
    text: string;
    tone: 'enter' | 'exit';
    timestamp: string; // para mostrar
    timeMs: number;    // para ordenar
  }>>([]);
  const prevCountRef = React.useRef<number | null>(null);
  const pendingDiffRef = React.useRef(0);
  const flushTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    const current = occupied;
    if (current == null) return;
    if (prevCountRef.current === null) {
      prevCountRef.current = current;
      return;
    }
    const diff = current - prevCountRef.current;
    if (diff !== 0 && prevCountRef.current > 0) {
      // Acumular difs y despachar en lote para evitar spam de 1 en 1
      pendingDiffRef.current += diff;
      if (!flushTimerRef.current) {
        flushTimerRef.current = setTimeout(() => {
          const net = pendingDiffRef.current;
          pendingDiffRef.current = 0;
          flushTimerRef.current = null;
          if (net !== 0) {
            const abs = Math.abs(net);
            const tone: 'enter' | 'exit' = net > 0 ? 'enter' : 'exit';
            const text = net > 0
              ? `${abs} auto${abs !== 1 ? 's' : ''} entraron al estacionamiento`
              : `${abs} auto${abs !== 1 ? 's' : ''} salieron del estacionamiento`;
            const now = new Date();
            const timestamp = now.toLocaleTimeString();
            const timeMs = now.getTime();
            setEvents((prev) => [
              { id: `${timeMs}-${Math.random().toString(36).slice(2,8)}`, text, tone, timestamp, timeMs },
              ...prev,
            ]);
          }
        }, 1500);
      }
    }
    prevCountRef.current = current;
  }, [occupied]);

  // Feed de detecciones por tiempo (últimas 4 mostradas)
  const [detectionFeed, setDetectionFeed] = React.useState<Array<{
    id: string;
    className: string;
    confidence: number;
    timestamp: string; // para mostrar
    timeMs: number;    // para ordenar
  }>>([]);
  const lastProcessedBatchRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (!lastPredsAt) return;
    if (lastProcessedBatchRef.current === lastPredsAt) return;
    const timeMs = Date.parse(lastPredsAt) || Date.now();
    const tsLabel = new Date(timeMs).toLocaleTimeString();
    const batchItems = preds.map((p, i) => ({
      id: `${timeMs}-${i}-${p.class_id}-${Math.round(p.confidence * 100)}`,
      className: p.class_name,
      confidence: p.confidence,
      timestamp: tsLabel,
      timeMs,
    }));
    // agregar lote reciente al principio
    setDetectionFeed((prev) => [...batchItems, ...prev]);
    lastProcessedBatchRef.current = lastPredsAt;
  }, [lastPredsAt, preds]);

  

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Camera className="h-5 w-5 text-muted-foreground" />
          <h1 className="text-lg font-semibold">{meta?.title ?? `Cámara ${camIndex + 1}`}</h1>
          <span className="text-sm text-muted-foreground">{meta?.subtitle ?? `Zona ${String.fromCharCode(65 + camIndex)}`}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {(() => {
          const occLabel = pct <= 20 ? 'Vacío' : pct <= 60 ? 'Medio' : pct <= 85 ? 'Alto' : 'Crítico';
          const occClass = pct >= 90 ? 'text-red-600' : pct >= 70 ? 'text-amber-600' : 'text-emerald-600';
          return (
            <CardStat
              icon={Gauge}
              label="Ocupación"
              value={
                <>
                  <span>{pct}%</span>
                  <span className={`ml-2 text-xs font-semibold ${occClass}`}>{occLabel}</span>
                </>
              }
            />
          )
        })()}
        <CardStat icon={Activity} label="Ocupados" value={`${occupied}`} />
        <CardStat icon={Activity} label="Disponibles" value={`${available}`} />
        {(() => {
          const isConn = barrierConn === 'connected'
          const text = !isConn ? '—' : barrierOpen ? 'Abierta' : 'Cerrada'
          const cls = !isConn ? 'text-muted-foreground' : barrierOpen ? 'text-green-600' : 'text-red-600'
          return (
            <CardStat
              icon={barrierOpen ? LockOpen : Lock}
              label="Barrera"
              value={text}
              valueClassName={cls}
            />
          )
        })()}
      </div>

      {/* Stream */}
      <div className="rounded-2xl border bg-muted/50 p-4">
        <div className="mb-3 flex items-center gap-2">
          <Camera className="h-4 w-4" />
          <h2 className="text-sm font-semibold">Vista en vivo</h2>
          <span className="ml-auto text-xs text-muted-foreground">
            Última act.: {stats?.lastUpdate ?? '—'} | Sistema: {systemStatus}
          </span>
        </div>
        <VideoStream
          predictions={preds}
          cam_index={camIndex}
          cameraName={meta?.title ?? `Cámara ${camIndex + 1}`}
          streamUrl={`${env.STREAMING_BASE_URL}/${camIndex}`}
        />
      </div>

      
      <div className="rounded-2xl border bg-muted/50 p-4">
        <h2 className="mb-3 text-sm font-semibold">Eventos recientes</h2>
        {events.length === 0 ? (
          <div className="text-sm text-muted-foreground">Sin eventos aún.</div>
        ) : (
          <AnimatedList delay={250} className="w-full">
            {events
              .slice() // no mutar original
              .sort((a, b) => a.timeMs - b.timeMs) // ascendente
              .slice(-4) // solo 4 más recientes
              .map((e) => (
              <div
                key={e.id}
                className="flex w-full items-center justify-between rounded-lg border bg-background px-3 py-2"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${e.tone === 'enter' ? 'bg-green-500' : 'bg-red-500'}`}
                    aria-hidden
                  />
                  <span className="truncate text-sm font-medium">{e.text}</span>
                </div>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium">
                  {e.timestamp}
                </span>
              </div>
            ))}
          </AnimatedList>
        )}
      </div>

      {/* Detecciones */}
      <div className="rounded-2xl border bg-muted/50 p-4">
        <h2 className="mb-3 text-sm font-semibold">Detecciones recientes</h2>
        {detectionFeed.length === 0 ? (
          <div className="text-sm text-muted-foreground">Sin detecciones aún.</div>
        ) : (
          <AnimatedList delay={250} className="w-full">
            {detectionFeed
              .slice()
              .sort((a, b) => a.timeMs - b.timeMs) // ascendente para que AnimatedList invierta y muestre la más nueva arriba
              .slice(-4) // solo 4
              .map((p) => (
                <div
                  key={p.id}
                  className="flex w-full items-center justify-between rounded-lg border bg-background px-3 py-2"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-primary" aria-hidden />
                    <span className="truncate text-sm font-medium">{getFriendlyLabel(p.className)}</span>
                  </div>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium">
                    {p.timestamp}
                  </span>
                </div>
              ))}
          </AnimatedList>
        )}
      </div>
    </div>
  );
}

function CardStat({
  icon: Icon,
  label,
  value,
  valueClassName,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
  valueClassName?: string;
}) {
  return (
    <div className="rounded-xl border bg-muted/50 p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">{label}</div>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className={"mt-2 text-2xl font-semibold flex items-baseline gap-2 " + (valueClassName ?? "")}>{value}</div>
    </div>
  );
}

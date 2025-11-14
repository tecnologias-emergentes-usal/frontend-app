
import { useState, useEffect, useRef } from "react";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Prediction } from "@/types/notifications";
import { cn } from "@/lib/utils";

type VideoVariant = "minimal" | "classic";

interface VideoStreamProps {
  predictions?: Prediction[];
  cam_index: number;
  cameraName?: string;
  streamUrl: string;
  className?: string;
  variant?: VideoVariant;
  showTimestamp?: boolean;
}

export function VideoStream({
  predictions = [],
  cam_index,
  cameraName,
  streamUrl,
  className,
  variant = "minimal",
  showTimestamp = false,
}: VideoStreamProps) {
  const [isStreamLoading, setIsStreamLoading] = useState(true);
  const [hasStreamError, setHasStreamError] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const imgRef = useRef<HTMLImageElement>(null);

  // Actualizar reloj cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Detectar cuando el stream está listo
  useEffect(() => {
    // Timeout para ocultar el loading después de un tiempo razonable
    const loadingTimeout = setTimeout(() => {
      setIsStreamLoading(false);
    }, 2000);

    // Intentar detectar cuando la imagen se carga
    const checkImageLoad = setInterval(() => {
      if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
        setIsStreamLoading(false);
        setHasStreamError(false);
        setImageDimensions({
          width: imgRef.current.naturalWidth,
          height: imgRef.current.naturalHeight
        });
        clearInterval(checkImageLoad);
        clearTimeout(loadingTimeout);
      }
    }, 100);

    return () => {
      clearTimeout(loadingTimeout);
      clearInterval(checkImageLoad);
    };
  }, [streamUrl]);

  const handleStreamLoad = () => {
    if (imgRef.current && imgRef.current.naturalWidth > 0) {
      setIsStreamLoading(false);
      setHasStreamError(false);
      setImageDimensions({
        width: imgRef.current.naturalWidth,
        height: imgRef.current.naturalHeight
      });
    }
  };

  const handleStreamError = () => {
    setIsStreamLoading(false);
    setHasStreamError(true);
  };

  const Container = (
    <div className={cn("relative aspect-video overflow-hidden rounded-xl border bg-muted/30", className)}>
        {hasStreamError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <div className="mb-4">
              <ExclamationTriangleIcon className="w-12 h-12 mx-auto text-red-500 opacity-80" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Error de Conexión
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              No se puede conectar con la cámara
            </p>
            <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-500">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span>Reconectando...</span>
            </div>
          </div>
        ) : (
          <>
            {isStreamLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-100/60 dark:bg-slate-900/60">
                <div className="flex flex-col items-center space-y-3">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Conectando con cámara...
                  </p>
                </div>
              </div>
            )}
            <img
              ref={imgRef}
              src={streamUrl}
              alt={`Stream de ${cameraName ?? `Cámara ${cam_index + 1}`}`}
              className="h-full w-full object-cover"
              onLoad={handleStreamLoad}
              onError={handleStreamError}
            />
            
            {/* Overlay de predicciones */}
            {predictions.length > 0 && imageDimensions.width > 0 && imageDimensions.height > 0 && (
              <div className="absolute inset-0">
                {predictions.map((prediction, index) => (
                  <div
                    key={index}
                    className="absolute border-2 border-red-500 bg-red-500/10"
                    style={{
                      left: `${(prediction.x1 / imageDimensions.width) * 100}%`,
                      top: `${(prediction.y1 / imageDimensions.height) * 100}%`,
                      width: `${((prediction.x2 - prediction.x1) / imageDimensions.width) * 100}%`,
                      height: `${((prediction.y2 - prediction.y1) / imageDimensions.height) * 100}%`,
                    }}
                  >
                    <div className="absolute -top-6 left-0 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                      {prediction.class_name} ({Math.round(prediction.confidence * 100)}%)
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Overlay minimal */}
            <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-black/60 px-2 py-0.5 text-[11px] text-white">
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
              <span>LIVE</span>
              {showTimestamp && <span className="opacity-80">• {currentTime.toLocaleTimeString()}</span>}
            </div>
          </>
        )}
      </div>
  );

  if (variant === "classic") {
    return (
      <div className="relative rounded-2xl border bg-background shadow-sm">
        <div className="p-3">
          <div className="text-sm font-medium">{cameraName ?? `Cámara ${cam_index + 1}`}</div>
        </div>
        {Container}
      </div>
    );
  }

  return Container;
}

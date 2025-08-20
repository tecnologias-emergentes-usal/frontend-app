
import { useState, useEffect, useRef } from "react";
import { VideoIcon, ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Prediction } from "@/types/notifications";

interface VideoStreamProps {
  predictions?: Prediction[];
  cam_index: number; // Cambiado de cameraId a cam_index
  cameraName: string;
  streamUrl: string;
}

export function VideoStream({ predictions = [], cam_index, cameraName, streamUrl }: VideoStreamProps) {
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

  const handleStreamLoad = () => {
    setIsStreamLoading(false);
    setHasStreamError(false);
    
    if (imgRef.current) {
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

  return (
    <div className="relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-xl border border-slate-200/50 dark:border-slate-700/50">
      <div className="bg-gradient-to-r from-primary/20 to-accent/20 p-4">
        <div className="flex items-center space-x-2">
          <VideoIcon className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
            Vista en Tiempo Real
          </h2>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          {cameraName}
        </p>
      </div>
      
      <div className="relative aspect-video bg-slate-100 dark:bg-slate-900">
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
              <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-900">
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
              alt={`Stream de ${cameraName}`}
              className="w-full h-full object-cover"
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
            
            {/* Overlay con información */}
            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-xs font-mono">
              LIVE • {currentTime.toLocaleString()}
            </div>
            
            <div className="absolute top-3 right-3 bg-green-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-semibold">
              🔴 EN VIVO
            </div>
          </>
        )}
      </div>
    </div>
  );
}

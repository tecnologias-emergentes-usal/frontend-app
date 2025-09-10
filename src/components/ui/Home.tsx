'use client';

import { useLayoutEffect, useState, useEffect } from "react";
import { 
  ClockIcon, 
  PersonIcon, 
  ArchiveIcon,
  EyeOpenIcon,
  ActivityLogIcon,
  DotFilledIcon,
  GearIcon,
  LockClosedIcon,
  LockOpen1Icon,
  UpdateIcon
} from "@radix-ui/react-icons";
import { usePredictionsNotificationContext } from "@/context/PredictionsNotificationContext";
import { useBarrier } from "@/context/BarrierContext";
import { VideoStream } from "@/components/VideoStream";
import { env } from "@/lib/env";

interface Props {
  onTheme: (theme: "ios" | "material") => void;
  theme: "ios" | "material";
}

export function Home(props: Props) {
  const [_, setDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Obtener datos del contexto
  const { 
    predictionsByCamera,
    parkingStatsByCamera,
    error, 
    totalParkingSpaces,
    systemStatus 
  } = usePredictionsNotificationContext();
  
  const { 
    lastActions,
    error: barrierError,
    connectionStatus: barrierConnectionStatus 
  } = useBarrier();

  useLayoutEffect(() => {
    setDarkMode(document.documentElement.classList.contains("dark"));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getAlertBgColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-100 dark:bg-red-900/20';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/20';
      case 'low': return 'bg-green-100 dark:bg-green-900/20';
      default: return 'bg-gray-100 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header con tiempo y estado */}
      <div className="flex items-center justify-between bg-white/80 dark:bg-slate-800/80 backdrop-blur-xs rounded-2xl p-4 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <EyeOpenIcon className="w-5 h-5 text-primary" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {systemStatus === 'error' ? 'Sistema con Error' : 
               systemStatus === 'inactive' ? 'Conectando Sistema...' : 
               'Sistema Activo'}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <DotFilledIcon className={`w-4 h-4 ${systemStatus === 'active' ? 'animate-pulse' : ''} ${
              systemStatus === 'error' ? 'text-red-500' : 
              systemStatus === 'inactive' ? 'text-yellow-500' : 
              'text-green-500'
            }`} />
            <ActivityLogIcon className={`w-4 h-4 ${
              systemStatus === 'error' ? 'text-red-500' : 
              systemStatus === 'inactive' ? 'text-yellow-500' : 
              'text-green-500'
            }`} />
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
          <ClockIcon className="w-4 h-4" />
          <span className="font-mono text-sm">
            {currentTime.toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Video Streams, Estadísticas y Barrera por cámara */}
      <div className="space-y-6">
        {Array.from({ length: env.CAMERA_COUNT }, (_, index) => (
          <div key={index} className="space-y-4">
            <VideoStream 
              predictions={predictionsByCamera[index] || []}
              cam_index={index}
              cameraName={`Cámara ${index + 1}`}
              streamUrl={`${env.STREAMING_BASE_URL}/${index}`}
            />

            {/* Estadísticas de la cámara */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xs rounded-xl p-4 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
                <div className="flex items-center space-x-2 mb-2">
                  <ArchiveIcon className="w-5 h-5 text-red-500" />
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Ocupados
                  </span>
                </div>
                {systemStatus === 'active' ? (
                  <>
                    <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                      {parkingStatsByCamera[index]?.occupiedSpots ?? 0}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-500">
                      de {parkingStatsByCamera[index]?.totalSpots ?? env.PARKING_SPACES_PER_CAMERA[index]} espacios
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-bold text-slate-400 dark:text-slate-600">
                      --
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-500">
                      {systemStatus === 'error' ? 'Error de conexión' : 'Cargando datos...'}
                    </div>
                  </>
                )}
              </div>
              
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xs rounded-xl p-4 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
                <div className="flex items-center space-x-2 mb-2">
                  <PersonIcon className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Disponibles
                  </span>
                </div>
                {systemStatus === 'active' ? (
                  <>
                    <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                      {parkingStatsByCamera[index]?.availableSpots ?? 0}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-500">
                      espacios libres
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-bold text-slate-400 dark:text-slate-600">
                      --
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-500">
                      {systemStatus === 'error' ? 'Error de conexión' : 'Cargando datos...'}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Indicador de Estado y Alerta por cámara */}
            <div className={`${systemStatus === 'active' ? getAlertBgColor(parkingStatsByCamera[index]?.alertLevel) : 'bg-gray-100 dark:bg-gray-900/20'} rounded-xl p-4 border border-opacity-20`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    systemStatus === 'error' ? 'bg-red-500' : 
                    systemStatus === 'inactive' ? 'bg-yellow-500' : 
                    parkingStatsByCamera[index]?.alertLevel === 'high' ? 'bg-red-500' : 
                    parkingStatsByCamera[index]?.alertLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  } ${systemStatus === 'active' ? 'animate-pulse' : ''}`}></div>
                  <div>
                    <h3 className={`font-semibold ${
                      systemStatus === 'error' ? 'text-red-500' : 
                      systemStatus === 'inactive' ? 'text-yellow-500' : 
                      getAlertColor(parkingStatsByCamera[index]?.alertLevel)
                    }`}>
                      {systemStatus === 'error' ? '🔌 Error de Conexión' :
                       systemStatus === 'inactive' ? '⏳ Cargando Sistema...' :
                       parkingStatsByCamera[index]?.alertLevel === 'high' ? 'Capacidad Crítica' : 
                       parkingStatsByCamera[index]?.alertLevel === 'medium' ? 'Capacidad Media' : 
                       'Capacidad Normal'}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {systemStatus === 'error' ? `Error: ${error}` :
                       systemStatus === 'inactive' ? 'Conectando al sistema de predicciones...' :
                       `Última actualización: ${parkingStatsByCamera[index]?.lastUpdate}`}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-lg font-bold ${
                    systemStatus === 'error' ? 'text-red-500' : 
                    systemStatus === 'inactive' ? 'text-yellow-500' : 
                    getAlertColor(parkingStatsByCamera[index]?.alertLevel)
                  }`}>
                    {systemStatus === 'active' ? `${Math.round((parkingStatsByCamera[index]?.occupiedSpots / parkingStatsByCamera[index]?.totalSpots) * 100)}%` : '--'}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-500">
                    {systemStatus === 'active' ? 'ocupación' : 
                     systemStatus === 'error' ? 'sin datos' : 'cargando...'}
                  </div>
                </div>
              </div>
            </div>

            {/* Estado de la Barrera por cámara */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xs rounded-xl p-4 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
              <div className="flex items-center space-x-2 mb-2">
                <GearIcon className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Barrera - Cámara {index + 1}
                </span>
              </div>
              {barrierConnectionStatus === 'connected' && lastActions[index] ? (
                <>
                  <div className="flex items-center justify-center h-8">
                    {lastActions[index].event === 'command_sent' ? (
                      <UpdateIcon className="w-6 h-6 text-yellow-500 animate-spin" />
                    ) : (
                      lastActions[index].barrier_state === 'abrir' ? 
                        <LockOpen1Icon className="w-6 h-6 text-green-500" /> : 
                        <LockClosedIcon className="w-6 h-6 text-red-500" />
                    )}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-500">
                    {lastActions[index].event === 'command_sent' ? 
                      `${lastActions[index].barrier_action === 'abrir' ? 'abriendo' : 'cerrando'}...` :
                      lastActions[index].barrier_state === 'abrir' ? 'abierta' : 'cerrada'
                    }
                  </div>
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold text-slate-400 dark:text-slate-600">
                    --
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-500">
                    {barrierError ? 'Error de conexión' : 
                     barrierConnectionStatus === 'connecting' ? 'Conectando...' : 'Sin datos'}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Metadata Adicional */}
      <div className="bg-white/80 dark:bg-slaterouge-800/80 backdrop-blur-xs rounded-xl p-4 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
        <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">
          Información del Sistema
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-slate-600 dark:text-slate-400">Resolución:</span>
            <span className="ml-2 font-mono text-slate-800 dark:text-slate-200">1920x1080</span>
          </div>
          <div>
            <span className="text-slate-600 dark:text-slate-400">FPS:</span>
            <span className="ml-2 font-mono text-slate-800 dark:text-slate-200">30</span>
          </div>
          <div>
            <span className="text-slate-600 dark:text-slate-400">Predicciones:</span>
            <span className={`ml-2 font-mono ${
              systemStatus === 'error' ? 'text-red-600' : 
              systemStatus === 'inactive' ? 'text-yellow-600' : 
              'text-green-600'
            } dark:text-opacity-80`}>
              {systemStatus === 'error' ? 'Error' : 
               systemStatus === 'inactive' ? 'Cargando...' : 
               'Activo'}
            </span>
          </div>
          <div>
            <span className="text-slate-600 dark:text-slate-400">Detecciones:</span>
            <span className="ml-2 font-mono text-slate-800 dark:text-slate-200">
              {systemStatus === 'active' ? 
                `${parkingStatsByCamera.reduce((sum, stats) => sum + stats.occupiedSpots, 0)} autos de ${totalParkingSpaces} espacios` : 
                '--'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
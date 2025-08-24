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
  const [darkMode, setDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Get data from contexts
  const { 
    predictionsByCamera, // Usamos el nuevo estado de predicciones por cámara
    totalDetections,    // Usamos el total de detecciones ya calculado
    loading, 
    error, 
    lastUpdated, 
    totalParkingSpaces,
    systemStatus 
  } = usePredictionsNotificationContext();
  
  const { 
    lastAction: barrierAction, 
    loading: barrierLoading, 
    error: barrierError,
    connectionStatus: barrierConnectionStatus 
  } = useBarrier();

  // Los cálculos de estadísticas ahora usan totalDetections directamente
  const realTotal = barrierAction?.max_cars || totalParkingSpaces;
  const occupiedSpots = totalDetections;
  const availableSpots = Math.max(0, realTotal - occupiedSpots);
  const occupancyPercentage = realTotal > 0 ? Math.round((occupiedSpots / realTotal) * 100) : 0;
  const alertLevel: 'low' | 'medium' | 'high' = 
    availableSpots < 5 ? 'high' : 
    availableSpots < 15 ? 'medium' : 'low';

  const parkingStats = {
    totalSpots: realTotal,
    occupiedSpots,
    availableSpots,
    lastUpdate: lastUpdated?.toLocaleTimeString() || new Date().toLocaleTimeString(),
    alertLevel
  };

  useLayoutEffect(() => {
    setDarkMode(document.documentElement.classList.contains("dark"));
  });

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
        <div className="flex items-center justify-between bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
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

        {/* Video Streams - Bucle para múltiples cámaras */}
        <div className="space-y-4">
          {Array.from({ length: env.CAMERA_COUNT }, (_, index) => (
            <VideoStream 
              key={index}
              predictions={predictionsByCamera[index] || []}
              cam_index={index}
              cameraName={`Cámara ${index + 1}`}
              streamUrl={`${env.STREAMING_BASE_URL}/${index}`}
            />
          ))}
        </div>

        {/* Estadísticas del Estacionamiento (Global) */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center space-x-2 mb-2">
              <ArchiveIcon className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Ocupados
              </span>
            </div>
            {systemStatus === 'active' ? (
              <>
                <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                  {parkingStats.occupiedSpots}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-500">
                  de {parkingStats.totalSpots} espacios
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
          
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center space-x-2 mb-2">
              <PersonIcon className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Disponibles
              </span>
            </div>
            {systemStatus === 'active' ? (
              <>
                <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                  {parkingStats.availableSpots}
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
          
          {/* Estado de la Barrera */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center space-x-2 mb-2">
              <GearIcon className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Barrera
              </span>
            </div>
            {barrierConnectionStatus === 'connected' && barrierAction ? (
              <>
                <div className="flex items-center justify-center h-8">
                  {barrierAction.event === 'command_sent' ? (
                    <UpdateIcon className="w-6 h-6 text-yellow-500 animate-spin" />
                  ) : (
                    barrierAction.barrier_state === 'abrir' ? 
                      <LockOpen1Icon className="w-6 h-6 text-green-500" /> : 
                      <LockClosedIcon className="w-6 h-6 text-red-500" />
                  )}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-500">
                  {barrierAction.event === 'command_sent' ? 
                    `${barrierAction.barrier_action === 'abrir' ? 'abriendo' : 'cerrando'}...` :
                    barrierAction.barrier_state === 'abrir' ? 'abierta' : 'cerrada'
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

        {/* Indicador de Estado y Alerta */}
        <div className={`${systemStatus === 'active' ? getAlertBgColor(parkingStats.alertLevel) : 'bg-gray-100 dark:bg-gray-900/20'} rounded-xl p-4 border border-opacity-20`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                systemStatus === 'error' ? 'bg-red-500' : 
                systemStatus === 'inactive' ? 'bg-yellow-500' : 
                parkingStats.alertLevel === 'high' ? 'bg-red-500' : 
                parkingStats.alertLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
              } ${systemStatus === 'active' ? 'animate-pulse' : ''}`}></div>
              <div>
                <h3 className={`font-semibold ${
                  systemStatus === 'error' ? 'text-red-500' : 
                  systemStatus === 'inactive' ? 'text-yellow-500' : 
                  getAlertColor(parkingStats.alertLevel)
                }`}>
                  {systemStatus === 'error' ? '🔌 Error de Conexión' :
                   systemStatus === 'inactive' ? '⏳ Cargando Sistema...' :
                   parkingStats.alertLevel === 'high' ? 'Capacidad Crítica' : 
                   parkingStats.alertLevel === 'medium' ? 'Capacidad Media' : 
                   'Capacidad Normal'}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {systemStatus === 'error' ? `Error: ${error}` :
                   systemStatus === 'inactive' ? 'Conectando al sistema de predicciones...' :
                   `Última actualización: ${parkingStats.lastUpdate}`}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <div className={`text-lg font-bold ${
                systemStatus === 'error' ? 'text-red-500' : 
                systemStatus === 'inactive' ? 'text-yellow-500' : 
                getAlertColor(parkingStats.alertLevel)
              }`}>
                {systemStatus === 'active' ? `${occupancyPercentage}%` : '--'}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-500">
                {systemStatus === 'active' ? 'ocupación' : 
                 systemStatus === 'error' ? 'sin datos' : 'cargando...'}
              </div>
            </div>
          </div>
        </div>

        {/* Metadata Adicional */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
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
                {systemStatus === 'active' ? `${totalDetections} autos` : '--'}
              </span>
            </div>
          </div>
        </div>
    </div>
  );
}
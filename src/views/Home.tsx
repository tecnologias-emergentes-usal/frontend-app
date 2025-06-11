import { useLayoutEffect, useState, useEffect } from "react";
import {
  Page,
  Navbar,
} from "konsta/react";
import { 
  VideoIcon, 
  ClockIcon, 
  PersonIcon, 
  ArchiveIcon,
  EyeOpenIcon,
  ActivityLogIcon,
  DotFilledIcon
} from "@radix-ui/react-icons";
import { usePredictionsNotificationContext } from "@/context/PredictionsNotificationContext";
import { env } from "@/lib/env";

interface Props {
  onTheme: (theme: "ios" | "material") => void;
  theme: "ios" | "material";
}

export function Home(props: Props) {
  const [darkMode, setDarkMode] = useState(false);
  const [isStreamLoading, setIsStreamLoading] = useState(true);
  const [hasStreamError, setHasStreamError] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Get data from context
  const { 
    notifications, 
    loading, 
    error, 
    lastUpdated, 
    totalParkingSpaces,
    systemStatus 
  } = usePredictionsNotificationContext();

  // Calculate parking statistics from context data
  const occupiedSpots = notifications?.predictions?.length || 0;
  const availableSpots = Math.max(0, totalParkingSpaces - occupiedSpots);
  const occupancyPercentage = totalParkingSpaces > 0 ? Math.round((occupiedSpots / totalParkingSpaces) * 100) : 0;
  const alertLevel: 'low' | 'medium' | 'high' = 
    availableSpots < 5 ? 'high' : 
    availableSpots < 15 ? 'medium' : 'low';

  const parkingStats = {
    totalSpots: totalParkingSpaces,
    occupiedSpots,
    availableSpots,
    lastUpdate: lastUpdated?.toLocaleTimeString() || new Date().toLocaleTimeString(),
    alertLevel
  };

  // URL del streaming desde configuración centralizada
  const STREAM_URL = env.STREAMING_URL;

  useLayoutEffect(() => {
    setDarkMode(document.documentElement.classList.contains("dark"));
  });

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
  };

  const handleStreamError = () => {
    setIsStreamLoading(false);
    setHasStreamError(true);
  };

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
    <Page className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 min-h-screen">
      <Navbar 
        title="USAL Parking Monitor" 
        large 
        transparent 
        centerTitle 
        className="text-slate-800 dark:text-slate-200"
      />
      
      <div className="p-4 space-y-6">
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

        {/* Video Stream */}
        <div className="relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-xl border border-slate-200/50 dark:border-slate-700/50">
          <div className="bg-gradient-to-r from-primary/20 to-accent/20 p-4">
            <div className="flex items-center space-x-2">
              <VideoIcon className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                Vista en Tiempo Real
              </h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Estacionamiento Principal - Cámara 01
            </p>
          </div>
          
          <div className="relative aspect-video bg-slate-100 dark:bg-slate-900">
            {hasStreamError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <div className="mb-4">
                  <img 
                    src="/images/technical-difficulties.svg" 
                    alt="Robot con dificultades técnicas" 
                    className="w-40 h-40 mx-auto opacity-80"
                  />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  🔧 Dificultades Técnicas
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Estamos experimentando problemas con la conexión de video.
                  <br />
                  Nuestro equipo técnico está trabajando para resolverlo.
                </p>
                <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-500">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span>Reconectando automáticamente...</span>
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
                  src={STREAM_URL}
                  alt="Stream de monitoreo en vivo"
                  className="w-full h-full object-cover"
                  onLoad={handleStreamLoad}
                  onError={handleStreamError}
                />
                
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

        {/* Estadísticas del Estacionamiento */}
        <div className="grid grid-cols-2 gap-4">
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
                   parkingStats.alertLevel === 'high' ? '🚨 Capacidad Crítica' : 
                   parkingStats.alertLevel === 'medium' ? '⚠️ Capacidad Media' : 
                   '✅ Capacidad Normal'}
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
            📊 Información del Sistema
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
                {systemStatus === 'active' ? `${notifications?.predictions?.length || 0} autos` : '--'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}

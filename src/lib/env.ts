/**
 * Configuración de variables de entorno
 * Centraliza el acceso a las variables de entorno de la aplicación
 */

export const env = {
  // URL del streaming de video
  STREAMING_URL: import.meta.env.VITE_STREAMING_URL || "https://097c-190-105-0-25.ngrok-free.app/video",
  
  // URL del API backend
  API_URL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  
  // Configuración del sistema de predicciones
  POLLING_INTERVAL: Number(import.meta.env.VITE_POLLING_INTERVAL) || 3000,
  
  // Configuración del estacionamiento
  TOTAL_PARKING_SPACES: Number(import.meta.env.VITE_TOTAL_PARKING_SPACES) || 45,
  
  // Configuración de desarrollo
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
} as const;

/**
 * Valida que las variables de entorno críticas estén configuradas
 */
export const validateEnv = () => {
  const errors: string[] = [];
  
  if (!env.STREAMING_URL) {
    errors.push("VITE_STREAMING_URL is required");
  }
  
  if (env.POLLING_INTERVAL < 1000) {
    errors.push("VITE_POLLING_INTERVAL must be at least 1000ms");
  }
  
  if (env.TOTAL_PARKING_SPACES < 1) {
    errors.push("VITE_TOTAL_PARKING_SPACES must be at least 1");
  }
  
  if (errors.length > 0) {
    console.warn("Environment validation warnings:", errors);
  }
  
  return errors.length === 0;
}; 
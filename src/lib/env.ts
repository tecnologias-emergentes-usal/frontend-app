/**
 * Configuración de variables de entorno
 * Centraliza el acceso a las variables de entorno de la aplicación
 */

export const env = {
  // URL base del streaming de video (sin la parte final como /video o /0)
  STREAMING_BASE_URL: import.meta.env.VITE_STREAMING_BASE_URL || "https://097c-190-105-0-25.ngrok-free.app",
  
  // Cantidad de cámaras que se esperan
  CAMERA_COUNT: Number(import.meta.env.VITE_APP_CAMERA_COUNT) || 1,

  // URL del API backend
  API_URL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  
  // Configuración del sistema de predicciones
  POLLING_INTERVAL: Number(import.meta.env.VITE_POLLING_INTERVAL) || 3000,
  
  // Configuración del estacionamiento
  PARKING_SPACES_PER_CAMERA: import.meta.env.REACT_APP_PARKING_SPACES_PER_CAMERA
    ? import.meta.env.REACT_APP_PARKING_SPACES_PER_CAMERA.split(',').map((num: string) => parseInt(num.trim(), 10))
    : [45, 55], 
  
  // Configuración de desarrollo
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
} as const;

/**
 * Valida que las variables de entorno críticas estén configuradas
 */
export const validateEnv = () => {
  const errors: string[] = [];
  
  if (!env.STREAMING_BASE_URL) {
    errors.push("VITE_STREAMING_BASE_URL is required");
  }

  if (env.CAMERA_COUNT < 1) {
    errors.push("VITE_APP_CAMERA_COUNT must be at least 1");
  }
  
  if (env.POLLING_INTERVAL < 1000) {
    errors.push("VITE_POLLING_INTERVAL must be at least 1000ms");
  }
  
  if (errors.length > 0) {
    console.warn("Environment validation warnings:", errors);
  }
  
  return errors.length === 0;
}; 
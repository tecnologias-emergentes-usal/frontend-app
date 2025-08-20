
import React, { createContext, useContext, ReactNode, useState, useEffect, useCallback, useRef } from 'react';
import { PredictionsNotificationContextType, NotificationResponse, Prediction } from '../types/notifications';
import { predictionsWebSocket } from '../services/websocketService';
import { useNotifications } from '../hooks/useNotifications';
import { useAuth } from '@clerk/clerk-react';
import { env } from '../lib/env';

// La respuesta del WebSocket ahora debe incluir el índice de la cámara
interface PredictionMessage extends NotificationResponse {
  cam_index: number;
}

export const PredictionsNotificationContext = createContext<PredictionsNotificationContextType | undefined>(undefined);

interface PredictionsNotificationProviderProps {
  children: ReactNode;
}

export const PredictionsNotificationProvider: React.FC<PredictionsNotificationProviderProps> = ({
  children
}) => {
  // Estado para almacenar las predicciones por cámara
  const [predictionsByCamera, setPredictionsByCamera] = useState<Prediction[][]>(
    Array.from({ length: env.CAMERA_COUNT }, () => [])
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [totalParkingSpaces] = useState<number>(env.TOTAL_PARKING_SPACES);
  const [totalDetections, setTotalDetections] = useState<number>(0);
  const previousTotalCarCountRef = useRef<number>(0);
  const { addNotification } = useNotifications();
  const { getToken } = useAuth();

  const systemStatus: 'active' | 'inactive' | 'error' = 
    error ? 'error' : 
    loading ? 'inactive' : 
    'active';

  const handlePredictionData = useCallback((data: PredictionMessage) => {
    console.log(`Received WebSocket data for camera ${data.cam_index}:`, data);

    // Actualizar las predicciones para la cámara específica
    setPredictionsByCamera(prevPredictions => {
      const newPredictions = [...prevPredictions];
      if (data.cam_index >= 0 && data.cam_index < env.CAMERA_COUNT) {
        newPredictions[data.cam_index] = data.predictions || [];
      }
      
      // Recalcular el total de detecciones
      const currentTotalCarCount = newPredictions.flat().length;
      setTotalDetections(currentTotalCarCount);
      
      // Lógica de notificación basada en el cambio del *total* de autos
      const carDifference = currentTotalCarCount - previousTotalCarCountRef.current;
      if (previousTotalCarCountRef.current > 0 && carDifference !== 0) {
        let title: string;
        let message: string;
        let status: 'info' | 'success' | 'warning' | 'error';
        
        if (carDifference > 0) {
          title = "Nuevos Autos Detectados";
          message = `${carDifference} auto${carDifference !== 1 ? 's' : ''} nuevo${carDifference !== 1 ? 's' : ''} en el estacionamiento`;
          status = 'info';
        } else {
          title = "Autos Salieron";
          message = `${Math.abs(carDifference)} auto${Math.abs(carDifference) !== 1 ? 's' : ''} salieron del estacionamiento`;
          status = 'success';
        }
        
        addNotification(title, message, "target", status);
      }
      
      previousTotalCarCountRef.current = currentTotalCarCount;
      
      return newPredictions;
    });

    setLastUpdated(new Date());
    setError(null);
  }, [addNotification, env.CAMERA_COUNT]);

  const refetch = useCallback(async () => {
    predictionsWebSocket.reconnect();
  }, []);

  useEffect(() => {
    let unsubscribeMessage: (() => void) | undefined;
    let unsubscribeError: (() => void) | undefined;
    let unsubscribeStatus: (() => void) | undefined;

    const initializeWebSocket = async () => {
      try {
        const token = await getToken();
        
        unsubscribeMessage = predictionsWebSocket.onMessage(handlePredictionData);
        
        unsubscribeError = predictionsWebSocket.onError((err) => {
          setError(err.message);
          console.error('WebSocket error:', err);
        });
        
        unsubscribeStatus = predictionsWebSocket.onStatusChange((status) => {
          switch (status) {
            case 'connecting':
              setLoading(true);
              break;
            case 'connected':
              setLoading(false);
              setError(null);
              break;
            case 'disconnected':
              setError('Disconnected from server');
              break;
            case 'error':
              setError('Connection error');
              break;
          }
        });

        predictionsWebSocket.connect(token || undefined);

      } catch (err) {
        console.error('Failed to initialize WebSocket with auth:', err);
        setError('Authentication error');
      }
    };

    initializeWebSocket();

    return () => {
      unsubscribeMessage?.();
      unsubscribeError?.();
      unsubscribeStatus?.();
      predictionsWebSocket.disconnect();
    };
  }, [handlePredictionData, getToken]);

  const value: PredictionsNotificationContextType = {
    // Se mantiene 'notifications' para compatibilidad de tipo, pero ahora es un subconjunto
    notifications: { predictions: predictionsByCamera.flat() }, 
    predictionsByCamera, // Nuevo estado para acceder a predicciones por cámara
    loading,
    error,
    lastUpdated,
    refetch,
    totalParkingSpaces,
    systemStatus,
    totalDetections
  };

  return (
    <PredictionsNotificationContext.Provider value={value}>
      {children}
    </PredictionsNotificationContext.Provider>
  );
};

export const usePredictionsNotificationContext = (): PredictionsNotificationContextType => {
  const context = useContext(PredictionsNotificationContext);
  if (context === undefined) {
    throw new Error('usePredictionsNotificationContext must be used within a PredictionsNotificationProvider');
  }
  return context;
};

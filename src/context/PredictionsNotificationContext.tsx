'use client';


import React, { createContext, useContext, ReactNode, useState, useEffect, useCallback, useRef } from 'react';
import { PredictionsNotificationContextType, NotificationResponse, Prediction, ParkingStats } from '../types/notifications';
import { predictionsWebSocket } from '../services/websocketService';
import { useNotifications } from '../hooks/useNotifications';
import { useAuth } from '@clerk/nextjs';
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
  const [predictionsByCamera, setPredictionsByCamera] = useState<Prediction[][]>(
    Array.from({ length: env.CAMERA_COUNT }, () => [])
  );
  const [parkingStatsByCamera, setParkingStatsByCamera] = useState<ParkingStats[]>(
    Array.from({ length: env.CAMERA_COUNT }, (_, index) => ({
      totalSpots: env.PARKING_SPACES_PER_CAMERA[index] || 45,
      occupiedSpots: 0,
      availableSpots: env.PARKING_SPACES_PER_CAMERA[index] || 45,
      lastUpdate: new Date().toLocaleTimeString(),
      alertLevel: 'low'
    }))
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [totalParkingSpaces] = useState<number>(
    env.PARKING_SPACES_PER_CAMERA.reduce((sum: number, spaces: number) => sum + spaces, 0)
  );
  const previousCarCountByCameraRef = useRef<number[]>(Array(env.CAMERA_COUNT).fill(0));
  const { addNotification } = useNotifications();
  const { getToken } = useAuth();

  const systemStatus: 'active' | 'inactive' | 'error' = 
    error ? 'error' : 
    loading ? 'inactive' : 
    'active';

  const handlePredictionData = useCallback((data: PredictionMessage) => {
    console.log(`Received WebSocket data for camera ${data.cam_index}:`, data);

    setPredictionsByCamera(prevPredictions => {
      const newPredictions = [...prevPredictions];
      if (data.cam_index >= 0 && data.cam_index < env.CAMERA_COUNT) {
        newPredictions[data.cam_index] = data.predictions || [];

        // Calcular estadísticas para la cámara específica
        const occupiedSpots = newPredictions[data.cam_index].length;
        const totalSpots = env.PARKING_SPACES_PER_CAMERA[data.cam_index] || 45;
        const availableSpots = Math.max(0, totalSpots - occupiedSpots);
        const alertLevel: 'low' | 'medium' | 'high' = 
          availableSpots < 5 ? 'high' : 
          availableSpots < 15 ? 'medium' : 'low';

        // Actualizar estadísticas por cámara
        setParkingStatsByCamera(prevStats => {
          const newStats = [...prevStats];
          newStats[data.cam_index] = {
            totalSpots,
            occupiedSpots,
            availableSpots,
            lastUpdate: new Date().toLocaleTimeString(),
            alertLevel
          };
          return newStats;
        });

        // Notificaciones basadas en cambios por cámara
        const carDifference = occupiedSpots - previousCarCountByCameraRef.current[data.cam_index];
        if (previousCarCountByCameraRef.current[data.cam_index] > 0 && carDifference !== 0) {
          let title: string;
          let message: string;
          let status: 'info' | 'success' | 'warning' | 'error';
          
          if (carDifference > 0) {
            title = `Nuevos Autos en Estacionamiento ${data.cam_index + 1}`;
            message = `${carDifference} auto${carDifference !== 1 ? 's' : ''} nuevo${carDifference !== 1 ? 's' : ''} en el estacionamiento ${data.cam_index + 1}`;
            status = 'info';
          } else {
            title = `Autos Salieron de Estacionamiento ${data.cam_index + 1}`;
            message = `${Math.abs(carDifference)} auto${Math.abs(carDifference) !== 1 ? 's' : ''} salieron del estacionamiento ${data.cam_index + 1}`;
            status = 'success';
          }
          
          addNotification(title, message, "target", status);
        }
        
        previousCarCountByCameraRef.current[data.cam_index] = occupiedSpots;
      }
      
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
    notifications: { predictions: predictionsByCamera.flat() },
    predictionsByCamera,
    parkingStatsByCamera,
    loading,
    error,
    lastUpdated,
    refetch,
    totalParkingSpaces,
    systemStatus,
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

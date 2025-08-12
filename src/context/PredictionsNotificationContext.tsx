import React, { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { PredictionsNotificationContextType, NotificationResponse, Prediction } from '../types/notifications';
import { predictionsWebSocket } from '../services/websocketService';
import { useNotifications } from '../hooks/useNotifications';
import { useAuth } from '@clerk/clerk-react';
import { env } from '../lib/env';

export const PredictionsNotificationContext = createContext<PredictionsNotificationContextType | undefined>(undefined);

interface PredictionsNotificationProviderProps {
  children: ReactNode;
}

export const PredictionsNotificationProvider: React.FC<PredictionsNotificationProviderProps> = ({
  children
}) => {
  const [notifications, setNotifications] = useState<NotificationResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [totalParkingSpaces] = useState<number>(env.TOTAL_PARKING_SPACES);
  const [totalDetections, setTotalDetections] = useState<number>(0);
  const [previousCarCount, setPreviousCarCount] = useState<number>(0);
  const { addNotification } = useNotifications();
  const { getToken } = useAuth();

  // Calculate system status based on state
  const systemStatus: 'active' | 'inactive' | 'error' = 
    error ? 'error' : 
    loading ? 'inactive' : 
    'active';

  const handlePredictionData = useCallback((data: NotificationResponse) => {
    console.log('Received WebSocket data:', data);
    
    const currentCarCount = data.predictions?.length || 0;
    const carDifference = currentCarCount - previousCarCount;
    
    setNotifications(data);
    setLastUpdated(new Date());
    setTotalDetections(currentCarCount);
    
    // Only notify about changes in car count
    if (carDifference !== 0) {
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
    
    setPreviousCarCount(currentCarCount);
    setError(null);
  }, [addNotification, previousCarCount]);

  const refetch = useCallback(async () => {
    // Reconnect WebSocket to get fresh data
    predictionsWebSocket.reconnect();
  }, []);

  useEffect(() => {
    let unsubscribeMessage: (() => void) | undefined;
    let unsubscribeError: (() => void) | undefined;
    let unsubscribeStatus: (() => void) | undefined;

    const initializeWebSocket = async () => {
      try {
        // Get auth token from Clerk
        const token = await getToken();
        
        // Subscribe to WebSocket events
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

        // Connect to WebSocket with auth token
        predictionsWebSocket.connect(token || undefined);

      } catch (err) {
        console.error('Failed to initialize WebSocket with auth:', err);
        setError('Authentication error');
      }
    };

    initializeWebSocket();

    // Cleanup on unmount
    return () => {
      unsubscribeMessage?.();
      unsubscribeError?.();
      unsubscribeStatus?.();
      predictionsWebSocket.disconnect();
    };
  }, [handlePredictionData, getToken]);

  const value: PredictionsNotificationContextType = {
    notifications,
    loading,
    error,
    lastUpdated,
    refetch,
    // Parking-specific data
    totalParkingSpaces,
    // System status
    systemStatus,
    // Total detections count
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
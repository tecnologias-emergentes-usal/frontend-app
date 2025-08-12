import React, { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { PredictionsNotificationContextType, NotificationResponse, Prediction, LegacyNotificationResponse } from '../types/notifications';
import { NotificationService } from '../services/notificationService';
import { predictionsWebSocket } from '../services/websocketService';
import { useNotifications } from '../hooks/useNotifications';
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
  const { addNotification } = useNotifications();

  // Calculate system status based on state
  const systemStatus: 'active' | 'inactive' | 'error' = 
    error ? 'error' : 
    loading ? 'inactive' : 
    'active';

  const handlePredictionData = useCallback((data: NotificationResponse) => {
    setNotifications(data);
    setLastUpdated(new Date());
    setTotalDetections(data.total_detections || 0);

    // Extract all predictions from all cameras
    const allPredictions: Prediction[] = [];
    if (data.detections?.length) {
      data.detections.forEach(detection => {
        if (detection.predictions?.length) {
          allPredictions.push(...detection.predictions);
        }
      });
    }

    // Automatically create notifications for predictions
    if (allPredictions.length > 0) {
      const uniqueClasses = [...new Set(allPredictions.map((p: Prediction) => p.class_name))];
      
      // Create a message with the detected objects
      const objectCount = allPredictions.length;
      const cameraCount = data.detections.length;
      const title = "Detecciones Activas";
      
      // Create chips for the subtitle
      const classChips = uniqueClasses.map(className => {
        const count = allPredictions.filter((p: Prediction) => p.class_name === className).length;
        return `${className} (${count})`;
      }).join(', ');
      
      const message = `${objectCount} objeto${objectCount !== 1 ? 's' : ''} en ${cameraCount} cámara${cameraCount !== 1 ? 's' : ''}: ${classChips}`;

      // Add notification to queue with prediction data
      addNotification(title, message, "target", { predictions: allPredictions, uniqueClasses, detections: data.detections });
      setError(null);
    }
  }, [addNotification]);

  const refetch = useCallback(async () => {
    // For backward compatibility, fetch once from API
    setLoading(true);
    try {
      const legacyData: LegacyNotificationResponse = await NotificationService.fetchNotifications();
      // Convert legacy format to new format
      const convertedData: NotificationResponse = {
        timestamp: new Date().toISOString(),
        total_detections: legacyData.predictions?.length || 0,
        detections: legacyData.predictions?.length ? [{
          cam_index: "legacy",
          predictions: legacyData.predictions
        }] : []
      };
      handlePredictionData(convertedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [handlePredictionData]);

  useEffect(() => {
    // Subscribe to WebSocket events
    const unsubscribeMessage = predictionsWebSocket.onMessage(handlePredictionData);
    
    const unsubscribeError = predictionsWebSocket.onError((err) => {
      setError(err.message);
      console.error('WebSocket error:', err);
    });
    
    const unsubscribeStatus = predictionsWebSocket.onStatusChange((status) => {
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

    // Connect to WebSocket
    predictionsWebSocket.connect();

    // Cleanup on unmount
    return () => {
      unsubscribeMessage();
      unsubscribeError();
      unsubscribeStatus();
      predictionsWebSocket.disconnect();
    };
  }, [handlePredictionData]);

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
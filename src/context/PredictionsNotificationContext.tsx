import React, { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { PredictionsNotificationContextType, NotificationResponse, Prediction } from '../types/notifications';
import { NotificationService } from '../services/notificationService';
import { useNotifications } from '../hooks/useNotifications';

export const PredictionsNotificationContext = createContext<PredictionsNotificationContextType | undefined>(undefined);

interface PredictionsNotificationProviderProps {
  children: ReactNode;
  pollingInterval?: number;
}

export const PredictionsNotificationProvider: React.FC<PredictionsNotificationProviderProps> = ({
  children,
  pollingInterval = 3000
}) => {
  const [notifications, setNotifications] = useState<NotificationResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { addNotification } = useNotifications();

  const fetchNotifications = useCallback(async () => {
    try {
      setError(null);
      const data = await NotificationService.fetchNotifications();
      setNotifications(data);
      setLastUpdated(new Date());

      // Automatically create notifications for predictions
      if (data?.predictions?.length) {
        const predictions = data.predictions;
        const uniqueClasses = [...new Set(predictions.map((p: Prediction) => p.class_name))];
        
        // Create a message with the detected objects
        const objectCount = predictions.length;
        const title = "Detecciones Activas";
        
        // Create chips for the subtitle
        const classChips = uniqueClasses.map(className => {
          const count = predictions.filter((p: Prediction) => p.class_name === className).length;
          return `${className} (${count})`;
        }).join(', ');
        
        const message = `${objectCount} objeto${objectCount !== 1 ? 's' : ''} detectado${objectCount !== 1 ? 's' : ''}: ${classChips}`;

        // Add notification to queue with prediction data
        addNotification(title, message, "target", { predictions, uniqueClasses });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  const refetch = useCallback(async () => {
    setLoading(true);
    await fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    // Fetch initial data
    fetchNotifications();

    // Set up polling interval
    const interval = setInterval(() => {
      fetchNotifications();
    }, pollingInterval);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [fetchNotifications, pollingInterval]);

  const value: PredictionsNotificationContextType = {
    notifications,
    loading,
    error,
    lastUpdated,
    refetch
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
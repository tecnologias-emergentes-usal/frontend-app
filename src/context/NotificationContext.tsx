import React, { createContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { Notification } from 'konsta/react';
import { NotificationContextType, GenericNotification, NotificationDisplayState } from '../types/notifications';
import { getIcon } from '../utils/iconDictionary';

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
  displayTimeout?: number;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  displayTimeout = 8000
}) => {
  // Queue management state
  const [notificationQueue, setNotificationQueue] = useState<GenericNotification[]>([]);
  const [displayState, setDisplayState] = useState<NotificationDisplayState>({
    isVisible: false,
    currentNotification: null
  });
  const [isProcessingQueue, setIsProcessingQueue] = useState(false);

  // Generate unique ID for notifications
  const generateNotificationId = useCallback(() => {
    return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Add notification to queue
  const addNotification = useCallback((title: string, message: string, icon: string, status: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const newNotification: GenericNotification = {
      id: generateNotificationId(),
      title,
      message,
      icon,
      timestamp: new Date(),
      status
    };

    setNotificationQueue(prev => [...prev, newNotification]);
  }, [generateNotificationId]);

  // Process notification queue
  useEffect(() => {
    const processQueue = async () => {
      if (isProcessingQueue || notificationQueue.length === 0 || displayState.isVisible) {
        return;
      }

      setIsProcessingQueue(true);
      const nextNotification = notificationQueue[0];

      // Show notification
      setDisplayState({
        isVisible: true,
        currentNotification: nextNotification
      });

      // Remove from queue
      setNotificationQueue(prev => prev.slice(1));

      // Auto-dismiss after timeout
      setTimeout(() => {
        setDisplayState(prev => ({
          ...prev,
          isVisible: false
        }));

        // Wait a bit before processing next notification
        setTimeout(() => {
          setDisplayState({
            isVisible: false,
            currentNotification: null
          });
          setIsProcessingQueue(false);
        }, 500); // Small delay between notifications
      }, displayTimeout);
    };

    processQueue();
  }, [notificationQueue, displayState.isVisible, isProcessingQueue, displayTimeout]);

  // Manual dismiss function
  const dismissCurrentNotification = useCallback(() => {
    setDisplayState(prev => ({
      ...prev,
      isVisible: false
    }));

    // Clean up current notification after animation
    setTimeout(() => {
      setDisplayState({
        isVisible: false,
        currentNotification: null
      });
      setIsProcessingQueue(false);
    }, 300);
  }, []);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'success': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-blue-500';
    }
  };

  const getStatusBgColor = (status?: string) => {
    switch (status) {
      case 'success': return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'warning': return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'error': return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      default: return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    }
  };

  const value: NotificationContextType = {
    displayState,
    addNotification,
    dismissCurrentNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {/* Always render notification, control visibility with opened prop */}
      <div>
        <Notification
          opened={displayState.isVisible && displayState.currentNotification !== null}
          icon={displayState.currentNotification ? getIcon(displayState.currentNotification.icon, `w-6 h-6 ${getStatusColor(displayState.currentNotification.status)}`) : undefined}
          title={displayState.currentNotification?.title || ''}
          subtitle={displayState.currentNotification?.message || ''}
          onClick={dismissCurrentNotification}
          className={displayState.currentNotification ? getStatusBgColor(displayState.currentNotification.status) : ''}
        />
      </div>
    </NotificationContext.Provider>
  );
};

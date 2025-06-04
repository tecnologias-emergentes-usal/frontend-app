import React, { createContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { Notification, Chip } from 'konsta/react';
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
  const addNotification = useCallback((title: string, message: string, icon: string, data?: any) => {
    const newNotification: GenericNotification = {
      id: generateNotificationId(),
      title,
      message,
      icon,
      timestamp: new Date(),
      data
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

  // Render subtitle based on data content
  const renderSubtitle = (currentNotification: GenericNotification) => {
    const { message, data } = currentNotification;
    
    // If we have prediction data, render chips
    if (data?.predictions && data?.uniqueClasses) {
      const predictions = data.predictions;
      const uniqueClasses = data.uniqueClasses;
      
      return (
        <div className="flex flex-wrap gap-1">
          {uniqueClasses.map((className: string) => {
            const count = predictions.filter((p: any) => p.class_name === className).length;
            return (
              <Chip
                key={className}
                colors={{
                  fillBgIos: 'bg-indigo-500',
                  fillTextIos: 'text-white',
                  fillBgMaterial: 'bg-indigo-500',
                  fillTextMaterial: 'text-white'
                }}
              >
                {className} ({count})
              </Chip>
            );
          })}
        </div>
      );
    }
    
    // Default message rendering
    return message;
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
          icon={displayState.currentNotification ? getIcon(displayState.currentNotification.icon, "w-6 h-6 text-accent") : undefined}
          title={displayState.currentNotification?.title || ''}
          titleRightText={displayState.currentNotification?.data?.predictions ? 
            `${displayState.currentNotification.data.predictions.length} objeto${displayState.currentNotification.data.predictions.length !== 1 ? 's' : ''}` : 
            undefined
          }
          subtitle={displayState.currentNotification ? renderSubtitle(displayState.currentNotification) : ''}
          text={displayState.currentNotification?.data?.predictions ? "" : undefined}
          onClick={dismissCurrentNotification}
        />
      </div>
    </NotificationContext.Provider>
  );
};

import { useContext } from 'react';
import { NotificationContextType } from '../types/notifications';
import { NotificationContext } from '@/context';

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a PredictionsNotificationProvider');
  }
  return context;
};

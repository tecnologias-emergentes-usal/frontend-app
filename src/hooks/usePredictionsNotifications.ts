import { useContext } from 'react';
import { PredictionsNotificationContext } from '../context/PredictionsNotificationContext';
import { PredictionsNotificationContextType } from '../types/notifications';

export const usePredictionsNotifications = (): PredictionsNotificationContextType => {
  const context = useContext(PredictionsNotificationContext);
  if (context === undefined) {
    throw new Error('usePredictionsNotifications must be used within a PredictionsNotificationProvider');
  }
  return context;
}; 
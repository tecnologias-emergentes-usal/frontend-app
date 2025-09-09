export interface Prediction {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  confidence: number;
  class_id: number;
  class_name: string;
}

export interface NotificationResponse {
  cam_index: number; // Corregido a number
  timestamp: string;
  predictions: Prediction[];
}

// Generic notification types
export interface GenericNotification {
  id: string;
  title: string;
  message: string;
  icon: string;
  timestamp: Date;
  status?: 'info' | 'success' | 'warning' | 'error';
}

export interface NotificationDisplayState {
  isVisible: boolean;
  currentNotification: GenericNotification | null;
}

// Generic notification context type
export interface NotificationContextType {
  displayState: NotificationDisplayState;
  addNotification: (title: string, message: string, icon: string, status?: 'info' | 'success' | 'warning' | 'error') => void;
  dismissCurrentNotification: () => void;
}

export interface ParkingStats {
  totalSpots: number;
  occupiedSpots: number;
  availableSpots: number;
  lastUpdate: string;
  alertLevel: 'low' | 'medium' | 'high';
}

// Tipo para el contexto de notificaciones de predicciones actualizado
export interface PredictionsNotificationContextType {
  // Objeto de notificaciones original, ahora representa un consolidado
  notifications: { predictions: Prediction[] } | null;
  // Nuevo: Array de predicciones por cámara
  predictionsByCamera: Prediction[][];
  parkingStatsByCamera: ParkingStats[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refetch: () => Promise<void>;
  totalParkingSpaces: number;
  systemStatus: 'active' | 'inactive' | 'error';
}

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
  predictions: Prediction[];
}

// Generic notification types
export interface GenericNotification {
  id: string;
  title: string;
  message: string;
  icon: string;
  timestamp: Date;
  data?: any; // Optional data payload
}

export interface NotificationDisplayState {
  isVisible: boolean;
  currentNotification: GenericNotification | null;
}

// Generic notification context type
export interface NotificationContextType {
  displayState: NotificationDisplayState;
  addNotification: (title: string, message: string, icon: string, data?: any) => void;
  dismissCurrentNotification: () => void;
}

// Prediction-specific types
export interface QueuedNotification {
  id: string;
  predictions: Prediction[];
  timestamp: Date;
}

export interface PredictionsNotificationContextType {
  notifications: NotificationResponse | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refetch: () => Promise<void>;
}
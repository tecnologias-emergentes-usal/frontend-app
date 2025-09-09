import React, { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { barrierWebSocket, BarrierStatus } from '../services/barrierWebSocketService';
import { useAuth } from '@clerk/clerk-react';

export interface BarrierContextType {
  lastActions: Record<number, BarrierStatus | null>; 
  loading: boolean;
  error: string | null;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  refetch: () => Promise<void>;
}



const BarrierContext = createContext<BarrierContextType | undefined>(undefined);

interface BarrierProviderProps {
  children: ReactNode;
}

export const BarrierProvider: React.FC<BarrierProviderProps> = ({ children }) => {
  const [lastActions, setLastActions] = useState<Record<number, BarrierStatus | null>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const { getToken } = useAuth();

  const handleBarrierMessage = useCallback((data: BarrierStatus) => {
    console.log('Received barrier status:', data);
    setLastActions((prev) => ({
      ...prev,
      [data.cam_index]: data // Actualiza el estado para la cámara específica
    }));
    setError(null);
  }, []);

  const refetch = useCallback(async () => {
    barrierWebSocket.reconnect();
  }, []);

  useEffect(() => {
    let unsubscribeMessage: (() => void) | undefined;
    let unsubscribeError: (() => void) | undefined;
    let unsubscribeStatus: (() => void) | undefined;

    const initializeBarrierWebSocket = async () => {
      try {
        const token = await getToken();
        
        unsubscribeMessage = barrierWebSocket.onMessage(handleBarrierMessage);
        
        unsubscribeError = barrierWebSocket.onError((err) => {
          setError(err.message);
          console.error('Barrier WebSocket error:', err);
        });
        
        unsubscribeStatus = barrierWebSocket.onStatusChange((status) => {
          setConnectionStatus(status);
          switch (status) {
            case 'connecting':
              setLoading(true);
              break;
            case 'connected':
              setLoading(false);
              setError(null);
              break;
            case 'disconnected':
              setError('Desconectado del servidor de barrera');
              break;
            case 'error':
              setError('Error de conexión con barrera');
              break;
          }
        });

        barrierWebSocket.connect(token || undefined);

      } catch (err) {
        console.error('Failed to initialize Barrier WebSocket with auth:', err);
        setError('Error de autenticación para barrera');
      }
    };

    initializeBarrierWebSocket();

    return () => {
      unsubscribeMessage?.();
      unsubscribeError?.();
      unsubscribeStatus?.();
      barrierWebSocket.disconnect();
    };
  }, [getToken]);

  const value: BarrierContextType = {
    lastActions,
    loading,
    error,
    connectionStatus,
    refetch
  };

  return (
    <BarrierContext.Provider value={value}>
      {children}
    </BarrierContext.Provider>
  );
};

export const useBarrier = (): BarrierContextType => {
  const context = useContext(BarrierContext);
  if (context === undefined) {
    throw new Error('useBarrier must be used within a BarrierProvider');
  }
  return context;
};
import { env } from '../lib/env';
import { NotificationResponse } from '../types/notifications';

type MessageHandler = (data: NotificationResponse) => void;
type ErrorHandler = (error: Error) => void;
type StatusHandler = (status: 'connecting' | 'connected' | 'disconnected' | 'error') => void;

class PredictionsWebSocketService {
  private ws: WebSocket | null = null;
  private messageHandlers: Set<MessageHandler> = new Set();
  private errorHandlers: Set<ErrorHandler> = new Set();
  private statusHandlers: Set<StatusHandler> = new Set();
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private shouldReconnect = true;
  private reconnectDelay = 5000; // Aumentado a 5 segundos
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private isConnecting = false;

  connect() {
    // Evitar múltiples conexiones simultáneas
    if (this.isConnecting || this.ws?.readyState === WebSocket.CONNECTING) {
      console.log('WebSocket already connecting, skipping...');
      return;
    }

    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    this.cleanup();
    this.shouldReconnect = true;
    this.isConnecting = true;
    
    const baseUrl = env.API_URL;
    const wsUrl = baseUrl.replace(/^http/, 'ws') + '/ws/predictions';
    
    console.log(`Connecting to WebSocket (attempt ${this.reconnectAttempts + 1}/${this.maxReconnectAttempts}):`, wsUrl);
    this.notifyStatus('connecting');
    
    try {
      this.ws = new WebSocket(wsUrl);
      this.setupEventHandlers();
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      this.isConnecting = false;
      this.notifyError(error as Error);
      this.scheduleReconnect();
    }
  }

  private setupEventHandlers() {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log('WebSocket connected successfully');
      this.isConnecting = false;
      this.reconnectAttempts = 0; // Reset en conexión exitosa
      this.notifyStatus('connected');
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.notifyMessage(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
        this.notifyError(new Error('Failed to parse message'));
      }
    };

    this.ws.onerror = (event) => {
      console.error('WebSocket error:', event);
      this.isConnecting = false;
      this.notifyStatus('error');
      this.notifyError(new Error('WebSocket connection error'));
    };

    this.ws.onclose = (event) => {
      console.log(`WebSocket disconnected. Code: ${event.code}, Reason: ${event.reason}`);
      this.isConnecting = false;
      this.notifyStatus('disconnected');
      
      if (this.shouldReconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
        this.scheduleReconnect();
      } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.warn('Max reconnection attempts reached. Stopping reconnections.');
        this.shouldReconnect = false;
      }
    };
  }

  private scheduleReconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    
    this.reconnectAttempts++;
    
    // Backoff exponencial: 5s, 10s, 20s, etc. (máximo 60s)
    const delay = Math.min(this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1), 60000);
    
    console.log(`Scheduling reconnection in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
    this.reconnectTimeout = setTimeout(() => {
      if (this.shouldReconnect && this.reconnectAttempts <= this.maxReconnectAttempts) {
        this.connect();
      }
    }, delay);
  }

  disconnect() {
    console.log('Disconnecting WebSocket manually');
    this.shouldReconnect = false;
    this.isConnecting = false;
    this.cleanup();
    this.notifyStatus('disconnected');
  }

  private cleanup() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    if (this.ws) {
      // Evitar loops de cierre
      if (this.ws.readyState !== WebSocket.CLOSED) {
        this.ws.close();
      }
      this.ws = null;
    }
  }

  // Método para reiniciar conexión manualmente
  reconnect() {
    console.log('Manual reconnection triggered');
    this.reconnectAttempts = 0;
    this.shouldReconnect = true;
    this.disconnect();
    setTimeout(() => this.connect(), 1000);
  }

  onMessage(handler: MessageHandler) {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  onError(handler: ErrorHandler) {
    this.errorHandlers.add(handler);
    return () => this.errorHandlers.delete(handler);
  }

  onStatusChange(handler: StatusHandler) {
    this.statusHandlers.add(handler);
    return () => this.statusHandlers.delete(handler);
  }

  private notifyMessage(data: NotificationResponse) {
    this.messageHandlers.forEach(handler => handler(data));
  }

  private notifyError(error: Error) {
    this.errorHandlers.forEach(handler => handler(error));
  }

  private notifyStatus(status: 'connecting' | 'connected' | 'disconnected' | 'error') {
    this.statusHandlers.forEach(handler => handler(status));
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

export const predictionsWebSocket = new PredictionsWebSocketService();
import { env } from '../lib/env';

export interface BarrierStatus {
  event: 'command_sent' | 'status_confirmed';
  barrier_action: string;
  barrier_state: string;
  current_cars: number;
  max_cars: number;
  utilization_percent: number;
  space_available: number;
  timestamp: number;
  parsedTimestamp: Date;
}

type MessageHandler = (data: BarrierStatus) => void;
type ErrorHandler = (error: Error) => void;
type StatusHandler = (status: 'connecting' | 'connected' | 'disconnected' | 'error') => void;

class BarrierWebSocketService {
  private ws: WebSocket | null = null;
  private messageHandlers: Set<MessageHandler> = new Set();
  private errorHandlers: Set<ErrorHandler> = new Set();
  private statusHandlers: Set<StatusHandler> = new Set();
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private shouldReconnect = true;
  private reconnectDelay = 5000;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private isConnecting = false;
  private authToken: string | null = null;

  connect(authToken?: string) {
    if (this.isConnecting || this.ws?.readyState === WebSocket.CONNECTING) {
      console.log('Barrier WebSocket already connecting, skipping...');
      return;
    }

    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('Barrier WebSocket already connected');
      return;
    }

    if (authToken) {
      this.authToken = authToken;
    }

    this.cleanup();
    this.shouldReconnect = true;
    this.isConnecting = true;
    
    const baseUrl = env.API_URL;
    let wsUrl = baseUrl.replace(/^http/, 'ws') + '/api/v1/ws/barrier-status';
    
    if (this.authToken) {
      const separator = wsUrl.includes('?') ? '&' : '?';
      wsUrl = `${wsUrl}${separator}token=${encodeURIComponent(this.authToken)}`;
    }
    
    console.log(`Connecting to Barrier WebSocket (attempt ${this.reconnectAttempts + 1}/${this.maxReconnectAttempts}):`, wsUrl);
    this.notifyStatus('connecting');
    
    try {
      this.ws = new WebSocket(wsUrl);
      this.setupEventHandlers();
    } catch (error) {
      console.error('Failed to create Barrier WebSocket:', error);
      this.isConnecting = false;
      this.notifyError(error as Error);
      this.scheduleReconnect();
    }
  }

  private parseBarrierMessage(message: string): BarrierStatus {
    try {
      const data = JSON.parse(message);
      return {
        event: data.event,
        barrier_action: data.barrier_action,
        barrier_state: data.barrier_state,
        current_cars: data.current_cars,
        max_cars: data.max_cars,
        utilization_percent: data.utilization_percent,
        space_available: data.space_available,
        timestamp: data.timestamp,
        parsedTimestamp: new Date(data.timestamp * 1000)
      };
    } catch (error) {
      throw new Error(`Invalid barrier message JSON: ${message}`);
    }
  }

  private setupEventHandlers() {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log('Barrier WebSocket connected successfully');
      this.isConnecting = false;
      this.reconnectAttempts = 0;
      this.notifyStatus('connected');
    };

    this.ws.onmessage = (event) => {
      try {
        const rawMessage = event.data.toString();
        const parsedData = this.parseBarrierMessage(rawMessage);
        console.log('Received barrier message:', parsedData);
        this.notifyMessage(parsedData);
      } catch (error) {
        console.error('Error parsing Barrier WebSocket message:', error);
        this.notifyError(new Error('Failed to parse barrier message'));
      }
    };

    this.ws.onerror = (event) => {
      console.error('Barrier WebSocket error:', event);
      this.isConnecting = false;
      this.notifyStatus('error');
      this.notifyError(new Error('Barrier WebSocket connection error'));
    };

    this.ws.onclose = (event) => {
      console.log(`Barrier WebSocket disconnected. Code: ${event.code}, Reason: ${event.reason}`);
      this.isConnecting = false;
      this.notifyStatus('disconnected');
      
      if (this.shouldReconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
        this.scheduleReconnect();
      } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.warn('Max barrier reconnection attempts reached. Stopping reconnections.');
        this.shouldReconnect = false;
      }
    };
  }

  private scheduleReconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    
    this.reconnectAttempts++;
    const delay = Math.min(this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1), 60000);
    
    console.log(`Scheduling barrier reconnection in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
    this.reconnectTimeout = setTimeout(() => {
      if (this.shouldReconnect && this.reconnectAttempts <= this.maxReconnectAttempts) {
        this.connect();
      }
    }, delay);
  }

  disconnect() {
    console.log('Disconnecting Barrier WebSocket manually');
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
      if (this.ws.readyState !== WebSocket.CLOSED) {
        this.ws.close();
      }
      this.ws = null;
    }
  }

  reconnect() {
    console.log('Manual barrier reconnection triggered');
    this.reconnectAttempts = 0;
    this.shouldReconnect = true;
    this.disconnect();
    setTimeout(() => this.connect(), 1000);
  }

  updateAuthToken(token: string | null) {
    const tokenChanged = this.authToken !== token;
    this.authToken = token;
    
    if (tokenChanged && this.ws?.readyState === WebSocket.OPEN) {
      console.log('Barrier auth token updated, reconnecting WebSocket...');
      this.reconnect();
    }
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

  private notifyMessage(data: BarrierStatus) {
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

export const barrierWebSocket = new BarrierWebSocketService();
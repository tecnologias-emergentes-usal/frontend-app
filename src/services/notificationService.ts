import axios from 'axios';
import { NotificationResponse } from '../types/notifications';
import { env } from '@/lib/env';

const API_URL = env.API_URL;
const ENDPOINT = 'resultado';

export class NotificationService {
  static async fetchNotifications(): Promise<NotificationResponse> {
    try {
      const response = await axios.get<NotificationResponse>(`${API_URL}${ENDPOINT}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to fetch notifications: ${error.message}`);
      }
      if (error instanceof Error) {
        throw new Error(`Failed to fetch notifications: ${error.message}`);
      }
      throw new Error('Failed to fetch notifications: Unknown error');
    }
  }
} 
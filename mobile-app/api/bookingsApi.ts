import { apiClient } from './client';
import { CreateBookingDto, UpdateBookingStatusDto, Booking } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const bookingsApi = {
  create: async (data: CreateBookingDto): Promise<Booking> => {
    const idempotencyKey = uuidv4();
    const response = await apiClient.post('/bookings', data, {
      headers: {
        'Idempotency-Key': idempotencyKey,
      },
    });
    return response.data;
  },

  getAll: async (): Promise<Booking[]> => {
    const response = await apiClient.get('/bookings');
    return response.data;
  },

  getHistory: async () => {
    const response = await apiClient.get('/bookings/history');
    return response.data;
  },

  updateStatus: async (id: string, data: UpdateBookingStatusDto): Promise<Booking> => {
    const response = await apiClient.patch(`/bookings/${id}/status`, data);
    return response.data;
  },
};

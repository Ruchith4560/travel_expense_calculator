import axios, { AxiosError } from 'axios';
import { ApiErrorResponse, Trip, TripFormData } from '../types/trip';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const tripApi = {
  /**
   * Fetch all saved trips ordered newest first.
   */
  async getAllTrips(): Promise<Trip[]> {
    const response = await apiClient.get<Trip[]>('/trips');
    return response.data;
  },

  /**
   * Fetch a single trip by ID.
   */
  async getTripById(id: number): Promise<Trip> {
    const response = await apiClient.get<Trip>(`/trips/${id}`);
    return response.data;
  },

  /**
   * Create and persist a new trip with calculated totals.
   */
  async createTrip(formData: TripFormData): Promise<Trip> {
    const payload = {
      destination: formData.destination.trim(),
      days: Number(formData.days),
      travellers: Number(formData.travellers),
      travelExpense: Number(formData.travelExpense),
      accommodationExpense: Number(formData.accommodationExpense),
      foodExpense: Number(formData.foodExpense),
    };

    const response = await apiClient.post<Trip>('/trips', payload);
    return response.data;
  },

  /**
   * Delete a saved trip by ID.
   */
  async deleteTrip(id: number): Promise<void> {
    await apiClient.delete(`/trips/${id}`);
  },

  /**
   * Helper to extract standardized API error details.
   */
  extractApiError(error: unknown): { message: string; validationErrors?: Record<string, string> } {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      if (axiosError.response?.data) {
        const data = axiosError.response.data;
        return {
          message: data.message || 'An error occurred while communicating with the server.',
          validationErrors: data.validationErrors,
        };
      }
      if (axiosError.code === 'ECONNABORTED') {
        return { message: 'Connection timed out. Please check if the backend service is running.' };
      }
      if (!axiosError.response) {
        return { message: 'Unable to reach the backend server. Please verify network connectivity.' };
      }
    }
    return { message: error instanceof Error ? error.message : 'An unexpected error occurred.' };
  },
};

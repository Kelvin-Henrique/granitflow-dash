import api from './api';
import { ScheduleEvent } from '@/types';

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

const scheduleService = {
  getEvents: async (search?: string): Promise<ApiResponse<ScheduleEvent[]>> => {
    try {
      const url = search ? `/schedule?search=${encodeURIComponent(search)}` : '/schedule';
      const response = await api.get(url);
      return { data: response.data, error: null };
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      return { 
        data: null, 
        error: axiosError.response?.data?.message || 'Erro ao buscar eventos' 
      };
    }
  },

  getEventById: async (id: number): Promise<ApiResponse<ScheduleEvent>> => {
    try {
      const response = await api.get(`/schedule/${id}`);
      return { data: response.data, error: null };
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      return { 
        data: null, 
        error: axiosError.response?.data?.message || 'Erro ao buscar evento' 
      };
    }
  },

  createEvent: async (eventData: Partial<ScheduleEvent>): Promise<ApiResponse<ScheduleEvent>> => {
    try {
      const response = await api.post('/schedule', eventData);
      return { data: response.data, error: null };
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      return { 
        data: null, 
        error: axiosError.response?.data?.message || 'Erro ao criar evento' 
      };
    }
  },

  updateEvent: async (id: number, eventData: Partial<ScheduleEvent>): Promise<ApiResponse<ScheduleEvent>> => {
    try {
      const response = await api.put(`/schedule/${id}`, eventData);
      return { data: response.data, error: null };
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      return { 
        data: null, 
        error: axiosError.response?.data?.message || 'Erro ao atualizar evento' 
      };
    }
  },

  deleteEvent: async (id: number): Promise<ApiResponse<void>> => {
    try {
      await api.delete(`/schedule/${id}`);
      return { data: null, error: null };
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      return { 
        data: null, 
        error: axiosError.response?.data?.message || 'Erro ao deletar evento' 
      };
    }
  },
};

export default scheduleService;

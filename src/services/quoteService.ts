import api from './api';
import { Quote } from '@/types';

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

const quoteService = {
  getQuotes: async (search?: string): Promise<ApiResponse<Quote[]>> => {
    try {
      const url = search ? `/quotes?search=${encodeURIComponent(search)}` : '/quotes';
      const response = await api.get(url);
      return { data: response.data, error: null };
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      return { 
        data: null, 
        error: axiosError.response?.data?.message || 'Erro ao buscar orçamentos' 
      };
    }
  },

  getQuoteById: async (id: number): Promise<ApiResponse<Quote>> => {
    try {
      const response = await api.get(`/quotes/${id}`);
      return { data: response.data, error: null };
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      return { 
        data: null, 
        error: axiosError.response?.data?.message || 'Erro ao buscar orçamento' 
      };
    }
  },

  createQuote: async (quoteData: Partial<Quote>): Promise<ApiResponse<Quote>> => {
    try {
      const response = await api.post('/quotes', quoteData);
      return { data: response.data, error: null };
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      return { 
        data: null, 
        error: axiosError.response?.data?.message || 'Erro ao criar orçamento' 
      };
    }
  },

  updateQuote: async (id: number, quoteData: Partial<Quote>): Promise<ApiResponse<Quote>> => {
    try {
      const response = await api.put(`/quotes/${id}`, quoteData);
      return { data: response.data, error: null };
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      return { 
        data: null, 
        error: axiosError.response?.data?.message || 'Erro ao atualizar orçamento' 
      };
    }
  },

  deleteQuote: async (id: number): Promise<ApiResponse<void>> => {
    try {
      await api.delete(`/quotes/${id}`);
      return { data: null, error: null };
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      return { 
        data: null, 
        error: axiosError.response?.data?.message || 'Erro ao deletar orçamento' 
      };
    }
  },
};

export default quoteService;

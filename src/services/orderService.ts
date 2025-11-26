import api from './api';
import { Order } from '@/types';

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

const orderService = {
  getOrders: async (search?: string): Promise<ApiResponse<Order[]>> => {
    try {
      const url = search ? `/orders?search=${encodeURIComponent(search)}` : '/orders';
      const response = await api.get(url);
      return { data: response.data, error: null };
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      return { 
        data: null, 
        error: axiosError.response?.data?.message || 'Erro ao buscar pedidos' 
      };
    }
  },

  getOrderById: async (id: number): Promise<ApiResponse<Order>> => {
    try {
      const response = await api.get(`/orders/${id}`);
      return { data: response.data, error: null };
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      return { 
        data: null, 
        error: axiosError.response?.data?.message || 'Erro ao buscar pedido' 
      };
    }
  },

  createOrder: async (orderData: Partial<Order>): Promise<ApiResponse<Order>> => {
    try {
      const response = await api.post('/orders', orderData);
      return { data: response.data, error: null };
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      return { 
        data: null, 
        error: axiosError.response?.data?.message || 'Erro ao criar pedido' 
      };
    }
  },

  updateOrder: async (id: number, orderData: Partial<Order>): Promise<ApiResponse<Order>> => {
    try {
      const response = await api.put(`/orders/${id}`, orderData);
      return { data: response.data, error: null };
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      return { 
        data: null, 
        error: axiosError.response?.data?.message || 'Erro ao atualizar pedido' 
      };
    }
  },

  deleteOrder: async (id: number): Promise<ApiResponse<void>> => {
    try {
      await api.delete(`/orders/${id}`);
      return { data: null, error: null };
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      return { 
        data: null, 
        error: axiosError.response?.data?.message || 'Erro ao deletar pedido' 
      };
    }
  },
};

export default orderService;

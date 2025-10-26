import { DashboardStats } from '../types';
import api from './api';

export interface DashboardResponse {
  data?: DashboardStats;
  error?: string;
}

class DashboardService {
  async getStats(): Promise<DashboardResponse> {
    try {
      const response = await api.get('/dashboard/stats');
      return { data: response.data };
    } catch (error: unknown) {
      console.error('Error fetching dashboard stats:', error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      return { error: axiosError.response?.data?.message || 'Failed to fetch dashboard stats' };
    }
  }
}

export default new DashboardService();
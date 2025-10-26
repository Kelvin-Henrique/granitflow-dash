import { Material } from '../types';
import api from './api';

export interface MaterialsResponse {
  data?: Material[];
  error?: string;
}

export interface MaterialResponse {
  data?: Material;
  error?: string;
}

class MaterialService {
  async getMaterials(search?: string): Promise<MaterialsResponse> {
    try {
      const params = search ? { search } : {};
      const response = await api.get('/materials', { params });
      return { data: response.data };
    } catch (error: unknown) {
      console.error('Error fetching materials:', error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      return { error: axiosError.response?.data?.message || 'Failed to fetch materials' };
    }
  }

  async getMaterial(id: number): Promise<MaterialResponse> {
    try {
      const response = await api.get(`/materials/${id}`);
      return { data: response.data };
    } catch (error: unknown) {
      console.error('Error fetching material:', error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      return { error: axiosError.response?.data?.message || 'Failed to fetch material' };
    }
  }

  async createMaterial(material: Omit<Material, 'id' | 'totalValue' | 'isLowStock'>): Promise<MaterialResponse> {
    try {
      const response = await api.post('/materials', material);
      return { data: response.data };
    } catch (error: unknown) {
      console.error('Error creating material:', error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      return { error: axiosError.response?.data?.message || 'Failed to create material' };
    }
  }

  async updateMaterial(id: number, material: Omit<Material, 'id' | 'totalValue' | 'isLowStock'>): Promise<MaterialResponse> {
    try {
      const response = await api.put(`/materials/${id}`, material);
      return { data: response.data };
    } catch (error: unknown) {
      console.error('Error updating material:', error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      return { error: axiosError.response?.data?.message || 'Failed to update material' };
    }
  }

  async deleteMaterial(id: number): Promise<{ error?: string }> {
    try {
      await api.delete(`/materials/${id}`);
      return {};
    } catch (error: unknown) {
      console.error('Error deleting material:', error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      return { error: axiosError.response?.data?.message || 'Failed to delete material' };
    }
  }
}

export default new MaterialService();
import { Customer, CustomerFormData } from '../types';
import api from './api';

export interface CustomersResponse {
  data?: Customer[];
  error?: string;
}

export interface CustomerResponse {
  data?: Customer;
  error?: string;
}

class CustomerService {
  async getCustomers(search?: string): Promise<CustomersResponse> {
    try {
      const params = search ? { search } : {};
      const response = await api.get('/customers', { params });
      return { data: response.data };
    } catch (error: unknown) {
      console.error('Error fetching customers:', error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      return { error: axiosError.response?.data?.message || 'Failed to fetch customers' };
    }
  }

  async getCustomer(id: number): Promise<CustomerResponse> {
    try {
      const response = await api.get(`/customers/${id}`);
      return { data: response.data };
    } catch (error: unknown) {
      console.error('Error fetching customer:', error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      return { error: axiosError.response?.data?.message || 'Failed to fetch customer' };
    }
  }

  async createCustomer(customer: CustomerFormData): Promise<CustomerResponse> {
    try {
      const response = await api.post('/customers', customer);
      return { data: response.data };
    } catch (error: unknown) {
      console.error('Error creating customer:', error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      return { error: axiosError.response?.data?.message || 'Failed to create customer' };
    }
  }

  async updateCustomer(id: number, customer: CustomerFormData): Promise<CustomerResponse> {
    try {
      const response = await api.put(`/customers/${id}`, customer);
      return { data: response.data };
    } catch (error: unknown) {
      console.error('Error updating customer:', error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      return { error: axiosError.response?.data?.message || 'Failed to update customer' };
    }
  }

  async deleteCustomer(id: number): Promise<{ error?: string }> {
    try {
      await api.delete(`/customers/${id}`);
      return {};
    } catch (error: unknown) {
      console.error('Error deleting customer:', error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      return { error: axiosError.response?.data?.message || 'Failed to delete customer' };
    }
  }
}

export default new CustomerService();
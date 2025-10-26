import { Project, ProjectFormData } from '../types';
import api from './api';

export interface ProjectsResponse {
  data?: Project[];
  error?: string;
}

export interface ProjectResponse {
  data?: Project;
  error?: string;
}

class ProjectService {
  async getProjects(search?: string): Promise<ProjectsResponse> {
    try {
      const params = search ? { search } : {};
      const response = await api.get('/projects', { params });
      return { data: response.data };
    } catch (error: unknown) {
      console.error('Error fetching projects:', error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      return { error: axiosError.response?.data?.message || 'Failed to fetch projects' };
    }
  }

  async getProject(id: number): Promise<ProjectResponse> {
    try {
      const response = await api.get(`/projects/${id}`);
      return { data: response.data };
    } catch (error: unknown) {
      console.error('Error fetching project:', error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      return { error: axiosError.response?.data?.message || 'Failed to fetch project' };
    }
  }

  async createProject(project: ProjectFormData): Promise<ProjectResponse> {
    try {
      const response = await api.post('/projects', project);
      return { data: response.data };
    } catch (error: unknown) {
      console.error('Error creating project:', error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      return { error: axiosError.response?.data?.message || 'Failed to create project' };
    }
  }

  async updateProject(id: number, project: ProjectFormData): Promise<ProjectResponse> {
    try {
      const response = await api.put(`/projects/${id}`, project);
      return { data: response.data };
    } catch (error: unknown) {
      console.error('Error updating project:', error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      return { error: axiosError.response?.data?.message || 'Failed to update project' };
    }
  }

  async deleteProject(id: number): Promise<{ error?: string }> {
    try {
      await api.delete(`/projects/${id}`);
      return {};
    } catch (error: unknown) {
      console.error('Error deleting project:', error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      return { error: axiosError.response?.data?.message || 'Failed to delete project' };
    }
  }
}

export default new ProjectService();
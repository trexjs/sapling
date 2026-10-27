import { apiClient } from "./client";
import type {
  PaginatedTaskResponse,
  Task,
  TaskFilters,
  TaskSummaryResponse,
} from "../types/task";

export const fetchTasks = async (filters: TaskFilters = {}): Promise<PaginatedTaskResponse> => {
  const response = await apiClient.get<PaginatedTaskResponse>('/tasks', {
    params: filters,
  });
  return response.data;
};

export const fetchTask = async (id: string): Promise<Task> => {
  const response = await apiClient.get<Task>(`/tasks/${id}`);
  return response.data;
};

export const createTask = async (payload: Partial<Task>): Promise<Task> => {
  const response = await apiClient.post<Task>('/tasks', payload);
  return response.data;
};

export const updateTask = async (id: string, payload: Partial<Task>): Promise<Task> => {
  const response = await apiClient.patch<Task>(`/tasks/${id}`, payload);
  return response.data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await apiClient.delete(`/tasks/${id}`);
};

export const toggleComplete = async (id: string): Promise<Task> => {
  const response = await apiClient.patch<Task>(`/tasks/${id}/complete`);
  return response.data;
};

export const toggleFavorite = async (id: string): Promise<Task> => {
  const response = await apiClient.patch<Task>(`/tasks/${id}/favorite`);
  return response.data;
};

export const duplicateTask = async (id: string): Promise<Task> => {
  const response = await apiClient.post<Task>(`/tasks/${id}/duplicate`);
  return response.data;
};

export const fetchTaskSummary = async (): Promise<TaskSummaryResponse> => {
  const response = await apiClient.get<TaskSummaryResponse>('/tasks/summary');
  return response.data;
};

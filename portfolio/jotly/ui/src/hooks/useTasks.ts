import { useMemo } from "react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  fetchTasks,
  fetchTaskSummary,
  createTask as createTaskApi,
  updateTask as updateTaskApi,
  deleteTask as deleteTaskApi,
  toggleComplete as toggleCompleteApi,
  toggleFavorite as toggleFavoriteApi,
  duplicateTask as duplicateTaskApi,
} from "../api/tasks";
import type { PaginatedTaskResponse, Task, TaskFilters } from "../types/task";

const TASKS_QUERY_KEY = "tasks";
const SUMMARY_QUERY_KEY = "task-summary";

export const useTasksQuery = (filters: TaskFilters) => {
  const queryKey = useMemo(() => [TASKS_QUERY_KEY, filters], [filters]);

  return useQuery<PaginatedTaskResponse>({
    queryKey,
    queryFn: () => fetchTasks(filters),
    placeholderData: keepPreviousData,
  });
};

export const useTaskSummaryQuery = () => {
  return useQuery({
    queryKey: [SUMMARY_QUERY_KEY],
    queryFn: fetchTaskSummary,
    staleTime: 1000 * 60,
  });
};

export const useTaskMutations = () => {
  const queryClient = useQueryClient();

  const invalidateTasks = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] }),
      queryClient.invalidateQueries({ queryKey: [SUMMARY_QUERY_KEY] }),
    ]);
  };

  const createTask = useMutation({
    mutationFn: (payload: Partial<Task>) => createTaskApi(payload),
    onSuccess: invalidateTasks,
  });

  const updateTask = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Task> }) =>
      updateTaskApi(id, payload),
    onSuccess: invalidateTasks,
  });

  const deleteTask = useMutation({
    mutationFn: (id: string) => deleteTaskApi(id),
    onSuccess: invalidateTasks,
  });

  const toggleComplete = useMutation({
    mutationFn: (id: string) => toggleCompleteApi(id),
    onSuccess: invalidateTasks,
  });

  const toggleFavorite = useMutation({
    mutationFn: (id: string) => toggleFavoriteApi(id),
    onSuccess: invalidateTasks,
  });

  const duplicateTask = useMutation({
    mutationFn: (id: string) => duplicateTaskApi(id),
    onSuccess: invalidateTasks,
  });

  return {
    createTask,
    updateTask,
    deleteTask,
    toggleComplete,
    toggleFavorite,
    duplicateTask,
  };
};

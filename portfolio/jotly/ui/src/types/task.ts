export interface Reminder {
  time: string;
  message?: string;
}

export interface Attachment {
  label?: string;
  url: string;
  type?: "file" | "image" | "video" | "link";
}

export interface RepeatConfig {
  pattern: "none" | "daily" | "weekly" | "monthly" | "yearly" | "custom";
  interval?: number;
  daysOfWeek?: number[];
  endsOn?: string | null;
}

export interface Subtask {
  title: string;
  isCompleted?: boolean;
  notes?: string;
  dueDate?: string | null;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  isFavorite: boolean;
  status: "pending" | "in-progress" | "completed";
  dueDate?: string | null;
  reminders?: Reminder[];
  repeat?: RepeatConfig;
  notes?: string;
  attachments?: Attachment[];
  subtasks?: Subtask[];
  isOverdue?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedTaskResponse {
  data: Task[];
  pagination: Pagination;
}

export interface TaskFilters {
  search?: string;
  status?: string;
  category?: string;
  isFavorite?: boolean;
  dueBefore?: string;
  dueAfter?: string;
  overdue?: boolean;
  reminderBefore?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

export interface TaskSummaryResponse {
  totals: {
    all: number;
    favorites: number;
    overdue: number;
    dueSoon: number;
  };
  statusBreakdown: Record<string, number>;
  categories: {
    category: string;
    count: number;
  }[];
}

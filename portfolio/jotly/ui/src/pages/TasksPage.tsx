import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { TaskFiltersPanel } from "../components/TaskFilters";
import { TaskList } from "../components/TaskList";
import { TaskSummary } from "../components/TaskSummary";
import { useTaskMutations, useTaskSummaryQuery, useTasksQuery } from "../hooks/useTasks";
import type { Task, TaskFilters } from "../types/task";

const DEFAULT_FILTERS: TaskFilters = {
  page: 1,
  limit: 10,
  sort: "-createdAt",
};

const getDateInputValue = (iso?: string | null) => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const tzOffset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - tzOffset * 60000);
  return local.toISOString().slice(0, 16);
};

const sanitizeNotes = (html: string) => {
  if (!html) return "";
  return html.replace(/<p><br><\/p>/g, "").trim();
};

interface TaskComposerProps {
  mode: "create" | "edit";
  initialTask?: Task | null;
  onSubmit: (payload: Partial<Task>) => Promise<void>;
  onCancel?: () => void;
  isSubmitting: boolean;
  view?: "page" | "modal";
}

const TaskComposer = ({ mode, initialTask, onSubmit, onCancel, isSubmitting, view = "page" }: TaskComposerProps) => {
  const isModal = view === "modal";
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [attachments, setAttachments] = useState<Array<{ label: string; url: string }>>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDueDate(getDateInputValue(initialTask.dueDate));
      setCategory(initialTask.category ?? "");
      setDescription(initialTask.description ?? "");
      setNotes(initialTask.notes ?? "");
      setAttachments(initialTask.attachments ?? []);
    } else if (mode === "create") {
      setTitle("");
      setDueDate("");
      setCategory("");
      setDescription("");
      setNotes("");
      setAttachments([]);
    }
  }, [initialTask, mode]);

  const handleAttachmentChange = (index: number, key: "label" | "url", value: string) => {
    setAttachments((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [key]: value };
      return next;
    });
  };

  const handleAddAttachment = () => {
    setAttachments((prev) => [...prev, { label: "", url: "" }]);
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Please provide a task title.");
      return;
    }

    try {
      const payload: Partial<Task> = {
        title: title.trim(),
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        category: category.trim() || undefined,
        description: description.trim() || undefined,
        attachments: attachments
          .map((item) => ({
            label: item.label.trim() || undefined,
            url: item.url.trim(),
          }))
          .filter((item) => item.url),
      };

      const cleanedNotes = sanitizeNotes(notes);
      payload.notes = cleanedNotes || undefined;

      await onSubmit(payload);

      if (mode === "create") {
        setTitle("");
        setDueDate("");
        setCategory("");
        setDescription("");
        setNotes("");
        setAttachments([]);
      } else {
        onCancel?.();
      }
    } catch (err) {
      const message = (err as Error)?.message ?? "Unable to save task.";
      setError(message);
    }
  };

  return (   
    <form onSubmit={handleSubmit}>
      <div className={`task-composer__header ${isModal ? "task-composer__header--modal" : ""}`}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <h3>{mode === "create" ? "New task" : "Update task"}</h3>         

          <div>
           <button
            type="submit"
            className={isModal ? "button--primary" : ""}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving…" : mode === "create" ? "Save task" : "Update task"}
          </button>
           <button type="button" className="button--ghost" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </button>
          </div>
        </div>
      </div>

      <section style={{marginTop:"24px"}} className="task-composer__section">
        {!isModal && (
          <header>
            <h4>Task overview</h4>
            <p>Give your task a clear title, timing, and category.</p>
          </header>
        )}
        <div className="task-composer__grid">
          <label className="task-composer__field">
            <span>Task title</span>
            <input
              id="task-title"
              name="title"
              placeholder="What do you need to get done?"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </label>

          <label className="task-composer__field">
            <span>Due date</span>
            <input
              id="task-due"
              type="datetime-local"
              name="dueDate"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
            />
          </label>

          <label className="task-composer__field">
            <span>Category</span>
            <input
              id="task-category"
              name="category"
              placeholder="Work, Personal, etc."
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            />
          </label>
        </div>
      </section>

      <section className="task-composer__section">
        {!isModal && (
          <header>
            <h4>Context</h4>
            <p>Share any background, links, or reminders that make this task actionable.</p>
          </header>
        )}
        <label className="task-composer__field task-composer__field--wide">
          <div className="task-composer__field-label">
            <span>Description</span>           
          </div>
          <textarea
            id="task-description"
            name="description"
            placeholder="Add context, links, or next steps"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>

        <div className="task-composer__notes">
          <div className="task-composer__field-label">
            <span>Notes</span>         
          </div>
          <ReactQuill theme="snow" value={notes} onChange={setNotes} placeholder="Write detailed notes…" />
        </div>
      </section>

      <section className="task-composer__section">
        {!isModal && (
          <header>
            <h4>Attachments</h4>
            <p>Attach quick links to specs, documents, or files you’ll need.</p>
          </header>
        )}
        <div className="task-composer__attachments">
          <div className="task-composer__attachments-header">
            <span>Links</span>
            <button type="button" className="button--ghost" onClick={handleAddAttachment}>
              Add link
            </button>
          </div>
          {attachments.length ? (
            <div className="task-composer__attachment-list">
              {attachments.map((attachment, index) => (
                <div key={`attachment-${index}`} className="task-composer__attachment-row">
                  <input
                    placeholder="Label"
                    value={attachment.label}
                    onChange={(event) => handleAttachmentChange(index, "label", event.target.value)}
                  />
                  <input
                    placeholder="https://"
                    value={attachment.url}
                    onChange={(event) => handleAttachmentChange(index, "url", event.target.value)}
                  />
                  <button
                    type="button"
                    className="button--ghost"
                    onClick={() => handleRemoveAttachment(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="task-composer__attachments-empty">No links yet — add one to keep everything in one place.</p>
          )}
        </div>
      </section>

      {error && <div className="task-composer__error">{error}</div>}
    </form>
  );
};

export const TasksPage = () => {
  const [filters, setFilters] = useState<TaskFilters>(DEFAULT_FILTERS);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);

  const { data: taskData, isLoading, isFetching, error } = useTasksQuery(filters);
  const { data: summaryData, isLoading: summaryLoading } = useTaskSummaryQuery();
  const { createTask, updateTask, toggleComplete, toggleFavorite, duplicateTask, deleteTask } = useTaskMutations();

  const categories = useMemo(() => summaryData?.categories?.map((item) => item.category) ?? [], [
    summaryData,
  ]);

  const tasks = taskData?.data ?? [];
  const pagination = taskData?.pagination;

  const mutationInFlight =
    createTask.isPending ||
    toggleComplete.isPending ||
    toggleFavorite.isPending ||
    duplicateTask.isPending ||
    deleteTask.isPending;

  const handleFilterChange = (nextFilters: TaskFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...nextFilters,
    }));
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const handleCreateTask = async (payload: Partial<Task>) => {
    await createTask.mutateAsync(payload);
    setIsCreateOpen(false);
  };

  const handleUpdateTask = async (taskId: string, payload: Partial<Task>) => {
    await updateTask.mutateAsync({ id: taskId, payload });
    setEditingTask(null);
  };

  const handleToggleComplete = (task: Task) => {
    toggleComplete.mutate(task._id);
  };

  const handleToggleFavorite = (task: Task) => {
    toggleFavorite.mutate(task._id);
  };

  const handleDuplicate = (task: Task) => {
    duplicateTask.mutate(task._id);
  };

  const handleDelete = (task: Task) => {
    deleteTask.mutate(task._id);
  };

  const handleStartEdit = (task: Task) => {
    setIsCreateOpen(false);
    setEditingTask(task);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  const handleOpenCreate = () => {
    setEditingTask(null);
    setIsCreateOpen(true);
  };

  const handleCloseCreate = () => {
    setIsCreateOpen(false);
  };

  const goToPage = (page: number) => {
    if (!pagination) return;
    const safePage = Math.max(1, Math.min(page, pagination.totalPages));
    setFilters((prev) => ({ ...prev, page: safePage }));
  };

  const activeFilters = useMemo(() => {
    const { page, limit, sort, ...rest } = filters;
    return Object.entries(rest).filter(([, value]) => Boolean(value)) as [string, string | number][];
  }, [filters]);

  return (
    <div className="tasks-page">
      <header className="tasks-hero card">
        <div className="tasks-hero__content">
          <div>
            <p className="tasks-hero__eyebrow">Workspace</p>
            <h1>Task Management</h1>
            <p>Plan, prioritize, and collaborate on everything you need to ship.</p>
          </div>
          <div className="tasks-hero__actions">
            <button type="button" className="button--ghost">
              Import tasks
            </button>
          </div>
        </div>
        <TaskSummary summary={summaryData} isLoading={summaryLoading} />
      </header>

      <section className="tasks-layout">
        <aside className="tasks-sidebar card">
          <div className="tasks-sidebar__section">
            <h3>Active filters</h3>
            {activeFilters.length ? (
              <ul className="tasks-active-filters">
                {activeFilters.map(([key, value]) => (
                  <li key={key}>
                    <span>{key}</span>
                    <strong>{String(value)}</strong>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="tasks-sidebar__empty">No filters currently applied.</p>
            )}
          </div>

          <div className="tasks-sidebar__section">
            <h3>Quick stats</h3>
            <ul className="tasks-sidebar__stats">
              <li>
                <span>Synced at</span>
                <strong>Just now</strong>
              </li>
              <li>
                <span>Page size</span>
                <strong>{filters.limit}</strong>
              </li>
            </ul>
          </div>

          <div className="tasks-sidebar__section">
            <h3>Filters</h3>
            <TaskFiltersPanel
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
              categories={categories}
            />
          </div>
        </aside>

        <main className="tasks-main">
          <div className="tasks-main__toolbar">
            <h2>Tasks</h2>
            <button type="button" onClick={handleOpenCreate} className="button--primary">
              New task
            </button>
          </div>

          {error && (
            <div className="tasks-main__alert">
              {(error as { message?: string })?.message ?? "Unable to load tasks. Please try again."}
            </div>
          )}

          <TaskList
            tasks={tasks}
            onToggleComplete={handleToggleComplete}
            onToggleFavorite={handleToggleFavorite}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
            onEdit={handleStartEdit}
            isMutating={mutationInFlight || isFetching}
          />

          {pagination && pagination.totalPages > 1 && (
            <div className="tasks-pagination">
              <button
                type="button"
                className="button--outline"
                onClick={() => goToPage((pagination?.page ?? 1) - 1)}
                disabled={(pagination?.page ?? 1) <= 1}
              >
                Previous
              </button>
              <span>
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                type="button"
                className="button--outline"
                onClick={() => goToPage((pagination?.page ?? 1) + 1)}
                disabled={(pagination?.page ?? 1) >= pagination.totalPages}
              >
                Next
              </button>
            </div>
          )}

          {isLoading && <div className="tasks-main__loading">Loading tasks…</div>}
        </main>
      </section>

      {(isCreateOpen || editingTask) && (
        <div className="tasks-modal" role="dialog" aria-modal="true">
          <div
            className="tasks-modal__backdrop"
            onClick={editingTask ? undefined : handleCloseCreate}
            aria-hidden="true"
          />
          <div className="tasks-modal__panel">          
            {isCreateOpen && !editingTask && (
              <TaskComposer
                mode="create"
                onSubmit={handleCreateTask}
                onCancel={handleCloseCreate}
                isSubmitting={createTask.isPending}
                view="modal"
              />
            )}
            {editingTask && (
              <TaskComposer
                mode="edit"
                initialTask={editingTask}
                onSubmit={(payload) => handleUpdateTask(editingTask._id, payload)}
                onCancel={handleCancelEdit}
                isSubmitting={updateTask.isPending}
                view="modal"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

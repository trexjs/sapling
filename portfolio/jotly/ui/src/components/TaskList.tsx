import { format, isPast, isToday } from "date-fns";
import type { Task } from "../types/task";

interface TaskListProps {
  tasks?: Task[];
  onToggleComplete: (task: Task) => void;
  onToggleFavorite: (task: Task) => void;
  onDuplicate: (task: Task) => void;
  onDelete: (task: Task) => void;
  onEdit: (task: Task) => void;
  isMutating?: boolean;
}

const statusLabelMap: Record<Task["status"], string> = {
  pending: "Pending",
  "in-progress": "In Progress",
  completed: "Completed",
};

const formatDate = (value?: string | null) => {
  if (!value) return "No due date";
  try {
    const date = new Date(value);
    const label = format(date, "PPp");
    if (isToday(date)) {
      return `${label} (Today)`;
    }
    if (isPast(date)) {
      return `${label} (Overdue)`;
    }
    return label;
  } catch (error) {
    return value;
  }
};

const getRepeatLabel = (task: Task) => {
  const pattern = task.repeat?.pattern ?? "none";
  if (pattern === "none") return "Does not repeat";
  if (pattern === "custom" && task.repeat?.interval) {
    return `Repeats every ${task.repeat.interval} days`;
  }
  return `Repeats ${pattern}`;
};

export const TaskList = ({
  tasks,
  onToggleComplete,
  onToggleFavorite,
  onDuplicate,
  onDelete,
  onEdit,
  isMutating,
}: TaskListProps) => {
  if (!tasks?.length) {
    return <div className="empty-state">No tasks match the filters yet.</div>;
  }

  return (
    <div className="task-list">
      {tasks.map((task) => {
        const overdue = Boolean(task.isOverdue || (task.dueDate && isPast(new Date(task.dueDate))));
        return (
          <article key={task._id} className="task-card">
            <header className="task-card__header">
              <div>
                <h3 className="task-card__title">
                  {task.title}
                  {task.isFavorite && <span className="badge badge--favorite">★ Favourite</span>}
                </h3>
                <div className="task-card__meta">
                  <span className="badge badge--status">{statusLabelMap[task.status]}</span>
                  {task.category && <span className="badge">📁 {task.category}</span>}
                  {task.dueDate && (
                    <span className={"badge" + (overdue ? " badge--overdue" : "")}>🗓️ {formatDate(task.dueDate)}</span>
                  )}
                </div>
              </div>
              <div className="task-actions">
                <button
                  type="button"
                  className="button--outline"
                  onClick={() => onToggleComplete(task)}
                  disabled={isMutating}
                >
                  {task.status === "completed" ? "Mark Pending" : "Mark Done"}
                </button>
                <button
                  type="button"
                  className="button--ghost"
                  onClick={() => onToggleFavorite(task)}
                  disabled={isMutating}
                >
                  {task.isFavorite ? "Unfavourite" : "Favourite"}
                </button>
                <button
                  type="button"
                  className="button--ghost"
                  onClick={() => onEdit(task)}
                  disabled={isMutating}
                >
                  Edit
                </button>
                <button type="button" onClick={() => onDuplicate(task)} disabled={isMutating}>
                  Duplicate
                </button>
                <button
                  type="button"
                  className="button--danger"
                  onClick={() => onDelete(task)}
                  disabled={isMutating}
                >
                  Delete
                </button>
              </div>
            </header>

            {task.description && <p className="task-card__description">{task.description}</p>}

            <div className="task-card__meta">
              <span className="badge">🔁 {getRepeatLabel(task)}</span>
            </div>

            {task.subtasks && task.subtasks.length > 0 && (
              <section>
                <h4>Subtasks</h4>
                <div className="subtask-list">
                  {task.subtasks.map((subtask, index) => (
                    <div key={`${task._id}-subtask-${index}`} className="subtask-item">
                      <input type="checkbox" checked={Boolean(subtask.isCompleted)} readOnly />
                      <span>{subtask.title}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {task.attachments && task.attachments.length > 0 && (
              <section className="attachments">
                <h4>Attachments</h4>
                {task.attachments.map((attachment, index) => (
                  <a
                    key={`${task._id}-attachment-${index}`}
                    href={attachment.url}
                    target="_blank"
                    rel="noreferrer"
                    className="attachment-link"
                  >
                    🔗 {attachment.label ?? attachment.url}
                  </a>
                ))}
              </section>
            )}

            {task.notes && (
              <section className="task-notes">
                <h4>Notes</h4>
                <div
                  className="task-notes__content"
                  dangerouslySetInnerHTML={{ __html: task.notes }}
                />
              </section>
            )}

            {task.reminders && task.reminders.length > 0 && (
              <section>
                <h4>Reminders</h4>
                <ul>
                  {task.reminders.map((reminder, index) => (
                    <li key={`${task._id}-reminder-${index}`}>
                      ⏰ {formatDate(reminder.time)} {reminder.message ? `— ${reminder.message}` : ""}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </article>
        );
      })}
    </div>
  );
};

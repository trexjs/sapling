import { useMemo } from "react";
import type { TaskFilters } from "../types/task";

interface TaskFiltersProps {
  filters: TaskFilters;
  onChange: (filters: TaskFilters) => void;
  onReset: () => void;
  categories?: string[];
}

const statusOptions = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "in-progress", label: "In progress" },
  { value: "completed", label: "Completed" },
];

const sortOptions = [
  { value: "-createdAt", label: "Newest first" },
  { value: "createdAt", label: "Oldest first" },
  { value: "-dueDate", label: "Due date (soonest)" },
  { value: "dueDate", label: "Due date (latest)" },
  { value: "title", label: "Title A-Z" },
];

export const TaskFiltersPanel = ({ filters, onChange, onReset, categories }: TaskFiltersProps) => {
  const categoryOptions = useMemo(() => {
    const set = new Set<string>();
    if (filters.category) {
      set.add(filters.category);
    }
    categories?.forEach((item) => {
      if (item) set.add(item);
    });
    return Array.from(set);
  }, [categories, filters.category]);

  const handleChange = <K extends keyof TaskFilters>(key: K, value: TaskFilters[K] | undefined) => {
    onChange({
      ...filters,
      [key]: value,
      page: 1,
    });
  };

  return (
    <section className="tasks-filters">
      <header className="tasks-filters__header">
        <div>
          <p>Refine results</p>
          <h4>Filter tasks</h4>
        </div>
        <button type="button" className="button--ghost" onClick={onReset}>
          Reset
        </button>
      </header>

      <div className="tasks-filters__search">
        <input
          type="search"
          placeholder="Search title, description, notes…"
          value={filters.search ?? ""}
          onChange={(event) => handleChange("search", event.target.value || undefined)}
        />
      </div>

      <div className="tasks-filters__quick">
        <div className="tasks-filters__group">
          <span>Status</span>
          <div className="tasks-filters__chips">
            {statusOptions.map((option) => {
              const isActive = (filters.status ?? "") === option.value;
              return (
                <button
                  key={option.value || "all"}
                  type="button"
                  className={`tasks-chip${isActive ? " tasks-chip--active" : ""}`}
                  onClick={() => handleChange("status", option.value || undefined)}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="tasks-filters__group">
          <span>Quick toggles</span>
          <div className="tasks-filters__chips">
            <button
              type="button"
              className={`tasks-chip${filters.isFavorite ? " tasks-chip--active" : ""}`}
              onClick={() => handleChange("isFavorite", filters.isFavorite ? undefined : true)}
            >
              Favourites
            </button>
            <button
              type="button"
              className={`tasks-chip${filters.overdue ? " tasks-chip--active" : ""}`}
              onClick={() => handleChange("overdue", filters.overdue ? undefined : true)}
            >
              Overdue
            </button>
          </div>
        </div>
      </div>

      <div className="tasks-filters__grid">
        <label className="tasks-filter-field">
          <span>Category</span>
          <input
            list="task-category-options"
            placeholder="Select or type category"
            value={filters.category ?? ""}
            onChange={(event) => handleChange("category", event.target.value || undefined)}
          />
          <datalist id="task-category-options">
            {categoryOptions.map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>
        </label>

        <label className="tasks-filter-field">
          <span>Due after</span>
          <input
            type="date"
            value={filters.dueAfter ?? ""}
            onChange={(event) => handleChange("dueAfter", event.target.value || undefined)}
          />
        </label>

        <label className="tasks-filter-field">
          <span>Due before</span>
          <input
            type="date"
            value={filters.dueBefore ?? ""}
            onChange={(event) => handleChange("dueBefore", event.target.value || undefined)}
          />
        </label>

        <label className="tasks-filter-field">
          <span>Reminder before</span>
          <input
            type="datetime-local"
            value={filters.reminderBefore ?? ""}
            onChange={(event) => handleChange("reminderBefore", event.target.value || undefined)}
          />
        </label>

        <label className="tasks-filter-field">
          <span>Sort</span>
          <select
            value={filters.sort ?? "-createdAt"}
            onChange={(event) => handleChange("sort", event.target.value || undefined)}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
};

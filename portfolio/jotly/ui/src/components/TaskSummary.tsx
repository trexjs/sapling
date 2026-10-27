import type { TaskSummaryResponse } from "../types/task";

interface TaskSummaryProps {
  summary?: TaskSummaryResponse;
  isLoading?: boolean;
}

const summaryItems = [
  { key: "all", label: "Total Tasks" },
  { key: "favorites", label: "Favourites" },
  { key: "overdue", label: "Overdue" },
  { key: "dueSoon", label: "Due in 7 Days" },
] as const;

export const TaskSummary = ({ summary, isLoading }: TaskSummaryProps) => {
  return (
    <section className="task-summary">
      {summaryItems.map(({ key, label }) => (
        <article className="task-summary__card" key={key}>
          <span className="task-summary__label">{label}</span>
          <strong className="task-summary__value">
            {isLoading ? "…" : summary?.totals?.[key] ?? 0}
          </strong>
        </article>
      ))}
    </section>
  );
};

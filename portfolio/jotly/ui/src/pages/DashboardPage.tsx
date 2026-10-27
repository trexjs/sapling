import { useMemo } from "react";
import { addDays, format, parseISO } from "date-fns";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { TaskSummary } from "../components/TaskSummary";
import { useTaskSummaryQuery, useTasksQuery } from "../hooks/useTasks";
import type { Task } from "../types/task";

const STATUS_COLORS: Record<string, string> = {
  pending: "#f97316",
  "in-progress": "#4f46e5",
  completed: "#16a34a",
  unspecified: "#64748b",
};

const CATEGORY_COLORS = [
  "#6366f1",
  "#ef4444",
  "#10b981",
  "#fbbf24",
  "#0ea5e9",
];

const UpcomingTasks = ({ tasks }: { tasks: Task[] }) => {
  if (!tasks.length) {
    return <div className="empty-state">No upcoming tasks for the next 7 days.</div>;
  }

  return (
    <ul className="dashboard-upcoming__list">
      {tasks.map((task) => (
        <li key={task._id} className="dashboard-upcoming__item">
          <div className="dashboard-upcoming__meta">
            <span className={`dashboard-upcoming__status dashboard-upcoming__status--${task.status}`}>
              {task.status}
            </span>
            {task.category && <span className="dashboard-upcoming__chip">📁 {task.category}</span>}
          </div>
          <div className="dashboard-upcoming__content">
            <h3>{task.title}</h3>
            {task.description && <p>{task.description}</p>}
          </div>
          <div className="dashboard-upcoming__date">
            <span>{task.dueDate ? format(parseISO(task.dueDate), "EEE, MMM d") : "No due date"}</span>
            {task.dueDate && <small>{format(parseISO(task.dueDate), "p")}</small>}
          </div>
        </li>
      ))}
    </ul>
  );
};

export const DashboardPage = () => {
  const { data: summary, isLoading: summaryLoading } = useTaskSummaryQuery();

  const upcomingFilters = useMemo(() => {
    const now = new Date();
    const inSevenDays = addDays(now, 7);
    return {
      page: 1,
      limit: 10,
      sort: "dueDate",
      dueAfter: now.toISOString(),
      dueBefore: inSevenDays.toISOString(),
      status: undefined,
    };
  }, []);

  const { data: upcomingTasksData, isLoading: upcomingLoading } = useTasksQuery(upcomingFilters);
  const upcomingTasks = upcomingTasksData?.data ?? [];

  const statusData = useMemo(() => {
    if (!summary) return [];
    return Object.entries(summary.statusBreakdown ?? {}).map(([status, count]) => ({
      name: status,
      value: count,
      fill: STATUS_COLORS[status] ?? STATUS_COLORS.unspecified,
    }));
  }, [summary]);

  const categoryData = useMemo(() => {
    if (!summary?.categories) return [];
    return summary.categories.slice(0, 5).map((item, index) => ({
      name: item.category,
      count: item.count,
      fill: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
    }));
  }, [summary]);

  return (
    <div className="dashboard-page">
      <header className="dashboard-hero card">
        <div>
          <p>Insights</p>
          <h1>Welcome back</h1>
          <p>Track progress, spot trends, and plan your next move with a snapshot of your workspace.</p>
        </div>
        <div className="dashboard-hero__meta">
          <div>
            <span>Total tasks</span>
            <strong>{summary?.totals?.all ?? 0}</strong>
          </div>
          <div>
            <span>Active this week</span>
            <strong>{upcomingTasks.length}</strong>
          </div>
        </div>
      </header>

      <TaskSummary summary={summary} isLoading={summaryLoading} />

      <section className="dashboard-insights">
        <article className="dashboard-card">
          <header>
            <h2>Status distribution</h2>
            <p>Understand how work is progressing across states.</p>
          </header>
          {statusData.length ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie dataKey="value" data={statusData} innerRadius={70} outerRadius={110} paddingAngle={4}>
                  {statusData.map((entry, index) => (
                    <Cell key={`status-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number, name: string) => [value, name]} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state">Not enough data yet.</div>
          )}
        </article>

        <article className="dashboard-card">
          <header>
            <h2>Top categories</h2>
            <p>See where time and effort are focused.</p>
          </header>
          {categoryData.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={categoryData}>
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 12 }} width={32} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-15} textAnchor="end" axisLine={false} tickLine={false} />
                <Tooltip formatter={(value: number) => [`${value} tasks`, "Tasks"]} />
                <Bar dataKey="count" radius={[8, 8, 8, 8]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`category-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state">Categorise tasks to unlock insights.</div>
          )}
        </article>
      </section>

      <section className="dashboard-card dashboard-upcoming">
        <header>
          <div>
            <h2>Upcoming week</h2>
            <p>Tasks due within the next 7 days.</p>
          </div>
        </header>
        {upcomingLoading ? <div className="empty-state">Loading upcoming tasks…</div> : <UpcomingTasks tasks={upcomingTasks} />}
      </section>
    </div>
  );
};

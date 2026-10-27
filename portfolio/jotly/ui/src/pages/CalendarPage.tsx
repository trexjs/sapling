import { useMemo, useState } from "react";
import type { MouseEvent } from "react";
import {
  addMonths,
  addWeeks,
  endOfDay,
  eachDayOfInterval,
  eachMonthOfInterval,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";

import { useTasksQuery } from "../hooks/useTasks";
import type { Task } from "../types/task";

const eventPalette = ["#2563eb", "#9333ea", "#059669", "#f97316", "#ec4899", "#0ea5e9"];

const getDayKey = (date: Date) => format(date, "yyyy-MM-dd");

type CalendarView = "month" | "week" | "today" | "year";

export const CalendarPage = () => {
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(new Date()));
  const [activeDay, setActiveDay] = useState<Date>(() => startOfDay(new Date()));
  const [view, setView] = useState<CalendarView>("month");

  const monthStart = useMemo(() => startOfMonth(currentMonth), [currentMonth]);
  const monthEnd = useMemo(() => endOfMonth(monthStart), [monthStart]);

  const { rangeStart, rangeEnd } = useMemo(() => {
    if (view === "today") {
      const day = startOfDay(activeDay);
      return {
        rangeStart: startOfDay(day),
        rangeEnd: endOfDay(day),
      };
    }

    if (view === "week") {
      const weekStart = startOfWeek(activeDay, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(activeDay, { weekStartsOn: 1 });
      return {
        rangeStart: startOfDay(weekStart),
        rangeEnd: endOfDay(weekEnd),
      };
    }

    if (view === "year") {
      const yearStart = startOfYear(currentMonth);
      const yearEnd = endOfYear(currentMonth);
      return {
        rangeStart: startOfDay(startOfWeek(yearStart, { weekStartsOn: 1 })),
        rangeEnd: endOfDay(endOfWeek(yearEnd, { weekStartsOn: 1 })),
      };
    }

    return {
      rangeStart: startOfWeek(monthStart, { weekStartsOn: 1 }),
      rangeEnd: endOfWeek(monthEnd, { weekStartsOn: 1 }),
    };
  }, [activeDay, currentMonth, monthEnd, monthStart, view]);

  const calendarDays = useMemo(() => {
    if (view === "year") {
      return eachMonthOfInterval({ start: startOfYear(currentMonth), end: endOfYear(currentMonth) });
    }

    return eachDayOfInterval({ start: rangeStart, end: rangeEnd });
  }, [currentMonth, rangeEnd, rangeStart, view]);

  const filters = useMemo(
    () => ({
      page: 1,
      limit: 200,
      sort: "dueDate",
      dueAfter: startOfDay(rangeStart).toISOString(),
      dueBefore: endOfDay(rangeEnd).toISOString(),
    }),
    [rangeStart, rangeEnd]
  );

  const { data, isLoading, isFetching } = useTasksQuery(filters);

  const tasksByDate = useMemo(() => {
    const mapping = new Map<string, Task[]>();
    const tasks = data?.data ?? [];

    tasks
      .filter((task): task is Task & { dueDate: string } => Boolean(task.dueDate))
      .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
      .forEach((task) => {
        const key = getDayKey(parseISO(task.dueDate!));
        const list = mapping.get(key) ?? [];
        list.push(task);
        mapping.set(key, list);
      });

    return mapping;
  }, [data]);

  const selectedDayKey = getDayKey(activeDay);
  const selectedDayTasks = tasksByDate.get(selectedDayKey) ?? [];

  const handleSelectDay = (date: Date) => {
    setActiveDay(startOfDay(date));
    if (view === "year") {
      setView("month");
      setCurrentMonth(startOfMonth(date));
    }
  };

  const handleToday = () => {
    const today = startOfDay(new Date());
    setCurrentMonth(startOfMonth(today));
    setActiveDay(today);
    if (view !== "today") {
      setView("today");
    }
  };

  const changeMonth = (delta: number) => {
    if (view === "week") {
      setActiveDay((prev) => startOfDay(addWeeks(prev, delta)));
      setCurrentMonth((prev) => startOfMonth(addWeeks(prev, delta)));
      return;
    }

    if (view === "today") {
      const nextDay = startOfDay(addWeeks(activeDay, delta));
      setActiveDay(nextDay);
      setCurrentMonth(startOfMonth(nextDay));
      return;
    }

    if (view === "year") {
      setCurrentMonth((prev) => startOfYear(addMonths(prev, delta * 12)));
      return;
    }

    setCurrentMonth((prev) => {
      const nextMonth = addMonths(prev, delta);
      const nextActive = startOfDay(nextMonth);
      setActiveDay(nextActive);
      return nextMonth;
    });
  };

  const handleViewChange = (nextView: CalendarView) => {
    setView(nextView);

    if (nextView === "month") {
      setCurrentMonth(startOfMonth(activeDay));
    }

    if (nextView === "today") {
      handleToday();
    }

    if (nextView === "week") {
      setCurrentMonth(startOfMonth(activeDay));
    }

    if (nextView === "year") {
      setCurrentMonth(startOfYear(activeDay));
    }
  };

  return (
    <div className="calendar-page">
      <div className="calendar-toolbar card">
        <div className="calendar-toolbar__left">
          <h1>Calendar</h1>
          <span>{format(monthStart, "MMMM yyyy")}</span>
        </div>
        <div className="calendar-toolbar__right">
          <div className="calendar-view-toggle">
            {([
              ["today", "Today"],
              ["week", "Week"],
              ["month", "Month"],
              ["year", "Year"],
            ] as [CalendarView, string][]).map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={`calendar-view-toggle__btn${view === value ? " calendar-view-toggle__btn--active" : ""}`}
                onClick={() => handleViewChange(value)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="calendar-toolbar__nav">
            <button
              type="button"
              className="calendar-icon-button"
              onClick={() => changeMonth(-1)}
              aria-label="Previous month"
            >
              ‹
            </button>
            <button
              type="button"
              className="calendar-icon-button"
              onClick={() => changeMonth(1)}
              aria-label="Next month"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      <div className="calendar-layout">
        <section className="calendar-board card">
          {view === "year" ? (
            <div className="calendar-year-grid">
              {calendarDays.map((monthDate) => {
                const key = format(monthDate, "yyyy-MM");
                const monthLabel = format(monthDate, "MMM");
                const monthStartDate = startOfMonth(monthDate);
                const monthEndDate = endOfMonth(monthDate);
                const monthDays = eachDayOfInterval({
                  start: startOfWeek(monthStartDate, { weekStartsOn: 1 }),
                  end: endOfWeek(monthEndDate, { weekStartsOn: 1 }),
                });

                return (
                  <div key={key} className="calendar-year-card">
                    <header>
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentMonth(monthStartDate);
                          setView("month");
                        }}
                      >
                        {monthLabel}
                      </button>
                    </header>
                    <div className="calendar-weekdays-row calendar-weekdays-row--compact">
                      {["M", "T", "W", "T", "F", "S", "S"].map((label) => (
                        <span key={`year-weekday-${label}`}>{label}</span>
                      ))}
                    </div>
                    <div className="calendar-month-grid calendar-month-grid--compact">
                      {monthDays.map((date) => {
                        const dayKey = getDayKey(date);
                        const tasksForDay = tasksByDate.get(dayKey) ?? [];
                        const isMuted = !isSameMonth(date, monthDate);
                        const isActive = isSameDay(date, activeDay);
                        const isDayToday = isToday(date);

                        return (
                          <button
                            key={`${key}-${dayKey}`}
                            type="button"
                            className={
                              [
                                "calendar-day-mini",
                                isMuted ? "calendar-day-mini--muted" : undefined,
                                isActive ? "calendar-day-mini--active" : undefined,
                                isDayToday ? "calendar-day-mini--today" : undefined,
                              ]
                                .filter(Boolean)
                                .join(" ")
                            }
                            onClick={() => handleSelectDay(date)}
                          >
                            <span className="calendar-day-mini__number">{format(date, "d")}</span>
                            {tasksForDay.length > 0 && <span className="calendar-day-mini__dot" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <>
              <div className="calendar-weekdays-row">
                {calendarDays.slice(0, view === "week" || view === "today" ? calendarDays.length : 7).map((date) => (
                  <div key={`weekday-${getDayKey(date)}`} className="calendar-weekday">
                    <span className="calendar-weekday__label">{format(date, view === "today" ? "EEEE" : "EEE")}</span>
                    <span className="calendar-weekday__date">{format(date, "d")}</span>
                  </div>
                ))}
              </div>

              <div className={`calendar-month-grid${view === "week" || view === "today" ? " calendar-month-grid--single" : ""}`}>
                {calendarDays.map((date) => {
                  const key = getDayKey(date);
                  const tasksForDay = tasksByDate.get(key) ?? [];
                  const isMuted = view === "month" ? !isSameMonth(date, monthStart) : false;
                  const isSelected = selectedDayKey === key;
                  const isActiveToday = isToday(date);

                  return (
                    <button
                      key={key}
                      type="button"
                      className={
                        [
                          "calendar-day",
                          isMuted ? "calendar-day--muted" : undefined,
                          isSelected ? "calendar-day--active" : undefined,
                          isActiveToday ? "calendar-day--today" : undefined,
                        ]
                          .filter(Boolean)
                          .join(" ")
                      }
                      onClick={(event: MouseEvent<HTMLButtonElement>) => {
                        event.preventDefault();
                        handleSelectDay(date);
                      }}
                    >
                      <div className="calendar-day__header">
                        <span className="calendar-day__number">{format(date, "d")}</span>
                      </div>
                      <div className="calendar-day__events">
                        {tasksForDay.slice(0, 4).map((task, index) => (
                          <span
                            key={task._id}
                            className="calendar-event"
                            style={{
                              backgroundColor: `${eventPalette[index % eventPalette.length]}1a`,
                              borderLeftColor: eventPalette[index % eventPalette.length],
                              color: eventPalette[index % eventPalette.length],
                            }}
                          >
                            {task.title}
                          </span>
                        ))}
                        {tasksForDay.length > 4 && (
                          <span className="calendar-event calendar-event--more">
                            +{tasksForDay.length - 4} more
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </section>

        <aside className="calendar-sidebar card">
          <header className="calendar-sidebar__header">
            <span className="calendar-sidebar__date">{format(parseISO(selectedDayKey), "EEEE, MMMM d")}</span>
            <span className="calendar-sidebar__meta">
              {selectedDayTasks.length ? `${selectedDayTasks.length} task${selectedDayTasks.length > 1 ? "s" : ""}` : "No tasks"}
            </span>
          </header>

          {isLoading || isFetching ? (
            <div className="empty-state">Loading calendar data…</div>
          ) : selectedDayTasks.length ? (
            <div className="calendar-sidebar__content">
              {selectedDayTasks.map((task, index) => (
                <article key={task._id} className="calendar-task-card">
                  <div className="calendar-task-card__indicator" style={{ backgroundColor: eventPalette[index % eventPalette.length] }} />
                  <div className="calendar-task-card__body">
                    <div className="calendar-task-card__title-row">
                      <h3>{task.title}</h3>
                      <span className="calendar-task-card__status" data-status={task.status}>
                        {task.status.replace("-", " ")}
                      </span>
                    </div>
                    {task.description && <p className="calendar-task-card__description">{task.description}</p>}
                    <div className="calendar-task-card__meta">
                      {task.category && (
                        <span className="calendar-task-card__chip calendar-task-card__chip--category">
                          📁 {task.category}
                        </span>
                      )}
                      {task.notes && (
                        <span className="calendar-task-card__chip">📝 Notes available</span>
                      )}
                      {task.repeat && task.repeat.pattern && task.repeat.pattern !== "none" && (
                        <span className="calendar-task-card__chip">🔁 {task.repeat.pattern}</span>
                      )}
                    </div>
                    {!!task.subtasks?.length && (
                      <div className="calendar-task-card__subtasks">
                        <span className="calendar-task-card__chip">
                          ✅ {task.subtasks.filter((item) => item.isCompleted).length}/{task.subtasks.length} subtasks
                        </span>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">No tasks scheduled for this day.</div>
          )}
        </aside>
      </div>
    </div>
  );
};

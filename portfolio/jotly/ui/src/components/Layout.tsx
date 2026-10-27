import { NavLink } from "react-router-dom";
import type { PropsWithChildren } from "react";

const navItems = [
  {
    to: "/tasks",
    label: "Tasks",
    description: "Organize and manage tasks",
    icon: "✅",
  },
  {
    to: "/calendar",
    label: "Calendar",
    description: "Visualize deadlines",
    icon: "🗓️",
  },
  {
    to: "/dashboard",
    label: "Dashboard",
    description: "Track productivity insights",
    icon: "📊",
  },
];

export const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="sidebar__brand">
          <div className="sidebar__logo" aria-hidden>🗒️</div>
          <div>
            <h1 className="sidebar__title">Task Master</h1>
            <p className="sidebar__subtitle">Focus. Organize. Deliver.</p>
          </div>
        </div>

        <nav className="sidebar__nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  "sidebar__link",
                  isActive ? "sidebar__link--active" : undefined,
                ]
                  .filter(Boolean)
                  .join(" ")
              }
            >
              <span className="sidebar__link-icon" aria-hidden>
                {item.icon}
              </span>
              <span>
                <span className="sidebar__link-label">{item.label}</span>
                <span className="sidebar__link-description">{item.description}</span>
              </span>
            </NavLink>
          ))}
        </nav>

        <footer className="sidebar__footer">
          <p>Stay ahead of your schedule with Task Master.</p>
        </footer>
      </aside>

      <main className="app-main">{children}</main>
    </div>
  );
};

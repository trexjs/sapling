import { NavLink } from 'react-router-dom';
import { useState } from 'react';

import { Breadcrumbs } from '../navigation/Breadcrumbs.jsx';

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/courses', label: 'Courses' },
];

const linkClass = ({ isActive }) =>
  `block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
    isActive ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-100 hover:text-primary-600'
  }`;

export const AppLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } hidden border-r border-slate-200 bg-white transition-all duration-300 md:block`}
      >
        <div className="flex h-16 items-center justify-center border-b border-slate-200 px-4">
          <span className="text-lg font-semibold text-primary-600">LMS Admin</span>
        </div>
        <nav className="space-y-1 px-4 py-6">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass} end={item.to === '/'}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition hover:bg-slate-100 md:hidden"
              onClick={() => setIsSidebarOpen((prev) => !prev)}
            >
              <span className="sr-only">Toggle navigation</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-slate-900">Learning Management System</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
                SA
              </span>
              <div className="hidden text-right md:block">
                <p className="text-sm font-medium text-slate-700">Super Admin</p>
                <p className="text-xs text-slate-500">admin@lms.com</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="mx-auto max-w-6xl space-y-6">
            <Breadcrumbs />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

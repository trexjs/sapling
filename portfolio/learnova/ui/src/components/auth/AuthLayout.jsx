import { NavLink } from 'react-router-dom';

export const AuthLayout = ({ title, subtitle, children, footer }) => {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="hidden w-1/2 flex-col justify-center bg-primary-600 px-12 text-white lg:flex">
        <div className="max-w-xl space-y-6">
          <h1 className="text-4xl font-semibold">Learning Management System</h1>
          <p className="text-lg text-primary-100">
            Create and manage courses, track students, and share knowledge effectively with a modern MERN-based
            platform.
          </p>
          <div className="space-x-4">
            <NavLink to="/" className="text-sm font-semibold text-white/80 hover:text-white">
              Back to dashboard
            </NavLink>
          </div>
        </div>
      </aside>

      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
            {subtitle ? <p className="text-sm text-slate-500">{subtitle}</p> : null}
          </div>

          <div className="mt-8 space-y-6">
            {children}
            {footer ? <div className="text-center text-sm text-slate-500">{footer}</div> : null}
          </div>
        </div>
      </main>
    </div>
  );
};

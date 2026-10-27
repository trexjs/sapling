import { Fragment } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';

const LABEL_MAP = {
  '': 'Dashboard',
  courses: 'Courses',
  new: 'Create course',
  edit: 'Edit course',
};

const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1);

export const Breadcrumbs = ({ overrides = {} }) => {
  const location = useLocation();
  const params = useParams();

  const segments = location.pathname.split('/').filter(Boolean);

  const items = segments.map((segment, index) => {
    const path = `/${segments.slice(0, index + 1).join('/')}`;
    const isLast = index === segments.length - 1;
    const paramMatch = Object.entries(params).find(([, value]) => value === segment);

    let label = overrides[segment] || overrides[path];
    if (!label) {
      if (paramMatch) {
        const [paramKey] = paramMatch;
        const readable = overrides[paramKey] || overrides[paramMatch[1]];
        label = readable || LABEL_MAP[paramKey] || LABEL_MAP[segment] || capitalize(segment.replace(/[-_]/g, ' '));
      } else {
        label = LABEL_MAP[segment] || capitalize(segment.replace(/[-_]/g, ' '));
      }
    }

    return {
      label,
      path,
      isLast,
    };
  });

  if (!items.length) {
    return (
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex items-center gap-2 text-sm text-slate-500">
          <li className="flex items-center gap-2">
            <span className="font-medium text-slate-700">Dashboard</span>
          </li>
        </ol>
      </nav>
    );
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <li>
          <Link to="/" className="font-medium text-slate-600 transition hover:text-primary-600">
            Dashboard
          </Link>
        </li>
        {items.map((item) => (
          <Fragment key={item.path}>
            <li aria-hidden className="text-slate-400">/</li>
            <li>
              {item.isLast ? (
                <span className="font-semibold text-slate-700">{item.label}</span>
              ) : (
                <Link to={item.path} className="font-medium text-slate-600 transition hover:text-primary-600">
                  {item.label}
                </Link>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
};

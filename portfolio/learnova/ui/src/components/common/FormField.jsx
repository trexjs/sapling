export const inputClasses =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100';

export const FormField = ({ label, description, error, required, children }) => {
  return (
    <label className="flex flex-col gap-1">
      {label && (
        <span className="text-sm font-semibold text-slate-700">
          {label}
          {required ? <span className="ml-1 text-rose-500">*</span> : null}
        </span>
      )}
      {children}
      {description ? <span className="text-xs text-slate-500">{description}</span> : null}
      {error ? <span className="text-xs text-rose-500">{error}</span> : null}
    </label>
  );
};

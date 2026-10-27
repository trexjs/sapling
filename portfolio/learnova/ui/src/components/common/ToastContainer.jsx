import { useToast } from '../../context/ToastContext.jsx';

const TYPE_STYLES = {
  info: 'bg-primary-600 text-white',
  success: 'bg-emerald-600 text-white',
  error: 'bg-rose-600 text-white',
  warning: 'bg-amber-500 text-slate-900',
};

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (!toasts.length) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center justify-between rounded-lg px-4 py-3 text-sm shadow-lg ${TYPE_STYLES[toast.type] || TYPE_STYLES.info}`}
        >
          <span>{toast.message}</span>
          <button
            type="button"
            className="ml-3 text-xs font-semibold uppercase text-white/80"
            onClick={() => removeToast(toast.id)}
          >
            Close
          </button>
        </div>
      ))}
    </div>
  );
};

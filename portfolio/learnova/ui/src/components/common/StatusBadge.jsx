const STATUS_STYLES = {
  published: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  draft: 'bg-amber-100 text-amber-700 border-amber-200',
  unpublish: 'bg-rose-100 text-rose-700 border-rose-200',
};

export const StatusBadge = ({ status }) => {
  const value = status?.toLowerCase?.() ?? 'draft';
  const styles = STATUS_STYLES[value] || STATUS_STYLES.draft;

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${styles}`}>
      {status || 'draft'}
    </span>
  );
};

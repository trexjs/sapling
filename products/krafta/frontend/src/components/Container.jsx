export const Container = ({ background = 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)', padding = 20, children }) => {
  return (
    <div
      style={{
        background,
        padding: `${padding}px`,
        minHeight: '200px',
        borderRadius: '12px',
        border: '2px dashed #d1d5db',
        boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        transition: 'border-color 0.2s',
      }}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = '#60a5fa'}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
    >
      {children || (
        <p style={{
          color: '#6b7280',
          textAlign: 'center',
          padding: '32px 0',
          fontWeight: '500',
          margin: 0,
        }}>
          Drop components here
        </p>
      )}
    </div>
  );
};

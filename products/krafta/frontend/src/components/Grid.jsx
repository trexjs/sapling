export const Grid = ({ columns = 2, gap = 16, children }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gap}px`,
        minHeight: '200px',
        padding: '16px',
        border: '2px dashed #a5b4fc',
        borderRadius: '12px',
        backgroundColor: 'rgba(238, 242, 255, 0.3)',
        transition: 'border-color 0.2s',
      }}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = '#6366f1'}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = '#a5b4fc'}
    >
      {children || <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#6b7280', padding: '32px 0' }}>Drop components here</div>}
    </div>
  );
};

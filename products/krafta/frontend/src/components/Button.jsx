export const Button = ({ text = 'Button', backgroundColor = '#3b82f6', color = '#ffffff', children }) => {
  return (
    <div style={{ padding: '8px' }}>
      <button
        style={{
          backgroundColor,
          color,
          padding: '12px 24px',
          borderRadius: '8px',
          fontWeight: '600',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.2s',
          fontSize: '16px',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
        }}
      >
        {text}
      </button>
      {children}
    </div>
  );
};

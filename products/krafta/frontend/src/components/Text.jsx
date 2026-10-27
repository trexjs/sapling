export const Text = ({ text = 'Text content', fontSize = 18, children }) => {
  return (
    <div
      style={{
        padding: '16px',
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        cursor: 'pointer',
        transition: 'box-shadow 0.2s',
      }}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)'}
    >
      <p
        style={{
          fontSize: `${fontSize}px`,
          color: '#1f2937',
          fontWeight: '500',
          lineHeight: '1.6',
          margin: 0,
        }}
      >
        {text}
      </p>
      {children}
    </div>
  );
};

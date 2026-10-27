export const Input = ({ placeholder = 'Enter text...', type = 'text', label = 'Input Label', children }) => {
  return (
    <div style={{ padding: '12px' }}>
      {label && (
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '500',
          color: '#374151',
          marginBottom: '8px',
        }}>
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '10px 16px',
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          fontSize: '16px',
          transition: 'all 0.2s',
          outline: 'none',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = '#6366f1';
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = '#d1d5db';
          e.currentTarget.style.boxShadow = 'none';
        }}
      />
      {children}
    </div>
  );
};

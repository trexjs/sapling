export const Image = ({ src = 'https://via.placeholder.com/400x300?text=Image+Placeholder', alt = 'Image', width = 400, height = 300, children }) => {
  return (
    <div style={{ padding: '8px' }}>
      <img
        src={src}
        alt={alt}
        style={{
          width: width ? `${width}px` : '100%',
          height: height ? `${height}px` : 'auto',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          objectFit: 'cover',
          display: 'block',
        }}
      />
      {children}
    </div>
  );
};

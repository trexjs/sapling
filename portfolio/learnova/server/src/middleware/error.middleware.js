export const notFoundHandler = (_req, res, _next) => {
  res.status(404).json({ message: 'Route not found' });
};

export const errorHandler = (err, _req, res, _next) => {
  console.error('Request failed', err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

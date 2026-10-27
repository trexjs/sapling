import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    cors: {
      origin: 'http://localhost:5000',
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization', 'x-user-role', 'X-Requested-With'],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    },
  },
});

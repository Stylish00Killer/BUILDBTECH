import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5000,
    strictPort: true,
    allowedHosts: 'all', // Allow all hosts in development
    cors: true
  },
  preview: {
    port: 5000,
    strictPort: true,
    host: true,
    cors: true
  }
});

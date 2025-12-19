
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
// Explicitly import process to provide correct Node.js types for process.cwd()
import process from 'node:process';

export default defineConfig(({ mode }) => {
  // Load environment variables from the root .env file
  // Setting the third argument to '' allows loading variables without the VITE_ prefix
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // This polyfills process.env.API_KEY for the browser
      'process.env.API_KEY': JSON.stringify(env.API_KEY || '')
    },
    server: {
      port: 3000,
      open: true
    }
  };
});

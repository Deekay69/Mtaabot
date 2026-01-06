import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env from files (if any) AND system environment (Docker)
  const env = { ...process.env, ...loadEnv(mode, process.cwd(), '') };

  console.log("[Vite Config] process.cwd():", process.cwd());
  console.log("[Vite Config] VITE_CLERK_PUBLISHABLE_KEY (starts with):", env.VITE_CLERK_PUBLISHABLE_KEY?.substring(0, 10));
  console.log("[Vite Config] VITE_API_URL:", env.VITE_API_URL);

  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      'import.meta.env.VITE_CLERK_PUBLISHABLE_KEY': JSON.stringify(env.VITE_CLERK_PUBLISHABLE_KEY),
      'process.env.VITE_CLERK_PUBLISHABLE_KEY': JSON.stringify(env.VITE_CLERK_PUBLISHABLE_KEY),
      'window.__CLERK_KEY__': JSON.stringify(env.VITE_CLERK_PUBLISHABLE_KEY),
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});

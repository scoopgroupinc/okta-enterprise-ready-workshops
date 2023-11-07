/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    cacheDir: '../../node_modules/.vite/todo-app',

    define: {
      'process.env.VITE_OPENAI_API_KEY': JSON.stringify(
        env.VITE_OPENAI_API_KEY
      ),
      'process.env.VITE_TINY_MCE_KEY': JSON.stringify(env.VITE_TINY_MCE_KEY),

      // If you want to exposes all env variables, which is not recommended
      // 'process.env': env
    },

    server: {
      port: 3000,
      host: 'localhost',
    },

    preview: {
      port: 4300,
      host: 'localhost',
    },

    plugins: [
      react(),
      viteTsConfigPaths({
        root: '../../',
      }),
    ],

    // Uncomment this if you are using workers.
    // worker: {
    //  plugins: [
    //    viteTsConfigPaths({
    //      root: '../../',
    //    }),
    //  ],
    // },

    test: {
      globals: true,
      cache: {
        dir: '../../node_modules/.vitest',
      },
      environment: 'jsdom',
      include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    },
  };
});

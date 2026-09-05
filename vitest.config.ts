import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// Separate from vite.config.ts so the production build config stays clean, and
// so the lightningcss/base-path settings the app needs cannot silently change
// how tests resolve modules. Vitest picks this up automatically; `vite build`
// keeps using vite.config.ts.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    // src/lib/supabase.ts throws at import time when these are missing, which
    // would turn any unmocked import into a baffling module-load crash. These
    // are inert placeholders, not a licence to hit the network: tests that touch
    // Supabase still mock '@/lib/supabase' outright.
    env: {
      VITE_SUPABASE_URL: 'http://supabase.test',
      VITE_SUPABASE_PUBLISHABLE_KEY: 'test-publishable-key',
    },
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules/**', 'dist/**'],
    // Fresh module registry per file, so a module-level singleton cannot leak
    // between test files.
    isolate: true,
    restoreMocks: true,
    css: false,
  },
});

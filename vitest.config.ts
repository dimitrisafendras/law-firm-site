import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

/**
 * Test config kept separate from vite.config.ts on purpose.
 *
 * The app config runs CSS through lightningcss and pins a `base` for GitHub
 * Pages; neither is meaningful under jsdom, and the lightningcss native binary
 * is a needless dependency for a test run. What tests DO need to share with the
 * app is the '@' alias, so an import reads identically in a test and in a
 * component. That is restated below rather than merged, so a change to the
 * build pipeline can never silently change how tests resolve modules.
 */
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
    // are inert placeholders and not a licence to hit the network: every test
    // that touches Supabase still mocks '@/lib/supabase' outright — see
    // createMockSupabaseClient in src/test/utils.tsx.
    env: {
      VITE_SUPABASE_URL: 'http://supabase.test',
      VITE_SUPABASE_PUBLISHABLE_KEY: 'test-publishable-key',
    },
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules/**', 'dist/**'],
    // A fresh module registry per file, so a module-level singleton (i18n, a
    // mocked Supabase client) cannot leak from one test file into the next.
    isolate: true,
    restoreMocks: true,
    css: false,
    coverage: {
      // Report only. A threshold here would fail CI on unrelated work, and
      // coverage is a signal to read, not a gate to satisfy.
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.{test,spec}.{ts,tsx}',
        'src/test/**',
        'src/main.tsx',
        'src/vite-env.d.ts',
        'src/**/*.d.ts',
      ],
    },
  },
});

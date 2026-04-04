import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import browserslist from 'browserslist'
import { browserslistToTargets } from 'lightningcss'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/law-firm-site/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  css: {
    transformer: 'lightningcss',
    lightningcss: {
      targets: browserslistToTargets(browserslist('last 2 versions')),
    },
  },
  build: {
    cssMinify: 'lightningcss',
  },
})

/// <reference types="vitest" />
import { cloudflare } from "@cloudflare/vite-plugin"
import tailwindcss from "@tailwindcss/vite"
import react from '@vitejs/plugin-react'
import path from "path"
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  define: {

  },
  plugins: [react(), tailwindcss(), cloudflare()],
  test: {
    globals: true,
    environment: 'jsdom',
    expect: {
      requireAssertions: true,
    },
    setupFiles: './src/setupTests.ts',
    include: ['**/__tests__/**/*.test.{ts,tsx}'],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  }
})

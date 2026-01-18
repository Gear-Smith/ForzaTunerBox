/// <reference types="vitest" />
import { cloudflare } from "@cloudflare/vite-plugin"
import tailwindcss from "@tailwindcss/vite"
import react from '@vitejs/plugin-react'
import path from "path"
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isTest =
    mode === "test" ||
    process.env.VITEST === "true" ||
    !!process.env.VITEST ||
    process.argv.some((a) => a.includes("vitest"));
  return {
    define: {

    },
    plugins: [react(), tailwindcss(), (isTest ? [] : [cloudflare()])],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    test: {
      environment: "jsdom",
      setupFiles: ["./src/setupTests.ts"]
    }
  }
})

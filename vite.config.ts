import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Allow the sandbox preview host (and localhost) to reach the dev and preview servers.
  server: { allowedHosts: ['.e2b.app', 'localhost'] },
  preview: { allowedHosts: ['.e2b.app', 'localhost'] },
})

import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'
  return {
    plugins: [react(), tailwindcss()],
    resolve: { alias: { '~': fileURLToPath(new URL('./src', import.meta.url)) } },
    server: {
      host: '127.0.0.1',
      strictPort: true,
      allowedHosts: env.TAILSCALE_HOST ? [env.TAILSCALE_HOST] : [],
      // Keep API, Passport, and Pusher auth on the browser's origin in development.
      proxy: {
        '^/(api|broadcasting)(/|$)': { target: apiTarget, changeOrigin: true },
        // Vite matches the full request URL, including the query string.
        '^/auth/discord(?:[/?]|$)': { target: apiTarget, changeOrigin: true }
      }
    }
  }
})

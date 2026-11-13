import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'
import { appMeta } from './src/app-meta.ts'

const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// index.html's title and description come from the same place as the app's.
const appMetaHtml: Plugin = {
  name: 'app-meta-html',
  transformIndexHtml: {
    order: 'pre',
    handler: (html) =>
      html
        .replaceAll('%APP_TITLE%', escapeHtml(appMeta.title))
        .replaceAll('%APP_DESCRIPTION%', escapeHtml(appMeta.description))
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'
  return {
    plugins: [appMetaHtml, react(), tailwindcss()],
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

import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // Keep existing local .env files usable while exposing only browser configuration.
  // The existing OAuth flow already sends its client credential from the browser.
  // Pusher's server secret is deliberately absent from this allowlist.
  const publicKeys = ['API_BASE_URL', 'API_CLIENT_ID', 'API_CLIENT_SECRET', 'PUSHER_APP_ID', 'PUSHER_KEY', 'PUSHER_CLUSTER']
  const apiTarget = env.VITE_API_BASE_URL || env.API_BASE_URL || 'http://127.0.0.1:8000'
  return {
    plugins: [react()],
    resolve: { alias: { '~': fileURLToPath(new URL('./src', import.meta.url)) } },
    define: Object.fromEntries(publicKeys.map(key => [
      `import.meta.env.VITE_${key}`, JSON.stringify(env[`VITE_${key}`] ?? env[key] ?? ''),
    ])),
    server: {
      host: '127.0.0.1',
      strictPort: true,
      allowedHosts: env.TAILSCALE_HOST ? [env.TAILSCALE_HOST] : [],
      // Keep API, Passport, and Pusher auth on the browser's origin in development.
      proxy: {
        '^/(api|oauth|broadcasting)(/|$)': { target: apiTarget, changeOrigin: true },
      },
    },
  }
})

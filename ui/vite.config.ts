import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // Keep existing local .env files usable while exposing only browser configuration.
  // The existing OAuth flow already sends its client credential from the browser.
  // Pusher's server secret is deliberately absent from this allowlist.
  const publicKeys = ['API_BASE_URL', 'API_CLIENT_ID', 'API_CLIENT_SECRET', 'PUSHER_APP_ID', 'PUSHER_KEY', 'PUSHER_CLUSTER']
  return {
    plugins: [react()],
    resolve: { alias: { '~': fileURLToPath(new URL('./src', import.meta.url)) } },
    define: Object.fromEntries(publicKeys.map(key => [
      `import.meta.env.VITE_${key}`, JSON.stringify(env[`VITE_${key}`] ?? env[key] ?? ''),
    ])),
    server: { strictPort: true },
  }
})

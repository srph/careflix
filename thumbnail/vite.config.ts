import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Bind to all interfaces so the dev server is reachable over Tailscale/LAN.
    host: true,
    port: 5273,
    strictPort: true,
    // Allow the Tailscale MagicDNS hostname (e.g. "mbp") to pass Vite's host check.
    // `true` allows any host — fine for a personal dev tool on your own Tailnet.
    allowedHosts: true
  }
})

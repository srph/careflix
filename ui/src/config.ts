import { appMeta } from './app-meta'

export const config = {
  app: appMeta,
  api: {
    baseUrl: import.meta.env.DEV ? '' : import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
    pusherKey: import.meta.env.VITE_PUSHER_KEY,
    pusherCluster: import.meta.env.VITE_PUSHER_CLUSTER
  },
  links: {
    changelogs: 'https://www.notion.so/6591cc7552bf4b3f8f4a80ba7d7d9e00?v=ce00c057beda4f2495e733d5a38db73b'
  }
}

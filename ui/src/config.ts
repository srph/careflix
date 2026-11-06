export default {
  api: {
    baseUrl: import.meta.env.DEV ? '' : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'),
    pusherAppId: import.meta.env.VITE_PUSHER_APP_ID,
    pusherKey: import.meta.env.VITE_PUSHER_KEY,
    pusherCluster: import.meta.env.VITE_PUSHER_CLUSTER
  },
  app: {
    title: 'Pulse',
    tagline: 'An annual bullet journal to help you track your progress. ',
    description: 'Pulse is an annual bullet journal to help you track your progress. '
  },
  links: {
    changelogs: 'https://www.notion.so/6591cc7552bf4b3f8f4a80ba7d7d9e00?v=ce00c057beda4f2495e733d5a38db73b'
  }
}

export default {
  api: {
    baseUrl: process.env.API_BASE_URL || 'http://localhost:8000',
    clientId: process.env.API_CLIENT_ID || '',
    clientSecret: process.env.API_CLIENT_SECRET || '',
    pusherAppId: process.env.PUSHER_APP_ID,
    pusherKey: process.env.PUSHER_KEY,
    pusherSecret: process.env.PUSHER_SECRET,
    pusherCluster: process.env.PUSHER_CLUSTER
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

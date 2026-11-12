import { useEffect, useState } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { useAuth } from '~/contexts/auth/auth'
import { createQueryClient } from './client'

function QuerySession({ children }: ReactComponentWrapper) {
  const [client] = useState(createQueryClient)
  useEffect(() => () => { client.clear() }, [client])
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

export function QueryProvider({ children }: ReactComponentWrapper) {
  const auth = useAuth()
  // A new account gets a new cache, including when switching without a reload.
  return <QuerySession key={auth.data?.id ?? 'guest'}>{children}</QuerySession>
}

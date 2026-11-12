import { QueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        retry: (count, error) => {
          const status = (error as AxiosError).response?.status
          return !(status !== undefined && status >= 400 && status < 500) && count < 2
        },
      },
    },
  })
}

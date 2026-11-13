import { useQueryClient } from '@tanstack/react-query'
import { UiButton } from '~/components/ui-button/ui-button'
import { queryKeys } from '~/query-keys'
import { useAuth } from './auth-queries'

/** Holds the routes back until we know who's signed in, like the first load always has. */
export function AuthBoundary({ children }: ReactComponentWrapper) {
  const auth = useAuth()
  const client = useQueryClient()

  if (auth.status === 'pending') return null

  if (auth.status === 'error') {
    return (
      <div className="mx-auto my-20 max-w-120 p-6 text-center" role="alert">
        <p className="mb-4">We couldn’t reach Care.tv. Please try again.</p>
        {/* Reset rather than refetch, so the retry shows nothing while it loads, like the first load. */}
        <UiButton onClick={() => client.resetQueries({ queryKey: queryKeys.global.auth() })}>Retry</UiButton>
      </div>
    )
  }

  return children
}

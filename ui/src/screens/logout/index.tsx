import { useEffect } from 'react'
import { useUnstated } from '~/lib/unstated'
import { AuthContainer } from '~/containers'

function Logout() {
  const auth = useUnstated(AuthContainer)

  useEffect(() => {
    auth.logout()
  }, [])

  return null
}

export default Logout
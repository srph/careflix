import { useState, useEffect } from 'react'
import axios from '~/lib/axios'

interface UseRequestPayload<T> {
  data: T,
  isLoading: boolean
}

/**
 * Basic data resolver
 */
function useRequest<T>(endpoint: string): UseRequestPayload<T> {
  const [data, setData] = useState<T>()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      setIsLoading(true)

      const [err, res] = await axios.get(endpoint)

      if (err) {
        setIsLoading(false)
        return
      }

      setData(res.data)
      setIsLoading(false)
    }

    fetch()
  }, [endpoint])

  return { data, isLoading }
}


export {
  useRequest,
  useRequest as default
}
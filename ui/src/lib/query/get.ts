import axiosLibrary from 'axios'
import axios from '~/lib/axios'

/** A cancellable GET for query functions: throws the Axios tuple's error so Query sees a failure. */
export async function get<T>(url: string, params?: object, signal?: AbortSignal): Promise<T> {
  // The existing Axios version uses CancelToken rather than AbortSignal.
  const source = axiosLibrary.CancelToken.source()
  const cancel = () => source.cancel('Query cancelled')
  signal?.addEventListener('abort', cancel, { once: true })
  if (signal?.aborted) cancel()
  try {
    const [error, response] = await axios.get(url, { params, cancelToken: source.token })
    if (error) throw error
    return response.data
  } finally {
    signal?.removeEventListener('abort', cancel)
  }
}

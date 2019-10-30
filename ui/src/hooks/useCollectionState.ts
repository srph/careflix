import { useState } from 'react'

function useCollectionState<T>() {
  return useState<AppCollection<T>>(() => ({
    data: [],
    current_page: 1,
    last_page: 1,
    from: 1,
    to: 1,
    path: '',
    first_page_url: '',
    per_page: 1,
    prev_page_url: null,
    next_page_url: null
  }))
}

export { useCollectionState, useCollectionState as default }

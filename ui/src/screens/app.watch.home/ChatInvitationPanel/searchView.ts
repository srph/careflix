export type SearchView =
  | { kind: 'skeleton' }
  | { kind: 'results'; users: AppUser[] }
  | { kind: 'empty' }
  | { kind: 'error' }

/**
 * What the invite search list shows for its query (which runs on the debounced term): the skeleton until the
 * query has an answer, including while a Retry runs, then the answer or the error.
 */
export function searchView(query: { data?: AppUser[]; isError: boolean; isFetching: boolean }): SearchView {
  if (query.data) return query.data.length ? { kind: 'results', users: query.data } : { kind: 'empty' }
  if (query.isError && !query.isFetching) return { kind: 'error' }
  return { kind: 'skeleton' }
}

export type SearchView =
  | { kind: 'skeleton' }
  | { kind: 'results'; users: AppUser[] }
  | { kind: 'empty' }
  | { kind: 'error' }

/**
 * What the invite search list shows for the text in the field. Rows only ever belong to that text, so until
 * its search has answered (typing, the debounce, the request, a Retry) the list is a skeleton.
 */
export function searchView(text: string, term: string, query: { data?: AppUser[]; isError: boolean; isFetching: boolean }): SearchView {
  if (term !== text) return { kind: 'skeleton' }
  if (query.data) return query.data.length ? { kind: 'results', users: query.data } : { kind: 'empty' }
  if (query.isError && !query.isFetching) return { kind: 'error' }
  return { kind: 'skeleton' }
}

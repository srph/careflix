import { describe, expect, it } from 'vitest'
import { searchView } from './app-watch-home-chat-invitation-panel-search-view'

const joel = { id: 3, name: 'Joel' } as AppUser
const query = (patch: { data?: AppUser[]; isError?: boolean; isFetching?: boolean }) => ({
  isError: false,
  isFetching: false,
  ...patch
})

describe('invite search view', () => {
  it('shows the skeleton until the query has an answer', () => {
    expect(searchView(query({ isFetching: true }))).toEqual({ kind: 'skeleton' })
  })

  it('shows the answer', () => {
    expect(searchView(query({ data: [joel] }))).toEqual({ kind: 'results', users: [joel] })
    expect(searchView(query({ data: [] }))).toEqual({ kind: 'empty' })
  })

  it('shows the error, and the skeleton again while Retry runs', () => {
    expect(searchView(query({ isError: true }))).toEqual({ kind: 'error' })
    expect(searchView(query({ isError: true, isFetching: true }))).toEqual({ kind: 'skeleton' })
  })

  it('keeps an answer it has even if a refresh in the background failed', () => {
    expect(searchView(query({ data: [joel], isError: true }))).toEqual({ kind: 'results', users: [joel] })
  })
})

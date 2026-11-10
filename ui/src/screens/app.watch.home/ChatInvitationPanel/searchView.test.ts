import { describe, expect, it } from 'vitest'
import { searchView } from './searchView'

const joel = { id: 3, name: 'Joel' } as AppUser
const query = (patch: { data?: AppUser[]; isError?: boolean; isFetching?: boolean }) => ({ isError: false, isFetching: false, ...patch })

describe('invite search view', () => {
  it('shows the skeleton until the search for the text as typed has answered', () => {
    expect(searchView('jo', 'j', query({ data: [joel] }))).toEqual({ kind: 'skeleton' })
    expect(searchView('jo', 'jo', query({ isFetching: true }))).toEqual({ kind: 'skeleton' })
  })

  it('shows the answer once it is for this text', () => {
    expect(searchView('jo', 'jo', query({ data: [joel] }))).toEqual({ kind: 'results', users: [joel] })
    expect(searchView('jox', 'jox', query({ data: [] }))).toEqual({ kind: 'empty' })
  })

  it('shows the error, and the skeleton again while Retry runs', () => {
    expect(searchView('jo', 'jo', query({ isError: true }))).toEqual({ kind: 'error' })
    expect(searchView('jo', 'jo', query({ isError: true, isFetching: true }))).toEqual({ kind: 'skeleton' })
  })

  it('keeps an answer it has even if a refresh in the background failed', () => {
    expect(searchView('jo', 'jo', query({ data: [joel], isError: true }))).toEqual({ kind: 'results', users: [joel] })
  })
})

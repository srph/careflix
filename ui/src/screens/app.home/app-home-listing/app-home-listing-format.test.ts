import { expect, it, vi } from 'vitest'
import { partyStatus } from './app-home-listing-format'

it('shows the same elapsed time for equivalent timestamps across time zones', () => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date('2026-11-02T12:00:00Z'))
  const party = { members: [], last_activity_at: '2026-11-02T18:00:00+08:00' } as unknown as AppParty
  expect(partyStatus(party)).toBe('Last watched 2h ago')
  expect(partyStatus({ ...party, last_activity_at: '2026-11-02T10:00:00Z' })).toBe('Last watched 2h ago')
})

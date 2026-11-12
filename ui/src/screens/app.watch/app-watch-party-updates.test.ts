import { describe, expect, it } from 'vitest'
import { addMember, setPlayback } from './app-watch-party-updates'

const member = (id: number) => ({ id, pivot: {} }) as AppPartyMember
const party = { members: [member(1)] } as unknown as AppParty

describe('party updates', () => {
  it('adds a member once', () => {
    expect(addMember(party, member(2)).members).toHaveLength(2)
    expect(addMember(party, member(1))).toBe(party)
  })

  it('sets playback', () => {
    expect(setPlayback(party, { current_time: 42, is_playing: true } as AppPartyState)).toMatchObject({
      current_time: 42,
      is_playing: true
    })
  })
})

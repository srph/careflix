import { describe, expect, it } from 'vitest'
import { acceptInvitation, addInvitation, addMember, removeInvitation, setPlayback } from './app-watch-party-updates'

const member = (id: number) => ({ id, pivot: {} }) as AppPartyMember
const invitation = (id: number, recipient: number) => ({ id, recipient: { id: recipient } }) as AppPartyInvitation
const party = { members: [member(1)], invitations: [invitation(10, 2)] } as unknown as AppParty

describe('party updates', () => {
  it('adds a member once', () => {
    expect(addMember(party, member(2)).members).toHaveLength(2)
    expect(addMember(party, member(1))).toBe(party)
  })

  it('skips an invitation it already has, or one for a member', () => {
    expect(addInvitation(party, invitation(10, 2))).toBe(party)
    expect(addInvitation(party, invitation(11, 1))).toBe(party)
    expect(addInvitation(party, invitation(12, 3)).invitations).toHaveLength(2)
  })

  it('accepting adds the member and drops the invitation', () => {
    const next = acceptInvitation(party, invitation(10, 2), member(2))
    expect(next.members.map((m) => m.id)).toEqual([1, 2])
    expect(next.invitations).toEqual([])
  })

  it('removes an invitation', () => {
    expect(removeInvitation(party, invitation(10, 2)).invitations).toEqual([])
  })

  it('sets playback', () => {
    expect(setPlayback(party, { current_time: 42, is_playing: true } as AppPartyState)).toMatchObject({
      current_time: 42,
      is_playing: true
    })
  })
})

import { afterEach, describe, expect, it } from 'vitest'
import { readDeclinedInvitations, rememberDeclinedInvitation } from './declinedInvitations'

const at = (minutes: number) => new Date(Date.now() + minutes * 60_000).toISOString()
const invitation = (id: number, minutes = 30) => ({ id, expires_at: at(minutes) }) as AppPartyInvitation

describe('declined invitations', () => {
  afterEach(() => localStorage.clear())

  it('remembers declines per account', () => {
    rememberDeclinedInvitation(1, invitation(7))
    rememberDeclinedInvitation(1, invitation(7))
    expect(readDeclinedInvitations(1).map(entry => entry.id)).toEqual(['7'])
    expect(readDeclinedInvitations(2)).toEqual([])
  })

  it('forgets declines once their invitation expires', () => {
    rememberDeclinedInvitation(1, invitation(7, 1))
    rememberDeclinedInvitation(1, invitation(8, 30))
    expect(readDeclinedInvitations(1, Date.now() + 2 * 60_000).map(entry => entry.id)).toEqual(['8'])
    expect(JSON.parse(localStorage.getItem('care.declined-invitations.1')).map(entry => entry.id)).toEqual(['8'])
  })

  it('ignores unreadable storage', () => {
    localStorage.setItem('care.declined-invitations.1', '{nope')
    expect(readDeclinedInvitations(1)).toEqual([])
    localStorage.setItem('care.declined-invitations.1', '{"id":"7"}')
    expect(readDeclinedInvitations(1)).toEqual([])
  })
})

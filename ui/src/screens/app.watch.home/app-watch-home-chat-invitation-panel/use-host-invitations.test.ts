import { describe, expect, it } from 'vitest'
import { ANSWER_MS, reducer, State } from './use-host-invitations'

const mira = { id: 7, name: 'Mira' } as AppUser
const invite = (id: number, action: AppPartyInvitation['action']) =>
  ({ id, action, recipient: mira, expires_at: '2026-11-10T12:30:00Z' }) as AppPartyInvitation
const start = (history: AppPartyInvitation[]): State => ({
  history,
  answers: {},
  historyError: false,
  busy: {},
  errors: {}
})

describe('invite answers', () => {
  it('notes Joined and Declined only when a waiting invite we had gets answered', () => {
    const joined = reducer(start([invite(1, 'pending')]), {
      type: 'history',
      at: 1000,
      invitations: [invite(1, 'accepted')]
    })
    expect(joined.answers['7']).toEqual({ kind: 'joined', at: 1000 })
    const declined = reducer(start([invite(1, 'pending')]), {
      type: 'history',
      at: 1000,
      invitations: [invite(1, 'declined')]
    })
    expect(declined.answers['7'].kind).toBe('declined')
    const old = reducer(start([]), { type: 'history', at: 1000, invitations: [invite(1, 'declined')] })
    expect(old.answers).toEqual({})
  })

  it('clears an answer when a new invite goes out, and prunes it after it has shown', () => {
    const declined = reducer(start([invite(1, 'pending')]), {
      type: 'history',
      at: 1000,
      invitations: [invite(1, 'declined')]
    })
    expect(reducer(declined, { type: 'history', at: 2000, invitations: [invite(2, 'pending')] }).answers).toEqual({})
    expect(reducer(declined, { type: 'prune', at: 1000 + ANSWER_MS - 1 }).answers['7']).toBeDefined()
    expect(reducer(declined, { type: 'prune', at: 1000 + ANSWER_MS }).answers).toEqual({})
  })

  it('ignores a late pending copy of an invite that was already answered', () => {
    const declined = reducer(start([invite(1, 'pending')]), {
      type: 'history',
      at: 1000,
      invitations: [invite(1, 'declined')]
    })
    const late = reducer(declined, { type: 'history', at: 1500, invitations: [invite(1, 'pending')] })
    expect(late.history[0].action).toBe('declined')
    expect(late.answers['7'].at).toBe(1000)
  })
})

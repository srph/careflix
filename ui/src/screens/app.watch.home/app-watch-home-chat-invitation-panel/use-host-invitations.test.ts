import { describe, expect, it } from 'vitest'
import { mergeHistory } from '~/screens/app.watch/queries/app-watch-invitation-queries'
import { ANSWER_MS, noteAnswers, reducer, State } from './use-host-invitations'

const mira = { id: 7, name: 'Mira' } as AppUser
const invite = (id: number, action: AppPartyInvitation['action']) =>
  ({ id, action, recipient: mira, expires_at: '2026-11-10T12:30:00Z' }) as AppPartyInvitation
const start: State = { answers: {}, busy: {}, errors: {} }

// What the hook does when the invitation list changes: merge, then note the answers it reveals.
function receive(state: State, before: AppPartyInvitation[], incoming: AppPartyInvitation[], at: number) {
  const history = mergeHistory(before, incoming)
  return { history, state: reducer(state, { type: 'history', previous: before, history, at }) }
}

describe('invite answers', () => {
  it('notes Joined and Declined only when a waiting invite we had gets answered', () => {
    const joined = receive(start, [invite(1, 'pending')], [invite(1, 'accepted')], 1000)
    expect(joined.state.answers['7']).toEqual({ kind: 'joined', at: 1000 })
    const declined = receive(start, [invite(1, 'pending')], [invite(1, 'declined')], 1000)
    expect(declined.state.answers['7'].kind).toBe('declined')
    expect(noteAnswers({}, [], [invite(1, 'declined')], 1000)).toEqual({})
  })

  it('clears an answer when a new invite goes out, and prunes it after it has shown', () => {
    const declined = receive(start, [invite(1, 'pending')], [invite(1, 'declined')], 1000)
    expect(receive(declined.state, declined.history, [invite(2, 'pending')], 2000).state.answers).toEqual({})
    expect(reducer(declined.state, { type: 'prune', at: 1000 + ANSWER_MS - 1 }).answers['7']).toBeDefined()
    expect(reducer(declined.state, { type: 'prune', at: 1000 + ANSWER_MS }).answers).toEqual({})
  })

  it('ignores a late pending copy of an invite that was already answered', () => {
    const declined = receive(start, [invite(1, 'pending')], [invite(1, 'declined')], 1000)
    const late = receive(declined.state, declined.history, [invite(1, 'pending')], 1500)
    expect(late.history[0].action).toBe('declined')
    expect(late.state.answers['7'].at).toBe(1000)
  })
})

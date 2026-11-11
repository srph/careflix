import { describe, expect, it } from 'vitest'
import { isActivityLevel, showsOnOverlay, showsReactions } from './activityLevel'

const leo = { id: 2, name: 'Leo' } as AppUser
const me = 1

const message = (user: AppUser, text = 'ok who picked this') =>
  ({ id: 'm', type: 'message', message: { id: 'm', text, user } }) as AppPartyLog
const activity = (kind: AppPartyActivityKind | null, user: AppUser = leo) =>
  ({ id: 'a', type: 'activity', activity: { id: 'a', text: '', kind, user } }) as AppPartyLog

describe('activity overlay level', () => {
  it('shows messages and all room activity at Everything', () => {
    expect(showsOnOverlay(message(leo), 'all', me)).toBe(true)
    for (const kind of ['joined', 'joined_code', 'paused', 'played', 'seeked', 'switched'] as const) {
      expect(showsOnOverlay(activity(kind), 'all', me)).toBe(true)
    }
    expect(showsOnOverlay(activity('created'), 'all', me)).toBe(false)
    expect(showsOnOverlay(activity(null), 'all', me)).toBe(false)
  })

  it('keeps only joins and pauses at the middle level', () => {
    expect(showsOnOverlay(message(leo), 'activity', me)).toBe(false)
    expect(showsOnOverlay(activity('joined'), 'activity', me)).toBe(true)
    expect(showsOnOverlay(activity('joined_code'), 'activity', me)).toBe(true)
    expect(showsOnOverlay(activity('paused'), 'activity', me)).toBe(true)
    expect(showsOnOverlay(activity('played'), 'activity', me)).toBe(false)
    expect(showsOnOverlay(activity('seeked'), 'activity', me)).toBe(false)
    expect(showsOnOverlay(activity('accepted'), 'activity', me)).toBe(false)
  })

  it('shows nothing when off, and never your own', () => {
    expect(showsOnOverlay(activity('joined'), 'off', me)).toBe(false)
    expect(showsOnOverlay(message({ id: '1', name: 'You' } as AppUser), 'all', me)).toBe(false)
    expect(showsOnOverlay(activity('paused', { id: 1, name: 'You' } as AppUser), 'all', me)).toBe(false)
  })

  it('lets reactions through with the sidebar open, or at Everything', () => {
    expect(showsReactions('off', true)).toBe(true)
    expect(showsReactions('all', false)).toBe(true)
    expect(showsReactions('activity', false)).toBe(false)
    expect(showsReactions('off', false)).toBe(false)
  })

  it('accepts only known levels from storage', () => {
    expect(isActivityLevel('activity')).toBe(true)
    expect(isActivityLevel('comments')).toBe(false)
    expect(isActivityLevel(null)).toBe(false)
  })
})

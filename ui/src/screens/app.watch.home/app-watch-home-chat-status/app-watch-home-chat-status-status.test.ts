import { describe, expect, it } from 'vitest'
import { isJoinActivity, latestStatusActivity } from './app-watch-home-chat-status-status'

const user = { id: 1, name: 'Kier' } as AppUser
const activity = (
  kind: AppPartyActivityKind | null,
  meta: { seconds?: number; from_seconds?: number } | null = null,
  id = kind
) =>
  ({
    id: String(id),
    type: 'activity',
    activity: { id: String(id), text: String(kind), kind, meta, user, created_at: '', updated_at: '' }
  }) as AppPartyLog
const message = { id: 'm', type: 'message', message: { id: 'm', text: 'hi', user } } as AppPartyLog

describe('chat status', () => {
  it('describes the latest playback change, skipping joins and messages', () => {
    const logs = [activity('created'), activity('paused', { seconds: 30 }), activity('joined'), message]
    expect(latestStatusActivity(logs)!.kind).toBe('paused')
    expect(latestStatusActivity([activity('created'), activity('joined')])!.kind).toBe('created')
    expect(latestStatusActivity([activity(null), message])).toBeNull()
  })

  it('only treats real arrivals as joins', () => {
    expect(isJoinActivity(activity('joined').activity)).toBe(true)
    expect(isJoinActivity(activity('joined_code').activity)).toBe(true)
    expect(isJoinActivity(activity('accepted').activity)).toBe(false)
  })
})

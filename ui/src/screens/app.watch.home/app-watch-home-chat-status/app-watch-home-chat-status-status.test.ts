import { describe, expect, it } from 'vitest'
import { hypeFor, isJoinActivity, latestStatusActivity, movieTime, seekDirection, typingLabel } from './app-watch-home-chat-status-status'

const user = { id: 1, name: 'Kier' } as AppUser
const activity = (kind: AppPartyActivityKind | null, meta = null, id = kind) => ({
  id: String(id), type: 'activity', activity: { id: String(id), text: String(kind), kind, meta, user, created_at: '', updated_at: '' }
}) as AppPartyLog
const message = { id: 'm', type: 'message', message: { id: 'm', text: 'hi', user } } as AppPartyLog

describe('chat status', () => {
  it('formats movie time the way the player does', () => {
    expect(movieTime(0)).toBe('0:00')
    expect(movieTime(2472)).toBe('41:12')
    expect(movieTime(3735)).toBe('1:02:15')
  })

  it('describes the latest playback change, skipping joins and messages', () => {
    const logs = [activity('created'), activity('paused', { seconds: 30 }), activity('joined'), message]
    expect(latestStatusActivity(logs).kind).toBe('paused')
    expect(latestStatusActivity([activity('created'), activity('joined')]).kind).toBe('created')
    expect(latestStatusActivity([activity(null), message])).toBeNull()
  })

  it('tells a jump back from a skip ahead, and admits when it cannot', () => {
    expect(seekDirection(activity('seeked', { seconds: 2327, from_seconds: 2481 }).activity)).toBe('back')
    expect(seekDirection(activity('seeked', { seconds: 3000, from_seconds: 2481 }).activity)).toBe('ahead')
    // Rows recovered from old text have no starting point.
    expect(seekDirection(activity('seeked', { seconds: 2327 }).activity)).toBeNull()
  })

  it('only treats real arrivals as joins', () => {
    expect(isJoinActivity(activity('joined').activity)).toBe(true)
    expect(isJoinActivity(activity('joined_code').activity)).toBe(true)
    expect(isJoinActivity(activity('accepted').activity)).toBe(false)
  })

  it('gives each friend the same hype line every time', () => {
    expect(hypeFor(7)).toEqual(hypeFor('7'))
    const lines = new Set(Array.from({ length: 40 }, (_, id) => hypeFor(id)[1]))
    expect(lines.size).toBe(5)
  })

  it('names up to two typers, then counts', () => {
    expect(typingLabel([])).toBeNull()
    expect(typingLabel(['Joyce'])).toEqual({ subject: 'Joyce', verb: 'is typing' })
    expect(typingLabel(['Joyce', 'Mira'])).toEqual({ subject: 'Joyce and Mira', verb: 'are typing' })
    expect(typingLabel(['Joyce', 'Mira', 'Leo'])).toEqual({ subject: '3 people', verb: 'are typing' })
  })
})

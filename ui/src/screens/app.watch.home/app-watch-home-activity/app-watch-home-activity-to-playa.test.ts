import { describe, expect, it } from 'vitest'
import { activityToPlaya, toPlayaActivity } from './app-watch-home-activity-to-playa'

const user = { id: 7, name: 'Joyce', avatar: 'joyce.png' } as AppUser
const activity = (kind: AppPartyActivityKind | null, meta: AppPartyActivity['meta'] = null, text = 'did a thing') =>
  ({ id: 'a', text, kind, meta, user, created_at: '', updated_at: '' }) as AppPartyActivity

describe('room activity in Playa’s words', () => {
  it('maps every kind, with the person and what Playa needs to say it', () => {
    const by = { id: 7, name: 'Joyce', avatar: 'joyce.png' }
    expect(activityToPlaya(1, activity('joined'))).toEqual({ id: '1', type: 'joined', by })
    expect(activityToPlaya(1, activity('joined_code')).type).toBe('joined')
    expect(activityToPlaya(1, activity('played')).type).toBe('played')
    expect(activityToPlaya(1, activity('paused', { seconds: 41 }))).toMatchObject({ type: 'paused', at: 41 })
    expect(activityToPlaya(1, activity('seeked', { seconds: 30, from_seconds: 90 }))).toMatchObject({
      type: 'seeked',
      from: 90,
      to: 30
    })
    expect(activityToPlaya(1, activity('created')).type).toBe('started')
    expect(activityToPlaya(1, activity('switched', null, 'switched to S1:E2'))).toMatchObject({
      type: 'switched',
      text: 'switched to S1:E2'
    })
  })

  it('says unknown and old kinds as the server wrote them', () => {
    expect(activityToPlaya(1, activity('accepted', null, 'accepted the invite'))).toMatchObject({
      type: 'note',
      text: 'accepted the invite'
    })
    expect(activityToPlaya(1, activity(null, null, 'paused at 12:00'))).toMatchObject({ type: 'note' })
  })

  it('turns a message log into a message line', () => {
    const log = { id: 9, type: 'message', message: { id: 'm', text: 'hi', user } } as AppPartyLog
    expect(toPlayaActivity(log)).toMatchObject({ id: '9', type: 'message', text: 'hi', by: { name: 'Joyce' } })
  })
})

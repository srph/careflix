import { describe, expect, it } from 'vitest'
import { inviteRow, InviteRowInput } from './inviteRow'

const rest: InviteRowInput = { name: 'Mira', online: true, member: false, waiting: false, busy: false, error: '', answer: null, minutes: '30m' }
const row = (patch: Partial<InviteRowInput>) => inviteRow({ ...rest, ...patch })

describe('invite row', () => {
  it('rests on presence with Invite', () => {
    expect(row({})).toMatchObject({ status: 'Online', action: 'invite', busy: false, label: 'Invite Mira' })
    expect(row({ online: false }).status).toBe('Offline')
  })

  it('keeps presence while sending, then says why a send failed', () => {
    expect(row({ busy: true })).toMatchObject({ status: 'Online', action: 'invite', busy: true, label: 'Sending invite to Mira' })
    expect(row({ error: 'Couldn’t send' })).toMatchObject({ status: 'Couldn’t send', tone: 'error', action: 'retry' })
  })

  it('shows the invite with Undo, and a failed undo in its place', () => {
    expect(row({ waiting: true })).toMatchObject({ status: 'Invited (30m)', tone: 'pink', action: 'undo' })
    expect(row({ waiting: true, busy: true })).toMatchObject({ status: 'Invited (30m)', busy: true, label: 'Undoing invite to Mira' })
    expect(row({ waiting: true, error: 'Couldn’t undo' })).toMatchObject({ status: 'Couldn’t undo', tone: 'error', action: 'undo' })
  })

  it('says each answer, then rests', () => {
    expect(row({ member: true, answer: 'joined' })).toMatchObject({ status: 'Joined', tone: 'success', action: null })
    expect(row({ member: true })).toMatchObject({ status: 'In the room', action: null })
    expect(row({ member: true, host: true })).toMatchObject({ status: 'Host 👑', action: null })
    expect(row({ answer: 'declined' })).toMatchObject({ status: 'Declined', action: 'invite' })
    expect(row({ answer: 'expired' })).toMatchObject({ status: 'Expired', action: 'invite' })
  })

  it('lets a new send win over a fresh answer', () => {
    expect(row({ answer: 'declined', busy: true }).status).toBe('Online')
  })
})

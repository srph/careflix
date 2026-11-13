import type { PlayaActivity } from '~/components/playa/playa-activity'
import type { PlayaPerson } from '~/components/playa/use-playa'

export function toPlayaPerson(user: Pick<AppUser, 'id' | 'name' | 'avatar'>): PlayaPerson {
  return { id: user.id, name: user.name, avatar: user.avatar }
}

/** The room's word for what someone did, in Playa's. Unknown or old kinds fall back to the server's text. */
export function activityToPlaya(id: AppId, activity: AppPartyActivity): PlayaActivity {
  const base = { id: String(id), by: toPlayaPerson(activity.user) }
  switch (activity.kind) {
    case 'joined':
    case 'joined_code':
      return { ...base, type: 'joined' }
    case 'played':
      return { ...base, type: 'played' }
    case 'paused':
      return { ...base, type: 'paused', at: activity.meta?.seconds }
    case 'seeked':
      return { ...base, type: 'seeked', from: activity.meta?.from_seconds, to: activity.meta?.seconds }
    case 'created':
      return { ...base, type: 'started' }
    case 'switched':
      return { ...base, type: 'switched', text: activity.text }
    default:
      return { ...base, type: 'note', text: activity.text }
  }
}

export function toPlayaActivity(log: AppPartyLog): PlayaActivity {
  if (log.type === 'message') {
    return { id: String(log.id), type: 'message', by: toPlayaPerson(log.message.user), text: log.message.text }
  }
  return activityToPlaya(log.id, log.activity)
}

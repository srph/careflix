import { parse } from 'date-fns-v1'

// Declines are optimistic: the invite leaves the screen before the API hears about it. If the
// request never lands, the invite stays pending on the server until it expires, so /api/me would
// return it again on reload. Remember declines on this device until then.

interface DeclinedInvitation {
  id: string
  expiresAt: string
}

const key = (userId: AppId) => `care.declined-invitations.${userId}`

export function readDeclinedInvitations(userId: AppId, now = Date.now()): DeclinedInvitation[] {
  let list: unknown
  try {
    list = JSON.parse(localStorage.getItem(key(userId)) ?? '[]')
  } catch {
    return []
  }
  if (!Array.isArray(list)) return []
  const live = list.filter((entry): entry is DeclinedInvitation =>
    typeof entry?.id === 'string' && typeof entry?.expiresAt === 'string' && parse(entry.expiresAt).getTime() > now)
  if (live.length !== list.length) write(userId, live)
  return live
}

export function rememberDeclinedInvitation(userId: AppId, invitation: AppPartyInvitation) {
  const id = String(invitation.id)
  write(userId, [...readDeclinedInvitations(userId).filter(entry => entry.id !== id), { id, expiresAt: invitation.expires_at }])
}

function write(userId: AppId, list: DeclinedInvitation[]) {
  try {
    if (list.length) localStorage.setItem(key(userId), JSON.stringify(list))
    else localStorage.removeItem(key(userId))
  } catch {
    // Storage can be full or blocked; the decline still hides the invite for this visit.
  }
}

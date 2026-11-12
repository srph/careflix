import { useMemo } from 'react'
import { usePresence } from '~/hooks/use-presence'

/** The room's members, each marked active while they're in the room; the party's own flags until the roster arrives. */
export function useActiveMembers(party: AppParty) {
  const active = usePresence(`presence-chat-party.${party.id}`)
  return useMemo(() => {
    if (!active) return party.members
    return party.members.map((member) => ({
      ...member,
      pivot: { ...member.pivot, is_active: active.has(String(member.id)) }
    }))
  }, [party.members, active])
}

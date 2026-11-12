import immer from 'immer'

// Pure updates for the cached party, applied through useSetParty.

const isMember = (party: AppParty, id: AppId) => party.members.some((member) => String(member.id) === String(id))

export function addMember(party: AppParty, member: AppPartyMember) {
  return immer(party, (draft) => {
    if (!isMember(draft, member.id)) draft.members.push(member)
  })
}

export function setPlayback(party: AppParty, state: AppPartyState): AppParty {
  return { ...party, current_time: state.current_time, is_playing: state.is_playing }
}

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

export function addInvitation(party: AppParty, invitation: AppPartyInvitation) {
  if (isMember(party, invitation.recipient.id) || party.invitations?.some((existing) => existing.id === invitation.id))
    return party
  return immer(party, (draft) => {
    ;(draft.invitations ??= []).push(invitation)
  })
}

export function removeInvitation(party: AppParty, invitation: AppPartyInvitation) {
  return immer(party, (draft) => {
    draft.invitations = (draft.invitations ?? []).filter((existing) => existing.id !== invitation.id)
  })
}

export function acceptInvitation(party: AppParty, invitation: AppPartyInvitation, member: AppPartyMember) {
  return removeInvitation(addMember(party, member), invitation)
}

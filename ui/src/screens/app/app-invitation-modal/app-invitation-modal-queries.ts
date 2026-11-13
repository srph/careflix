import { useMutation } from '@tanstack/react-query'
import { axios } from '~/lib/axios/axios'
import { useIncomingInvitationsCache } from '~/queries/invitation-queries'

type AcceptedParty = AppParty & { accepted_invitation_ids?: AppId[]; declined_invitation_ids?: AppId[] }

/** Join the invitation's room. The API answers the user's other invites to that room too. */
export function useAcceptInvitationMutation() {
  const invitations = useIncomingInvitationsCache()
  return useMutation({
    mutationFn: async (invitation: AppPartyInvitation): Promise<AcceptedParty> => {
      const [error, response] = await axios.post(
        `/api/invitations/${invitation.id}/accept`,
        {},
        { app: { validation: false } }
      )
      if (error) throw error
      return response.data
    },
    onSuccess: (party, invitation) => {
      invitations.remove([
        invitation.id,
        ...(party.declined_invitation_ids ?? []),
        ...(party.accepted_invitation_ids ?? [])
      ])
    }
  })
}

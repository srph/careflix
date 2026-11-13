/**
 * Every React Query key, in one place.
 *
 * Queries shared across pages start with `global-`; a page's own start with the page's name.
 * Keys leave out the account: sign-in and logout clear the cache (`lib/auth/session.ts`).
 */
export const queryKeys = {
  global: {
    /** The signed-in user, or null for a guest. */
    auth: () => ['global-auth'] as const,
    /** Invitations sent to the signed-in user. */
    invitations: () => ['global-invitations'] as const,
    showGroups: (showId?: AppId) => ['global-show-groups', showId] as const
  },
  home: {
    shows: (titleType: 'movie' | 'series' | 'all') => ['home-shows', titleType] as const,
    /** Without a show, the prefix for every party list. */
    parties: (showId?: AppId) =>
      (showId === undefined ? ['home-parties'] : ['home-parties', showId]) as readonly unknown[],
    /** Without a term, the prefix for every search. */
    search: (term?: string) => (term === undefined ? ['home-search'] : ['home-search', term]) as readonly unknown[],
    partyCode: (code: string) => ['home-party-code', code] as const,
    createParty: () => ['home-create-party'] as const
  },
  watchParty: {
    party: (partyId: AppId) => ['watch-party', String(partyId)] as const,
    chat: (partyId: AppId) => ['watch-party-chat', String(partyId)] as const,
    invitations: (partyId: AppId) => ['watch-party-invitations', String(partyId)] as const,
    subtitle: (videoId: AppId) => ['watch-party-subtitle', String(videoId)] as const,
    inviteRecents: (partyId: AppId) => ['watch-party-invite-recents', String(partyId)] as const,
    inviteSearch: (partyId: AppId, term: string) => ['watch-party-invite-search', String(partyId), term] as const
  }
}

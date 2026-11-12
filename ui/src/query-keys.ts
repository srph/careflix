/**
 * Every React Query key, in one place.
 *
 * Queries shared across pages start with `global-`; a page's own start with the page's name.
 * Keys leave out the account: `QueryProvider` swaps the whole cache when the account changes.
 */
export const queryKeys = {
  global: {
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
    inviteRecents: (partyId: AppId) => ['watch-party-invite-recents', String(partyId)] as const,
    inviteSearch: (partyId: AppId, term: string) => ['watch-party-invite-search', String(partyId), term] as const
  }
}

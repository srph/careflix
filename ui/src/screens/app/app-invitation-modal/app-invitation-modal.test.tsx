import { act, fireEvent, render, screen } from '@testing-library/react'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { AppInvitationModal } from './app-invitation-modal'
import { InvitationOverlayProvider } from './app-invitation-modal-context'
import { sendDecline } from './app-invitation-modal-send-decline'
import { QueryClientProvider } from '@tanstack/react-query'
import { createQueryClient } from '~/lib/query/client'
import { queryKeys } from '~/query-keys'
import { readDeclinedInvitations } from '~/queries/declined-invitations'

let client = createQueryClient()
const invitations = {
  set: (list: AppPartyInvitation[]) => client.setQueryData(queryKeys.global.invitations(), list),
  ids: () => client.getQueryData<AppPartyInvitation[]>(queryKeys.global.invitations())!.map((item) => item.id)
}

vi.mock('~/lib/auth/auth-queries', () => ({ useAuthUser: () => ({ id: 1 }) }))
vi.mock('./app-invitation-modal-send-decline', () => ({ sendDecline: vi.fn(() => new Promise(() => {})) }))
vi.mock('~/lib/axios/axios', () => ({ axios: { post: vi.fn() } }))
vi.mock('~/hooks/use-pusher', () => ({ usePusher: () => {} }))
vi.mock('~/queries/show-queries', () => ({ useShowGroupsQuery: () => ({ data: undefined as unknown }) }))
vi.mock('react-router', () => ({ useNavigate: () => vi.fn(), useLocation: () => ({ pathname: '/' }) }))
vi.mock('border-beam', () => ({ BorderBeam: (): null => null }))

const invite = (id: number, name: string) =>
  ({
    id,
    action: 'pending',
    party: null,
    sender: { id: id + 100, name },
    expires_at: new Date(Date.now() + 30 * 60_000).toISOString()
  }) as unknown as AppPartyInvitation

function open() {
  render(
    <QueryClientProvider client={client}>
      <InvitationOverlayProvider>
        <AppInvitationModal />
      </InvitationOverlayProvider>
    </QueryClientProvider>
  )
  fireEvent.click(screen.getByRole('button', { name: 'Respond' }))
}

describe('InvitationModal decline', () => {
  beforeAll(() => {
    globalThis.ResizeObserver ??= class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as any
    window.matchMedia ??= (() => ({
      matches: false,
      addEventListener() {},
      removeEventListener() {},
      addListener() {},
      removeListener() {}
    })) as any
    HTMLMediaElement.prototype.play = () => Promise.resolve()
  })
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    client.clear()
    client = createQueryClient()
  })

  it('hides the invitation without waiting for the API', () => {
    invitations.set([invite(1, 'Kier')])
    open()
    fireEvent.click(screen.getByRole('button', { name: 'Decline' }))
    expect(sendDecline).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }))
    expect(readDeclinedInvitations(1).map((entry) => entry.id)).toEqual(['1'])
    expect(
      screen.getAllByText((_, node) => node?.tagName === 'P' && node.textContent === 'Declined Kier’s invitation')
        .length
    ).toBeGreaterThan(0)
    expect(screen.queryByText('Declining…')).toBeNull()
    expect(screen.queryByRole('alert')).toBeNull()
  })

  it('moves to the next invitation, and a double click declines only one', () => {
    invitations.set([invite(1, 'Kier'), invite(2, 'Mira')])
    open()
    const decline = screen.getByRole('button', { name: 'Decline' })
    fireEvent.click(decline)
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Decline' }))
    })
    expect(sendDecline).toHaveBeenCalledTimes(1)
    expect(invitations.ids()).toEqual([2])
    expect(screen.getByText('2 of 2')).toBeTruthy()
  })
})

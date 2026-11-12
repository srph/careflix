import { act, fireEvent, render, screen } from '@testing-library/react'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { AppInvitationModal } from './app-invitation-modal'
import { InvitationOverlayProvider } from './app-invitation-modal-context'
import { sendDecline } from './app-invitation-modal-send-decline'

const auth = vi.hoisted(() => ({
  invitations: [] as AppPartyInvitation[],
  listeners: new Set<() => void>(),
  declined: [] as AppId[],
  set(list: AppPartyInvitation[]) {
    auth.invitations = list
    auth.listeners.forEach((listener) => listener())
  }
}))

vi.mock('~/contexts/auth/auth', async () => {
  const { useSyncExternalStore } = await import('react')
  const subscribe = (listener: () => void) => {
    auth.listeners.add(listener)
    return () => {
      auth.listeners.delete(listener)
    }
  }
  const removeInvitation = (id: AppId) => auth.set(auth.invitations.filter((invitation) => invitation.id !== id))
  const useUser = () => ({ id: 1, invitations: useSyncExternalStore(subscribe, () => auth.invitations) })
  return {
    useAuthUser: useUser,
    useAuth: () => ({
      data: useUser(),
      removeInvitation,
      declineInvitation: (invitation: AppPartyInvitation) => {
        auth.declined.push(invitation.id)
        removeInvitation(invitation.id)
      },
      receiveInvitation: () => {},
      cancelInvitation: () => {}
    })
  }
})
vi.mock('./app-invitation-modal-send-decline', () => ({ sendDecline: vi.fn(() => new Promise(() => {})) }))
vi.mock('~/lib/axios/axios', () => ({ axios: { post: vi.fn() } }))
vi.mock('~/hooks/use-pusher', () => ({ usePusher: () => {} }))
vi.mock('~/screens/app.home/app-home-queries', () => ({ useShowGroupsQuery: () => ({ data: undefined as unknown }) }))
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
    <InvitationOverlayProvider>
      <AppInvitationModal />
    </InvitationOverlayProvider>
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
    auth.declined = []
    auth.set([])
  })

  it('hides the invitation without waiting for the API', () => {
    auth.set([invite(1, 'Kier')])
    open()
    fireEvent.click(screen.getByRole('button', { name: 'Decline' }))
    expect(sendDecline).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }))
    expect(auth.declined).toEqual([1])
    expect(
      screen.getAllByText((_, node) => node?.tagName === 'P' && node.textContent === 'Declined Kier’s invitation')
        .length
    ).toBeGreaterThan(0)
    expect(screen.queryByText('Declining…')).toBeNull()
    expect(screen.queryByRole('alert')).toBeNull()
  })

  it('moves to the next invitation, and a double click declines only one', () => {
    auth.set([invite(1, 'Kier'), invite(2, 'Mira')])
    open()
    const decline = screen.getByRole('button', { name: 'Decline' })
    fireEvent.click(decline)
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Decline' }))
    })
    expect(sendDecline).toHaveBeenCalledTimes(1)
    expect(auth.invitations.map((invitation) => invitation.id)).toEqual([2])
    expect(screen.getByText('2 of 2')).toBeTruthy()
  })
})

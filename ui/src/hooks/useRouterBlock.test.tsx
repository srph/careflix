import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { createMemoryRouter, Link, RouterProvider } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import useRouterBlock from './useRouterBlock'

function renderRoom(playing = true, destination = '/') {
  function Room() {
    useRouterBlock(location => playing && !location.pathname.startsWith('/watch') ? 'Leave the party?' : null)
    return <Link to={destination}>Browse</Link>
  }
  const router = createMemoryRouter([
    { path: '/watch/:id', element: <Room /> },
    { path: '/', element: <p>Movie catalog</p> },
  ], { initialEntries: ['/watch/1'] })
  render(<RouterProvider router={router} />)
  return router
}

describe('leave-party navigation', () => {
  it('keeps the current route when confirmation is declined', async () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false)
    const router = renderRoom()
    fireEvent.click(screen.getByRole('link', { name: 'Browse' }))
    await waitFor(() => expect(confirm).toHaveBeenCalledExactlyOnceWith('Leave the party?'))
    expect(router.state.location.pathname).toBe('/watch/1')
  })

  it('proceeds when confirmation is accepted', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    renderRoom()
    fireEvent.click(screen.getByRole('link', { name: 'Browse' }))
    expect(await screen.findByText('Movie catalog')).toBeTruthy()
  })

  it('does not prompt when playback is paused', async () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false)
    renderRoom(false)
    fireEvent.click(screen.getByRole('link', { name: 'Browse' }))
    expect(await screen.findByText('Movie catalog')).toBeTruthy()
    expect(confirm).not.toHaveBeenCalled()
  })
})

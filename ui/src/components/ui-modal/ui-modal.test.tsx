import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { UiModal } from './ui-modal'

describe('modal integration', () => {
  it('defers render-prop content until the modal opens', async () => {
    const content = vi.fn(() => <button>Movie action</button>)
    const { rerender } = render(<UiModal isOpen={false}>{content}</UiModal>)
    expect(content).not.toHaveBeenCalled()
    rerender(<UiModal isOpen>{content}</UiModal>)
    expect(await screen.findByRole('button', { name: 'Movie action' })).toBeTruthy()
  })

  it('notifies the owner when Escape closes the modal', async () => {
    const onClose = vi.fn()
    render(<UiModal isOpen onClose={onClose}><button>Movie action</button></UiModal>)
    await screen.findByRole('dialog')
    fireEvent.keyDown(document, { key: 'Escape' })
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1))
  })
})

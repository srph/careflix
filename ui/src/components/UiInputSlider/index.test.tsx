import { useState } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import UiInputSlider from './index'

describe('player slider integration', () => {
  it('commits a keyboard adjustment once and reflects the controlled value', () => {
    const onChange = vi.fn()
    function Player() {
      const [value, setValue] = useState(10)
      return <UiInputSlider value={value} min={0} max={100} ariaLabel="Playback position"
        onChange={next => { onChange(next); setValue(next) }} />
    }
    render(<Player />)
    const slider = screen.getByRole('slider', { name: 'Playback position' })
    fireEvent.keyDown(slider, { key: 'ArrowRight' })
    fireEvent.keyUp(slider, { key: 'ArrowRight' })
    expect(onChange).toHaveBeenCalledExactlyOnceWith(11)
    expect(slider.getAttribute('aria-valuenow')).toBe('11')
  })

  it('reflects playback updates without sending a seek callback', () => {
    const onChange = vi.fn()
    const { rerender } = render(<UiInputSlider value={10} min={0} max={100} onChange={onChange} />)
    rerender(<UiInputSlider value={42} min={0} max={100} onChange={onChange} />)
    expect(screen.getByRole('slider').getAttribute('aria-valuenow')).toBe('42')
    expect(onChange).not.toHaveBeenCalled()
  })
})

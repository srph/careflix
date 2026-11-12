import { useState, type CSSProperties } from 'react'
import { Slider } from '@base-ui/react/slider'

interface Props {
  value: number
  min: number
  max: number
  step?: number
  ariaLabel?: string
  styles?: { active?: CSSProperties; thumb?: CSSProperties; track?: CSSProperties }
  onChange?: (value: number) => void
}

export default function UiInputSlider(props: Props) {
  const [draft, setDraft] = useState(props.value)
  const [isDragging, setIsDragging] = useState(false)
  return (
    <Slider.Root
      className="w-full"
      value={isDragging ? draft : props.value}
      min={props.min}
      max={props.max}
      step={props.step ?? 1}
      onValueChange={(value) => {
        setDraft(value)
        setIsDragging(true)
      }}
      onValueCommitted={(value) => {
        props.onChange?.(value)
        setIsDragging(false)
      }}
      onPointerCancel={() => setIsDragging(false)}>
      <Slider.Control className="relative flex h-7 w-full touch-none items-center select-none">
        <Slider.Track
          data-testid="slider-track"
          className="relative h-2 w-full rounded-sm bg-neutral-700"
          style={props.styles?.track}>
          <Slider.Indicator className="h-full rounded-[inherit] bg-pink-500" style={props.styles?.active} />
          {/* Base UI focuses the range input inside the thumb, so the ring goes on the thumb. */}
          <Slider.Thumb
            className="absolute top-1/2 size-5 rounded-full bg-pink-500 has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-3 has-[input:focus-visible]:outline-pink-700"
            style={props.styles?.thumb}
            aria-label={props.ariaLabel || 'Value'}
          />
        </Slider.Track>
      </Slider.Control>
    </Slider.Root>
  )
}

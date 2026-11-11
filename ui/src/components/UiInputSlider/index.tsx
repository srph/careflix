import './style.css'
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
    <Slider.Root className="ui-input-slider" value={isDragging ? draft : props.value}
      min={props.min} max={props.max} step={props.step ?? 1}
      onValueChange={value => { setDraft(value); setIsDragging(true) }}
      onValueCommitted={value => { props.onChange?.(value); setIsDragging(false) }}
      onPointerCancel={() => setIsDragging(false)}>
      <Slider.Control className="ui-input-slider-control">
        <Slider.Track data-testid="slider-track" className="ui-input-slider-track" style={props.styles?.track}>
          <Slider.Indicator className="ui-input-slider-active" style={props.styles?.active} />
          <Slider.Thumb className="ui-input-slider-thumb" style={props.styles?.thumb} aria-label={props.ariaLabel || 'Value'} />
        </Slider.Track>
      </Slider.Control>
    </Slider.Root>
  )
}

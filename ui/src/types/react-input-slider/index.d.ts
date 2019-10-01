declare module 'react-input-slider' {
  export interface SliderValue {
    x: number
    y: number
  }

  export interface SliderProps {
    axis?: 'x' | 'y' | 'xy'
    x?: number
    y?: number
    xmin?: number
    xmax?: number
    ymin?: number
    ymax?: number
    xstep?: number
    ystep?: number
    styles?: {}
    onClick?: (evt: React.ClickEvent<HTMLElement>) => void
    onChange?: (value: SliderValue) => void
    onDragEnd?: () => void
  }

  declare class Slider extends React.Component<SliderProps, any> {}

  export default Slider
}
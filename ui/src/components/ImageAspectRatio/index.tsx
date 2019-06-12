import './style.css'
import * as React from 'react'

export type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  ratio: number
}

function ImageAspectRatio(props: Props) {
  const { ratio, ...imgProps } = props

  return (
    <div className="c-image-aspect-ratio" style={{ paddingBottom: `${ratio}%` }}>
      <img {...imgProps} />
    </div>
  )
}

export default ImageAspectRatio
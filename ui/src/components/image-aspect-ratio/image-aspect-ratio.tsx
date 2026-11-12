import * as React from 'react'

export type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  ratio: number
}

export function ImageAspectRatio(props: Props) {
  const { ratio, ...imgProps } = props

  return (
    <div className="relative w-full" style={{ paddingBottom: `${ratio}%` }}>
      <img {...imgProps} className="absolute inset-0 size-full" />
    </div>
  )
}

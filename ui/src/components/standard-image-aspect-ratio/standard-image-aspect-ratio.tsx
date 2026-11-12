import * as React from 'react'
import { ImageAspectRatio, Props as ImageAspectRatioProps } from '~/components/image-aspect-ratio/image-aspect-ratio'

type Props = Omit<ImageAspectRatioProps, 'ratio'>

export function StandardImageAspectRatio(props: Props) {
  return <ImageAspectRatio {...props} ratio={(9 / 16) * 100} />
}

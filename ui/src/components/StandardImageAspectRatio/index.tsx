import * as React from 'react'
import ImageAspectRatio, { Props as ImageAspectRatioProps } from '~/components/ImageAspectRatio'

type Props = Omit<ImageAspectRatioProps, 'ratio'>

function StandardImageAspectRatio(props: Props) {
  return (
    <ImageAspectRatio {...props} ratio={9/16 * 100} />
  )
}

export default StandardImageAspectRatio
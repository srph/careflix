import * as React from 'react'
import { cn } from '~/utils/cn'
import asset_loader from '~/assets/loader.svg'

interface Props {
  size?: 'medium' | 'large'
}

/**
 * The image is half a ring, so it turns around its right edge.
 * @source https://projects.lukehaas.me/css-loaders/
 */
export function UiLoader(props: Props) {
  return (
    <div data-testid="loader" className="text-center">
      <img
        src={asset_loader}
        alt="Loading..."
        className={cn('inline origin-right animate-[spin_1s_ease_infinite]', props.size === 'large' ? 'w-8' : 'w-4')}
      />
    </div>
  )
}

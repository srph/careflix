import fallback from '~/assets/show-thumbnail-218x146.jpg'
import { cn } from '~/utils/cn'

/** A title's picture, filling its positioned parent unless `className` says otherwise. */
export default function Artwork({ src, className, eager = false }: { src?: string; className?: string; eager?: boolean }) {
  return <img data-testid="artwork" className={cn('absolute inset-0 size-full object-cover', className)} src={src || fallback} alt="" loading={eager ? 'eager' : 'lazy'}
    onError={event => { if (!event.currentTarget.src.endsWith(fallback)) event.currentTarget.src = fallback }} />
}

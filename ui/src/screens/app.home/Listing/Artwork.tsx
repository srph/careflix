import fallback from '~/assets/show-thumbnail-218x146.jpg'

export default function Artwork({ src, className = '', eager = false }: { src?: string; className?: string; eager?: boolean }) {
  return <img data-testid="artwork" className={`listing-artwork ${className}`} src={src || fallback} alt="" loading={eager ? 'eager' : 'lazy'}
    onError={event => { if (!event.currentTarget.src.endsWith(fallback)) event.currentTarget.src = fallback }} />
}

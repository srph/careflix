import memoji1 from '~/assets/login/memoji-1.webp'
import memoji2 from '~/assets/login/memoji-2.webp'
import memoji3 from '~/assets/login/memoji-3.webp'
import { cn } from '~/utils/cn'

// Each face has its own pastel disc and lands at its own time: the middle one first.
const faces = [
  { src: memoji1, disc: 'bg-[#cfe4ff]', delay: '.85s' },
  { src: memoji2, disc: 'bg-[#ffedb0]', delay: '.72s' },
  { src: memoji3, disc: 'bg-[#ffd1e4]', delay: '.98s' }
]

/**
 * Three overlapping faces set inline in the login subtitle, sized in em so they follow its text.
 * Hovering spreads them apart: the overlap is one variable that the row's width and each face's margin read.
 */
export function LoginFriendAvatars() {
  return <span aria-hidden="true" className="relative -mt-[.2em] mr-[.32em] ml-[.12em] inline-flex w-[calc(4.65em-2*var(--overlap))] animate-friends-open align-middle transition-[width] duration-280 ease-out-soft [--overlap:.42em] hover:[--overlap:.16em] motion-reduce:animate-none motion-reduce:transition-none">
    {faces.map(face => <span key={face.src} style={{ animationDelay: face.delay }} 
      className="relative block size-[1.55em] flex-none origin-bottom animate-friend-drop transition-[margin] duration-280 ease-out-soft not-first:ml-[calc(-1*var(--overlap))] motion-reduce:animate-none motion-reduce:transition-none">
      <span className={cn('absolute inset-0 rounded-full ring-2 ring-neutral-950', face.disc)} />
      <span className="absolute inset-0 overflow-hidden rounded-full">
        <img src={face.src} alt="" draggable={false} className="pointer-events-none absolute top-1/2 left-1/2 w-[86%] -translate-1/2 select-none" />
      </span>
    </span>)}
  </span>
}

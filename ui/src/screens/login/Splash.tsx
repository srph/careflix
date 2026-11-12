import { useRef, type ReactNode } from 'react'
import { Link } from 'react-router'
import { PageTitle } from '~/components/page-title/page-title'
import { cn } from '~/utils/cn'
import FriendAvatars from './FriendAvatars'
import ReactionCanvas from './ReactionCanvas'

export function DiscordMark() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5.75 flex-none"><path fill="currentColor" d="M20.3 4.4a20 20 0 0 0-5-1.6l-.6 1.3a18 18 0 0 0-5.4 0l-.6-1.3a20 20 0 0 0-5 1.6C.5 9.1-.3 13.7.1 18.2a20 20 0 0 0 6.1 3.1l1.3-2.1-1.9-.9.5-.4a14 14 0 0 0 11.8 0l.5.4-1.9.9 1.3 2.1a20 20 0 0 0 6.1-3.1c.5-5.2-.9-9.7-3.7-13.8ZM8 15.4c-1.2 0-2.1-1.1-2.1-2.4s.9-2.4 2.1-2.4 2.2 1.1 2.1 2.4c0 1.3-.9 2.4-2.1 2.4Zm8 0c-1.2 0-2.1-1.1-2.1-2.4s.9-2.4 2.1-2.4 2.2 1.1 2.1 2.4c0 1.3-.9 2.4-2.1 2.4Z" /></svg>
}

export function Spinner() {
  return <i className="inline-block size-4.5 flex-none animate-spin rounded-full border-2 border-current border-r-transparent motion-reduce:animate-none" aria-hidden="true" />
}

/** The Discord button's look, shared with the onboarding screen's "start over" button. */
export const DISCORD_BUTTON = 'flex min-h-14 w-full cursor-pointer items-center justify-center gap-2.5 rounded-full bg-[#5865f2] px-5.5 py-3 text-lg leading-snug font-semibold tracking-[-.01em] text-white transition-colors duration-150 hover:bg-[#4752c4] disabled:cursor-wait motion-reduce:transition-none'

function DiscordButton({ state, onClick, name }: { state: string; onClick?: () => void; name?: string }) {
  return <button type="button" className={DISCORD_BUTTON} data-reaction-shelf disabled={state === 'connecting' || state === 'welcome'} onClick={onClick}>
    {state === 'connecting' ? <><Spinner />Opening Discord…</> :
      state === 'welcome' ? <><span aria-hidden="true">👋</span> Welcome, {name}</> :
      <><DiscordMark />{state === 'cancelled' ? 'Try again with Discord' : 'Continue with Discord'}</>}
  </button>
}

/**
 * The signed-out splash. `access` is the second step, where a new account enters its access code:
 * the same stage, laid out as a column with a smaller headline. Phone layout first, desktop from `md`.
 */
export default function Splash({ state = 'idle', name, error, children, identity, onDiscord, access = false }: {
  state?: string; name?: string; error?: string; children?: ReactNode; identity?: ReactNode; onDiscord?: () => void; access?: boolean
}) {
  const stage = useRef<HTMLElement>(null)
  return <main ref={stage} data-state={state} className={cn(
    'relative isolate min-h-[max(620px,100svh)] overflow-hidden bg-neutral-950 font-sans text-white antialiased md:min-h-[max(760px,100svh)]',
    access
      ? 'flex flex-col items-center px-6 pt-[clamp(130px,25svh,190px)] pb-[calc(22px+env(safe-area-inset-bottom,0px))] md:pt-37.5 md:pb-16'
      : 'grid grid-cols-1 grid-rows-[minmax(190px,28svh)_auto_minmax(64px,1fr)_auto_24px] justify-items-center md:grid-rows-[170px_auto_40px_auto_minmax(64px,1fr)]'
  )}>
    <PageTitle title={access ? 'Request access' : 'Watch together'} />
    <Link to="/" aria-label="Care.tv home" className={cn(
      'absolute inset-x-0 z-2 text-center text-pink-500 md:top-9 md:right-auto md:left-11 md:text-left',
      access ? 'top-16.5 font-label text-lg leading-none font-semibold tracking-[-.01em]' : 'top-5.5 text-[25px] leading-none font-bold tracking-[-.04em] md:text-[27px]'
    )}>Care.tv</Link>
    <div className={cn('z-2 text-center', access ? 'w-[min(100%,1000px)]' : 'row-start-2 w-full px-5 md:px-6')}>
      {identity}
      <h1 className={cn(
        'font-bold tracking-[-.045em] [&_span]:wrap-anywhere',
        access
          ? 'text-[clamp(40px,13.33vw,52px)]/[1.04] md:text-[clamp(64px,8.75vw,112px)]/none'
          : 'text-[clamp(38px,11.8vw,62px)]/[1.06] md:text-[clamp(64px,8.6vw,110px)]/[1.02]'
      )}>{access ? <span data-reaction-shelf>Ticket, please.</span> : state === 'welcome' ? <><span>Here they</span><br /><span>come, {name}.</span></> :
        <><span data-reaction-shelf>Bring popcorn.</span><br /><span data-reaction-shelf>Bring feelings.</span></>}</h1>
      <p data-reaction-layout className={cn(
        'mx-auto text-base text-balance text-neutral-300 md:text-lg',
        access ? 'mt-4 max-w-75 md:mt-5.5 md:max-w-115' : 'mt-4.5 max-w-80 md:mt-6 md:max-w-130'
      )}>{access ? 'Care.tv is invite-only for now. Ask Kier or a friend who’s already in.' : state === 'welcome' ? 'Taking you in…' :
        <>Host watch parties with your <span className="whitespace-nowrap"><FriendAvatars />friends.</span></>}</p>
    </div>
    <div className={cn(
      'relative',
      access
        ? 'z-3 mt-auto w-[min(400px,100%)] self-center pt-10 md:mt-10 md:pt-0'
        : 'z-2 row-start-4 mb-[env(safe-area-inset-bottom,0px)] w-[min(380px,calc(100%-48px))] self-end md:mb-0 md:self-auto'
    )}>
      {error && <p className="mb-4 text-center text-sm wrap-anywhere text-pink-300" role="alert">{error}</p>}
      {children || <DiscordButton state={state} onClick={onDiscord} name={name} />}
    </div>
    <span className="sr-only" role="status">{state === 'connecting' ? 'Opening Discord…' : state === 'welcome' ? 'Signed in. Taking you in…' : ''}</span>
    <ReactionCanvas stage={stage} state={state} resting={access} />
  </main>
}

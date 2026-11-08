import { useRef, type ReactNode } from 'react'
import { Link } from 'react-router'
import PageTitle from '~/components/PageTitle'
import FriendAvatars from './FriendAvatars'
import ReactionCanvas from './ReactionCanvas'
import './style.css'

export function DiscordMark() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" className="discord-mark"><path fill="currentColor" d="M20.3 4.4a20 20 0 0 0-5-1.6l-.6 1.3a18 18 0 0 0-5.4 0l-.6-1.3a20 20 0 0 0-5 1.6C.5 9.1-.3 13.7.1 18.2a20 20 0 0 0 6.1 3.1l1.3-2.1-1.9-.9.5-.4a14 14 0 0 0 11.8 0l.5.4-1.9.9 1.3 2.1a20 20 0 0 0 6.1-3.1c.5-5.2-.9-9.7-3.7-13.8ZM8 15.4c-1.2 0-2.1-1.1-2.1-2.4s.9-2.4 2.1-2.4 2.2 1.1 2.1 2.4c0 1.3-.9 2.4-2.1 2.4Zm8 0c-1.2 0-2.1-1.1-2.1-2.4s.9-2.4 2.1-2.4 2.2 1.1 2.1 2.4c0 1.3-.9 2.4-2.1 2.4Z" /></svg>
}

function DiscordButton({ state, onClick, name }: { state: string; onClick?: () => void; name?: string }) {
  return <button type="button" className="login-discord" data-reaction-shelf disabled={state === 'connecting' || state === 'welcome'} onClick={onClick}>
    {state === 'connecting' ? <><i className="login-spinner" aria-hidden="true" />Opening Discord…</> :
      state === 'welcome' ? <><span aria-hidden="true">👋</span> Welcome, {name}</> :
      <><DiscordMark />{state === 'cancelled' ? 'Try again with Discord' : 'Continue with Discord'}</>}
  </button>
}

export default function Splash({ state = 'idle', name, error, children, identity, onDiscord, access = false }: {
  state?: string; name?: string; error?: string; children?: ReactNode; identity?: ReactNode; onDiscord?: () => void; access?: boolean
}) {
  const stage = useRef<HTMLElement>(null)
  return <main className={`login-splash${access ? ' login-splash-access' : ''}`} ref={stage} data-state={state}>
    <PageTitle title={access ? 'Request access' : 'Watch together'} />
    <Link className="login-brand" to="/" aria-label="Care.tv home">Care.tv</Link>
    <div className="login-message">
      {identity}
      <h1>{access ? <span data-reaction-shelf>Ticket, please.</span> : state === 'welcome' ? <><span>Here they</span><br /><span>come, {name}.</span></> :
        <><span data-reaction-shelf>Bring popcorn.</span><br /><span data-reaction-shelf>Bring feelings.</span></>}</h1>
      <p className="login-subtitle" data-reaction-layout>{access ? 'Care.tv is invite-only for now. Ask Kier or a friend who’s already in.' : state === 'welcome' ? 'Taking you in…' :
        <>Host watch parties with your <span className="login-friends"><FriendAvatars />friends.</span></>}</p>
    </div>
    <div className="login-actions">
      {error && <p className="login-error" role="alert">{error}</p>}
      {children || <DiscordButton state={state} onClick={onDiscord} name={name} />}
    </div>
    <span className="login-announcement" role="status">{state === 'connecting' ? 'Opening Discord…' : state === 'welcome' ? 'Signed in. Taking you in…' : ''}</span>
    <ReactionCanvas stage={stage} state={state} resting={access} />
  </main>
}

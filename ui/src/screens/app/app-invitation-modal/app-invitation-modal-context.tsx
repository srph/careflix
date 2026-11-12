import { createContext, useCallback, useContext, useState } from 'react'

interface Player {
  partyId: AppId
  element: HTMLElement
}

const Context = createContext({
  isExpanded: false,
  setExpanded: (_value: boolean) => {},
  player: null as Player | null,
  registerPlayer: (_player: Player | null) => {}
})

export function InvitationOverlayProvider({ children }: ReactComponentWrapper) {
  const [isExpanded, setExpanded] = useState(false)
  const [player, setPlayer] = useState<Player | null>(null)
  const registerPlayer = useCallback((value: Player | null) => setPlayer(value), [])
  return <Context.Provider value={{ isExpanded, setExpanded, player, registerPlayer }}>{children}</Context.Provider>
}

export const useInvitationOverlay = () => useContext(Context)

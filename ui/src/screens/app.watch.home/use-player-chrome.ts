import { useReducer, useRef } from 'react'
import { useActivityLevel } from './app-watch-home-activity-level'

interface State {
  isOpen: boolean
  isSeasonSelectionOpen: boolean
  isChatOpen: boolean
  isInvitationOpen: boolean
  isKeyboardInfoOpen: boolean
  isSubtitleEnabled: boolean
}

type Action =
  | ReducerAction<'controls:open'>
  | ReducerAction<'controls:close'>
  | ReducerAction<'season-selection:toggle', { isSeasonSelectionOpen: boolean }>
  | ReducerAction<'invitation-modal:toggle', { isInvitationOpen: boolean }>
  | ReducerAction<'keyboard-info-modal:toggle', { isKeyboardInfoOpen: boolean }>
  | ReducerAction<'toggle-chat'>
  | ReducerAction<'toggle-subtitle'>

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'controls:open':
      return { ...state, isOpen: true }
    case 'controls:close':
      return { ...state, isOpen: false }
    case 'season-selection:toggle':
      return { ...state, isSeasonSelectionOpen: action.payload.isSeasonSelectionOpen }
    case 'invitation-modal:toggle':
      return { ...state, isInvitationOpen: action.payload.isInvitationOpen }
    case 'keyboard-info-modal:toggle':
      return { ...state, isKeyboardInfoOpen: action.payload.isKeyboardInfoOpen }
    case 'toggle-chat':
      return { ...state, isChatOpen: !state.isChatOpen }
    case 'toggle-subtitle':
      return { ...state, isSubtitleEnabled: !state.isSubtitleEnabled }
  }

  return state
}

/** The player's UI around the picture: the controls, chat, the modals, subtitles and the Activity Overlay level. */
export function usePlayerChrome(party: AppParty, user: AppUser) {
  const [activityLevel, setActivityLevel] = useActivityLevel(user.id)
  const [state, dispatch] = useReducer(reducer, {
    isOpen: false,
    isSeasonSelectionOpen: false,
    isChatOpen: true,
    isInvitationOpen: false,
    isKeyboardInfoOpen: false,
    isSubtitleEnabled: Boolean(party.video.subtitle_url)
  })

  const timeoutRef = useRef<number | undefined>(undefined)
  // The controls hide a while after the pointer last moved over the picture,
  // except while the Activity Overlay menu is open from them.
  const isActivityMenuOpenRef = useRef(false)

  function armControlsTimeout() {
    window.clearTimeout(timeoutRef.current)
    if (isActivityMenuOpenRef.current) return

    timeoutRef.current = window.setTimeout(() => {
      dispatch({ type: 'controls:close' })
    }, 5000)
  }

  return {
    state,
    activityLevel,
    setActivityLevel,
    openControls() {
      dispatch({ type: 'controls:open' })
    },
    /** Opens the controls and hides them again a while after the pointer stops. */
    showControlsForAWhile() {
      // No worries about optimizing this since `onMouseMove` no longer fires
      // after we've opened the overlay; the overlay contains the entire player.
      dispatch({ type: 'controls:open' })
      armControlsTimeout()
    },
    closeControls() {
      dispatch({ type: 'controls:close' })
    },
    activityMenuOpenChange(open: boolean) {
      isActivityMenuOpenRef.current = open
      armControlsTimeout()
    },
    openSeasonSelection() {
      dispatch({ type: 'season-selection:toggle', payload: { isSeasonSelectionOpen: true } })
    },
    closeSeasonSelection() {
      dispatch({ type: 'season-selection:toggle', payload: { isSeasonSelectionOpen: false } })
    },
    openInvitation() {
      dispatch({ type: 'invitation-modal:toggle', payload: { isInvitationOpen: true } })
    },
    closeInvitation() {
      dispatch({ type: 'invitation-modal:toggle', payload: { isInvitationOpen: false } })
    },
    openKeyboardInfo() {
      dispatch({ type: 'keyboard-info-modal:toggle', payload: { isKeyboardInfoOpen: true } })
    },
    closeKeyboardInfo() {
      dispatch({ type: 'keyboard-info-modal:toggle', payload: { isKeyboardInfoOpen: false } })
    },
    toggleChat() {
      dispatch({ type: 'toggle-chat' })
    },
    toggleSubtitle() {
      dispatch({ type: 'toggle-subtitle' })
    }
  }
}

export type PlayerChrome = ReturnType<typeof usePlayerChrome>

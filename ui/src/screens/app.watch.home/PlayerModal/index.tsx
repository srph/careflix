import { useInvitationOverlay } from '~/screens/app/InvitationModal/Context'
import * as React from 'react'
import { cn } from '~/utils/cn'
import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { UiPlainButton } from '~/components/ui-plain-button/ui-plain-button'
import { toReadableTime } from '~/utils/date/to-readable-time'
import { getVideoDetails } from '~/utils/shows/get-video-details'
import { Link } from 'react-router'
import { useMediaMode } from '~/hooks/use-media-mode'
import { useFullscreen } from '~/hooks/use-fullscreen'
import { usePlayerHotkeys } from '../usePlayerHotkeys'
import PlayerSeeker from '../PlayerSeeker'
import VolumeControl from '../VolumeControl'
import { Tooltip } from '@base-ui/react/tooltip'
import PlayerTooltip from '../PlayerTooltip'
import ActivityMenu from '../ActivityMenu'
import type { ActivityLevel } from '../activityLevel'

interface Props {
  party: AppParty
  time: number
  volume: number
  getVideoElement: () => HTMLVideoElement
  isOpen: boolean
  isPlaying: boolean
  isChatOpen: boolean
  isMuted: boolean
  isSeasonSelectionOpen: boolean
  isInvitationOpen: boolean
  isKeyboardInfoOpen: boolean
  isSubtitleEnabled: boolean
  activityLevel: ActivityLevel
  onChangeActivityLevel: (level: ActivityLevel) => void
  // The Activity Overlay menu opened or shut; the controls stay up while it's open.
  onActivityMenuOpenChange: (open: boolean) => void
  onClose: () => void
  onPlay: () => void
  onSeek: (time: number) => void
  onOpenSeasonSelection: () => void
  onOpenKeyboardInfo: () => void
  onCloseKeyboardInfo: () => void
  onChangeVolume: (volume: number) => void
  onToggleChat: () => void
  onToggleMute: () => void
  onToggleSubtitle: () => void
}

// An icon in the bottom bar. `CONTROL` ones (play, skip, volume) only show on desktop; phones and tablets use the buttons over the picture.
const ITEM = 'relative mr-8 text-xl leading-none text-white lg:text-3xl'
const CONTROL = `${ITEM} hidden lg:flex`
const TIME = 'shrink-0 text-base leading-none tabular-nums not-last:mr-4 lg:not-last:mr-8'
const SECTION = 'flex items-center'
const CENTER_ACTION = 'pointer-events-auto p-4 text-base leading-none'

/**
 * @TODO We might not need to use a modal here since it's only an overlay on desktop screens.
 */
function PlayerModal({ party, ...props }: Props) {
  const { isExpanded: isIncomingInvitationOpen } = useInvitationOverlay()
  const overlayRef = useRef<HTMLDivElement>(null)
  const media = useMediaMode()
  const [isFullscreen, toggleIsFullsceen] = useFullscreen()
  const [isVolumeControlOpen, setIsVolumeControlOpen] = useState(false)
  // Counted, not a flag: moving across the controls opens the next tooltip before the last one closes.
  const [openTooltips, setOpenTooltips] = useState(0)
  const isTooltipOpen = openTooltips > 0
  const [isRemainingTimeToggled, setIsRemainingTimeToggled] = useState(false)
  const [isRemainingTimeTooltipOpen, setIsRemainingTimeTooltipOpen] = useState(false)
  const [isActivityMenuOpen, setIsActivityMenuOpen] = useState(false)

  useEffect(() => {
    return () => {
      if (isFullscreen) {
        toggleIsFullsceen()
      }
    }
  }, [])

  useEffect(() => {
    // When the player overlay closes, we also want volume control to close in case it's open.
    if (!props.isOpen && isVolumeControlOpen) {
      setIsVolumeControlOpen(false)
    }
  }, [props.isOpen])

  usePlayerHotkeys({
    isDisabled() {
      return isIncomingInvitationOpen || isActivityMenuOpen || props.isSeasonSelectionOpen || props.isInvitationOpen || props.isKeyboardInfoOpen
    },
    onFullscreen() {
      toggleIsFullsceen()
    },
    onToggleChat() {
      props.onToggleChat()
    },
    onToggleMute() {
      props.onToggleMute()
    },
    onPlay() {
      props.onPlay()
    },
    onForward() {
      handleForward()
    },
    onBackward() {
      handleBackward()
    },
    onIncreaseVolume() {
      props.onChangeVolume((props.volume += 0.1))
    },
    onDecreaseVolume() {
      props.onChangeVolume((props.volume -= 0.1))
    },
    onToggleKeyboardInfo() {
      if (props.isKeyboardInfoOpen) {
        props.onCloseKeyboardInfo()
      } else {
        props.onOpenKeyboardInfo()
      }
    }
  })

  function handleForward() {
    props.onSeek(Math.min(props.time + 10, party.video.duration))
  }

  function handleBackward() {
    props.onSeek(Math.max(props.time - 10, 0))
  }

  function handleClickOverlay() {
    if (media === 'desktop') {
      props.getVideoElement().click()
    } else {
      props.onClose()
    }
  }

  function handleOpenVolumeControl() {
    setIsVolumeControlOpen(true)
  }

  function handleCloseVolumeControl() {
    setIsVolumeControlOpen(false)
  }

  function handleOpenTooltip() {
    setOpenTooltips(count => count + 1)
  }

  function handleCloseTooltip() {
    setOpenTooltips(count => Math.max(0, count - 1))
  }

  function handleOpenRemainingTimeTooltip() {
    handleOpenTooltip()
    setIsRemainingTimeTooltipOpen(true)
  }

  function handleActivityMenuOpenChange(open: boolean) {
    setIsActivityMenuOpen(open)
    props.onActivityMenuOpenChange(open)
  }

  function handleCloseRemainingTimeTooltip() {
    handleCloseTooltip()
    setIsRemainingTimeTooltipOpen(false)
  }

  return (
    // One provider for every control's tooltip: once one shows, moving to the next swaps it in
    // instantly (data-instant) instead of fading up again.
    <Tooltip.Provider>
    <div>
      <AnimatePresence initial={false}>
      {props.isOpen && (
        <motion.div data-testid="player-chrome" className="pointer-events-auto absolute inset-0 z-(--zindex-player-overlay)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.1 }}>
          <div className="absolute inset-0 bg-black/70 sm:bg-transparent sm:bg-linear-to-t sm:from-black/75 sm:to-transparent" ref={overlayRef} onClick={handleClickOverlay} />

          <Link to="/" className="absolute top-4 left-4 text-base leading-none text-white text-shadow-[0_1px_2px_rgb(0_0_0/0.5)] lg:text-xl">
            <span className="mr-4">
              <i className="fa fa-long-arrow-left" />
            </span>
            Back to Browse
          </Link>

          <div data-testid="player-mobile-actions" className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center justify-center lg:hidden">
            <UiPlainButton className={CENTER_ACTION} aria-label="Rewind by 10 seconds" onClick={handleBackward}>
              <i className="fa fa-backward" />
            </UiPlainButton>

            <UiPlainButton className="pointer-events-auto mx-4 flex size-10 items-center justify-center rounded-full bg-pink-500 text-base leading-none text-white" aria-label={props.isPlaying ? 'Pause' : 'Play'} onClick={props.onPlay}>
              {props.isPlaying ? (
                <i className="fa fa-pause" />
              ) : (
                <span className="pl-0.5">
                  <i className="fa fa-play" />
                </span>
              )}
            </UiPlainButton>

            <UiPlainButton className={CENTER_ACTION} aria-label="Forward by 10 seconds" onClick={handleForward}>
              <i className="fa fa-forward" />
            </UiPlainButton>
          </div>

          <div className="absolute inset-x-0 bottom-0 z-(--zindex-player-overlay-elements)">
            {/* The Activity Overlay menu sits over the seek bar, so the bar and its times step aside, like for the volume. */}
            {!isVolumeControlOpen && !isActivityMenuOpen && (isRemainingTimeTooltipOpen || !isTooltipOpen) && (
              <div data-testid="player-controls" className="flex items-center p-4 sm:px-4 sm:py-0 lg:px-8">
                <div className={TIME}>
                  {toReadableTime(props.time, {
                    max: party.video.duration > 3600 ? 'hh' : 'mm'
                  })}
                </div>

                <PlayerSeeker time={props.time} duration={party.video.duration} onSeek={props.onSeek} />

                <div className={TIME}>
                  <PlayerTooltip
                    text={isRemainingTimeToggled ? 'Display remaining time' : 'Display duration'}
                    align="right"
                    padding={16}
                    onOpen={handleOpenRemainingTimeTooltip}
                    onClose={handleCloseRemainingTimeTooltip}>
                    <UiPlainButton onClick={() => setIsRemainingTimeToggled(!isRemainingTimeToggled)}>
                      {isRemainingTimeToggled
                        ? toReadableTime(party.video.duration - props.time)
                        : toReadableTime(party.video.duration)}
                    </UiPlainButton>
                  </PlayerTooltip>
                </div>
              </div>
            )}

            <div data-testid="player-actions" className="hidden items-center justify-between p-4 sm:flex lg:px-8">
              {/* min-w-0 lets the title shorten with an ellipsis. */}
              <div className={`${SECTION} min-w-0`}>
                <PlayerTooltip
                  text={props.isPlaying ? 'Pause' : 'Play'}
                  align="left"
                  onOpen={handleOpenTooltip}
                  onClose={handleCloseTooltip}>
                  <div className={CONTROL}>
                    <UiPlainButton aria-label={props.isPlaying ? 'Pause' : 'Play'} onClick={props.onPlay}>
                      {props.isPlaying ? <i className="fa fa-pause" /> : <i className="fa fa-play" />}
                    </UiPlainButton>
                  </div>
                </PlayerTooltip>

                <PlayerTooltip
                  text="Rewind by 10 seconds"
                  align="left"
                  onOpen={handleOpenTooltip}
                  onClose={handleCloseTooltip}>
                  <div className={CONTROL}>
                    <UiPlainButton aria-label="Rewind by 10 seconds" onClick={handleBackward}>
                      <i className="fa fa-backward" />
                    </UiPlainButton>
                  </div>
                </PlayerTooltip>

                <PlayerTooltip
                  text="Forward by 10 seconds"
                  align="left"
                  onOpen={handleOpenTooltip}
                  onClose={handleCloseTooltip}>
                  <div className={CONTROL}>
                    <UiPlainButton aria-label="Forward by 10 seconds" onClick={handleForward}>
                      <i className="fa fa-forward" />
                    </UiPlainButton>
                  </div>
                </PlayerTooltip>

                <div className={CONTROL}>
                  <VolumeControl
                    volume={props.volume}
                    isMuted={props.isMuted}
                    isOpen={isVolumeControlOpen}
                    isOverlayOpen={props.isOpen}
                    onChangeVolume={props.onChangeVolume}
                    onOpen={handleOpenVolumeControl}
                    onClose={handleCloseVolumeControl}
                    onToggleMute={props.onToggleMute}
                    onOpenTooltip={handleOpenTooltip}
                    onCloseTooltip={handleCloseTooltip}
                  />
                </div>

                <h3 className="max-w-full truncate pr-8 text-xl leading-none font-medium">
                  <span>{party.video.show.title}</span>
                  <span className="ml-2 opacity-75">{getVideoDetails(party.video)}</span>
                </h3>
              </div>

              <div className={`${SECTION} shrink-0`}>
                {/* <div className="action">
                  <UiPlainButton className="icon">
                    <i className="fa fa-info-circle" />
                  </UiPlainButton>
                </div>

                <div className="action">
                  <UiPlainButton className="icon">
                    <i className="fa fa-cog" />
                  </UiPlainButton>
                </div> */}

                <PlayerTooltip
                  text="View keyboard shortcuts"
                  align="right"
                  onOpen={handleOpenTooltip}
                  onClose={handleCloseTooltip}>
                  <div className={`${ITEM} hidden lg:block`}>
                    <UiPlainButton aria-label="View keyboard shortcuts" onClick={props.onOpenKeyboardInfo}>
                      <i className="fa fa-keyboard-o" />
                    </UiPlainButton>
                  </div>
                </PlayerTooltip>

                {Boolean(party.video.subtitle_url) && (
                  <PlayerTooltip
                    text={props.isSubtitleEnabled ? 'Disable subtitles' : 'Enable subtitles'}
                    align="right"
                    onOpen={handleOpenTooltip}
                    onClose={handleCloseTooltip}>
                    <div className={cn(ITEM, !props.isSubtitleEnabled && 'opacity-50 transition-opacity duration-200')}>
                      <UiPlainButton aria-label={props.isSubtitleEnabled ? 'Disable subtitles' : 'Enable subtitles'} onClick={props.onToggleSubtitle}>
                        <i className="fa fa-align-center" />
                      </UiPlainButton>
                    </div>
                  </PlayerTooltip>
                )}

                {party.video.show.title_type === 'series' && (
                  <PlayerTooltip
                    text="Open Episode Selection"
                    align="right"
                    onOpen={handleOpenTooltip}
                    onClose={handleCloseTooltip}>
                    <div className={ITEM} onClick={props.onOpenSeasonSelection}>
                      <UiPlainButton aria-label="Open Episode Selection">
                        <i className="fa fa-list-ol" />
                      </UiPlainButton>
                    </div>
                  </PlayerTooltip>
                )}

                <PlayerTooltip
                  text={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                  align="right"
                  onOpen={handleOpenTooltip}
                  onClose={handleCloseTooltip}>
                  <div className={ITEM} onClick={toggleIsFullsceen}>
                    <UiPlainButton aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}>
                      {isFullscreen ? <i className="fa fa-compress" /> : <i className="fa fa-expand" />}
                    </UiPlainButton>
                  </div>
                </PlayerTooltip>

                <PlayerTooltip
                  text="Activity Overlay"
                  align="right"
                  disabled={isActivityMenuOpen}
                  onOpen={handleOpenTooltip}
                  onClose={handleCloseTooltip}>
                  <div className={ITEM}>
                    <ActivityMenu
                      level={props.activityLevel}
                      onChange={props.onChangeActivityLevel}
                      onOpenChange={handleActivityMenuOpenChange}
                    />
                  </div>
                </PlayerTooltip>

                <PlayerTooltip
                  text={props.isChatOpen ? 'Close Chat' : 'Open Chat'}
                  align="right"
                  onOpen={handleOpenTooltip}
                  onClose={handleCloseTooltip}>
                  <div className={cn(ITEM, 'mr-0')}>
                    <UiPlainButton aria-label={props.isChatOpen ? 'Close Chat' : 'Open Chat'} onClick={props.onToggleChat}>
                      {props.isChatOpen ? <i className="fa fa-comment-o" /> : <i className="fa fa-comment" />}
                    </UiPlainButton>
                  </div>
                </PlayerTooltip>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
    </Tooltip.Provider>
  )
}

export default PlayerModal

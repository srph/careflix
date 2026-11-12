import { useInvitationOverlay } from '~/screens/app/app-invitation-modal/app-invitation-modal-context'
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
import { usePlayerHotkeys } from './use-player-hotkeys'
import { AppWatchHomePlayerSeeker } from './app-watch-home-player-seeker'
import { AppWatchHomeVolumeControl } from './app-watch-home-volume-control'
import { Tooltip } from '@base-ui/react/tooltip'
import { AppWatchHomePlayerTooltip } from './app-watch-home-player-tooltip'
import { AppWatchHomeActivityMenu } from './app-watch-home-activity-menu'
import { useParty } from '~/screens/app.watch/use-party'
import { usePlayer } from './use-player'

// An icon in the bottom bar. `CONTROL` ones (play, skip, volume) only show on desktop; phones and tablets use the buttons over the picture.
const ITEM = 'relative mr-8 text-xl leading-none text-white lg:text-3xl'
const CONTROL = `${ITEM} hidden lg:flex`
const TIME = 'shrink-0 text-base leading-none tabular-nums not-last:mr-4 lg:not-last:mr-8'
const SECTION = 'flex items-center'
const CENTER_ACTION = 'pointer-events-auto p-4 text-base leading-none'

/** The controls over the picture; they show while the pointer moves over it (desktop) or after a tap (phones). */
export function AppWatchHomePlayerControls() {
  const party = useParty()
  const { player, chrome } = usePlayer()
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
    if (!chrome.state.isOpen && isVolumeControlOpen) {
      setIsVolumeControlOpen(false)
    }
  }, [chrome.state.isOpen])

  usePlayerHotkeys({
    isDisabled() {
      return (
        isIncomingInvitationOpen ||
        isActivityMenuOpen ||
        chrome.state.isSeasonSelectionOpen ||
        chrome.state.isInvitationOpen ||
        chrome.state.isKeyboardInfoOpen
      )
    },
    onFullscreen() {
      toggleIsFullsceen()
    },
    onToggleChat() {
      chrome.toggleChat()
    },
    onToggleMute() {
      player.toggleMute()
    },
    onPlay() {
      player.play()
    },
    onForward() {
      handleForward()
    },
    onBackward() {
      handleBackward()
    },
    onIncreaseVolume() {
      player.changeVolume(player.state.volume + 0.1)
    },
    onDecreaseVolume() {
      player.changeVolume(player.state.volume - 0.1)
    },
    onToggleKeyboardInfo() {
      if (chrome.state.isKeyboardInfoOpen) {
        chrome.closeKeyboardInfo()
      } else {
        chrome.openKeyboardInfo()
      }
    }
  })

  function handleForward() {
    player.seek(Math.min(player.state.time + 10, party.video.duration))
  }

  function handleBackward() {
    player.seek(Math.max(player.state.time - 10, 0))
  }

  function handleClickOverlay() {
    if (media === 'desktop') {
      player.$video.current!.click()
    } else {
      chrome.closeControls()
    }
  }

  function handleOpenVolumeControl() {
    setIsVolumeControlOpen(true)
  }

  function handleCloseVolumeControl() {
    setIsVolumeControlOpen(false)
  }

  function handleOpenTooltip() {
    setOpenTooltips((count) => count + 1)
  }

  function handleCloseTooltip() {
    setOpenTooltips((count) => Math.max(0, count - 1))
  }

  function handleOpenRemainingTimeTooltip() {
    handleOpenTooltip()
    setIsRemainingTimeTooltipOpen(true)
  }

  function handleActivityMenuOpenChange(open: boolean) {
    setIsActivityMenuOpen(open)
    chrome.activityMenuOpenChange(open)
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
          {chrome.state.isOpen && (
            <motion.div
              data-testid="player-chrome"
              className="pointer-events-auto absolute inset-0 z-(--zindex-player-overlay)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}>
              <div
                className="absolute inset-0 bg-black/70 sm:bg-transparent sm:bg-linear-to-t sm:from-black/75 sm:to-transparent"
                ref={overlayRef}
                onClick={handleClickOverlay}
              />

              <Link
                to="/"
                className="absolute top-4 left-4 text-base leading-none text-white text-shadow-[0_1px_2px_rgb(0_0_0/0.5)] lg:text-xl">
                <span className="mr-4">
                  <i className="fa fa-long-arrow-left" />
                </span>
                Back to Browse
              </Link>

              <div
                data-testid="player-mobile-actions"
                className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center justify-center lg:hidden">
                <UiPlainButton className={CENTER_ACTION} aria-label="Rewind by 10 seconds" onClick={handleBackward}>
                  <i className="fa fa-backward" />
                </UiPlainButton>

                <UiPlainButton
                  className="pointer-events-auto mx-4 flex size-10 items-center justify-center rounded-full bg-pink-500 text-base leading-none text-white"
                  aria-label={player.state.isPlaying ? 'Pause' : 'Play'}
                  onClick={player.play}>
                  {player.state.isPlaying ? (
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
                      {toReadableTime(player.state.time, {
                        max: party.video.duration > 3600 ? 'hh' : 'mm'
                      })}
                    </div>

                    <AppWatchHomePlayerSeeker
                      time={player.state.time}
                      duration={party.video.duration}
                      onSeek={player.seek}
                    />

                    <div className={TIME}>
                      <AppWatchHomePlayerTooltip
                        text={isRemainingTimeToggled ? 'Display remaining time' : 'Display duration'}
                        align="right"
                        padding={16}
                        onOpen={handleOpenRemainingTimeTooltip}
                        onClose={handleCloseRemainingTimeTooltip}>
                        <UiPlainButton onClick={() => setIsRemainingTimeToggled(!isRemainingTimeToggled)}>
                          {isRemainingTimeToggled
                            ? toReadableTime(party.video.duration - player.state.time)
                            : toReadableTime(party.video.duration)}
                        </UiPlainButton>
                      </AppWatchHomePlayerTooltip>
                    </div>
                  </div>
                )}

                <div data-testid="player-actions" className="hidden items-center justify-between p-4 sm:flex lg:px-8">
                  {/* min-w-0 lets the title shorten with an ellipsis. */}
                  <div className={`${SECTION} min-w-0`}>
                    <AppWatchHomePlayerTooltip
                      text={player.state.isPlaying ? 'Pause' : 'Play'}
                      align="left"
                      onOpen={handleOpenTooltip}
                      onClose={handleCloseTooltip}>
                      <div className={CONTROL}>
                        <UiPlainButton aria-label={player.state.isPlaying ? 'Pause' : 'Play'} onClick={player.play}>
                          {player.state.isPlaying ? <i className="fa fa-pause" /> : <i className="fa fa-play" />}
                        </UiPlainButton>
                      </div>
                    </AppWatchHomePlayerTooltip>

                    <AppWatchHomePlayerTooltip
                      text="Rewind by 10 seconds"
                      align="left"
                      onOpen={handleOpenTooltip}
                      onClose={handleCloseTooltip}>
                      <div className={CONTROL}>
                        <UiPlainButton aria-label="Rewind by 10 seconds" onClick={handleBackward}>
                          <i className="fa fa-backward" />
                        </UiPlainButton>
                      </div>
                    </AppWatchHomePlayerTooltip>

                    <AppWatchHomePlayerTooltip
                      text="Forward by 10 seconds"
                      align="left"
                      onOpen={handleOpenTooltip}
                      onClose={handleCloseTooltip}>
                      <div className={CONTROL}>
                        <UiPlainButton aria-label="Forward by 10 seconds" onClick={handleForward}>
                          <i className="fa fa-forward" />
                        </UiPlainButton>
                      </div>
                    </AppWatchHomePlayerTooltip>

                    <div className={CONTROL}>
                      <AppWatchHomeVolumeControl
                        volume={player.state.volume}
                        isMuted={player.state.isMuted}
                        isOpen={isVolumeControlOpen}
                        isOverlayOpen={chrome.state.isOpen}
                        onChangeVolume={player.changeVolume}
                        onOpen={handleOpenVolumeControl}
                        onClose={handleCloseVolumeControl}
                        onToggleMute={player.toggleMute}
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

                    <AppWatchHomePlayerTooltip
                      text="View keyboard shortcuts"
                      align="right"
                      onOpen={handleOpenTooltip}
                      onClose={handleCloseTooltip}>
                      <div className={`${ITEM} hidden lg:block`}>
                        <UiPlainButton aria-label="View keyboard shortcuts" onClick={chrome.openKeyboardInfo}>
                          <i className="fa fa-keyboard-o" />
                        </UiPlainButton>
                      </div>
                    </AppWatchHomePlayerTooltip>

                    {Boolean(party.video.subtitle_url) && (
                      <AppWatchHomePlayerTooltip
                        text={chrome.state.isSubtitleEnabled ? 'Disable subtitles' : 'Enable subtitles'}
                        align="right"
                        onOpen={handleOpenTooltip}
                        onClose={handleCloseTooltip}>
                        <div
                          className={cn(
                            ITEM,
                            !chrome.state.isSubtitleEnabled && 'opacity-50 transition-opacity duration-200'
                          )}>
                          <UiPlainButton
                            aria-label={chrome.state.isSubtitleEnabled ? 'Disable subtitles' : 'Enable subtitles'}
                            onClick={chrome.toggleSubtitle}>
                            <i className="fa fa-align-center" />
                          </UiPlainButton>
                        </div>
                      </AppWatchHomePlayerTooltip>
                    )}

                    {party.video.show.title_type === 'series' && (
                      <AppWatchHomePlayerTooltip
                        text="Open Episode Selection"
                        align="right"
                        onOpen={handleOpenTooltip}
                        onClose={handleCloseTooltip}>
                        <div className={ITEM} onClick={chrome.openSeasonSelection}>
                          <UiPlainButton aria-label="Open Episode Selection">
                            <i className="fa fa-list-ol" />
                          </UiPlainButton>
                        </div>
                      </AppWatchHomePlayerTooltip>
                    )}

                    <AppWatchHomePlayerTooltip
                      text={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                      align="right"
                      onOpen={handleOpenTooltip}
                      onClose={handleCloseTooltip}>
                      <div className={ITEM} onClick={toggleIsFullsceen}>
                        <UiPlainButton aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}>
                          {isFullscreen ? <i className="fa fa-compress" /> : <i className="fa fa-expand" />}
                        </UiPlainButton>
                      </div>
                    </AppWatchHomePlayerTooltip>

                    <AppWatchHomePlayerTooltip
                      text="Activity Overlay"
                      align="right"
                      disabled={isActivityMenuOpen}
                      onOpen={handleOpenTooltip}
                      onClose={handleCloseTooltip}>
                      <div className={ITEM}>
                        <AppWatchHomeActivityMenu
                          level={chrome.activityLevel}
                          onChange={chrome.setActivityLevel}
                          onOpenChange={handleActivityMenuOpenChange}
                        />
                      </div>
                    </AppWatchHomePlayerTooltip>

                    <AppWatchHomePlayerTooltip
                      text={chrome.state.isChatOpen ? 'Close Chat' : 'Open Chat'}
                      align="right"
                      onOpen={handleOpenTooltip}
                      onClose={handleCloseTooltip}>
                      <div className={cn(ITEM, 'mr-0')}>
                        <UiPlainButton
                          aria-label={chrome.state.isChatOpen ? 'Close Chat' : 'Open Chat'}
                          onClick={chrome.toggleChat}>
                          {chrome.state.isChatOpen ? (
                            <i className="fa fa-comment-o" />
                          ) : (
                            <i className="fa fa-comment" />
                          )}
                        </UiPlainButton>
                      </div>
                    </AppWatchHomePlayerTooltip>
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

import './style.css'
import * as React from 'react'
import { useState, useRef, useEffect } from 'react'
import Transition from 'react-addons-css-transition-group'
import UiPlainButton from '~/components/UiPlainButton'
import Slider, { SliderValue } from 'react-input-slider'
import toReadableTime from '~/utils/date/toReadableTime'
import getVideoDetails from '~/utils/shows/getVideoDetails'
import { Link } from 'react-router-dom'
import { useMediaMode } from '~/hooks/useMediaMode'
import { useFullscreen } from '~/hooks/useFullscreen'
import { usePlayerHotkeys } from '../usePlayerHotkeys'
import VolumeControl from '../VolumeControl'
import PlayerTooltip from '../PlayerTooltip'

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
  onClose: () => void
  onPlay: () => void
  onSeek: (time: number) => void
  onOpenSeasonSelection: () => void
  onOpenKeyboardInfo: () => void
  onCloseKeyboardInfo: () => void
  onChangeVolume: (volume: number) => void
  onToggleChat: () => void
  onToggleMute: () => void
}

/**
 * @TODO We might not need to use a modal here since it's only an overlay on desktop screens.
 */
function PlayerModal({ party, ...props }: Props) {
  const overlayRef = useRef<HTMLDivElement>()
  const media = useMediaMode()
  const [isFullscreen, toggleIsFullsceen] = useFullscreen()
  const [isVolumeControlOpen, setIsVolumeControlOpen] = useState(false)
  const [isTooltipOpen, setIsTooltipOpen] = useState(false)

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
      return props.isSeasonSelectionOpen || props.isInvitationOpen || props.isKeyboardInfoOpen
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
    onToggleKeyboardInfo() {
      if (props.isKeyboardInfoOpen) {
        props.onCloseKeyboardInfo()
      } else {
        props.onOpenKeyboardInfo()
      }
    }
  })

  function handleSeek({ x }: SliderValue) {
    props.onSeek(x)
  }

  function handleForward() {
    props.onSeek(Math.min(props.time + 10, party.video.duration))
  }

  function handleBackward() {
    props.onSeek(Math.max(props.time - 10, 0))
  }

  function handleClickOverlay(evt: React.MouseEvent<HTMLDivElement>) {
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
    setIsTooltipOpen(true)
  }

  function handleCloseTooltip() {
    setIsTooltipOpen(false)
  }

  return (
    <Transition
      component="div"
      transitionName={{
        enter: '-enter',
        leave: '-leave'
      }}
      transitionEnterTimeout={100}
      transitionLeaveTimeout={100}>
      {props.isOpen && (
        <div className="watch-player-container">
          <div className="watch-player-overlay" ref={overlayRef} onClick={handleClickOverlay} />

          <Link to="/" className="watch-player-browse">
            <span className="icon">
              <i className="fa fa-long-arrow-left" />
            </span>
            Back to Browse
          </Link>

          <div className="watch-player-mobile-actions">
            <UiPlainButton className="action" onClick={handleBackward}>
              <i className="fa fa-backward" />
            </UiPlainButton>

            <UiPlainButton className="toggle" onClick={props.onPlay}>
              {props.isPlaying ? (
                <i className="fa fa-pause" />
              ) : (
                <span className="play">
                  <i className="fa fa-play" />
                </span>
              )}
            </UiPlainButton>

            <UiPlainButton className="action" onClick={handleForward}>
              <i className="fa fa-forward" />
            </UiPlainButton>
          </div>

          <div className="watch-player-contents">
            {(!isVolumeControlOpen && !isTooltipOpen) && (
              <div className="watch-player-controls">
                <div className="time">
                  {toReadableTime(props.time, {
                    max: party.video.duration > 3600 ? 'hh' : 'mm'
                  })}
                </div>

                <div className="slider">
                  <Slider
                    axis="x"
                    x={props.time}
                    xmin={0}
                    xmax={party.video.duration}
                    onChange={handleSeek}
                    styles={{
                      active: { background: 'var(--color-primary)' },
                      thumb: {
                        background: 'var(--color-primary)',
                        height: 28,
                        width: 28
                      },
                      track: {
                        width: '100%',
                        height: 8,
                        cursor: 'pointer'
                      }
                    }}
                  />
                </div>

                <div className="time">{toReadableTime(party.video.duration)}</div>
              </div>
            )}

            <div className="watch-player-modal-actions">
              <div className="section">
                <PlayerTooltip text={props.isPlaying ? 'Pause' : 'Play'} align="left" onOpen={handleOpenTooltip} onClose={handleCloseTooltip}>
                  <div className="watch-player-modal-action-item">
                    <UiPlainButton className="icon" onClick={props.onPlay}>
                      {props.isPlaying ? <i className="fa fa-pause" /> : <i className="fa fa-play" />}
                    </UiPlainButton>
                  </div>
                </PlayerTooltip>

                <PlayerTooltip text="Rewind by 10 seconds" align="left" onOpen={handleOpenTooltip} onClose={handleCloseTooltip}>
                  <div className="watch-player-modal-action-item">
                    <UiPlainButton className="icon" onClick={handleBackward}>
                      <i className="fa fa-backward" />
                    </UiPlainButton>
                  </div>
                </PlayerTooltip>

                <PlayerTooltip text="Forward by 10 seconds" align="left" onOpen={handleOpenTooltip} onClose={handleCloseTooltip}>
                  <div className="watch-player-modal-action-item">
                    <UiPlainButton className="icon" onClick={handleForward}>
                      <i className="fa fa-forward" />
                    </UiPlainButton>
                  </div>
                </PlayerTooltip>

                <div className="watch-player-modal-action-item">
                  <VolumeControl
                    volume={props.volume}
                    isMuted={props.isMuted}
                    isOpen={isVolumeControlOpen}
                    isOverlayOpen={props.isOpen}
                    onChangeVolume={props.onChangeVolume}
                    onOpen={handleOpenVolumeControl}
                    onClose={handleCloseVolumeControl}
                    onToggleMute={props.onToggleMute}
                  />
                </div>

                <h3 className="watch-player-modal-title">
                  <span className="title">{party.video.show.title}</span>
                  <span className="info">{getVideoDetails(party.video)}</span>
                </h3>
              </div>

              <div className="section">
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

                <PlayerTooltip text="View keyboard shortcuts" align="right" onOpen={handleOpenTooltip} onClose={handleCloseTooltip}>
                  <div className="watch-player-modal-action-item is-keyboard-icon">
                    <UiPlainButton className="icon" onClick={props.onOpenKeyboardInfo}>
                      <i className="fa fa-keyboard-o" />
                    </UiPlainButton>
                  </div>
                </PlayerTooltip>

                {party.video.show.title_type === 'series' && (
                  <PlayerTooltip text="Open Episode Selection" align="right" onOpen={handleOpenTooltip} onClose={handleCloseTooltip}>
                    <div className="watch-player-modal-action-item" onClick={props.onOpenSeasonSelection}>
                      <UiPlainButton className="icon">
                        <i className="fa fa-list-ol" />
                      </UiPlainButton>
                    </div>
                  </PlayerTooltip>
                )}

                <PlayerTooltip text={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'} align="right" onOpen={handleOpenTooltip} onClose={handleCloseTooltip}>
                  <div className="watch-player-modal-action-item is-fs-icon" onClick={toggleIsFullsceen}>
                    <UiPlainButton className="icon">
                      {isFullscreen ? <i className="fa fa-compress" /> : <i className="fa fa-expand" />}
                    </UiPlainButton>
                  </div>
                </PlayerTooltip>

                <PlayerTooltip text={props.isChatOpen ? 'Close Chat' : 'Open Chat'} align="right" onOpen={handleOpenTooltip} onClose={handleCloseTooltip}>
                  <div className="watch-player-modal-action-item is-chat-icon">
                    <UiPlainButton className="icon" onClick={props.onToggleChat}>
                      {props.isChatOpen ? <i className="fa fa-comment-o" /> : <i className="fa fa-comment" />}
                    </UiPlainButton>
                  </div>
                </PlayerTooltip>
              </div>
            </div>
          </div>
        </div>
      )}
    </Transition>
  )
}

export default PlayerModal

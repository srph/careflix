import './VideoStage.css'

/**
 * The video side of the watch screen.
 *
 * There is intentionally no real <video> here — drop a frame capture in later
 * by setting a `background-image` on `.watch-screen-video > .poster`
 * (see VideoStage.css for the hook), or replace the element entirely.
 */
function VideoStage() {
  // Static progress purely for the thumbnail composition.
  const progress = 34

  return (
    <div className="watch-screen-video">
      <div className="poster">
        {/* Back to browse */}
        <a className="watch-player-browse" href="#">
          <span className="icon">
            <i className="fa fa-long-arrow-left" />
          </span>
          Back to Browse
        </a>

        {/* Bottom overlay: gradient + controls */}
        <div className="watch-player-overlay" />

        <div className="watch-player-contents">
          <div className="watch-player-controls">
            <div className="time">21:04</div>

            <div className="app-watch-player-seeker">
              <div className="track">
                <div className="fill" style={{ width: `${progress}%` }} />
                <div className="knob" style={{ left: `${progress}%` }} />
              </div>
            </div>

            <div className="time">48:32</div>
          </div>

          <div className="watch-player-modal-actions">
            <div className="section">
              <div className="watch-player-modal-action-item is-control">
                <button className="ui-plain-button icon" aria-label="Play">
                  <i className="fa fa-play" />
                </button>
              </div>
              <div className="watch-player-modal-action-item is-control">
                <button className="ui-plain-button icon" aria-label="Rewind">
                  <i className="fa fa-backward" />
                </button>
              </div>
              <div className="watch-player-modal-action-item is-control">
                <button className="ui-plain-button icon" aria-label="Forward">
                  <i className="fa fa-forward" />
                </button>
              </div>
              <div className="watch-player-modal-action-item is-control">
                <button className="ui-plain-button icon" aria-label="Volume">
                  <i className="fa fa-volume-up" />
                </button>
              </div>

              <h3 className="watch-player-modal-title">
                <span className="title">The Bear</span>
                <span className="info">S2 · E7 · Forks</span>
              </h3>
            </div>

            <div className="section">
              <div className="watch-player-modal-action-item is-keyboard-icon">
                <button className="ui-plain-button icon" aria-label="Keyboard shortcuts">
                  <i className="fa fa-keyboard-o" />
                </button>
              </div>
              <div className="watch-player-modal-action-item">
                <button className="ui-plain-button icon" aria-label="Subtitles">
                  <i className="fa fa-align-center" />
                </button>
              </div>
              <div className="watch-player-modal-action-item">
                <button className="ui-plain-button icon" aria-label="Episodes">
                  <i className="fa fa-list-ol" />
                </button>
              </div>
              <div className="watch-player-modal-action-item is-fs-icon">
                <button className="ui-plain-button icon" aria-label="Fullscreen">
                  <i className="fa fa-expand" />
                </button>
              </div>
              <div className="watch-player-modal-action-item is-chat-icon">
                <button className="ui-plain-button icon" aria-label="Toggle chat">
                  <i className="fa fa-comment-o" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoStage

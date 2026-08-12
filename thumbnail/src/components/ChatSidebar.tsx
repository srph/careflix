import './ChatSidebar.css'
import cx from 'classnames'
import { useState } from 'react'
import { UiAvatar, UiAvatarGroup } from './Avatar'
import { members, logs, self } from '../data'

function firstName(name: string) {
  return name.split(' ')[0]
}

function ChatSidebar(props: { isChatOpen?: boolean }) {
  const [message, setMessage] = useState('')

  return (
    <div className={cx('watch-screen-chat', { 'is-chat-open': props.isChatOpen ?? true })}>
      {/* Canopy — online presence + invite button */}
      <div className="watch-screen-canopy">
        <UiAvatarGroup users={members} />

        <button className="ui-plain-button invite" type="button">
          Invite
        </button>
      </div>

      {/* Messages */}
      <div className="watch-screen-chat-messages-container">
        <div className="watch-screen-chat-messages">
          {logs.map((log, i) => {
            if (log.type === 'activity') {
              return (
                <div className="watch-screen-activity-group" key={i}>
                  <div className="activity">
                    <UiAvatar user={log.user} size="sm" />
                    <h6 className="ui-subheading">
                      <strong className="name">{firstName(log.user.name)}</strong> {log.text}
                    </h6>
                  </div>
                </div>
              )
            }

            const isSelf = log.user.id === self.id

            return (
              <div className={cx('watch-screen-chat-group', { 'is-self': isSelf })} key={i}>
                <div className="avatar">
                  <UiAvatar user={log.user} />
                </div>

                <div className="messages">
                  {!isSelf && <div className="name">{log.user.name}</div>}

                  <div className="list">
                    {log.texts.map((text, j) => (
                      <div className="message" key={j}>
                        <div className="inner">{text}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Chatbar */}
      <div className="watch-screen-chatbar">
        <form className="watch-screen-chatbar-input" onSubmit={e => e.preventDefault()}>
          <textarea
            className="textarea"
            placeholder="Press / to focus"
            rows={1}
            value={message}
            onChange={e => setMessage(e.target.value)}
          />

          <button
            className="ui-plain-button button"
            type="submit"
            disabled={!message.trim()}
            aria-label="Send message">
            <i className="fa fa-arrow-up" />
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatSidebar

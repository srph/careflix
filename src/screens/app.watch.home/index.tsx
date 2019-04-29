import "./style";

import * as React from "react";
import UiAvatar from '~/components/UiAvatar'

/**
 * Use this to create a route instead of typing everything down
 */
function AppWatchHome(props: ReactComponentWrapper) {
  return (
    <React.Fragment>
      <div className="watch-screen">
        <div
          className="watch-screen-video"
          style={{
            backgroundImage: `url(${require("~/assets/show-thumbnail-218x146.jpg")})`
          }}
        />

        <div className="watch-screen-chat">
          <div className="watch-screen-chat-group is-self">
            <div className="avatar">
              <UiAvatar img={require("~/assets/dummy-avatar.png")} />
            </div>

            <div className="messages">
              <div className="message">
                <div className="inner">kinda</div>
              </div>

              <div className="message">
                <div className="inner">
                  it wasn't that bad if you ask me. it was just weird.
                </div>
              </div>
            </div>
          </div>

          <div className="watch-screen-chat-group">
            <div className="avatar">
              <UiAvatar img={require("~/assets/dummy-avatar.png")} />
            </div>

            <div className="messages">
              <div className="message">
                <div className="inner">what'd you think</div>
              </div>

              <div className="message">
                <div className="inner">did you like it?</div>
              </div>

              <div className="message">
                <div className="inner">hey</div>
              </div>
            </div>
          </div>

          <div className="watch-screen-chat-group is-self">
            <div className="avatar">
              <UiAvatar img={require("~/assets/dummy-avatar.png")} />
            </div>

            <div className="messages">
              <div className="message">
                <div className="inner">kinda</div>
              </div>

              <div className="message">
                <div className="inner">
                  it wasn't that bad if you ask me. it was just weird.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="watch-screen-chatbar">
          <input
            type="text"
            className="ui-input"
            placeholder="Write something..."
          />
        </div>
      </div>
      {props.children}
    </React.Fragment>
  );
}

export default AppWatchHome;

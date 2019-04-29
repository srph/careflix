import "./style";

import * as React from "react";
import UiButton from '~/components/UiButton'
import UiAvatar from '~/components/UiAvatar'

/**
 * Use this to create a route instead of typing everything down
 */
function AppWatchInvite(props: ReactComponentWrapper) {
  return (
    <React.Fragment>
      <div className="invite-searchbar">
        <input type="text" className="ui-input" placeholder="Search for a friend to invite..." />
      </div>

      {Array(4).fill(0).map((user, i) =>
        <div className="user-item" key={i}>
          <div className="avatar">
            <UiAvatar img={require('~/assets/dummy-avatar.png')} size="m" />
          </div>

          <div className="details">
            <h3 className="name">Kier Borromeo</h3>
            <h6 className="meta">Expires in 10s</h6>
          </div>

          <div className="action">
            <UiButton>Cancel</UiButton>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

export default AppWatchInvite;

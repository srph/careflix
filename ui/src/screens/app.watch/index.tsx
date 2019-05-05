import "./style";
import * as React from "react";
import { NavLink } from "react-router-dom";
import AppHeadingSettings from '~/screens/app/AppHeadingSettings'
/**
 * Use this to create a route instead of typing everything down
 */
function AppWatch(props: ReactComponentWrapper) {
  return (
    <React.Fragment>
      <AppHeadingSettings title="Watch" backUrl="/" />

      <div className="nav-tabs">
        <NavLink to="/watch/1" className="link" exact activeClassName="is-active">
          Watch
        </NavLink>

        <NavLink to="/watch/1/invite" className="link" activeClassName="is-active">
          Invite Friends
        </NavLink>
      </div>

      {props.children}
    </React.Fragment>
  );
}

export default AppWatch;

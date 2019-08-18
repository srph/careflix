import './style'

import * as React from 'react'
import UiAvatar from '~/components/UiAvatar'
import UiContainer from '~/components/UiContainer'
import { Link } from 'react-router-dom'

import AppHeadingSettings from '~/screens/app/AppHeadingSettings'

import { useUnstated } from '~/lib/unstated'
import { AuthContainer } from '~/containers'

import { useIsPWA } from '~/hooks/useIsPWA'
import useWindowSize from 'react-use/lib/useWindowSize'

import config from '~/config'
import asset_author from '~/assets/author.jpg'

/**
 * Use this to create a route instead of typing everything down
 */
function AppSettings(props: ReactComponentWrapper) {
  const auth = useUnstated(AuthContainer)

  const { width } = useWindowSize()

  const isPWA = useIsPWA()

  return (
    <React.Fragment>
      <AppHeadingSettings title="Settings" backUrl="/" />

      <UiContainer size="sm">
        <div className="settings-page">
          <div className="settings-user-info">
            <div className="avatar">
              <UiAvatar user={auth.state.data} size="l" />
            </div>

            <div className="info">
              <h2 className="name">{auth.state.data.name}</h2>
              <div className="description">
                <h6 className="ui-subheading">View Your Profile</h6>
              </div>
            </div>

            <div className="caret">
              <i className="fa fa-angle-right" />
            </div>
          </div>

          <div className="settings-menu-list">
            <Link to="/settings/profile" className="item">
              <div className="icon">
                <i className="fa fa-cog" />
              </div>

              <div className="text">Account settings</div>

              <div className="caret">
                <i className="fa fa-angle-right" />
              </div>
            </Link>

            <Link to="/settings/password" className="item">
              <div className="icon">
                <i className="fa fa-lock" />
              </div>

              <div className="text">Update password</div>

              <div className="caret">
                <i className="fa fa-angle-right" />
              </div>
            </Link>

            {!isPWA && (
              <Link to="/download" className="item">
                <div className="icon">
                  <i className="fa fa-android" />
                </div>

                <div className="text">Download the app</div>

                <div className="caret">
                  <i className="fa fa-angle-right" />
                </div>
              </Link>
            )}

            <Link to="/settings/faq" className="item">
              <div className="icon">
                <i className="fa fa-question" />
              </div>

              <div className="text">Frequently asked questions</div>

              <div className="caret">
                <i className="fa fa-angle-right" />
              </div>
            </Link>

            <a href={config.links.changelogs} target="_blank" className="item">
              <div className="icon">
                <i className="fa fa-newspaper-o" />
              </div>

              <div className="text">Changelogs</div>

              <div className="caret">
                <i className="fa fa-angle-right" />
              </div>
            </a>

            <Link to="/logout" className="item">
              <div className="icon">
                <i className="fa fa-long-arrow-left" />
              </div>

              <div className="text">Logout</div>

              <div className="caret">
                <i className="fa fa-angle-right" />
              </div>
            </Link>
          </div>

          <div className="settings-credits">
            <div className="avatar">
              <UiAvatar img={asset_author} size="m" />
            </div>

            <h6 className="ui-subheading">Crafted by Kier Borromeo</h6>
          </div>
        </div>
      </UiContainer>
    </React.Fragment>
  )
}

export default AppSettings

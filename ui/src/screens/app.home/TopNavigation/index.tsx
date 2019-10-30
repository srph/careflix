import './style'
import * as React from 'react'
import UiAvatar from '~/components/UiAvatar'
import UiLogo from '~/components/UiLogo'
import UiContainer from '~/components/UiContainer'
import { Link } from 'react-router-dom'
import { useAuth } from '~/contexts/Auth'

function TopNavigation() {
  const auth = useAuth()

  return (
    <div className="app-home-top-navigation-shape">
      <UiContainer size="xl">
        <div className="app-home-top-navigation">
          <div className="logo">
            <UiLogo />
          </div>

          <Link to="/settings" className="avatar">
            <UiAvatar user={auth.data} />
          </Link>
        </div>
      </UiContainer>
    </div>
  )
}

export default TopNavigation

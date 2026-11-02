import './style.css'
import * as React from 'react'
import UiAvatar from '~/components/UiAvatar'
import UiNavigation from '~/components/UiNavigation'
import routerModule from 'use-react-router'
import { useAuth } from '~/contexts/Auth'

const useReactRouter = (routerModule as typeof routerModule & { default?: typeof routerModule }).default || routerModule
const headings: Record<string, { title: string; backUrl: string }> = {
  '/download': { title: 'Download The App', backUrl: '/' },
  '/settings': { title: 'Settings', backUrl: '/' },
  '/settings/profile': { title: 'Account Settings', backUrl: '/settings' },
  '/settings/password': { title: 'Change Password', backUrl: '/settings' },
  '/settings/faq': { title: 'FAQ', backUrl: '/settings' },
}

function AppHeading() {
  const auth = useAuth()
  const { location } = useReactRouter()
  if (location.pathname.includes('watch')) return null
  const heading = headings[location.pathname.replace(/\/$/, '')]
  return (
    <UiNavigation>
      {heading ? <UiNavigation.BackAction to={heading.backUrl} /> : <UiNavigation.Action />}
      {heading ? <UiNavigation.Title>{heading.title}</UiNavigation.Title> : <UiNavigation.Logo />}
      <UiNavigation.Action to="/settings"><UiAvatar user={auth.data} /></UiNavigation.Action>
    </UiNavigation>
  )
}

export default AppHeading

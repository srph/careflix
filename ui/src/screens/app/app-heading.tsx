import * as React from 'react'
import { UiAvatar } from '~/components/ui-avatar/ui-avatar'
import { UiNavigation } from '~/components/ui-navigation/ui-navigation'
import { useLocation } from 'react-router'
import { useAuth } from '~/lib/auth/auth-queries'

const headings: Record<string, { title: string; backUrl: string }> = {
  '/download': { title: 'Download The App', backUrl: '/' },
  '/settings': { title: 'Settings', backUrl: '/' },
  '/settings/profile': { title: 'Account Settings', backUrl: '/settings' },
  '/settings/faq': { title: 'FAQ', backUrl: '/settings' }
}

export function AppHeading() {
  const auth = useAuth()
  const location = useLocation()
  if (location.pathname === '/' || location.pathname.includes('watch')) return null
  const heading = headings[location.pathname.replace(/\/$/, '')]
  return (
    <UiNavigation>
      {heading ? <UiNavigation.BackAction to={heading.backUrl} /> : <UiNavigation.Action />}
      {heading ? <UiNavigation.Title>{heading.title}</UiNavigation.Title> : <UiNavigation.Logo />}
      <UiNavigation.Action to="/settings">
        <UiAvatar user={auth.user} />
      </UiNavigation.Action>
    </UiNavigation>
  )
}

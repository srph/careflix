import * as React from 'react'
import UiAvatar from '~/components/UiAvatar'
import UiContainer from '~/components/UiContainer'
import { Link } from 'react-router'

import AppHeadingSettings from '~/screens/app/AppHeadingSettings'

import { useAuth } from '~/contexts/Auth'
import { useIsPWA } from '~/hooks/useIsPWA'

import config from '~/config'
import asset_author from '~/assets/author.jpg'

const ITEM = 'flex items-center border-b border-neutral-900 p-4 text-white first:border-t'

function MenuItem({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <React.Fragment>
      <div className="w-6 text-neutral-400">
        <i className={`fa ${icon}`} />
      </div>

      <div>{children}</div>

      <div className="ml-auto">
        <i className="fa fa-angle-right" />
      </div>
    </React.Fragment>
  )
}

/**
 * Use this to create a route instead of typing everything down
 */
function AppSettings() {
  const auth = useAuth()
  const isPWA = useIsPWA()

  return (
    <React.Fragment>
      <AppHeadingSettings title="Settings" backUrl="/" />

      <UiContainer size="sm">
        <div className="relative h-[calc(100%-50px)]">
          <div className="-mt-4 flex items-center px-4 pt-12 pb-8">
            <div className="mr-4 shrink-0">
              <UiAvatar user={auth.data} size="l" />
            </div>

            {/* min-w-0 lets the name shrink so it can end in an ellipsis. */}
            <div className="w-full min-w-0">
              <h2 className="truncate text-2xl font-bold">{auth.data.name}</h2>
              <div className="shrink-0 text-neutral-400">
                <h6 className="font-label text-xs font-bold tracking-label uppercase">View Your Profile</h6>
              </div>
            </div>

            <div className="ml-auto pl-4">
              <i className="fa fa-angle-right" />
            </div>
          </div>

          <div>
            <Link to="/settings/profile" className={ITEM}>
              <MenuItem icon="fa-cog">Account settings</MenuItem>
            </Link>

            {!isPWA && (
              <Link to="/download" className={ITEM}>
                <MenuItem icon="fa-android">Download the app</MenuItem>
              </Link>
            )}

            <Link to="/settings/faq" className={ITEM}>
              <MenuItem icon="fa-question">Frequently asked questions</MenuItem>
            </Link>

            <a href={config.links.changelogs} target="_blank" className={ITEM}>
              <MenuItem icon="fa-newspaper-o">Changelogs</MenuItem>
            </a>

            <Link to="/logout" className={ITEM}>
              <MenuItem icon="fa-long-arrow-left">Logout</MenuItem>
            </Link>
          </div>

          <div className="absolute inset-x-4 bottom-4 text-center">
            <div className="mb-4">
              <UiAvatar img={asset_author} size="m" />
            </div>

            <h6 className="font-label text-xs font-bold tracking-label uppercase text-neutral-400">Crafted by Kier Borromeo</h6>
          </div>
        </div>
      </UiContainer>
    </React.Fragment>
  )
}

export default AppSettings

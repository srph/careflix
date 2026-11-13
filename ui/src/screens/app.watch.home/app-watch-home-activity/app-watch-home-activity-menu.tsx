import * as React from 'react'
import cx from 'classnames'
import { Menu } from '@base-ui/react/menu'
import { UiPlainButton } from '~/components/ui-plain-button/ui-plain-button'
import { usePinPlayaOverlay } from '~/components/playa/playa'
import { PLAYA_ITEM } from '~/components/playa/playa-controls'
import { PlayaTooltip } from '~/components/playa/playa-tooltip'
import { useWatchLayout } from '../app-watch-home-layout'
import { ACTIVITY_COPY, ACTIVITY_LEVELS, isActivityLevel } from './app-watch-home-activity-level'
import { AppWatchHomeActivityMenuPreview } from './app-watch-home-activity-menu-preview'

/**
 * The bell in the player controls. It shows the level at a glance (bell, outline, crossed out)
 * and opens a menu of the three levels, each with a close-up of what it puts on the picture.
 * The menu opens with a fade while it grows from 60% out of the bell (200ms) and shuts with a fade only (150ms),
 * both in-out expo. Base UI sets --transform-origin from the hidden arrow under the bell.
 * While it's open the controls stay up and the timeline steps aside, since the menu sits over it.
 */
export function AppWatchHomeActivityMenu() {
  const { activityLevel: level, setActivityLevel } = useWatchLayout()
  const [isOpen, setIsOpen] = React.useState(false)
  usePinPlayaOverlay(isOpen)

  return (
    <PlayaTooltip text="Activity Overlay" align="right" disabled={isOpen} className={PLAYA_ITEM}>
      <Menu.Root onOpenChange={setIsOpen}>
        <Menu.Trigger render={<UiPlainButton aria-label="Activity Overlay" data-level={level} />}>
          <i className={cx('fa', ACTIVITY_COPY[level].icon)} aria-hidden="true" />
        </Menu.Trigger>

        <Menu.Portal>
          <Menu.Positioner side="top" align="end" sideOffset={20} className="z-(--zindex-player-tooltip) outline-none">
            <Menu.Popup className="w-93 origin-(--transform-origin) rounded-xl bg-neutral-900 p-1.5 text-white shadow-[0_16px_36px_-12px_#000] ring-1 ring-white/7 transition-[opacity,scale] duration-200 ease-in-out-expo outline-none data-ending-style:opacity-0 data-ending-style:duration-150 data-starting-style:scale-60 data-starting-style:opacity-0 motion-reduce:data-starting-style:scale-100">
              {/* Invisible: it only gives the popup the bell's centre to grow from. */}
              <Menu.Arrow className="size-0" />

              <Menu.Group>
                <Menu.GroupLabel className="px-2.5 py-1.5 text-11 leading-none font-bold tracking-wider text-neutral-400 uppercase">
                  Activity Overlay
                </Menu.GroupLabel>

                <Menu.RadioGroup
                  value={level}
                  onValueChange={(value) => {
                    if (isActivityLevel(value)) setActivityLevel(value)
                  }}>
                  {ACTIVITY_LEVELS.map((level) => (
                    <Menu.RadioItem
                      key={level}
                      value={level}
                      closeOnClick
                      className="group flex cursor-pointer items-center gap-3.5 rounded-lg py-1.5 pr-2.5 pl-1.5 not-first:mt-0.5 focus-visible:-outline-offset-2 data-highlighted:bg-white/6">
                      <AppWatchHomeActivityMenuPreview level={level} />
                      <span className="flex min-w-0 flex-col gap-0.75">
                        <span className="flex items-center gap-1.5 text-sm leading-none font-bold">
                          {ACTIVITY_COPY[level].label}
                          <Menu.RadioItemIndicator className="text-11 leading-none text-pink-500">
                            <i className="fa fa-check" aria-hidden="true" />
                          </Menu.RadioItemIndicator>
                        </span>
                        <span className="text-xs/snug text-neutral-400">{ACTIVITY_COPY[level].description}</span>
                      </span>
                    </Menu.RadioItem>
                  ))}
                </Menu.RadioGroup>
              </Menu.Group>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    </PlayaTooltip>
  )
}

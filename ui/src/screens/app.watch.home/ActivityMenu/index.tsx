import './style.css'

import * as React from 'react'
import cx from 'classnames'
import { Menu } from '@base-ui/react/menu'
import UiPlainButton from '~/components/UiPlainButton'
import { ACTIVITY_COPY, ACTIVITY_LEVELS, type ActivityLevel, isActivityLevel } from '../activityLevel'
import Preview from './Preview'

interface Props {
  level: ActivityLevel
  onChange: (level: ActivityLevel) => void
  onOpenChange: (open: boolean) => void
}

/**
 * The bell in the player controls. It shows the level at a glance (bell, outline, crossed out)
 * and opens a menu of the three levels, each with a close-up of what it puts on the picture.
 * The menu grows out of the bell and fades shut; see style.css.
 */
function ActivityMenu(props: Props) {
  return (
    <Menu.Root onOpenChange={open => props.onOpenChange(open)}>
      <Menu.Trigger render={<UiPlainButton className="icon" aria-label="Activity Overlay" />}>
        <i className={cx('fa', ACTIVITY_COPY[props.level].icon)} aria-hidden="true" />
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Positioner side="top" align="end" sideOffset={20} className="activity-menu-positioner">
          <Menu.Popup className="activity-menu">
            {/* Invisible: it only gives the popup the bell's centre to grow from. */}
            <Menu.Arrow className="activity-menu-anchor" />

            <Menu.Group>
              <Menu.GroupLabel className="heading">Activity Overlay</Menu.GroupLabel>

              <Menu.RadioGroup value={props.level} onValueChange={value => { if (isActivityLevel(value)) props.onChange(value) }}>
                {ACTIVITY_LEVELS.map(level => (
                  <Menu.RadioItem key={level} value={level} className="option" closeOnClick>
                    <Preview level={level} />
                    <span className="words">
                      <span className="label">
                        {ACTIVITY_COPY[level].label}
                        <Menu.RadioItemIndicator className="check">
                          <i className="fa fa-check" aria-hidden="true" />
                        </Menu.RadioItemIndicator>
                      </span>
                      <span className="description">{ACTIVITY_COPY[level].description}</span>
                    </span>
                  </Menu.RadioItem>
                ))}
              </Menu.RadioGroup>
            </Menu.Group>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  )
}

export default ActivityMenu

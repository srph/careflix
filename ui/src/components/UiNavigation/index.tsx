import * as React from 'react'
import UiLogo from '~/components/UiLogo'
import UiContainer from '~/components/UiContainer'
import { Link, LinkProps } from 'react-router'

interface Props {
  children?: React.ReactNode
}

function UiNavigation(props: Props) {
  return (
    <div className="bg-neutral-900">
      <UiContainer size="xl">
        <div data-testid="navigation" className="flex h-12.5 items-center justify-between">
          {props.children}
        </div>
      </UiContainer>
    </div>
  )
}

type ActionProps =
  | {
      children?: React.ReactNode
    }
  | LinkProps

UiNavigation.Action = function (props: ActionProps) {
  return (
    <div className="w-1/4 text-neutral-400 last:text-right">
      {props.children && <Link {...(props as LinkProps)} className="inline-block text-neutral-400" />}
    </div>
  )
}

type BackActionProps = ActionProps

UiNavigation.BackAction = function (props: BackActionProps) {
  return (
    <div className="-ml-2 w-1/4 text-neutral-400 last:text-right">
      <Link aria-label="Go Back" {...(props as LinkProps)} className="inline-block p-2 text-neutral-400">
        <i className="fa fa-angle-left" />
        <span className="ml-2 hidden uppercase sm:inline-block">
          <h5 className="inline-block font-label text-xs font-bold uppercase">Go Back</h5>
        </span>
      </Link>
    </div>
  )
}

UiNavigation.Title = function (props: Props) {
  return <h6 className="font-label text-xs font-bold tracking-label uppercase">{props.children}</h6>
}

UiNavigation.Logo = function () {
  return (
    <div className="w-1/2 text-center">
      <Link to="/">
        <UiLogo />
      </Link>
    </div>
  )
}

export default UiNavigation

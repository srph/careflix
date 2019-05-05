import './style.css'
import * as React from 'react'
import UiLogo from '~/components/UiLogo'
import { Link, LinkProps } from 'react-router-dom'

interface Props {
  children?: React.ReactNode
}

function UiNavigation(props: Props) {
  return (
    <div className="ui-navigation">
      {props.children}
    </div>
  )
}

type ActionProps = {
  children?: React.ReactNode
} | LinkProps;

UiNavigation.Action = function(props: ActionProps) {
  return (
    <div className="action">
      {props.children && (
        <Link {...(props as LinkProps)} />
      )}
    </div>
  )
}

UiNavigation.Title = function(props: Props) {
  return (
    <h6 className="ui-subheading">{props.children}</h6>
  )
}

UiNavigation.Logo = function() {
  return (
    <div className="logo">
      <Link to="/">
        <UiLogo />
      </Link>
    </div>
  )
}

export default UiNavigation
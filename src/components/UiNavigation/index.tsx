import './style.css'
import * as React from 'react'
import UiLogo from '~/components/UiLogo'
import { Link } from 'react-router-dom'

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

UiNavigation.Action = function(props: Props) {
  return (
    <div className="action">{props.children}</div>
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
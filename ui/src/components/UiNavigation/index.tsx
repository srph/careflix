import './style.css'
import * as React from 'react'
import UiLogo from '~/components/UiLogo'
import UiContainer from '~/components/UiContainer'
import { Link, LinkProps } from 'react-router-dom'

interface Props {
  children?: React.ReactNode
}

function UiNavigation(props: Props) {
  return (
    <div className="ui-navigation-shape">
      <UiContainer size="xl">
        <div className="ui-navigation">
          {props.children}
        </div>
      </UiContainer>
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

type BackActionProps = ActionProps;

UiNavigation.BackAction = function(props: BackActionProps) {
  return (
    <div className="action is-back">
      <Link {...(props as LinkProps)}>
        <i className="fa fa-angle-left" />
        <span className="action-text">
          <h5 className="ui-subheading is-compact">Go Back</h5>
        </span>
      </Link>
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
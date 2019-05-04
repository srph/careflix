import './style.css'
import * as React from 'react'
import { Gateway } from 'react-gateway'
import Helmet from 'react-helmet'
import UiNavigation from '~/components/UiNavigation'
import constants from '../constants'

interface Props {
  title: string
  backUrl: string
}

function AppHeadingSettings(props: Props) {
  return (
    <React.Fragment>
      <Helmet title={props.title} />

      <Gateway into={constants.gateway.backUrl}>
        <UiNavigation.Action to={props.backUrl}>
          <i className="fa fa-angle-left" />
        </UiNavigation.Action>
      </Gateway>

      <Gateway into={constants.gateway.title}>
        <UiNavigation.Title>{props.title}</UiNavigation.Title>
      </Gateway>
    </React.Fragment>
  )
}

export default AppHeadingSettings
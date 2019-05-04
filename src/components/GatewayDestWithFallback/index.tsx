/**
 * Supercharges GatewayDest so that it allows default children, because this does not work:
 * <GatewayDest><div>Default content if nobody has passed anything to me yet.</GatewayDest>
 * @see https://github.com/cloudflare/react-gateway/pull/39
 * 
 * @usage <GatewayDestWithFallback name={constants.gateway.backUrl} fallback={<UiNavigation.Action />} />
 */

import * as React from 'react'
import { GatewayDest } from 'react-gateway'

interface Props {
  name: string
  children?: React.ReactNode
  fallback?: React.ReactNode
}

function GatewayDestWithFallback(props: Props) {
  return (
    <GatewayDest name={props.name} component={Inner} fallback={props.fallback}>
      {props.children}
    </GatewayDest>
  )
}

interface InnerProps {
  children?: React.ReactNode
  fallback?: React.ReactNode
}

function Inner(props: InnerProps) {
  return props.children || props.fallback || <div />
}

export default GatewayDestWithFallback
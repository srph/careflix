import * as React from 'react'

interface Props {
  children?: React.ReactNode
}

export function DummyComponent(props: Props) {
  return <div>{props.children}</div>
}

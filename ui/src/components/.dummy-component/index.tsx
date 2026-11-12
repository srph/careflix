import * as React from 'react'

interface Props {
  children?: React.ReactNode
}

function UiDummy(props: Props) {
  return (
    <div>
      {props.children}
    </div>
  )
}

export default UiDummy
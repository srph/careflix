import './style.css'
import * as React from 'react'

type Props = Omit<React.InputHTMLAttributes<HTMLSelectElement>, 'className'>

function UiInput(props: Props) {
  return (
    <div className="ui-select">
      <select {...props}  />
      <span className="caret">
        <i className='fa fa-angle-down' />
      </span>
    </div>
  )
}

export default UiInput
import './style.css'
import * as React from 'react'
import cx from 'classnames'

type ElementProps = Omit<React.InputHTMLAttributes<HTMLSelectElement>, 'className'>

interface OwnProps {
  mode?: 'dark' | 'light'
}

type Props = ElementProps & OwnProps

function UiInput(props: Props) {
  return (
    <div className={cx('ui-select', {
      'is-light': props.mode === 'light'
    })}>
      <select {...props}  />
      <span className="caret">
        <i className='fa fa-angle-down' />
      </span>
    </div>
  )
}

export default UiInput
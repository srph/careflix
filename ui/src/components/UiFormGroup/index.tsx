import './style.css'
import * as React from 'react'

interface Props {
  children: React.ReactNode
  label: string
  hint?: React.ReactNode
}

function UiFormGroup(props: Props) {
  return (
    <div className="ui-form-group">
      <label className="label">{props.label}</label>
      
      {props.children}

      {Boolean(props.hint) && (
        <span className="hint">
          <span className="icon">
            <i className="fa fa-info-circle" />
          </span>

          {props.hint}
        </span>
      )}
    </div>
  )
}

export default UiFormGroup
import './style.css'
import * as React from 'react'

interface Props {
  children: React.ReactNode
  label: string
}

function UiFormGroup(props: Props) {
  return (
    <div className="ui-form-group">
      <label className="label">{props.label}</label>
      {props.children}
    </div>
  )
}

export default UiFormGroup
import * as React from 'react'

interface Props {
  children: React.ReactNode
  label: string
  hint?: React.ReactNode
}

function UiFormGroup(props: Props) {
  return (
    <div className="[&_a]:text-sky-500">
      <label className="mb-1 block leading-none font-semibold text-neutral-400">{props.label}</label>

      {props.children}

      {Boolean(props.hint) && (
        <span className="mt-1 block text-sm text-neutral-400">
          <span className="mr-2 inline-block">
            <i className="fa fa-info-circle" />
          </span>

          {props.hint}
        </span>
      )}
    </div>
  )
}

export default UiFormGroup

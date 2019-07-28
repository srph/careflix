import './style.css'
import * as React from 'react'
import { useState } from 'react'
import cx from 'classnames'
import UiPlainButton from '~/components/UiPlainButton'

function UiAccordion(props: ReactComponentWrapper) {
  return (
    <div className="ui-accordion">
      {props.children}
    </div>
  )
}

interface SectionProps {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}

UiAccordion.Section = function(props: SectionProps) {
  const [isOpen, setIsOpen] = useState(false)

  function handleClick() {
    setIsOpen(!isOpen)
  }

  return (
    <div className={cx('section', {
      'is-open': isOpen
    })}>
      <div className="heading" onClick={handleClick}>
        <span className="icon">{props.icon}</span>
        <h4 className="title">{props.title}</h4>

        <UiPlainButton className="caret">
          {isOpen ? <i className="fa fa-angle-up" /> : <i className="fa fa-angle-down" />}
        </UiPlainButton>
      </div>

      <div className="content">
        {props.children}
      </div>
    </div>
  )
}

export default UiAccordion
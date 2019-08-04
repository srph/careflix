import './style.css'
import * as React from 'react'
import { useState } from 'react'
import cx from 'classnames'
import UiPlainButton from '~/components/UiPlainButton'

function UiAccordion(props: ReactComponentWrapper) {
  return <div className="ui-accordion">{props.children}</div>
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
    <div
      className={cx('section', {
        'is-open': isOpen
      })}>
      <UiPlainButton className="heading" onClick={handleClick}>
        <span className="icon">{props.icon}</span>
        <h4 className="title">{props.title}</h4>

        <div className="caret">
          {isOpen ? <i className="fa fa-angle-up" /> : <i className="fa fa-angle-down" />}
        </div>
      </UiPlainButton>

      <div className="content">
        {props.children}

        <UiPlainButton onClick={handleClick} className="close">
          Close
          <span className="icon"><i className="fa fa-angle-up" /></span>
        </UiPlainButton>
      </div>
    </div>
  )
}

export default UiAccordion

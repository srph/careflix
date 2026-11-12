import * as React from 'react'
import { useState } from 'react'
import { cn } from '~/utils/cn'
import UiPlainButton from '~/components/UiPlainButton'

function UiAccordion(props: ReactComponentWrapper) {
  return <div>{props.children}</div>
}

interface SectionProps {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}

UiAccordion.Section = function (props: SectionProps) {
  const [isOpen, setIsOpen] = useState(false)

  function handleClick() {
    setIsOpen(!isOpen)
  }

  return (
    <div className="border-b border-neutral-800">
      <UiPlainButton className="flex w-full items-center py-2 text-left" onClick={handleClick}>
        <span className="mr-4 text-base leading-none text-neutral-400">{props.icon}</span>
        <h4 className="text-base font-bold">{props.title}</h4>

        <div className="ml-auto p-2">
          {isOpen ? <i className="fa fa-angle-up" /> : <i className="fa fa-angle-down" />}
        </div>
      </UiPlainButton>

      <div
        className={cn('overflow-y-hidden transition-[max-height] duration-200', isOpen ? 'max-h-500 py-4' : 'max-h-0')}>
        {props.children}

        <UiPlainButton
          onClick={handleClick}
          className="block w-full pt-1 text-center text-xs text-neutral-400 uppercase">
          Close
          <span className="ml-2">
            <i className="fa fa-angle-up" />
          </span>
        </UiPlainButton>
      </div>
    </div>
  )
}

export default UiAccordion

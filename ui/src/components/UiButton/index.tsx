import './style.css'
import * as React from 'react'
import cx from 'classnames'
import { Link, LinkProps } from 'react-router-dom'

interface OwnProps {
  variant?: 'default' | 'primary' | 'clear-white'
  size?: 's' | 'l'
  link?: boolean
  block?: boolean
}

type ButtonAttributes =  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'>
type LinkAttributes = Omit<LinkProps, 'className'>
type Attributes = ButtonAttributes | LinkAttributes
type Props = OwnProps & Attributes

function UiButton({ variant, size, block, link, ...props }: Props) {
  const cls = cx("ui-button", {
    'is-clear-white': variant === 'clear-white',
    'is-primary': variant === 'primary',
    'is-block': block,
    'is-l': size === 'l',
  })

  return link
    ? <Link {...(props as LinkAttributes)} className={cls} />
    : <button {...(props as ButtonAttributes)} className={cls} />
}

export type UiButtonProps = Props

export default UiButton
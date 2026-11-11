import './style.css'
import * as React from 'react'
import cx from 'classnames'
import { Link, LinkProps } from 'react-router'

interface OwnProps {
  disabled?: boolean
  variant?: 'default' | 'primary'
  size?: 's' | 'm' | 'l'
  link?: boolean
  block?: boolean
  round?: boolean
  /** Pink shadow under a primary button. Ignored on the default variant. */
  glow?: boolean
  /** See-through background for a default button that sits on artwork or video. */
  onArt?: boolean
  ref?: React.Ref<HTMLButtonElement>
}

type ButtonAttributes =  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'>
type LinkAttributes = Omit<LinkProps, 'className'>
type Attributes = ButtonAttributes | LinkAttributes
type Props = OwnProps & Attributes

function UiButton({ variant, size = 'm', block, round, glow, onArt, link, ...props }: Props) {
  const cls = cx("ui-button", {
    'is-primary': variant === 'primary',
    'is-block': block,
    'is-s': size === 's',
    'is-l': size === 'l',
    'is-round': round,
    'is-glow': glow && variant === 'primary',
    'is-on-art': onArt,
  })

  return link
    ? <Link {...(props as LinkAttributes)} className={cls} />
    : <button {...(props as ButtonAttributes)} className={cls} />
}

export type UiButtonProps = Props

export default UiButton

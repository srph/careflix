import * as React from 'react'
import { Link, LinkProps } from 'react-router'
import { cn } from '~/utils/cn'

interface StyleProps {
  variant?: 'default' | 'primary'
  size?: 's' | 'm' | 'l'
  block?: boolean
  round?: boolean
  /** Pink shadow under a primary button. Ignored on the default variant. */
  glow?: boolean
  /** See-through background for a default button that sits on artwork or video. */
  onArt?: boolean
}

interface OwnProps extends StyleProps {
  disabled?: boolean
  link?: boolean
  className?: string
  ref?: React.Ref<HTMLButtonElement>
}

type ButtonAttributes = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'>
type LinkAttributes = Omit<LinkProps, 'className'>
type Attributes = ButtonAttributes | LinkAttributes
type Props = OwnProps & Attributes

const SIZES = { s: 'h-6.5 px-3', m: 'h-8 px-4', l: 'h-10 px-5' }

/**
 * The button's classes on their own, for an element that looks like a button without being one.
 */
export function buttonClass({ variant, size = 'm', block, round, glow, onArt }: StyleProps = {}, className?: string) {
  const primary = variant === 'primary'
  return cn(
    'inline-flex cursor-pointer items-center justify-center gap-2 text-center font-label text-11 leading-none font-bold tracking-label whitespace-nowrap text-white uppercase',
    'outline-2 outline-offset-3 outline-transparent transition-[background-color,filter,box-shadow,outline-color,opacity] duration-200 focus-visible:outline-pink-700 disabled:cursor-default disabled:opacity-50',
    SIZES[size],
    round ? 'rounded-full' : 'rounded-sm',
    block && 'w-full',
    primary && 'bg-pink-500 not-disabled:hover:brightness-112',
    primary && glow && 'shadow-glow',
    // Over artwork a solid step reads as a hole in the picture, so stay see-through.
    !primary &&
      (onArt ? 'bg-white/10 not-disabled:hover:bg-white/18' : 'bg-neutral-800 not-disabled:hover:bg-neutral-700'),
    className
  )
}

export function UiButton({ variant, size, block, round, glow, onArt, link, className, ...props }: Props) {
  const cls = buttonClass({ variant, size, block, round, glow, onArt }, className)

  return link ? (
    <Link {...(props as LinkAttributes)} className={cls} />
  ) : (
    <button {...(props as ButtonAttributes)} className={cls} />
  )
}

export type UiButtonProps = Props

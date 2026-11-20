import * as React from 'react'
import { Button as BaseButton } from '@base-ui/react/button'

export type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link'
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg'

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
}

/**
 * The attributes that make any element look like a Button. Spread them onto a link:
 * <a {...buttonProps({ variant: 'outline' })} href="/docs">Docs</a>
 */
export function buttonProps({ variant = 'default', size = 'default' }: { variant?: ButtonVariant; size?: ButtonSize } = {}) {
  return { 'data-slot': 'button', 'data-variant': variant, 'data-size': size } as const
}

export function Button({ variant = 'default', size = 'default', className, type = 'button', ...props }: ButtonProps) {
  return <BaseButton {...buttonProps({ variant, size })} type={type} className={className} {...props} />
}

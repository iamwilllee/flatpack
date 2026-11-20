import * as React from 'react'
import { Button as BaseButton } from '@base-ui-components/react/button'

type Variant = 'default' | 'secondary' | 'outline' | 'ghost' | 'link'
type Size = 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm'

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
}

export function Button({ variant = 'default', size = 'default', className, type = 'button', ...props }: ButtonProps) {
  return (
    <BaseButton
      data-slot="button"
      data-variant={variant}
      data-size={size}
      type={type}
      className={className}
      {...props}
    />
  )
}

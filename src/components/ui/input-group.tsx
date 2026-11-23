import * as React from 'react'
import { Input as BaseInput } from '@base-ui/react/input'
import { Button, type ButtonProps } from '@/components/ui/button'
import type { ControlSize } from '@/components/ui/input'

export type InputGroupProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & {
  size?: ControlSize
  variant?: 'outline' | 'filled'
  disabled?: boolean
  children: React.ReactNode
}

/**
 * One field frame around an input plus addons and buttons, drawn once so focus and error states
 * cover the whole row. Put `InputGroupInput` in it, with any number of `InputGroupAddon` (icon,
 * unit, Kbd) and `InputGroupButton` before or after. For a single icon on either side, `Input`'s
 * `leading` / `trailing` props are shorter.
 */
export function InputGroup({ size: sizeProp = 'md', variant = 'outline', disabled, className, ...props }: InputGroupProps) {
  const size = sizeProp === 'default' ? 'md' : sizeProp
  return <div data-slot="input-group" role="group" data-size={size} data-variant={variant} data-disabled={disabled ? 'true' : undefined} className={className} {...props} />
}

/** Icon or short text inside the frame. Pass `aria-hidden` on a purely decorative icon. */
export function InputGroupAddon({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span data-slot="input-adornment" className={className} {...props} />
}

/** The text input. A Base UI input, so it joins Field and forwards `ref`. */
export function InputGroupInput({ className, ...props }: React.ComponentProps<'input'>) {
  return <BaseInput data-slot="input-bare" className={className} {...props} />
}

/** A small button sitting inside the frame, e.g. Copy or Search. */
export function InputGroupButton({ size = 'sm', variant = 'secondary', ...props }: ButtonProps) {
  return <Button size={size} variant={variant} {...props} />
}

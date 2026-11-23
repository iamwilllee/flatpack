import * as React from 'react'
import { OTPField as BaseOTPField } from '@base-ui/react/otp-field'

export type OtpFieldProps = Omit<BaseOTPField.Root.Props, 'className' | 'children' | 'length'> & {
  /** Number of boxes. Default 6. */
  length?: number
  /** Print a dash after this many boxes, e.g. 3 gives `123-456`. */
  groupSize?: number
  size?: 'sm' | 'md' | 'default' | 'lg'
  invalid?: boolean
  className?: string
  /** Accessible name for box `index` (0-based). Default "Character 2 of 6". */
  getInputLabel?: (index: number, length: number) => string
}

/**
 * A row of single-character boxes for one-time codes. Typing moves forward, Backspace moves back
 * and pasting a whole code fills every box. Controlled (`value` + `onValueChange`) or uncontrolled
 * (`defaultValue`). `onValueComplete` fires once every box is filled. Name the group with a Field
 * label or `aria-label`.
 */
export function OtpField({ length = 6, groupSize, size = 'md', invalid, className, getInputLabel, ...props }: OtpFieldProps) {
  const sz = size === 'default' ? 'md' : size
  const label = getInputLabel ?? ((i: number, n: number) => `Character ${i + 1} of ${n}`)
  const items: React.ReactNode[] = []
  for (let i = 0; i < length; i++) {
    if (groupSize && i > 0 && i % groupSize === 0) items.push(<span key={`s${i}`} data-slot="otp-separator" aria-hidden="true" />)
    items.push(<BaseOTPField.Input key={i} data-slot="otp-input" aria-label={i === 0 ? undefined : label(i, length)} aria-invalid={invalid || undefined} />)
  }
  return (
    <BaseOTPField.Root data-slot="otp-field" data-size={sz} length={length} className={className} {...props}>
      {items}
    </BaseOTPField.Root>
  )
}

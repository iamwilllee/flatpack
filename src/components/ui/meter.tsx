import * as React from 'react'
import { Meter as BaseMeter } from '@base-ui/react/meter'

export type MeterProps = Omit<BaseMeter.Root.Props, 'className' | 'children'> & {
  label?: React.ReactNode
  /** Show the formatted value on the right. */
  showValue?: boolean
  size?: 'sm' | 'default' | 'lg'
  className?: string
}

/**
 * A value inside a known range, such as disk used or a score. Use Progress for a task that
 * finishes. Pass `aria-label` when there is no visible `label`. `format` takes
 * `Intl.NumberFormat` options, e.g. `{ style: 'percent' }` with min 0 and max 1.
 */
export function Meter({ label, showValue, size = 'default', className, ...props }: MeterProps) {
  return (
    <BaseMeter.Root data-slot="meter" data-size={size} className={className} {...props}>
      {(label || showValue) && (
        <div data-slot="meter-header">
          {label && <BaseMeter.Label data-slot="meter-label">{label}</BaseMeter.Label>}
          {showValue && <BaseMeter.Value data-slot="meter-value" />}
        </div>
      )}
      <BaseMeter.Track data-slot="meter-track">
        <BaseMeter.Indicator data-slot="meter-bar" />
      </BaseMeter.Track>
    </BaseMeter.Root>
  )
}

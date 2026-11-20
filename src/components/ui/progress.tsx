import * as React from 'react'
import { Progress as BaseProgress } from '@base-ui/react/progress'

export type ProgressProps = {
  value: number
  max?: number
  label?: React.ReactNode
  showValue?: boolean
  size?: 'sm' | 'default' | 'lg'
}

export function Progress({ value, max = 100, label, showValue, size = 'default' }: ProgressProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  return (
    <BaseProgress.Root value={value} max={max} data-slot="progress" data-size={size}>
      {(label || showValue) && (
        <div data-slot="progress-header">
          {label && <span data-slot="progress-label">{label}</span>}
          {showValue && <span data-slot="progress-value">{Math.round(pct)}%</span>}
        </div>
      )}
      <BaseProgress.Track data-slot="progress-track">
        <BaseProgress.Indicator data-slot="progress-bar" style={{ width: `${pct}%` }} />
      </BaseProgress.Track>
    </BaseProgress.Root>
  )
}

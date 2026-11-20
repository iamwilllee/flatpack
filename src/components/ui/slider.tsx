import * as React from 'react'
import { Slider as BaseSlider } from '@base-ui/react/slider'

export type SliderProps<V extends number | number[]> = {
  value?: V
  defaultValue?: V
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  label?: React.ReactNode
  /** Show the current value next to the label. */
  showValue?: boolean
  format?: (value: number) => string
  onValueChange?: (value: V) => void
  /** Fires when the user lets go, with the final value. Use it to save instead of on every move. */
  onValueCommitted?: (value: V) => void
  /** Form field name for the hidden inputs. */
  name?: string
  orientation?: 'horizontal' | 'vertical'
  className?: string
  /** Accessible name when `label` is not plain text. */
  'aria-label'?: string
}

/** A 2px track with an ink fill and a square thumb. Pass an array for a range. */
export function Slider<V extends number | number[]>({ value, defaultValue, min = 0, max = 100, step = 1, disabled, label, showValue, format = String, onValueChange, onValueCommitted, name, orientation, className, 'aria-label': ariaLabel }: SliderProps<V>) {
  const initial = (value ?? defaultValue ?? min) as number | number[]
  const thumbs = Array.isArray(initial) ? initial.length : 1
  return (
    <BaseSlider.Root
      data-slot="slider"
      value={value as never}
      defaultValue={defaultValue as never}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      onValueChange={(v) => onValueChange?.(v as V)}
      onValueCommitted={(v) => onValueCommitted?.(v as V)}
      name={name}
      orientation={orientation}
      className={className}
    >
      {(label != null || showValue) && (
        <div data-slot="slider-header">
          <span>{label}</span>
          {showValue && (
            <BaseSlider.Value data-slot="slider-value">
              {(_formatted, values) => values.map(format).join(' – ')}
            </BaseSlider.Value>
          )}
        </div>
      )}
      <BaseSlider.Control data-slot="slider-control">
        <BaseSlider.Track data-slot="slider-track">
          <BaseSlider.Indicator data-slot="slider-indicator" />
          {Array.from({ length: thumbs }, (_, i) => (
            <BaseSlider.Thumb key={i} index={thumbs > 1 ? i : undefined} data-slot="slider-thumb" aria-label={ariaLabel ?? (typeof label === 'string' ? label : undefined)} />
          ))}
        </BaseSlider.Track>
      </BaseSlider.Control>
    </BaseSlider.Root>
  )
}

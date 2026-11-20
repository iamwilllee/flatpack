import * as React from 'react'
import { Slider as BaseSlider } from '@base-ui-components/react/slider'

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
}

/** A 2px track with an ink fill and a square thumb. Pass an array for a range. */
export function Slider<V extends number | number[]>({ value, defaultValue, min = 0, max = 100, step = 1, disabled, label, showValue, format = String, onValueChange }: SliderProps<V>) {
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
            <BaseSlider.Thumb key={i} index={thumbs > 1 ? i : undefined} data-slot="slider-thumb" aria-label={typeof label === 'string' ? label : undefined} />
          ))}
        </BaseSlider.Track>
      </BaseSlider.Control>
    </BaseSlider.Root>
  )
}

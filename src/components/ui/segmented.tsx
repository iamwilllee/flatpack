import * as React from 'react'
import { ToggleGroup } from '@base-ui/react/toggle-group'
import { Toggle } from '@base-ui/react/toggle'

type Segment<T extends string> = { value: T; label: React.ReactNode; disabled?: boolean }
export type SegmentedProps<T extends string> = Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> & {
  size?: 'sm' | 'md' | 'lg'
  options: Segment<T>[]
  value?: T
  defaultValue?: T
  onValueChange?: (value: T) => void
  disabled?: boolean
}

/** One choice out of a few. Controlled (`value`) or uncontrolled (`defaultValue`); use aria-label to name it. */
export function Segmented<T extends string>({ options, value, defaultValue, onValueChange, size = 'md', disabled, ...rest }: SegmentedProps<T>) {
  const [internal, setInternal] = React.useState<T | undefined>(defaultValue)
  const current = value !== undefined ? value : internal
  const choose = (v: T) => {
    if (value === undefined) setInternal(v)
    onValueChange?.(v)
  }
  return (
    <ToggleGroup
      value={current === undefined ? [] : [current]}
      onValueChange={(values) => {
        const next = values[0] as T | undefined
        if (next !== undefined) choose(next)
      }}
      disabled={disabled}
      data-slot="segmented"
      data-size={size}
      role="tablist"
      {...rest}
    >
      {options.map((o) => (
        <Toggle
          value={o.value}
          data-slot="segmented-item"
          data-active={current === o.value}
          role="tab"
          aria-selected={current === o.value}
          disabled={o.disabled}
          key={o.value}
        >
          {o.label}
        </Toggle>
      ))}
    </ToggleGroup>
  )
}

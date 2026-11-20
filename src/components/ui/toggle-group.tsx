import * as React from 'react'
import { ToggleGroup as BaseToggleGroup } from '@base-ui/react/toggle-group'
import { Toggle as BaseToggle } from '@base-ui/react/toggle'

export type ToggleOption = { value: string; label: React.ReactNode; 'aria-label'?: string; disabled?: boolean }

export type ToggleGroupProps = {
  options: ToggleOption[]
  value?: string[]
  defaultValue?: string[]
  /** Allow several pressed at once (e.g. bold + italic). */
  multiple?: boolean
  size?: 'sm' | 'md'
  disabled?: boolean
  onValueChange?: (value: string[]) => void
}

/** Joined toggle buttons. Pressed items turn into an ink block. */
export function ToggleGroup({ options, value, defaultValue, multiple, size = 'md', disabled, onValueChange }: ToggleGroupProps) {
  return (
    <BaseToggleGroup
      data-slot="toggle-group"
      data-size={size}
      value={value}
      defaultValue={defaultValue}
      multiple={multiple}
      disabled={disabled}
      onValueChange={(v) => onValueChange?.(v as string[])}
    >
      {options.map((o) => (
        <BaseToggle key={o.value} value={o.value} data-slot="toggle" aria-label={o['aria-label']} disabled={o.disabled}>
          {o.label}
        </BaseToggle>
      ))}
    </BaseToggleGroup>
  )
}

/** A single on/off button. */
export function Toggle({ children, ...props }: React.ComponentProps<typeof BaseToggle>) {
  return <BaseToggle data-slot="toggle" {...props}>{children}</BaseToggle>
}

/** Buttons joined edge to edge, sharing one border. */
export function ButtonGroup({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="button-group" role="group" {...props}>{children}</div>
}

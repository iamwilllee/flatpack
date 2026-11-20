import * as React from 'react'
import { ToggleGroup as BaseToggleGroup } from '@base-ui/react/toggle-group'
import { Toggle as BaseToggle } from '@base-ui/react/toggle'

export type ChipOption = { value: string; label: React.ReactNode; count?: number; disabled?: boolean }

type Common = {
  options: ChipOption[]
  /** sm 32 / md 40 / lg 48, same as Button */
  size?: 'sm' | 'md' | 'default' | 'lg'
  disabled?: boolean
  'aria-label'?: string
}
export type ChipGroupProps = Common & (
  | { multiple?: false; value?: string; defaultValue?: string; onValueChange?: (value: string) => void }
  | { multiple: true; value?: string[]; defaultValue?: string[]; onValueChange?: (value: string[]) => void }
)

/**
 * Separate filter chips with gaps between them (unlike Segmented, which is one
 * joined bar). Unselected chips have a light line that turns ink on hover;
 * the selected chip is an ink block. An optional count sits after the label.
 * Single choice by default; `multiple` allows several.
 */
export function ChipGroup(props: ChipGroupProps) {
  const { options, size = 'md', disabled, multiple } = props
  const toArr = (v: string | string[] | undefined) => (v === undefined ? undefined : Array.isArray(v) ? v : [v])
  const [inner, setInner] = React.useState<string[]>(toArr(props.defaultValue) ?? [])
  const controlled = props.value !== undefined
  const current = controlled ? toArr(props.value)! : inner

  return (
    <BaseToggleGroup
      data-slot="chip-group"
      data-size={size === 'default' ? 'md' : size}
      aria-label={props['aria-label']}
      value={current}
      multiple={!!multiple}
      disabled={disabled}
      onValueChange={(next) => {
        const arr = next as string[]
        // single choice: clicking the selected chip keeps it selected
        if (!multiple && arr.length === 0) return
        if (!controlled) setInner(arr)
        if (multiple) (props.onValueChange as ((v: string[]) => void) | undefined)?.(arr)
        else (props.onValueChange as ((v: string) => void) | undefined)?.(arr[0])
      }}
    >
      {options.map((o) => (
        <BaseToggle key={o.value} value={o.value} data-slot="chip" disabled={o.disabled}>
          <span>{o.label}</span>
          {o.count != null && <span data-slot="chip-count">{o.count}</span>}
        </BaseToggle>
      ))}
    </BaseToggleGroup>
  )
}

import * as React from 'react'
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group'
import { Radio } from '@base-ui/react/radio'

type RadioItem = { value: string; label: React.ReactNode; disabled?: boolean }
export type RadioGroupProps = {
  options: RadioItem[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  name?: string
}

export function RadioGroup({ options, value, defaultValue, onValueChange, name }: RadioGroupProps) {
  const groupName = React.useMemo(() => name ?? `radio-${Math.random().toString(36).slice(2)}`, [name])
  return (
    <BaseRadioGroup
      data-slot="radio-group"
      name={groupName}
      value={value}
      defaultValue={defaultValue}
      onValueChange={(nextValue) => onValueChange?.(nextValue as string)}
    >
      {options.map((o) => (
        <label key={o.value} data-slot="radio" data-disabled={o.disabled ? 'true' : 'false'}>
          <Radio.Root
            value={o.value}
            disabled={o.disabled}
            aria-label={typeof o.label === 'string' ? o.label : undefined}
          >
            <Radio.Indicator
              keepMounted
              data-slot="radio-circle"
              render={(props, state) => (
                <span {...props} data-state={state.checked ? 'checked' : 'unchecked'}>
                  {state.checked && <span data-slot="radio-dot" />}
                </span>
              )}
            />
          </Radio.Root>
          <span data-slot="radio-label">{o.label}</span>
        </label>
      ))}
    </BaseRadioGroup>
  )
}

import * as React from 'react'
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group'
import { Radio } from '@base-ui/react/radio'

type RadioItem = { value: string; label: React.ReactNode; disabled?: boolean }
export type RadioGroupProps = Omit<BaseRadioGroup.Props, 'className' | 'children' | 'render' | 'onValueChange'> & {
  options: RadioItem[]
  onValueChange?: (value: string) => void
  className?: string
}

/** Controlled (`value`) or uncontrolled (`defaultValue`). Group props such as name, required, disabled and aria-* pass through. */
export function RadioGroup({ options, onValueChange, className, name, ...props }: RadioGroupProps) {
  // useId keeps the generated name identical on the server and the client.
  const generated = React.useId()
  return (
    <BaseRadioGroup
      data-slot="radio-group"
      name={name ?? `radio-${generated}`}
      className={className}
      onValueChange={(nextValue) => onValueChange?.(nextValue as string)}
      {...props}
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
              render={(indicatorProps, state) => (
                <span {...indicatorProps} data-state={state.checked ? 'checked' : 'unchecked'}>
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

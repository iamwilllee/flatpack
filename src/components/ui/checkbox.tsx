import * as React from 'react'
import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox'
import { Check, Minus } from 'lucide-react'

export type CheckboxProps = {
  checked?: boolean
  defaultChecked?: boolean
  indeterminate?: boolean
  disabled?: boolean
  label?: React.ReactNode
  onCheckedChange?: (checked: boolean) => void
}

export function Checkbox({ checked, defaultChecked, indeterminate, disabled, label, onCheckedChange }: CheckboxProps) {
  return (
    <label data-slot="checkbox" data-disabled={disabled ? 'true' : 'false'}>
      <BaseCheckbox.Root
        checked={checked}
        defaultChecked={defaultChecked}
        indeterminate={indeterminate}
        disabled={disabled}
        aria-label={typeof label === 'string' ? label : undefined}
        onCheckedChange={(nextChecked) => onCheckedChange?.(nextChecked)}
      >
        <BaseCheckbox.Indicator
          keepMounted
          data-slot="checkbox-box"
          render={(props, state) => (
            <span
              {...props}
              data-state={state.indeterminate ? 'indeterminate' : state.checked ? 'checked' : 'unchecked'}
            >
              {state.indeterminate
                ? <Minus size={12} strokeWidth={2.5} />
                : state.checked
                  ? <Check size={12} strokeWidth={2.5} />
                  : null}
            </span>
          )}
        />
      </BaseCheckbox.Root>
      {label != null && <span data-slot="checkbox-label">{label}</span>}
    </label>
  )
}

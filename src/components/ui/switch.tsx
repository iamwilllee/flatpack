import * as React from 'react'
import { Switch as BaseSwitch } from '@base-ui/react/switch'

export type SwitchProps = {
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  label?: React.ReactNode
  onCheckedChange?: (checked: boolean) => void
}

export function Switch({ checked, defaultChecked, disabled, label, onCheckedChange }: SwitchProps) {
  return (
    <label data-slot="switch" data-disabled={disabled ? 'true' : 'false'}>
      <BaseSwitch.Root
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        aria-label={typeof label === 'string' ? label : undefined}
        data-slot="switch-track"
        onCheckedChange={(nextChecked) => onCheckedChange?.(nextChecked)}
        render={(props, state) => (
          <span {...props} data-state={state.checked ? 'checked' : 'unchecked'} />
        )}
      >
        <BaseSwitch.Thumb data-slot="switch-thumb" />
      </BaseSwitch.Root>
      {label != null && <span data-slot="switch-label">{label}</span>}
    </label>
  )
}

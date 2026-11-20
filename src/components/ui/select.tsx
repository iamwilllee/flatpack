import { Select as BaseSelect } from '@base-ui-components/react/select'
import { Check, ChevronDown } from 'lucide-react'

type Option = { value: string; label: string }
export type SelectProps = {
  options: Option[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  /** sm 32 / md 40 / lg 48, same as Button */
  size?: 'sm' | 'md' | 'lg'
}

export function Select({ options, value, defaultValue, onValueChange, placeholder = '请选择', disabled, size = 'md' }: SelectProps) {
  return (
    <BaseSelect.Root
      value={value}
      defaultValue={defaultValue}
      disabled={disabled}
      items={options}
      onValueChange={(nextValue) => onValueChange?.(nextValue as string)}
    >
      <div data-slot="select">
        <BaseSelect.Trigger data-slot="select-trigger" data-size={size} disabled={disabled}>
          <BaseSelect.Value
            render={(props, state) => (
              <span
                {...props}
                data-placeholder={options.some((o) => o.value === state.value) ? 'false' : 'true'}
              />
            )}
          >
            {(current) => options.find((o) => o.value === current)?.label ?? placeholder}
          </BaseSelect.Value>
          <BaseSelect.Icon data-slot="select-icon">
            <ChevronDown size={16} />
          </BaseSelect.Icon>
        </BaseSelect.Trigger>
        <BaseSelect.Portal>
          <BaseSelect.Positioner sideOffset={6} alignItemWithTrigger={false}>
            <BaseSelect.Popup
              data-slot="select-content"
              // Base UI positions the Positioner; neutralize our absolute-position CSS on the popup.
              style={{ position: 'static', top: 'auto', left: 'auto', right: 'auto' }}
            >
              <BaseSelect.List>
                {options.map((o) => (
                  <BaseSelect.Item
                    key={o.value}
                    value={o.value}
                    data-slot="select-item"
                    render={(props, state) => (
                      <div {...props} data-selected={state.selected ? 'true' : 'false'} />
                    )}
                  >
                    <BaseSelect.ItemText>{o.label}</BaseSelect.ItemText>
                    <BaseSelect.ItemIndicator data-slot="select-item-check">
                      <Check size={16} />
                    </BaseSelect.ItemIndicator>
                  </BaseSelect.Item>
                ))}
              </BaseSelect.List>
            </BaseSelect.Popup>
          </BaseSelect.Positioner>
        </BaseSelect.Portal>
      </div>
    </BaseSelect.Root>
  )
}

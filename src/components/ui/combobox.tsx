import { Combobox as BaseCombobox } from '@base-ui/react/combobox'
import { Check, ChevronDown, X } from 'lucide-react'

export type ComboboxOption = { value: string; label: string }

export type ComboboxProps = {
  options: ComboboxOption[]
  value?: string | null
  defaultValue?: string | null
  onValueChange?: (value: string | null) => void
  placeholder?: string
  emptyText?: string
  disabled?: boolean
  'aria-label'?: string
  /** sm 32 / md 40 / lg 48, same as Button */
  size?: 'sm' | 'md' | 'lg'
}

const byValue = (options: ComboboxOption[], v?: string | null) => (v == null ? v : options.find((o) => o.value === v) ?? null)

/** A select you can type into. Filters as you type (Typeahead). */
export function Combobox({ options, value, defaultValue, onValueChange, placeholder = 'Search…', emptyText = 'No matches', disabled, 'aria-label': ariaLabel, size = 'md' }: ComboboxProps) {
  return (
    <BaseCombobox.Root
      items={options}
      value={value === undefined ? undefined : (byValue(options, value) as ComboboxOption)}
      defaultValue={byValue(options, defaultValue) ?? undefined}
      itemToStringLabel={(o: ComboboxOption) => o.label}
      isItemEqualToValue={(a: ComboboxOption, b: ComboboxOption) => a.value === b.value}
      onValueChange={(o) => onValueChange?.(o ? o.value : null)}
      disabled={disabled}
    >
      <div data-slot="combobox">
        <div data-slot="combobox-control" data-size={size}>
          <BaseCombobox.Input data-slot="combobox-input" placeholder={placeholder} aria-label={ariaLabel} />
          <BaseCombobox.Clear data-slot="combobox-clear" aria-label="Clear"><X size={16} /></BaseCombobox.Clear>
          <BaseCombobox.Trigger data-slot="combobox-trigger" aria-label="Open"><ChevronDown size={16} /></BaseCombobox.Trigger>
        </div>
      </div>
      <BaseCombobox.Portal>
        <BaseCombobox.Positioner sideOffset={4} style={{ zIndex: 50 }}>
          <BaseCombobox.Popup data-slot="combobox-content">
            <BaseCombobox.Empty data-slot="combobox-empty">{emptyText}</BaseCombobox.Empty>
            <BaseCombobox.List>
              {(o: ComboboxOption) => (
                <BaseCombobox.Item key={o.value} value={o} data-slot="combobox-item">
                  {o.label}
                  <BaseCombobox.ItemIndicator><Check size={16} /></BaseCombobox.ItemIndicator>
                </BaseCombobox.Item>
              )}
            </BaseCombobox.List>
          </BaseCombobox.Popup>
        </BaseCombobox.Positioner>
      </BaseCombobox.Portal>
    </BaseCombobox.Root>
  )
}

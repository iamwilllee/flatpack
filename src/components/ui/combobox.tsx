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
  'aria-labelledby'?: string
  /** sm 32 / md 40 / lg 48, same as Button. `default` is an alias of `md`. */
  size?: 'sm' | 'md' | 'default' | 'lg'
  /** Form field name, submitted with the surrounding <form>. */
  name?: string
  required?: boolean
  id?: string
  className?: string
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** Fires on every keystroke in the text box. */
  onInputValueChange?: (text: string) => void
  /** Accessible names of the clear and open buttons, for localized products. */
  clearLabel?: string
  openLabel?: string
}

const byValue = (options: ComboboxOption[], v?: string | null) => (v == null ? v : options.find((o) => o.value === v) ?? null)

/** A select you can type into. Filters as you type (Typeahead). */
export function Combobox({ options, value, defaultValue, onValueChange, placeholder = 'Search…', emptyText = 'No matches', disabled, 'aria-label': ariaLabel, 'aria-labelledby': labelledBy, size = 'md', name, required, id, className, open, defaultOpen, onOpenChange, onInputValueChange, clearLabel = 'Clear', openLabel = 'Open' }: ComboboxProps) {
  return (
    <BaseCombobox.Root
      items={options}
      value={value === undefined ? undefined : (byValue(options, value) as ComboboxOption)}
      defaultValue={byValue(options, defaultValue) ?? undefined}
      itemToStringLabel={(o: ComboboxOption) => o.label}
      isItemEqualToValue={(a: ComboboxOption, b: ComboboxOption) => a.value === b.value}
      onValueChange={(o) => onValueChange?.(o ? o.value : null)}
      disabled={disabled}
      name={name}
      required={required}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      onInputValueChange={onInputValueChange}
    >
      <div data-slot="combobox" className={className}>
        <div data-slot="combobox-control" data-size={size === 'default' ? 'md' : size}>
          <BaseCombobox.Input data-slot="combobox-input" id={id} placeholder={placeholder} aria-label={ariaLabel} aria-labelledby={labelledBy} />
          <BaseCombobox.Clear data-slot="combobox-clear" aria-label={clearLabel}><X size={16} /></BaseCombobox.Clear>
          <BaseCombobox.Trigger data-slot="combobox-trigger" aria-label={openLabel}><ChevronDown size={16} /></BaseCombobox.Trigger>
        </div>
      </div>
      <BaseCombobox.Portal>
        <BaseCombobox.Positioner data-slot="combobox-positioner" sideOffset={4}>
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

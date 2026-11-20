import * as React from 'react'
import { Combobox as BaseCombobox } from '@base-ui/react/combobox'
import { Check, X } from 'lucide-react'

export type MultiSelectOption = { value: string; label: string }

export type MultiSelectProps = {
  options: MultiSelectOption[]
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  placeholder?: string
  emptyText?: string
  disabled?: boolean
  'aria-label'?: string
  'aria-labelledby'?: string
  /** Form field name, submitted with the surrounding <form>. */
  name?: string
  required?: boolean
  id?: string
  className?: string
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onInputValueChange?: (text: string) => void
  /** Accessible name of each chip's remove button, for localized products. */
  removeLabel?: (label: string) => string
}

/** Pick several options; each choice becomes an ink chip (Tokenizer). Backspace removes the last. */
export function MultiSelect({ options, value, defaultValue, onValueChange, placeholder = 'Add…', emptyText = 'No matches', disabled, 'aria-label': ariaLabel, 'aria-labelledby': labelledBy, name, required, id, className, open, defaultOpen, onOpenChange, onInputValueChange, removeLabel = (label) => `Remove ${label}` }: MultiSelectProps) {
  const pick = (vs?: string[]) => (vs === undefined ? undefined : options.filter((o) => vs.includes(o.value)))
  const anchor = React.useRef<HTMLDivElement>(null)
  return (
    <BaseCombobox.Root
      multiple
      items={options}
      value={pick(value)}
      defaultValue={pick(defaultValue)}
      itemToStringLabel={(o: MultiSelectOption) => o.label}
      isItemEqualToValue={(a: MultiSelectOption, b: MultiSelectOption) => a.value === b.value}
      onValueChange={(os) => onValueChange?.((os as MultiSelectOption[]).map((o) => o.value))}
      disabled={disabled}
      name={name}
      required={required}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      onInputValueChange={onInputValueChange}
    >
      <div data-slot="combobox" className={className}>
        <BaseCombobox.Chips data-slot="combobox-control" data-multiple="true" ref={anchor}>
          <BaseCombobox.Value>
            {(selected: MultiSelectOption[]) => (
              <>
                {selected.map((o) => (
                  <BaseCombobox.Chip key={o.value} data-slot="combobox-chip" aria-label={o.label}>
                    {o.label}
                    <BaseCombobox.ChipRemove data-slot="combobox-chip-remove" aria-label={removeLabel(o.label)}><X size={12} /></BaseCombobox.ChipRemove>
                  </BaseCombobox.Chip>
                ))}
                <BaseCombobox.Input data-slot="combobox-input" id={id} placeholder={selected.length ? '' : placeholder} aria-label={ariaLabel} aria-labelledby={labelledBy} />
              </>
            )}
          </BaseCombobox.Value>
        </BaseCombobox.Chips>
      </div>
      <BaseCombobox.Portal>
        <BaseCombobox.Positioner data-slot="combobox-positioner" sideOffset={4} anchor={anchor}>
          <BaseCombobox.Popup data-slot="combobox-content">
            <BaseCombobox.Empty data-slot="combobox-empty">{emptyText}</BaseCombobox.Empty>
            <BaseCombobox.List>
              {(o: MultiSelectOption) => (
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

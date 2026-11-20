import { NumberField } from '@base-ui-components/react/number-field'
import { Minus, Plus } from 'lucide-react'

export type NumberInputProps = {
  value?: number | null
  defaultValue?: number
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  name?: string
  'aria-label'?: string
  onValueChange?: (value: number | null) => void
  /** sm 32 / md 40 / lg 48, same as Button */
  size?: 'sm' | 'md' | 'lg'
}

/** A number with − / + steppers. Arrow keys and the scroll wheel step too. */
export function NumberInput({ onValueChange, 'aria-label': ariaLabel, size = 'md', ...props }: NumberInputProps) {
  return (
    <NumberField.Root {...props} onValueChange={(v) => onValueChange?.(v)}>
      <NumberField.Group data-slot="number-input" data-size={size}>
        <NumberField.Decrement data-slot="number-input-step" aria-label="Decrease"><Minus size={16} /></NumberField.Decrement>
        <NumberField.Input data-slot="number-input-field" aria-label={ariaLabel} />
        <NumberField.Increment data-slot="number-input-step" aria-label="Increase"><Plus size={16} /></NumberField.Increment>
      </NumberField.Group>
    </NumberField.Root>
  )
}

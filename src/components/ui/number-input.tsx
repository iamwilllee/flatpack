import { NumberField } from '@base-ui/react/number-field'
import { Minus, Plus } from 'lucide-react'

export type NumberInputProps = Omit<NumberField.Root.Props, 'className' | 'children' | 'render' | 'onValueChange'> & {
  onValueChange?: (value: number | null) => void
  /** sm 32 / md 40 / lg 48, same as Button. `default` is an alias of `md`. */
  size?: 'sm' | 'md' | 'default' | 'lg'
  className?: string
  'aria-label'?: string
  'aria-labelledby'?: string
  /** Accessible names of the stepper buttons, for localized products. */
  decrementLabel?: string
  incrementLabel?: string
}

/**
 * A number with − / + steppers. Arrow keys and the scroll wheel step too. Controlled (`value`)
 * or uncontrolled (`defaultValue`); Base UI root props (name, required, format, locale…) pass through.
 */
export function NumberInput({
  onValueChange, 'aria-label': ariaLabel, 'aria-labelledby': labelledBy, size = 'md',
  className, decrementLabel = 'Decrease', incrementLabel = 'Increase', ...props
}: NumberInputProps) {
  return (
    <NumberField.Root {...props} onValueChange={(v) => onValueChange?.(v)}>
      <NumberField.Group data-slot="number-input" data-size={size === 'default' ? 'md' : size} className={className}>
        <NumberField.Decrement data-slot="number-input-step" aria-label={decrementLabel}><Minus size={16} /></NumberField.Decrement>
        <NumberField.Input data-slot="number-input-field" aria-label={ariaLabel} aria-labelledby={labelledBy} />
        <NumberField.Increment data-slot="number-input-step" aria-label={incrementLabel}><Plus size={16} /></NumberField.Increment>
      </NumberField.Group>
    </NumberField.Root>
  )
}

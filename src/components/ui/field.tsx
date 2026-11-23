import * as React from 'react'
import { Field as BaseField } from '@base-ui/react/field'
import { Fieldset as BaseFieldset } from '@base-ui/react/fieldset'

export type FieldProps = {
  label?: React.ReactNode
  description?: React.ReactNode
  /** Shown in red under the control; also marks the field invalid. */
  error?: React.ReactNode
  required?: boolean
  disabled?: boolean
  name?: string
  /** Custom check, run per `validationMode`. Return a message (or several) when invalid; return nothing when valid. */
  validate?: BaseField.Root.Props['validate']
  /** When to run `validate`: on submit (default inside Form), on blur or on change. */
  validationMode?: BaseField.Root.Props['validationMode']
  className?: string
  children: React.ReactNode
}

/** Label, help text and error message around one control. */
export function Field({ label, description, error, required, disabled, name, validate, validationMode, className, children }: FieldProps) {
  const hasError = error != null && error !== false
  return (
    <BaseField.Root data-slot="field" invalid={hasError || undefined} disabled={disabled} name={name} validate={validate} validationMode={validationMode} className={className}>
      {label != null && (
        <BaseField.Label data-slot="field-label">
          {label}
          {required && <span data-slot="field-required" aria-hidden="true">*</span>}
        </BaseField.Label>
      )}
      {children}
      {description != null && !hasError && <BaseField.Description data-slot="field-description">{description}</BaseField.Description>}
      {/* An `error` prop is always shown. Without one, Base UI fills this from Form `errors` or from `validate`. */}
      {hasError ? <BaseField.Error data-slot="field-error" match>{error}</BaseField.Error> : <BaseField.Error data-slot="field-error" />}
    </BaseField.Root>
  )
}

/** Wraps a native control so Field can label and describe it. */
export const FieldControl = BaseField.Control

/** A titled group of fields. Space separates them; there is no box. */
export function Fieldset({ legend, className, children }: { legend: React.ReactNode; className?: string; children: React.ReactNode }) {
  return (
    <BaseFieldset.Root data-slot="fieldset" className={className}>
      <BaseFieldset.Legend data-slot="fieldset-legend">{legend}</BaseFieldset.Legend>
      {children}
    </BaseFieldset.Root>
  )
}

import { Form as BaseForm } from '@base-ui/react/form'

export type FormProps<Values extends Record<string, any> = Record<string, any>> = Omit<BaseForm.Props<Values>, 'className'> & {
  className?: string
}

/**
 * A `<form>` that works with Field. On submit it checks every control, focuses the first invalid
 * one and, if all pass, calls `onFormSubmit(values)` with the values keyed by control `name`.
 * Pass server-side errors as `errors={{ email: 'Already taken' }}`; they show in the matching
 * Field and clear when the user edits it. `validationMode` is `onSubmit` (default), `onBlur`
 * or `onChange`.
 */
export function Form<Values extends Record<string, any> = Record<string, any>>({ className, ...props }: FormProps<Values>) {
  return <BaseForm<Values> data-slot="form" className={className} {...props} />
}

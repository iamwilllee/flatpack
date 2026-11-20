import * as React from 'react'

export type ControlSize = 'sm' | 'md' | 'lg'

export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  /** sm 32 / md 40 / lg 48, same as Button. Controls in one row share one size. */
  size?: ControlSize
  /** outline: 1px border (default). filled: light grey fill, no border, e.g. a search box. */
  variant?: 'outline' | 'filled'
  /** Icon before the text, e.g. <Search />. */
  leading?: React.ReactNode
  /** Icon or short text after the text, e.g. a unit or <Kbd>. */
  trailing?: React.ReactNode
}

export function Input({ className, style, size = 'md', variant = 'outline', leading, trailing, ...props }: InputProps) {
  if (leading == null && trailing == null) {
    return <input data-slot="input" data-size={size} data-variant={variant} className={className} style={style} {...props} />
  }
  // With icons the group draws the field; the inner input is bare.
  return (
    <div data-slot="input-group" data-size={size} data-variant={variant} data-disabled={props.disabled ? 'true' : undefined} className={className} style={style}>
      {leading != null && <span data-slot="input-adornment" aria-hidden="true">{leading}</span>}
      <input data-slot="input-bare" {...props} />
      {trailing != null && <span data-slot="input-adornment">{trailing}</span>}
    </div>
  )
}

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label data-slot="label" className={className} {...props} />
}

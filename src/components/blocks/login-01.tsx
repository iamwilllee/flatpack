import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Divider } from '@/components/ui/divider'
import { Field, FieldControl } from '@/components/ui/field'
import { Form } from '@/components/ui/form'

export type SignInValues = { email: string; password: string; remember: boolean }

export type Login01Props = {
  /** Brand name in the ink panel. */
  brand?: string
  headline?: React.ReactNode
  /**
   * Called with the values once the built-in checks pass. Resolve to sign in; resolve to a map of
   * errors by field name (`{ password: 'Wrong password' }`) to show them under the fields.
   */
  onSignIn?: (values: SignInValues) => Promise<Partial<Record<keyof SignInValues, string>> | void> | Partial<Record<keyof SignInValues, string>> | void
  /** A second way in, such as SSO or a magic link. Hidden when not given. */
  onOtherMethod?: () => void
  forgotHref?: string
}

/**
 * Sign-in screen: an ink panel with the brand on one side, the form on the other. Below 640px of
 * its own width the panel folds away. Email and password are checked on submit; server errors
 * returned from `onSignIn` show under the matching field and clear when the user edits it.
 */
export function Login01({ brand = 'Flatpack', headline = 'Build with clarity.', onSignIn, onOtherMethod, forgotHref = '#' }: Login01Props) {
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [busy, setBusy] = React.useState(false)
  return (
    <div data-slot="block-login">
      <div data-slot="block-login-layout">
        <div data-slot="block-login-panel" className="fp-invert">
          <div style={{ fontWeight: 'var(--fp-weight-semibold)' }}>{brand}</div>
          <div style={{ fontSize: 'var(--fp-text-2xl)', fontWeight: 'var(--fp-weight-semibold)', letterSpacing: 'var(--fp-tracking-display)', lineHeight: 1.1 }}>{headline}</div>
        </div>
        <div data-slot="block-login-form">
          <h2 style={{ fontSize: 'var(--fp-text-lg)', fontWeight: 'var(--fp-weight-semibold)', margin: '0 0 var(--fp-space-2)' }}>Sign in</h2>
          <p style={{ margin: '0 0 var(--fp-space-5)', color: 'var(--fp-muted)', fontSize: 'var(--fp-text-sm)' }}>Welcome back. Enter your details.</p>
          <Form
            errors={errors}
            onFormSubmit={async (v) => {
              setBusy(true)
              try {
                const result = await onSignIn?.({ email: String(v.email ?? ''), password: String(v.password ?? ''), remember: Boolean(v.remember) })
                setErrors(result ?? {})
              } finally {
                setBusy(false)
              }
            }}
          >
            <Field label="Email" name="email" required>
              <FieldControl render={<Input type="email" required autoComplete="email" placeholder="you@example.com" />} />
            </Field>
            <Field label="Password" name="password" required>
              <FieldControl render={<Input type="password" required autoComplete="current-password" />} />
            </Field>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--fp-space-3)', flexWrap: 'wrap' }}>
              {/* Form only collects values from controls inside a Field. */}
              <Field name="remember"><Checkbox defaultChecked label="Remember me" /></Field>
              <a href={forgotHref} style={{ fontSize: 'var(--fp-text-sm)', color: 'var(--fp-ink)' }}>Forgot password?</a>
            </div>
            <Button type="submit" disabled={busy} style={{ width: '100%' }}>{busy ? 'Signing in…' : 'Sign in'}</Button>
            {onOtherMethod && (
              <>
                <Divider label="or" />
                <Button variant="outline" onClick={onOtherMethod} style={{ width: '100%' }}>Continue with SSO</Button>
              </>
            )}
          </Form>
        </div>
      </div>
    </div>
  )
}

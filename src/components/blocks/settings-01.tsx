import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'
import { Field, FieldControl, Fieldset } from '@/components/ui/field'
import { Form } from '@/components/ui/form'
import { Segmented } from '@/components/ui/segmented'
import { Sidebar, SidebarSection, SidebarItem } from '@/components/ui/sidebar'
import { toast } from '@/components/ui/toast'

export type Profile = { name: string; email: string; newsletter: boolean; digest: 'daily' | 'weekly' | 'never' }

export type Settings01Props = {
  defaultValue?: Profile
  /** Called with the values once the checks pass. Resolve to a map of errors by field name to show them. */
  onSave?: (profile: Profile) => Promise<Partial<Record<keyof Profile, string>> | void> | Partial<Record<keyof Profile, string>> | void
}

const SECTIONS = ['Profile', 'Notifications', 'Security', 'Billing'] as const

/**
 * Account settings: a section list beside a profile form. The form keeps its own draft, checks
 * name and email on save and confirms with a toast (mount `<Toaster />` once in the app).
 * Only Profile is built here; the other sections are placeholders for your own forms.
 */
export function Settings01({ defaultValue = { name: 'Alex Wang', email: 'alex@example.com', newsletter: true, digest: 'weekly' }, onSave }: Settings01Props) {
  const [section, setSection] = React.useState<(typeof SECTIONS)[number]>('Profile')
  const [digest, setDigest] = React.useState(defaultValue.digest)
  const [newsletter, setNewsletter] = React.useState(defaultValue.newsletter)
  const [name, setName] = React.useState(defaultValue.name)
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [formKey, setFormKey] = React.useState(0)
  const digestId = React.useId()

  const reset = () => {
    setName(defaultValue.name)
    setNewsletter(defaultValue.newsletter)
    setDigest(defaultValue.digest)
    setErrors({})
    setFormKey((k) => k + 1)
  }

  return (
    <div data-slot="block-settings">
      <div data-slot="block-settings-layout">
        <Sidebar aria-label="Settings">
          <SidebarSection label="Account">
            {SECTIONS.map((s) => <SidebarItem key={s} active={s === section} onClick={() => setSection(s)}>{s}</SidebarItem>)}
          </SidebarSection>
        </Sidebar>
        <div style={{ flex: 1, minWidth: 0, maxWidth: 560 }}>
          <h2 style={{ fontSize: 'var(--fp-text-lg)', fontWeight: 'var(--fp-weight-semibold)', letterSpacing: 'var(--fp-tracking-display)', margin: '0 0 var(--fp-space-5)' }}>{section}</h2>
          {section !== 'Profile' ? (
            <p style={{ margin: 0, color: 'var(--fp-muted)', fontSize: 'var(--fp-text-sm)' }}>Put your {section.toLowerCase()} settings here.</p>
          ) : (
            <Form
              key={formKey}
              errors={errors}
              onFormSubmit={async (v) => {
                const profile: Profile = { name: String(v.name ?? ''), email: String(v.email ?? ''), newsletter, digest }
                const result = await onSave?.(profile)
                setErrors(result ?? {})
                if (!result || Object.keys(result).length === 0) toast({ title: 'Profile saved', type: 'success' })
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--fp-space-3)' }}>
                <Avatar name={name || '?'} size="lg" />
                <Button size="sm" variant="outline">Change photo</Button>
              </div>
              <div data-slot="block-settings-row">
                <Field label="Name" name="name" required>
                  <FieldControl render={<Input required defaultValue={defaultValue.name} autoComplete="name" onChange={(e) => setName(e.target.value)} />} />
                </Field>
                <Field label="Email" name="email" required description="Receipts and sign-in links go here.">
                  <FieldControl render={<Input type="email" required defaultValue={defaultValue.email} autoComplete="email" />} />
                </Field>
              </div>
              <Fieldset legend="Email updates">
                <Switch label="Product news" checked={newsletter} onCheckedChange={setNewsletter} />
                <div style={{ display: 'grid', gap: 'var(--fp-space-2)', justifyItems: 'start' }}>
                  <span style={{ fontSize: 'var(--fp-text-sm)', fontWeight: 'var(--fp-weight-medium)' }} id={digestId}>Activity digest</span>
                  <Segmented
                    aria-labelledby={digestId}
                    size="sm"
                    value={digest}
                    onValueChange={setDigest}
                    options={[{ value: 'daily', label: 'Daily' }, { value: 'weekly', label: 'Weekly' }, { value: 'never', label: 'Never' }]}
                  />
                </div>
              </Fieldset>
              <div style={{ display: 'flex', gap: 'var(--fp-space-2)' }}>
                <Button type="submit">Save changes</Button>
                <Button variant="ghost" onClick={reset}>Reset</Button>
              </div>
            </Form>
          )}
        </div>
      </div>
    </div>
  )
}

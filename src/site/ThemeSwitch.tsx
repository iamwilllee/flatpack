import { useState } from 'react'
import { Segmented } from '@/components/ui/segmented'
import { useI18n } from '@/site/i18n'

export type FpTheme = 'flatpack' | 'catalog' | 'sage'
const THEMES: FpTheme[] = ['flatpack', 'catalog', 'sage']
const LABEL: Record<FpTheme, string> = { flatpack: 'Flatpack', catalog: 'Catalog', sage: 'Sage' }

const read = (): FpTheme => {
  const m = window.location.hash.match(/[?&]theme=(\w+)/)
  return m && (THEMES as string[]).includes(m[1]) ? (m[1] as FpTheme) : 'flatpack'
}

/** The theme chosen for a gallery page. It lives in the URL (#/blocks?theme=sage) so a view can be shared. */
export function useFpTheme() {
  const [theme, setThemeState] = useState<FpTheme>(read)
  const setTheme = (next: FpTheme) => {
    setThemeState(next)
    const [path, query = ''] = window.location.hash.split('?')
    const params = new URLSearchParams(query)
    if (next === 'flatpack') params.delete('theme')
    else params.set('theme', next)
    const qs = params.toString()
    history.replaceState(null, '', `${path}${qs ? `?${qs}` : ''}`)
  }
  return [theme, setTheme] as const
}

/** Attributes that put a subtree in a theme. The default theme needs none. */
export const themeScope = (theme: FpTheme) => (theme === 'flatpack' ? {} : { 'data-fp-theme': theme })

export function ThemeSwitch({ value, onChange }: { value: FpTheme; onChange: (theme: FpTheme) => void }) {
  const { t } = useI18n()
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--fp-space-3)' }}>
      <span className="fp-label">{t('theme.label')}</span>
      <Segmented size="sm" aria-label={t('theme.label')} value={value} onValueChange={(v) => onChange(v as FpTheme)} options={THEMES.map((id) => ({ value: id, label: LABEL[id] }))} />
    </div>
  )
}

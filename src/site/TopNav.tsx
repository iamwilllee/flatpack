import { useState } from 'react'
import { Sun, Moon, Menu, X, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useI18n, type TKey } from '@/site/i18n'
import { REPO_URL } from '@/site/origin'
import { BrandMark } from '@/site/BrandMark'

export type Route = 'home' | 'components' | 'create' | 'blocks' | 'docs' | 'templates'

const NAV: { id: Route; key: TKey }[] = [
  { id: 'docs', key: 'nav.docs' },
  { id: 'components', key: 'nav.components' },
  { id: 'blocks', key: 'nav.blocks' },
  { id: 'templates', key: 'nav.templates' },
  { id: 'create', key: 'nav.create' },
]


/**
 * Brand on the left; navigation and actions together on the right.
 * Everything sits in the shared page container (.fp-container), so the logo
 * lines up with the page's left edge and the GitHub button with its right
 * edge. The hairline below is drawn at container width, not full bleed.
 */
export function TopNav({ route, dark, onTheme, onNavigate }: {
  route: Route
  dark: boolean
  onTheme: () => void
  onNavigate: (r: Route) => void
}) {
  const { lang, setLang, t } = useI18n()
  const [menuOpen, setMenuOpen] = useState(false)
  const go = (r: Route) => { onNavigate(r); setMenuOpen(false) }
  const link = (active: boolean): React.CSSProperties => ({ color: active ? 'var(--fp-ink)' : 'var(--fp-muted)' })

  return (
    <header className="fp-topnav" style={{ position: 'sticky', top: 0, zIndex: 40, background: 'var(--fp-bg)', color: 'var(--fp-ink)' }}>
      <div className="fp-container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--fp-space-5)', height: 64, borderBottom: '1px solid var(--fp-line)' }}>
          <Button variant="ghost" onClick={() => go('home')} className="fp-topnav-brand" aria-label="Flatpack">
            <BrandMark size={24} />
            <span style={{ fontWeight: 'var(--fp-weight-semibold)', fontSize: 'var(--fp-text-base)' }}>Flatpack</span>
          </Button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--fp-space-3)' }}>
            <nav className="fp-topnav-links" aria-label="Main" style={{ display: 'flex', alignItems: 'center' }}>
              {NAV.map((n) => (
                <Button key={n.id} variant="ghost" size="sm" onClick={() => go(n.id)} style={link(route === n.id)} aria-current={route === n.id ? 'page' : undefined}>
                  {t(n.key)}
                </Button>
              ))}
            </nav>
            <span className="fp-topnav-links" aria-hidden="true" style={{ width: 1, height: 16, background: 'var(--fp-line)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--fp-space-1)' }}>
              <Button variant="ghost" size="icon-sm" onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')} aria-label="Switch language">
                {lang === 'zh' ? 'EN' : '中'}
              </Button>
              <Button variant="ghost" size="icon-sm" onClick={onTheme} title={t('nav.theme')} aria-label={t('nav.theme')}>
                {dark ? <Sun size={16} /> : <Moon size={16} />}
              </Button>
            </div>
            <a href={REPO_URL} target="_blank" rel="noreferrer" data-slot="button" data-variant="outline" data-size="sm" aria-label={`GitHub, ${t('nav.repo')}`}>
              GitHub <ArrowUpRight size={16} />
            </a>
            <Button variant="ghost" size="icon-sm" className="fp-topnav-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu" aria-expanded={menuOpen} style={{ display: 'none' }}>
              {menuOpen ? <X size={16} /> : <Menu size={16} />}
            </Button>
          </div>
        </div>
      </div>
      {menuOpen && (
        <div className="fp-topnav-mobile" style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--fp-bg)', display: 'none' }}>
          <nav className="fp-container" aria-label="Main" style={{ display: 'flex', flexDirection: 'column', paddingBlock: 'var(--fp-space-2)', borderBottom: '1px solid var(--fp-line)' }}>
            {NAV.map((n) => (
              <Button key={n.id} variant="ghost" onClick={() => go(n.id)} style={{ ...link(route === n.id), justifyContent: 'flex-start' }}>{t(n.key)}</Button>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}

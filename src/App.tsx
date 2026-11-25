import { useState, useEffect } from 'react'
import { TopNav, type Route } from '@/site/TopNav'
import HomePage from '@/pages/HomePage'
import ComponentsPage from '@/pages/ComponentsPage'
import CreatePage from '@/pages/CreatePage'
import BlocksPage from '@/pages/BlocksPage'
import DocsPage from '@/pages/DocsPage'
import TemplatesPage from '@/pages/TemplatesPage'
import ComponentDocPage from '@/pages/ComponentDocPage'
import { docs, movedDocs } from '@/site/componentDocs'
import { Separator } from '@/components/ui/primitives'
import { LangProvider, useI18n } from '@/site/i18n'
import { useTheme } from '@/site/theme'
import { Toaster } from '@/components/ui/toast'

const ROUTES: Route[] = ['home', 'components', 'create', 'blocks', 'docs', 'templates']

// A renamed doc keeps its old link: swap in the new URL without adding a history entry.
function redirectMovedDoc() {
  const id = window.location.hash.match(/^#\/docs\/components\/([\w-]+)$/)?.[1]
  const moved = id ? movedDocs.get(id) : undefined
  if (moved) window.history.replaceState(null, '', `#/docs/components/${moved}`)
}

function parseHash(): { route: Route; docId: string | null } {
  const hash = window.location.hash
  const docMatch = hash.match(/^#\/docs\/components\/([\w-]+)$/)
  if (docMatch && docs.some((d) => d.id === docMatch[1])) {
    return { route: 'docs', docId: docMatch[1] }
  }
  const h = hash.replace(/^#\/?/, '').split('?')[0] as Route
  return { route: ROUTES.includes(h) ? h : 'home', docId: null }
}

function AppShell() {
  const { t } = useI18n()
  const [state, setState] = useState(() => { redirectMovedDoc(); return parseHash() })
  const { theme, toggle } = useTheme()
  const dark = theme === 'dark'

  useEffect(() => {
    const onHash = () => { redirectMovedDoc(); setState(parseHash()); window.scrollTo({ top: 0 }) }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const navigate = (r: Route) => {
    window.location.hash = r === 'home' ? '/' : `/${r}`
    setState({ route: r, docId: null })
    window.scrollTo({ top: 0 })
  }

  const { route, docId } = state

  return (
    <div style={{ minHeight: '100vh', background: 'var(--fp-bg)', color: 'var(--fp-ink)' }}>
      <TopNav route={route} dark={dark} onTheme={toggle} onNavigate={navigate} />
      {docId ? (
        <ComponentDocPage key={docId} id={docId} onNavigate={navigate} />
      ) : (
        <>
          <div className="fp-container" style={{ paddingBlock: route === 'home' ? 0 : 'var(--fp-space-7) var(--fp-space-9)' }}>
            {route === 'home' && <HomePage onNavigate={navigate} />}
            {route === 'components' && <ComponentsPage />}
            {route === 'create' && <CreatePage />}
            {route === 'blocks' && <BlocksPage />}
            {route === 'docs' && <DocsPage onNavigate={navigate} />}
            {route === 'templates' && <TemplatesPage />}
          </div>
          <footer className="fp-container" style={{ paddingBottom: 'var(--fp-space-6)' }}>
            <Separator />
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--fp-space-2)', paddingTop: 'var(--fp-space-5)' }}>
              <span className="fp-label">{t('app.footerA')}</span>
              <span className="fp-label">{t('app.footerB')}</span>
            </div>
          </footer>
        </>
      )}
    </div>
  )
}

export default function App() {
  return (
    <LangProvider>
      <AppShell />
      <Toaster />
    </LangProvider>
  )
}

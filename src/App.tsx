import { lazy, Suspense, useState, useEffect } from 'react'
import { TopNav, type Route } from '@/site/TopNav'
import HomePage from '@/pages/HomePage'
import { docs, movedDocs } from '@/site/componentDocs'
import { Separator } from '@/components/ui/primitives'
import { LangProvider, useI18n } from '@/site/i18n'
import { useTheme } from '@/site/theme'
import { Toaster } from '@/components/ui/toast'

// The home page loads with the app; every other page is its own chunk, fetched on first visit.
const ComponentsPage = lazy(() => import('@/pages/ComponentsPage'))
const CreatePage = lazy(() => import('@/pages/CreatePage'))
const BlocksPage = lazy(() => import('@/pages/BlocksPage'))
const DocsPage = lazy(() => import('@/pages/DocsPage'))
const TemplatesPage = lazy(() => import('@/pages/TemplatesPage'))
const ComponentDocPage = lazy(() => import('@/pages/ComponentDocPage'))

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
        <Suspense fallback={null}><ComponentDocPage key={docId} id={docId} onNavigate={navigate} /></Suspense>
      ) : (
        <>
          <main className="fp-container" style={{ paddingBlock: route === 'home' ? 0 : 'var(--fp-space-7) var(--fp-space-9)' }}>
            <Suspense fallback={null}>
              {route === 'home' && <HomePage onNavigate={navigate} />}
              {route === 'components' && <ComponentsPage />}
              {route === 'create' && <CreatePage />}
              {route === 'blocks' && <BlocksPage />}
              {route === 'docs' && <DocsPage onNavigate={navigate} />}
              {route === 'templates' && <TemplatesPage />}
            </Suspense>
          </main>
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

import { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SidebarItem } from '@/components/ui/sidebar'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import { useI18n } from '@/site/i18n'
import { docs, type ComponentDoc } from '@/site/componentDocs'
import { CodeBlock, InlineDemo } from '@/site/DocParts'
import { REGISTRY_ORIGIN } from '@/site/origin'

export default function ComponentDocPage({ id, onNavigate }: { id: string; onNavigate: (r: 'docs' | 'components') => void }) {
  const { lang, t } = useI18n()
  const index = docs.findIndex((d) => d.id === id)
  const doc: ComponentDoc | undefined = index >= 0 ? docs[index] : docs[0]
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    const onHash = () => {
      const h = window.location.hash.replace('#/docs/components/', '')
      if (docs.some((d) => d.id === h)) window.scrollTo({ top: 0 })
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // The registry item is named after the source file, which is not always the doc id (dropdown → dropdown-menu).
  const installCmd = `npx shadcn@latest add ${REGISTRY_ORIGIN}/r/${doc.importPath.split('/').pop()}.json`

  const copy = (key: string, text: string) => {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(key)
      setTimeout(() => setCopied(null), 1500)
    }).catch(() => {})
  }

  const go = (target: string) => {
    window.location.hash = `/docs/components/${target}`
  }

  const sections = [
    { id: 'installation', label: t('doc.installation') },
    { id: 'usage', label: t('doc.usage') },
    ...doc.examples.map((e, i) => ({ id: `example-${i}`, label: lang === 'zh' ? e.title : (e.titleEn ?? e.title) })),
    { id: 'api', label: t('doc.api') },
  ]

  return (
    <div className="fp-doc-layout fp-container" style={{ display: 'grid', gridTemplateColumns: '200px minmax(0, 1fr) 180px', gap: 'var(--fp-space-7)', paddingBlock: 'var(--fp-space-6) var(--fp-space-9)' }}>
      {/* left: component list */}
      <aside className="fp-doc-side" style={{ position: 'sticky', top: 86, height: 'calc(100vh - 100px)', overflowY: 'auto' }}>
        <Button variant="link" size="sm" onClick={() => onNavigate('docs')} style={{ color: 'var(--fp-muted)', padding: '0 0 var(--fp-space-3)', gap: 'var(--fp-space-1)', fontSize: 'var(--fp-text-xs)' }}>
          <ArrowLeft size={16} /> {t('doc.home')}
        </Button>
        <div className="fp-label" style={{ marginBottom: 'var(--fp-space-2)' }}>Components · {docs.length}</div>
        {docs.map((d) => (
          <SidebarItem key={d.id} active={d.id === id} onClick={() => go(d.id)}>{d.title}</SidebarItem>
        ))}
      </aside>

      {/* center: doc body */}
      <main style={{ minWidth: 0 }}>
        {/* title + description */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--fp-space-2)' }}>
          <div>
            <div className="fp-label" style={{ marginBottom: 'var(--fp-space-2)' }}>{(lang === 'zh' ? doc.category : (doc.categoryEn ?? doc.category))} · {doc.title}</div>
            <h1 style={{ fontSize: 'var(--fp-text-2xl)', fontWeight: 'var(--fp-weight-semibold)', letterSpacing: 'var(--fp-tracking-display)', margin: 0 }}>{doc.title}</h1>
          </div>
          <div style={{ display: 'flex', gap: 'var(--fp-space-2)' }}>
            <Button variant="outline" size="icon" onClick={() => index > 0 && go(docs[index - 1].id)} disabled={index <= 0} title={t('doc.prev')} style={{ width: 30, height: 30 }}><ArrowLeft size={16} /></Button>
            <Button variant="outline" size="icon" onClick={() => index < docs.length - 1 && go(docs[index + 1].id)} disabled={index >= docs.length - 1} title={t('doc.next')} style={{ width: 30, height: 30 }}><ArrowRight size={16} /></Button>
          </div>
        </div>
        <p style={{ fontSize: 'var(--fp-text-sm)', color: 'var(--fp-muted)', margin: '0 0 var(--fp-space-6)' }}>{lang === 'zh' ? doc.description : (doc.descriptionEn ?? doc.description)}</p>

        {/* live preview of primary example */}
        <Card style={{ marginBottom: 'var(--fp-space-6)' }}>
          <div style={{ minHeight: 180, display: 'grid', placeItems: 'center', padding: 'var(--fp-space-6)', background: 'var(--fp-surface)' }}>
            <InlineDemo id={doc.id} variant={0} />
          </div>
          <CodeBlock code={doc.examples[0]?.code ?? doc.usage} copied={copied === 'preview'} onCopy={() => copy('preview', doc.examples[0]?.code ?? doc.usage)} label="Preview" />
        </Card>

        {/* installation */}
        <section id="installation" style={{ scrollMarginTop: 80, marginBottom: 'var(--fp-space-6)' }}>
          <h2 style={{ fontSize: 'var(--fp-text-lg)', fontWeight: 'var(--fp-weight-semibold)', marginBottom: 'var(--fp-space-3)' }}>{t('doc.installation')}</h2>
          <CodeBlock
            code={`# ${lang === 'zh' ? '第一次使用：先装主题样式' : 'first time: install the theme'}\nnpx shadcn@latest add ${REGISTRY_ORIGIN}/r/flatpack-theme.json\n\n# ${lang === 'zh' ? '安装组件（依赖的组件会一起装上）' : 'add the component (its dependencies come with it)'}\n${installCmd}`}
            copied={copied === 'install'}
            onCopy={() => copy('install', installCmd)}
            label="Terminal"
          />
        </section>

        {/* usage */}
        <section id="usage" style={{ scrollMarginTop: 80, marginBottom: 'var(--fp-space-6)' }}>
          <h2 style={{ fontSize: 'var(--fp-text-lg)', fontWeight: 'var(--fp-weight-semibold)', marginBottom: 'var(--fp-space-3)' }}>{t('doc.usage')}</h2>
          <p style={{ fontSize: 'var(--fp-text-sm)', color: 'var(--fp-muted)', marginBottom: 'var(--fp-space-3)' }}>{t('doc.importFrom')} <code style={{ fontFamily: 'var(--fp-mono)', fontSize: 'var(--fp-text-xs)' }}>{doc.importPath}</code></p>
          <CodeBlock code={doc.usage} copied={copied === 'usage'} onCopy={() => copy('usage', doc.usage)} label="TSX" />
        </section>

        {/* examples */}
        {doc.examples.map((ex, i) => (
          <section key={i} id={`example-${i}`} style={{ scrollMarginTop: 80, marginBottom: 'var(--fp-space-6)' }}>
            <h2 style={{ fontSize: 'var(--fp-text-lg)', fontWeight: 'var(--fp-weight-semibold)', marginBottom: 'var(--fp-space-3)' }}>{lang === 'zh' ? ex.title : (ex.titleEn ?? ex.title)}</h2>
            <Card>
              <div style={{ minHeight: 130, display: 'grid', placeItems: 'center', padding: 'var(--fp-space-5)', background: 'var(--fp-surface)' }}>
                <InlineDemo id={doc.id} variant={i} />
              </div>
              <CodeBlock code={ex.code} copied={copied === `ex${i}`} onCopy={() => copy(`ex${i}`, ex.code)} label="TSX" />
            </Card>
          </section>
        ))}

        {/* API reference */}
        <section id="api" style={{ scrollMarginTop: 80, marginBottom: 'var(--fp-space-5)' }}>
          <h2 style={{ fontSize: 'var(--fp-text-lg)', fontWeight: 'var(--fp-weight-semibold)', marginBottom: 'var(--fp-space-3)' }}>{t('doc.api')}</h2>
          <p style={{ fontSize: 'var(--fp-text-sm)', color: 'var(--fp-muted)', marginBottom: 'var(--fp-space-4)' }}>{doc.title} — {t('doc.apiDesc')}</p>
          <Card style={{ overflowX: 'auto', padding: 0, width: '100%', maxWidth: '100%' }}>
            <Table style={{ minWidth: 520 }}>
              <TableHeader>
                <TableRow>
                  {[t('doc.prop'), t('doc.type'), t('doc.default'), t('doc.desc')].map((h) => (
                    <TableHead key={h}>{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {doc.api.map((row) => (
                  <TableRow key={row.prop}>
                    <TableCell style={{ fontFamily: 'var(--fp-mono)', fontWeight: 'var(--fp-weight-semibold)', whiteSpace: 'nowrap' }}>{row.prop}</TableCell>
                    <TableCell style={{ fontFamily: 'var(--fp-mono)', fontSize: 'var(--fp-text-xs)', color: 'var(--fp-muted)' }}>{row.type}</TableCell>
                    <TableCell style={{ fontFamily: 'var(--fp-mono)', fontSize: 'var(--fp-text-xs)' }}>{row.default ?? '—'}</TableCell>
                    <TableCell>{lang === 'zh' ? row.desc : (row.descEn ?? row.desc)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </section>

        {/* prev / next */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--fp-space-7)', paddingTop: 'var(--fp-space-5)', borderTop: '1px solid var(--fp-line)' }}>
          {index > 0
            ? <Button variant="link" size="sm" onClick={() => go(docs[index - 1].id)} style={{ gap: 'var(--fp-space-2)' }}><ArrowLeft size={16} /> {docs[index - 1].title}</Button>
            : <span />}
          {index < docs.length - 1
            ? <Button variant="link" size="sm" onClick={() => go(docs[index + 1].id)} style={{ gap: 'var(--fp-space-2)' }}>{docs[index + 1].title} <ArrowRight size={16} /></Button>
            : <span />}
        </div>
      </main>

      {/* right: on this page */}
      <aside className="fp-doc-toc" style={{ position: 'sticky', top: 86, height: 'fit-content' }}>
        <div className="fp-label" style={{ marginBottom: 'var(--fp-space-3)' }}>{t('doc.onThisPage')}</div>
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            onClick={(e) => { e.preventDefault(); document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}
            style={{ display: 'block', padding: 'var(--fp-space-1) 0', fontSize: 'var(--fp-text-xs)', color: 'var(--fp-muted)', textDecoration: 'none' }}
          >{s.label}</a>
        ))}
      </aside>
    </div>
  )
}

import { useState } from 'react'
import { Check, Copy, ArrowRight, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Kicker, Separator } from '@/components/ui/primitives'
import { Card } from '@/components/ui/card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { docs } from '@/site/componentDocs'
import { useI18n } from '@/site/i18n'
import { setTheme } from '@/site/theme'
import tokens from '../../tokens/flatpack.tokens.json'

export default function DocsPage({ onNavigate }: { onNavigate: (r: 'components' | 'docs') => void }) {
  const { lang, t } = useI18n()
  const [copied, setCopied] = useState<string | null>(null)
  const copy = (key: string, text: string) => {
    navigator.clipboard?.writeText(text).then(() => { setCopied(key); setTimeout(() => setCopied(null), 1500) }).catch(() => {})
  }

  const INSTALL = `npm install react react-dom @base-ui/react clsx tailwind-merge lucide-react

# ${lang === 'zh' ? '把 src/styles/flatpack.css 复制到你的项目' : 'copy src/styles/flatpack.css into your project'}
# ${lang === 'zh' ? '在入口引入（放在 tailwind 之后）' : 'import it in your entry (after tailwind)'}:
@import "flatpack.css";`

  const USAGE = `import { Button } from "@/components/ui/button"

export default function App() {
  return <Button>${lang === 'zh' ? '构建你的界面' : 'Build your interface'}</Button>
}`

  const stack: { n: string; zh: string; en: string }[] = [
    { n: 'React 19 + React DOM', zh: '组件运行时', en: 'Component runtime' },
    { n: 'Base UI', zh: '无样式交互原语：所有交互组件的基础（Dialog / Select / Menu / Tabs…）', en: 'Unstyled interaction primitives behind every interactive component (Dialog / Select / Menu / Tabs…)' },
    { n: 'Tailwind CSS 4', zh: '布局与间距工具类；主题层在其后引入', en: 'Layout and spacing utilities; theme loads after it' },
    { n: 'TypeScript', zh: '类型定义', en: 'Type definitions' },
    { n: 'lucide-react', zh: '图标', en: 'Icons' },
    { n: 'clsx + tailwind-merge', zh: 'cn() 类名合并工具', en: 'cn() class merging helper' },
    { n: 'shadcn registry', zh: '分发格式，npx shadcn add 可安装', en: 'Distribution format; install with npx shadcn add' },
  ]

  const principles = tokens.principles
  const palette = Object.entries(tokens.color).map(([name, v]) => ({
    name,
    light: v.light.startsWith('gray.') ? tokens.gray[v.light.slice(5) as keyof typeof tokens.gray] : v.light,
    dark: v.dark.startsWith('gray.') ? tokens.gray[v.dark.slice(5) as keyof typeof tokens.gray] : v.dark,
    zh: v.zh, en: v.en,
  }))

  const toc = [
    { id: 'components', label: t('docs.componentsCard') },
    { id: 'stack', label: t('docs.stackTitle') },
    { id: 'usage', label: t('docs.usageTitle') },
    { id: 'language', label: t('docs.langTitle') },
    { id: 'colors', label: t('docs.colorsTitle') },
    { id: 'theme', label: t('docs.themeTitle') },
    { id: 'figma', label: t('docs.figmaTitle') },
  ]

  return (
    <div className="fp-docs-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 200px', gap: 'var(--fp-space-8)', alignItems: 'start' }}>
    <div style={{ maxWidth: 820, minWidth: 0, paddingBottom: 'var(--fp-space-9)' }}>
      <Kicker>{t('docs.kicker')}</Kicker>
      <h1 style={{ fontSize: 'var(--fp-text-2xl)', fontWeight: 'var(--fp-weight-semibold)', letterSpacing: 'var(--fp-tracking-display)', margin: 'var(--fp-space-4) 0 var(--fp-space-3)' }}>{t('docs.title')}</h1>
      <p style={{ fontSize: 'var(--fp-text-base)', color: 'var(--fp-muted)', marginBottom: 'var(--fp-space-6)' }}>{t('docs.intro')}</p>

      <section id="components" style={{ scrollMarginTop: 96, marginBottom: 'var(--fp-space-8)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--fp-space-4)' }}>
          <div>
            <div style={{ fontWeight: 'var(--fp-weight-semibold)', fontSize: 'var(--fp-text-base)' }}>{t('docs.componentsCard')}</div>
            <div style={{ fontSize: 'var(--fp-text-xs)', color: 'var(--fp-muted)', marginTop: 'var(--fp-space-1)' }}>{t('docs.componentsCardDesc')}</div>
          </div>
          <Button size="sm" variant="outline" onClick={() => onNavigate('components')}>{t('docs.overview')} <ArrowRight size={16} /></Button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0 var(--fp-space-5)' }}>
          {docs.map((d) => (
            <a
              key={d.id}
              href={`#/docs/components/${d.id}`}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: 'var(--fp-space-2) 0', borderBottom: '1px solid var(--fp-line)',
                color: 'var(--fp-ink)', textDecoration: 'none',
                fontSize: 'var(--fp-text-xs)', fontWeight: 'var(--fp-weight-semibold)',
              }}
            >
              {d.title} <ChevronRight size={16} color="var(--fp-muted)" />
            </a>
          ))}
        </div>
      </section>

      <section id="stack" style={{ scrollMarginTop: 96, marginBottom: 'var(--fp-space-8)' }}>
        <h2 style={{ fontSize: 'var(--fp-text-lg)', fontWeight: 'var(--fp-weight-semibold)', marginBottom: 'var(--fp-space-3)' }}>{t('docs.stackTitle')}</h2>
        <p style={{ color: 'var(--fp-muted)', marginBottom: 'var(--fp-space-4)' }}>{t('docs.stackDesc')}</p>
        <Card style={{ padding: 0, overflowX: 'auto', marginBottom: 'var(--fp-space-4)' }}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{lang === 'zh' ? '依赖' : 'Dependency'}</TableHead>
                <TableHead>{lang === 'zh' ? '用途' : 'Role'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stack.map((d) => (
                <TableRow key={d.n}>
                  <TableCell style={{ fontFamily: 'var(--fp-mono)', fontWeight: 'var(--fp-weight-semibold)', whiteSpace: 'nowrap' }}>{d.n}</TableCell>
                  <TableCell>{lang === 'zh' ? d.zh : d.en}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
        <CodeBlock text={INSTALL} copied={copied === 'install'} onCopy={() => copy('install', INSTALL)} copyLabel={t('cmp.copy')} />
      </section>

      <section id="usage" style={{ scrollMarginTop: 96, marginBottom: 'var(--fp-space-8)' }}>
        <h2 style={{ fontSize: 'var(--fp-text-lg)', fontWeight: 'var(--fp-weight-semibold)', marginBottom: 'var(--fp-space-3)' }}>{t('docs.usageTitle')}</h2>
        <p style={{ color: 'var(--fp-muted)', marginBottom: 'var(--fp-space-3)' }}>{t('docs.usageDesc')}</p>
        <CodeBlock text={USAGE} copied={copied === 'usage'} onCopy={() => copy('usage', USAGE)} copyLabel={t('cmp.copy')} />
      </section>

      <Separator />
      <section id="language" style={{ scrollMarginTop: 96, margin: 'var(--fp-space-8) 0' }}>
        <h2 style={{ fontSize: 'var(--fp-text-lg)', fontWeight: 'var(--fp-weight-semibold)', marginBottom: 'var(--fp-space-2)' }}>{t('docs.langTitle')}</h2>
        <p style={{ color: 'var(--fp-muted)', marginBottom: 'var(--fp-space-4)' }}>{t('docs.langDesc')}</p>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {principles.map((p, i) => (
            <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '48px 1fr', gap: 'var(--fp-space-4)', padding: 'var(--fp-space-5) 0', borderTop: '1px solid var(--fp-line)' }}>
              <div className="fp-num fp-muted" style={{ fontSize: 'var(--fp-text-xs)', paddingTop: 'var(--fp-space-1)' }}>{String(i + 1).padStart(2, '0')}</div>
              <div>
                <div style={{ fontWeight: 'var(--fp-weight-semibold)', fontSize: 'var(--fp-text-lg)', marginBottom: 'var(--fp-space-2)' }}>{lang === 'zh' ? p.zh : p.en}</div>
                <div style={{ color: 'var(--fp-muted)' }}>{lang === 'zh' ? p.zhDesc : p.enDesc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Separator />
      <section id="colors" style={{ scrollMarginTop: 96, margin: 'var(--fp-space-8) 0' }}>
        <h2 style={{ fontSize: 'var(--fp-text-lg)', fontWeight: 'var(--fp-weight-semibold)', marginBottom: 'var(--fp-space-3)' }}>{t('docs.colorsTitle')}</h2>
        <p style={{ color: 'var(--fp-muted)', marginBottom: 'var(--fp-space-4)' }}>{t('docs.colorsDesc')}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 'var(--fp-space-5) var(--fp-space-4)' }}>
          {palette.map((c) => (
            <div key={c.name}>
              <div style={{ display: 'flex', height: 48, border: '1px solid var(--fp-line)' }}>
                <div style={{ flex: 1, background: c.light }} />
                <div style={{ flex: 1, background: c.dark }} />
              </div>
              <div className="fp-num" style={{ fontSize: 'var(--fp-text-sm)', marginTop: 'var(--fp-space-2)' }}>--fp-{c.name}</div>
              <div className="fp-num fp-muted" style={{ fontSize: 'var(--fp-text-xs)' }}>{c.light} / {c.dark}</div>
              <div className="fp-muted" style={{ fontSize: 'var(--fp-text-sm)' }}>{lang === 'zh' ? c.zh : c.en}</div>
            </div>
          ))}
        </div>
      </section>

      <Separator />
      <section id="theme" style={{ scrollMarginTop: 96, margin: 'var(--fp-space-8) 0' }}>
        <h2 style={{ fontSize: 'var(--fp-text-lg)', fontWeight: 'var(--fp-weight-semibold)', marginBottom: 'var(--fp-space-3)' }}>{t('docs.themeTitle')}</h2>
        <p style={{ color: 'var(--fp-muted)' }}>
          {lang === 'zh' ? '在 ' : 'Set '}
          <code style={{ fontFamily: 'var(--fp-mono)', fontSize: 'var(--fp-text-xs)' }}>&lt;html&gt;</code>
          {lang === 'zh' ? ' 上设置 ' : ' to '}
          <code style={{ fontFamily: 'var(--fp-mono)', fontSize: 'var(--fp-text-xs)' }}>data-theme="dark"</code>
          {lang === 'zh'
            ? ' 即可切换深色。默认跟随系统，选择存在 localStorage 的 fp-theme 里，index.html 在首屏前写好 data-theme。两套主题共用同一组 data-slot 选择器，切主题只换 token，组件代码不动。'
            : ' to switch themes. The default follows the system; a choice is saved to localStorage as fp-theme, and index.html sets data-theme before first paint. Both themes share the same data-slot selectors, so switching only swaps tokens.'}
        </p>
        <div style={{ display: 'flex', gap: 'var(--fp-space-2)', marginTop: 'var(--fp-space-4)' }}>
          <Button variant="outline" onClick={() => setTheme('light')}>{t('docs.light')}</Button>
          <Button variant="outline" onClick={() => setTheme('dark')}>{t('docs.dark')}</Button>
        </div>
      </section>

      <Separator />
      <section id="figma" style={{ scrollMarginTop: 96, margin: 'var(--fp-space-8) 0' }}>
        <h2 style={{ fontSize: 'var(--fp-text-lg)', fontWeight: 'var(--fp-weight-semibold)', marginBottom: 'var(--fp-space-3)' }}>{t('docs.figmaTitle')}</h2>
        <p style={{ color: 'var(--fp-muted)', marginBottom: 'var(--fp-space-4)' }}>{t('docs.figmaDesc')}</p>
        <div style={{ display: 'flex', gap: 'var(--fp-space-2)', flexWrap: 'wrap' }}>
          <a href="./figma/flatpack-tokens.json" download><Button variant="outline">{t('docs.figmaDownload')}</Button></a>
          <a href="./registry.json" target="_blank" rel="noreferrer"><Button variant="outline">{t('docs.viewRegistry')}</Button></a>
          <a href="https://ui.shadcn.com/docs/registry" target="_blank" rel="noreferrer"><Button variant="ghost">{t('docs.registryDocs')} ↗</Button></a>
        </div>
      </section>

      <div style={{ marginTop: 'var(--fp-space-7)', display: 'flex', gap: 'var(--fp-space-2)', flexWrap: 'wrap' }}>
        <Badge variant="outline">{docs.length} components</Badge><Badge variant="outline">Light and dark</Badge><Badge variant="outline">1 CSS file</Badge><Badge variant="outline">Figma tokens</Badge>
      </div>
    </div>

    {/* right: on this page, same as the component doc pages */}
    <aside className="fp-doc-toc" style={{ position: 'sticky', top: 112 }}>
      <div className="fp-label" style={{ marginBottom: 'var(--fp-space-3)' }}>{t('doc.onThisPage')}</div>
      {toc.map((x) => (
        <a key={x.id} href={`#${x.id}`} onClick={(e) => { e.preventDefault(); document.getElementById(x.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}
          style={{ display: 'block', padding: 'var(--fp-space-1) 0', fontSize: 'var(--fp-text-sm)', color: 'var(--fp-muted)', textDecoration: 'none' }}>{x.label}</a>
      ))}
    </aside>
    </div>
  )
}

function CodeBlock({ text, copied, onCopy, copyLabel }: { text: string; copied: boolean; onCopy: () => void; copyLabel: string }) {
  return (
    <div style={{ overflow: 'hidden', background: 'var(--fp-surface)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--fp-space-2) var(--fp-space-3) 0 var(--fp-space-4)' }}>
        <span style={{ fontFamily: 'var(--fp-mono)', fontSize: 'var(--fp-text-xs)', color: 'var(--fp-muted)' }}>Terminal</span>
        <Button variant="ghost" size="icon-sm" onClick={onCopy} title={copyLabel} style={{ color: 'var(--fp-muted)' }}>
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </Button>
      </div>
      <pre style={{ margin: 0, padding: 'var(--fp-space-3) var(--fp-space-4) var(--fp-space-4)', color: 'var(--fp-ink)', fontFamily: 'var(--fp-mono)', fontSize: 'var(--fp-text-sm)', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>{text}</pre>
    </div>
  )
}
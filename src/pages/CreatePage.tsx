import { useEffect, useMemo, useState } from 'react'
import { RotateCcw, Link2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/site/i18n'
import { Input } from '@/components/ui/input'
import { Segmented } from '@/components/ui/segmented'
import { Select } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { CodeBlock } from '@/components/ui/code-block'
import { Field, FieldControl } from '@/components/ui/field'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { screenMap } from '@/blocks/BlockScreens'
import { useTheme, setTheme, followSystem, hasSavedTheme } from '@/site/theme'
import { DIALS, PRESETS, DEFAULTS, encodePreset, decodePreset, scopeAttrs, cssVars, webfonts, matchPreset, type Values } from '@/lib/preset'

// Only dials that keep the three rules are exposed. Radius (always 0), accent
// color (always ink), shadow, blur and thickness are the rules themselves.

const SCREENS = ['type', 'storefront', 'dashboard', 'assistant', 'login', 'settings'] as const
type Screen = (typeof SCREENS)[number]

function readHashPreset(): Values | null {
  const m = window.location.hash.match(/[?&]p=([\w.-]+)/)
  return m ? decodePreset(m[1]) : null
}

function TypeSpecimen() {
  return (
    <div style={{ padding: 'var(--fp-space-7) var(--fp-space-6)' }}>
      <div className="fp-label" style={{ marginBottom: 'var(--fp-space-3)' }}>Flatpack UI</div>
      <h2 style={{ fontSize: 'var(--fp-text-3xl)', letterSpacing: 'var(--fp-tracking-display)', maxWidth: '12em' }}>Structure required. 结构先行。</h2>
      <p style={{ color: 'var(--fp-muted)', maxWidth: 560, margin: 'var(--fp-space-4) 0 var(--fp-space-6)' }}>
        The interface stays quiet so the content can lead. 界面保持安静，让内容做主角：一个大标题、一段正文、一行灰色的小字说明。
      </p>
      <div style={{ display: 'flex', gap: 'var(--fp-space-2)', flexWrap: 'wrap', marginBottom: 'var(--fp-space-7)' }}>
        <Button size="lg">Get started</Button>
        <Button size="lg" variant="outline">Read the rules</Button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))', gap: 'var(--fp-space-6)' }}>
        <Field label="Room name" description="Shown on the delivery label."><FieldControl render={<Input placeholder="e.g. Living room" />} /></Field>
        <Slider defaultValue={64} label="Seat height" showValue format={(v) => `${v} cm`} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--fp-space-2)' }}>
          <h3 style={{ fontSize: 'var(--fp-text-lg)', letterSpacing: 'var(--fp-tracking-display)' }}>¥ 1,299 <Badge variant="outline">In stock</Badge></h3>
          <span className="fp-label">Oak / 150 × 200 cm</span>
        </div>
      </div>
    </div>
  )
}

export default function CreatePage() {
  const { t, lang } = useI18n()
  const { theme } = useTheme()
  const [vals, setVals] = useState<Values>(() => readHashPreset() ?? DEFAULTS)
  const [mode, setMode] = useState<'system' | 'light' | 'dark'>(() => (hasSavedTheme() ? theme : 'system'))
  const [screen, setScreen] = useState<Screen>('type')
  const [codeInput, setCodeInput] = useState('')
  const [codeError, setCodeError] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)

  const code = encodePreset(vals)
  const preset = matchPreset(vals)
  const L = (x: { zh: string; en: string }) => (lang === 'zh' ? x.zh : x.en)

  // keep the code in the URL so the page can be shared or reloaded
  useEffect(() => {
    const base = window.location.hash.split('?')[0] || '#/create'
    const next = `${base}?p=${code}`
    if (window.location.hash !== next) history.replaceState(null, '', next)
  }, [code])

  // load web fonts for the chosen options
  useEffect(() => {
    for (const href of webfonts(vals)) {
      if (document.querySelector(`link[data-fp-webfont="${href}"]`)) continue
      const l = document.createElement('link')
      l.rel = 'stylesheet'
      l.href = href
      l.dataset.fpWebfont = href
      document.head.appendChild(l)
    }
  }, [vals])

  const chooseMode = (m: 'system' | 'light' | 'dark') => {
    setMode(m)
    if (m === 'system') followSystem()
    else setTheme(m)
  }

  const applyCode = () => {
    const v = decodePreset(codeInput)
    if (!v) { setCodeError(true); return }
    setCodeError(false)
    setVals(v)
    setCodeInput('')
  }

  const copyLink = () => {
    navigator.clipboard?.writeText(window.location.href).then(() => { setLinkCopied(true); setTimeout(() => setLinkCopied(false), 1500) }).catch(() => {})
  }

  const overrides = JSON.stringify({ preset: code }, null, 2)
  const css = useMemo(() => {
    const vars = cssVars(vals)
    const fonts = webfonts(vals).map((h) => `@import url("${h}");`)
    const body = Object.entries(vars).map(([k, v]) => `  ${k}: ${v};`)
    return [...fonts, ...(fonts.length ? [''] : []), ':root {', ...(body.length ? body : ['  /* defaults: nothing to override */']), '}'].join('\n')
  }, [vals])

  const Preview = screen === 'type' ? TypeSpecimen : screenMap[screen]

  return (
    <div className="fp-create-layout" style={{ display: 'flex', gap: 'var(--fp-space-8)', alignItems: 'flex-start' }}>
      <aside className="fp-create-side" style={{ width: 300, flexShrink: 0, position: 'sticky', top: 112 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--fp-space-6)' }}>
          <div>
            <h1 style={{ fontSize: 'var(--fp-text-lg)' }}>{t('create.title')}</h1>
            <div style={{ fontSize: 'var(--fp-text-sm)', color: 'var(--fp-muted)', marginTop: 'var(--fp-space-1)' }}>{t('create.sub')}</div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setVals(DEFAULTS)} title={t('create.reset')} aria-label={t('create.reset')}><RotateCcw size={16} /></Button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--fp-space-5)' }}>
          <div>
            <div className="fp-label" style={{ marginBottom: 'var(--fp-space-2)' }}>{t('create.preset')}</div>
            <Select
              value={preset ?? 'custom'}
              options={[...PRESETS.map((p) => ({ value: p.id, label: `${L(p)} · ${lang === 'zh' ? p.zhDesc : p.enDesc}` })), ...(preset ? [] : [{ value: 'custom', label: t('create.custom') }])]}
              onValueChange={(id) => { const p = PRESETS.find((x) => x.id === id); if (p) setVals({ ...DEFAULTS, ...p.values }) }}
            />
          </div>

          <div>
            <div className="fp-label" style={{ marginBottom: 'var(--fp-space-2)' }}>{t('create.mode')}</div>
            <Segmented value={mode} onValueChange={chooseMode} options={[
              { value: 'system', label: t('create.modeSystem') },
              { value: 'light', label: t('create.modeLight') },
              { value: 'dark', label: t('create.modeDark') },
            ]} />
          </div>

          {DIALS.map((dial) => {
            const long = dial.options.some((o) => L(o).length > 8) || dial.options.length > 3
            return (
              <div key={dial.id}>
                <div className="fp-label" style={{ marginBottom: 'var(--fp-space-2)', display: 'flex', gap: 'var(--fp-space-2)' }}>
                  {L(dial)}{dial.optional && <span>· {t('create.optional')}</span>}
                </div>
                {long ? (
                  <Select value={vals[dial.id]} options={dial.options.map((o) => ({ value: o.value, label: L(o) }))} onValueChange={(v) => setVals({ ...vals, [dial.id]: v })} />
                ) : (
                  <Segmented value={vals[dial.id]} options={dial.options.map((o) => ({ value: o.value, label: L(o) }))} onValueChange={(v: string) => setVals({ ...vals, [dial.id]: v })} />
                )}
                {dial.optional && (dial.zhNote || dial.enNote) && (
                  <p style={{ fontSize: 'var(--fp-text-xs)', color: 'var(--fp-muted)', marginTop: 'var(--fp-space-2)' }}>{lang === 'zh' ? dial.zhNote : dial.enNote}</p>
                )}
              </div>
            )
          })}

          <p style={{ fontSize: 'var(--fp-text-xs)', color: 'var(--fp-muted)' }}>{t('create.locked')}</p>

          <div>
            <div className="fp-label" style={{ marginBottom: 'var(--fp-space-2)' }}>{t('create.code')}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--fp-space-2)', marginBottom: 'var(--fp-space-2)' }}>
              <code className="fp-num" style={{ fontSize: 'var(--fp-text-sm)', whiteSpace: 'nowrap' }}>{code}</code>
              <Button variant="ghost" size="sm" onClick={copyLink}>{linkCopied ? <Check size={16} /> : <Link2 size={16} />} {linkCopied ? t('create.copied') : t('create.share')}</Button>
            </div>
            <div style={{ display: 'flex', gap: 'var(--fp-space-2)' }}>
              <Input value={codeInput} onChange={(e) => { setCodeInput(e.target.value); setCodeError(false) }} onKeyDown={(e) => { if (e.key === 'Enter') applyCode() }} placeholder={t('create.codePlaceholder')} aria-label={t('create.code')} />
              <Button variant="outline" onClick={applyCode}>{t('create.apply')}</Button>
            </div>
            {codeError && <p style={{ fontSize: 'var(--fp-text-xs)', color: 'var(--fp-danger)', marginTop: 'var(--fp-space-1)' }}>{t('create.codeInvalid')}</p>}
          </div>
        </div>
      </aside>

      <main style={{ flex: 1, minWidth: 0 }}>
        <div style={{ marginBottom: 'var(--fp-space-5)' }}>
          <h2 style={{ fontSize: 'var(--fp-text-xl)', letterSpacing: 'var(--fp-tracking-display)' }}>{t('create.previewTitle')}</h2>
          <p style={{ color: 'var(--fp-muted)', marginTop: 'var(--fp-space-2)' }}>{t('create.previewDesc')}</p>
        </div>
        <div style={{ overflowX: 'auto', marginBottom: 'var(--fp-space-4)' }}>
          <Segmented value={screen} onValueChange={setScreen} options={SCREENS.map((s) => ({ value: s, label: s === 'type' ? t('create.screenType') : s === 'assistant' ? 'AI assistant' : s[0].toUpperCase() + s.slice(1) }))} />
        </div>
        <div className="fp-tune-scope" {...scopeAttrs(vals)} style={{ border: '1px solid var(--fp-line)', overflowX: 'auto' }}>
          <div style={{ minWidth: screen === 'type' ? 0 : 720 }}>{Preview && <Preview />}</div>
        </div>

        <section style={{ marginTop: 'var(--fp-space-8)' }}>
          <h2 style={{ fontSize: 'var(--fp-text-lg)', marginBottom: 'var(--fp-space-2)' }}>{t('create.export')}</h2>
          <p style={{ fontSize: 'var(--fp-text-sm)', color: 'var(--fp-muted)', marginBottom: 'var(--fp-space-4)' }}>{t('create.exportDesc')}</p>
          <Tabs defaultValue="json">
            <TabsList>
              <TabsTrigger value="json">overrides.json</TabsTrigger>
              <TabsTrigger value="cli">CLI</TabsTrigger>
              <TabsTrigger value="css">CSS</TabsTrigger>
            </TabsList>
            <TabsContent value="json"><CodeBlock label="tokens/overrides.json" code={overrides} /></TabsContent>
            <TabsContent value="cli"><CodeBlock label="Terminal" code={`npm run build:tokens -- --preset ${code}`} /></TabsContent>
            <TabsContent value="css"><CodeBlock label="CSS" code={css} /></TabsContent>
          </Tabs>
        </section>
      </main>
    </div>
  )
}

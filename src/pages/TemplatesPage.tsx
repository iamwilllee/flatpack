import { useState, useRef, useEffect } from 'react'
import { Maximize2, RotateCcw, Monitor, Smartphone, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Segmented } from '@/components/ui/segmented'
import { Kicker } from '@/components/ui/primitives'
import { useI18n } from '@/site/i18n'
import { ThemeSwitch, themeScope, useFpTheme } from '@/site/ThemeSwitch'
import { CorporateSite } from '@/templates/CorporateSite'
import { CommerceSite } from '@/templates/CommerceSite'
import { AdminSite } from '@/templates/AdminSite'

type Kind = 'corporate' | 'commerce' | 'admin'

const META: Record<Kind, { key: string; url: string; desc: { zh: string; en: string }; stack: string }> = {
  corporate: {
    key: 'tpl.corporate', url: 'nordform.example',
    desc: { zh: '品牌官网：首页、服务、关于、联系表单，可真实提交。', en: 'Brand site: home, services, about and a working contact form.' },
    stack: 'Tabs · Card · Image · Avatar · Statistic · Input',
  },
  commerce: {
    key: 'tpl.commerce', url: 'store.nordform.example',
    desc: { zh: '电商商店：分类筛选、加入购物车、删除条目、结算流程。', en: 'Storefront: category filter, add to cart, remove items and checkout.' },
    stack: 'Segmented · Badge · Image · Statistic · Alert · Empty',
  },
  admin: {
    key: 'tpl.admin', url: 'console.nordform.example',
    desc: { zh: '后台控制台：侧栏导航、订单状态流转、筛选、设置开关。', en: 'Admin console: sidebar nav, order status flow, filters and settings.' },
    stack: 'Sidebar · Table · Statistic · Progress · Tabs · Switch',
  },
}

function SiteFor({ kind, compact }: { kind: Kind; compact: boolean }) {
  if (kind === 'corporate') return <CorporateSite compact={compact} />
  if (kind === 'commerce') return <CommerceSite compact={compact} />
  return <AdminSite compact={compact} />
}

export default function TemplatesPage() {
  const { lang, t } = useI18n()
  const [kind, setKind] = useState<Kind>('corporate')
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop')
  const [full, setFull] = useState(false)
  const [theme, setTheme] = useFpTheme()
  const [nonce, setNonce] = useState(0)
  const hostRef = useRef<HTMLDivElement>(null)
  const [hostW, setHostW] = useState(1200)

  useEffect(() => {
    const el = hostRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setHostW(el.clientWidth))
    ro.observe(el)
    setHostW(el.clientWidth)
    return () => ro.disconnect()
  }, [])

  const meta = META[kind]
  // auto-compact when the preview itself is narrow (real phone viewport),
  // even if the user never pressed the phone toggle
  const isCompact = device === 'mobile' || hostW < 560

  const preview = (scaleToMobile: boolean) => (
    <div ref={hostRef} style={{
      width: scaleToMobile ? 390 : '100%',
      maxWidth: '100%',
      margin: scaleToMobile ? '0 auto' : undefined,
      border: '1px solid var(--fp-line)',
     
      overflow: 'hidden',
      background: 'var(--fp-surface)',
     
    }}>
      {/* browser chrome */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--fp-space-3)', padding: 'var(--fp-space-2) var(--fp-space-3)', background: 'var(--fp-surface)', borderBottom: '1px solid var(--fp-line)' }}>
        <div style={{ flex: 1, textAlign: 'center', fontSize: 'var(--fp-text-xs)', fontFamily: 'var(--fp-mono)', color: 'var(--fp-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          https://{meta.url}
        </div>
        <button onClick={() => setFull(true)} title={t('tpl.fullscreen')} aria-label={t('tpl.fullscreen')} style={{ background: 'none', border: 0, color: 'var(--fp-muted)', cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
          <Maximize2 size={16} />
        </button>
      </div>
      <div className="fp-tune-scope" {...themeScope(theme)} key={`${kind}-${device}-${nonce}`} style={{ maxHeight: full ? 'none' : 620, overflow: 'auto' }}>
        <SiteFor kind={kind} compact={isCompact} />
      </div>
    </div>
  )

  return (
    <div style={{ paddingBottom: 'var(--fp-space-9)' }}>
      <div style={{ marginBottom: 'var(--fp-space-5)' }}>
        <Kicker>{t('tpl.kicker')}</Kicker>
        <h1 style={{ fontSize: 'var(--fp-text-2xl)', fontWeight: 'var(--fp-weight-semibold)', letterSpacing: 'var(--fp-tracking-display)', margin: 'var(--fp-space-4) 0 var(--fp-space-3)' }}>{t('tpl.title')}</h1>
        <p style={{ fontSize: 'var(--fp-text-sm)', color: 'var(--fp-muted)', maxWidth: 660 }}>{t('tpl.desc')}</p>
      </div>

      {/* type switch + controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--fp-space-4)', marginBottom: 'var(--fp-space-5)', flexWrap: 'wrap' }}>
        <Segmented
          value={kind}
          onValueChange={(v) => setKind(v as Kind)}
          options={[
            { value: 'corporate', label: t('tpl.corporate') },
            { value: 'commerce', label: t('tpl.commerce') },
            { value: 'admin', label: t('tpl.admin') },
          ]}
        />
        <div style={{ display: 'flex', gap: 'var(--fp-space-4)', alignItems: 'center', flexWrap: 'wrap' }}>
          <ThemeSwitch value={theme} onChange={setTheme} />
          <div role="group" aria-label="Device" style={{ display: 'flex' }}>
            <Button size="icon-sm" variant={device === 'desktop' ? 'default' : 'ghost'} onClick={() => setDevice('desktop')} aria-label="Desktop" aria-pressed={device === 'desktop'}><Monitor size={16} /></Button>
            <Button size="icon-sm" variant={device === 'mobile' ? 'default' : 'ghost'} onClick={() => setDevice('mobile')} aria-label="Mobile" aria-pressed={device === 'mobile'}><Smartphone size={16} /></Button>
          </div>
          <Button size="sm" variant="outline" onClick={() => setNonce((n) => n + 1)} title={t('tpl.reset')} style={{ gap: 'var(--fp-space-2)' }}><RotateCcw size={16} /> {t('tpl.reset')}</Button>
          <Button size="sm" onClick={() => setFull(true)} style={{ gap: 'var(--fp-space-2)' }}><Maximize2 size={16} /> {t('tpl.fullscreen')}</Button>
        </div>
      </div>

      {/* info strip */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--fp-space-3)', marginBottom: 'var(--fp-space-4)', flexWrap: 'wrap' }}>
        <Badge>{META[kind].key === 'tpl.corporate' ? 'Corporate' : META[kind].key === 'tpl.commerce' ? 'Commerce' : 'Admin'}</Badge>
        <span style={{ fontSize: 'var(--fp-text-xs)', color: 'var(--fp-muted)' }}>{lang === 'zh' ? meta.desc.zh : meta.desc.en}</span>
        <code style={{ marginLeft: 'auto', fontFamily: 'var(--fp-mono)', fontSize: 'var(--fp-text-xs)', color: 'var(--fp-muted)' }}>{meta.stack}</code>
      </div>

      {preview(device === 'mobile')}

      {/* fullscreen overlay */}
      {full && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 90, background: 'var(--fp-bg)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--fp-space-3) var(--fp-space-5)', background: 'var(--fp-bg)', color: 'var(--fp-ink)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--fp-space-3)' }}>
              <span style={{ fontWeight: 'var(--fp-weight-semibold)', fontSize: 'var(--fp-text-sm)' }}>{kind === 'corporate' ? t('tpl.corporate') : kind === 'commerce' ? t('tpl.commerce') : t('tpl.admin')}</span>
              <span style={{ opacity: 0.6, fontSize: 'var(--fp-text-xs)' }}>{meta.url}</span>
            </div>
            <Button size="sm" variant="ghost" onClick={() => setFull(false)} style={{ color: 'var(--fp-ink)', gap: 'var(--fp-space-2)' }}><X size={16} /> {t('tpl.close')}</Button>
          </div>
          <div style={{ flex: 1, overflow: 'auto' }}>
            <div className="fp-tune-scope" {...themeScope(theme)} key={`${kind}-full-${nonce}`} style={{ minHeight: '100%' }}><SiteFor kind={kind} compact={isCompact} /></div>
          </div>
        </div>
      )}
    </div>
  )
}

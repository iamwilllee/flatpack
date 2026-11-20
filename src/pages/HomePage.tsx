import { ArrowRight, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import { Steps } from '@/components/ui/steps'
import { Statistic } from '@/components/ui/statistic'
import { Segmented } from '@/components/ui/segmented'
import { Kicker } from '@/components/ui/primitives'
import { Photo } from '@/templates/Photo'
import type { Route } from '@/site/TopNav'
import { useI18n } from '@/site/i18n'
import tokens from '../../tokens/flatpack.tokens.json'

const section: React.CSSProperties = { marginTop: 'var(--fp-space-9)' }
const cardBody: React.CSSProperties = { padding: 'var(--fp-space-5)' }

export default function HomePage({ onNavigate }: { onNavigate: (r: Route) => void }) {
  const { t, lang } = useI18n()
  return (
    <div style={{ paddingBottom: 'var(--fp-space-9)' }}>
      {/* hero: one headline, one sentence, one button */}
      <section style={{ padding: 'var(--fp-space-10) 0 0' }}>
        <h1 className="fp-hero-title">{t('home.title')}</h1>
        <p style={{ fontSize: 'var(--fp-text-lg)', color: 'var(--fp-muted)', maxWidth: 560, margin: 'var(--fp-space-5) 0 var(--fp-space-6)' }}>
          {t('home.sub')}
        </p>
        <Button size="lg" onClick={() => onNavigate('docs')}>{t('nav.started')} <ArrowRight size={16} /></Button>
      </section>

      {/* showcase */}
      <section style={section}>
        <Kicker>{t('home.showcase')}</Kicker>
        <h2 style={{ fontSize: 'var(--fp-text-2xl)', letterSpacing: 'var(--fp-tracking-display)', margin: 'var(--fp-space-3) 0 var(--fp-space-3)' }}>{t('home.showcaseTitle')}</h2>
        <p style={{ color: 'var(--fp-muted)', maxWidth: 560, marginBottom: 'var(--fp-space-7)' }}>{t('home.showcaseDesc')}</p>

        <div className="fp-home-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 'var(--fp-space-5)' }}>
          {/* product: real photo, no frame inside the card */}
          <Card>
            <Photo of="chair" alt={t('home.product')} ratio="4:3" style={{ height: 'auto' }} />
            <div style={cardBody}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 'var(--fp-space-3)' }}>
                <div style={{ fontWeight: 'var(--fp-weight-semibold)' }}>{t('home.product')}</div>
                <span className="fp-num">¥ 499</span>
              </div>
              <div style={{ fontSize: 'var(--fp-text-sm)', color: 'var(--fp-muted)', margin: 'var(--fp-space-1) 0 var(--fp-space-4)' }}>{t('home.productMeta')}</div>
              <Button size="sm" variant="outline"><ShoppingBag size={16} /> {t('home.add')}</Button>
            </div>
          </Card>

          {/* metric */}
          <Card style={cardBody}>
            <Statistic label={t('home.orders')} value="1,472" trend={{ value: 12.4 }} hint={t('home.vsLast')} />
            <div style={{ marginTop: 'var(--fp-space-6)' }}><Progress value={64} label={t('home.taskProgress')} showValue /></div>
          </Card>

          {/* task flow: Steps draws no frame of its own */}
          <Card style={cardBody}>
            <Steps current={1} steps={[
              { title: t('home.created'), description: t('home.createdDesc') },
              { title: t('home.configure'), description: t('home.configureDesc') },
              { title: t('home.publish'), description: t('home.publishDesc') },
            ]} />
          </Card>
        </div>

        {/* controls sit on the page, not inside another frame */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--fp-space-5)', marginTop: 'var(--fp-space-7)' }}>
          <div style={{ width: 280 }}><Input placeholder={t('home.searchProducts')} /></div>
          <div style={{ display: 'flex', gap: 'var(--fp-space-2)' }}>
            <Button>Primary</Button><Button variant="outline">Outline</Button><Button variant="ghost">Ghost</Button>
          </div>
          <Segmented defaultValue="week" options={[{ value: 'day', label: lang === 'zh' ? '日' : 'Day' }, { value: 'week', label: lang === 'zh' ? '周' : 'Week' }, { value: 'month', label: lang === 'zh' ? '月' : 'Month' }]} />
          <Switch defaultChecked label={t('home.stockAlert')} />
          <Badge>{t('home.newBadge')}</Badge>
        </div>
      </section>

      {/* the three rules, straight from the tokens file */}
      <section style={section}>
        <Kicker>{t('home.principles')}</Kicker>
        <div className="fp-home-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 'var(--fp-space-7)', marginTop: 'var(--fp-space-5)' }}>
          {tokens.principles.map((p, i) => (
            <div key={p.id} style={{ borderTop: '1px solid var(--fp-ink)', paddingTop: 'var(--fp-space-4)' }}>
              <div className="fp-num fp-muted" style={{ fontSize: 'var(--fp-text-xs)' }}>{String(i + 1).padStart(2, '0')}</div>
              <h3 style={{ fontSize: 'var(--fp-text-xl)', margin: 'var(--fp-space-2) 0 var(--fp-space-3)' }}>{lang === 'zh' ? p.zh : p.en}</h3>
              <p style={{ color: 'var(--fp-muted)' }}>{lang === 'zh' ? p.zhDesc : p.enDesc}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 'var(--fp-space-8)' }}>
          <Button variant="link" onClick={() => onNavigate('components')}>{t('home.viewComponents')} <ArrowRight size={16} /></Button>
        </div>
      </section>
    </div>
  )
}

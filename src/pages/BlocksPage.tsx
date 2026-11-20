import { useState } from 'react'
import { ArrowUpRight, Code2, Eye, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Segmented } from '@/components/ui/segmented'
import { Kicker } from '@/components/ui/primitives'
import { blocks, categories, type BlockCategory } from '@/blocks/definitions'
import { useI18n } from '@/site/i18n'
import { screenMap } from '@/blocks/BlockScreens'

export default function BlocksPage() {
  const { lang, t } = useI18n()
  const [category, setCategory] = useState<'All' | BlockCategory>('All')
  const [mode, setMode] = useState<Record<string, 'preview' | 'code'>>({})
  const [fullscreen, setFullscreen] = useState<string | null>(null)

  const shown = category === 'All' ? blocks : blocks.filter((b) => b.category === category)

  const toggleMode = (id: string) => setMode((m) => ({ ...m, [id]: m[id] === 'code' ? 'preview' : 'code' }))

  return (
    <div style={{ paddingBottom: 'var(--fp-space-9)', position: 'relative' }}>
      {/* hero */}
      <div style={{ marginBottom: 'var(--fp-space-6)' }}>
        <Kicker>{t('blocks.kicker')}</Kicker>
        <h1 style={{ fontSize: 'var(--fp-text-2xl)', fontWeight: 'var(--fp-weight-semibold)', letterSpacing: 'var(--fp-tracking-display)', margin: 'var(--fp-space-4) 0 var(--fp-space-3)' }}>{t('blocks.title')}</h1>
        <p style={{ fontSize: 'var(--fp-text-sm)', color: 'var(--fp-muted)', maxWidth: 640 }}>
          {t('blocks.desc')}
        </p>
      </div>

      {/* category filter */}
      <div style={{ marginBottom: 'var(--fp-space-6)', overflowX: 'auto' }}>
        <Segmented
          value={category}
          onValueChange={(v) => setCategory(v as 'All' | BlockCategory)}
          options={categories.map((c) => ({ value: c, label: c === 'All' ? t('blocks.all') : c }))}
        />
      </div>

      {/* gallery */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(560px, 100%), 1fr))', gap: 'var(--fp-space-6)' }}>
        {shown.map((block) => {
          const Screen = screenMap[block.id]
          const isCode = mode[block.id] === 'code'
          return (
            <Card key={block.id} style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--fp-space-3) var(--fp-space-4)', background: 'var(--fp-surface)', borderBottom: '1px solid var(--fp-line)' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--fp-space-3)' }}>
                  <span className="fp-label" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>{String(blocks.indexOf(block) + 1).padStart(2, '0')} · {block.title}</span>
                  <BadgeCategory category={block.category} />
                </div>
                <div style={{ display: 'flex', gap: 'var(--fp-space-1)' }}>
                  <Button size="sm" variant={isCode ? 'default' : 'ghost'} onClick={() => toggleMode(block.id)}>
                    {isCode ? <Eye size={16} /> : <Code2 size={16} />} {isCode ? t('blocks.preview') : t('blocks.code')}
                  </Button>
                  <Button size="icon-sm" variant="ghost" onClick={() => setFullscreen(block.id)} title={t('blocks.fullscreen')}><ArrowUpRight size={16} /></Button>
                </div>
              </div>

              {isCode ? (
                <pre style={{ margin: 0, padding: 'var(--fp-space-4)', color: 'var(--fp-ink)', background: 'var(--fp-surface)', fontFamily: 'var(--fp-mono)', fontSize: 'var(--fp-text-xs)', overflowX: 'auto', minHeight: 420 }}>{block.code}</pre>
              ) : (
                <div style={{ maxHeight: 460, overflow: 'auto', position: 'relative', paddingBottom: 'var(--fp-space-5)' }}>
                  <div style={{ minWidth: 520 }}>
                    <Screen />
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--fp-space-3) var(--fp-space-4)', borderTop: '1px solid var(--fp-line)' }}>
                <span style={{ fontSize: 'var(--fp-text-xs)', color: 'var(--fp-muted)' }}>{lang === 'zh' ? block.description : (block.descriptionEn ?? block.description)}</span>
                <code style={{ fontFamily: 'var(--fp-mono)', fontSize: 'var(--fp-text-xs)', color: 'var(--fp-muted)' }}>npx shadcn add {block.id}</code>
              </div>
            </Card>
          )
        })}
      </div>

      {/* fullscreen overlay */}
      {fullscreen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 80, background: 'var(--fp-bg)', overflow: 'auto' }}>
          <div style={{ position: 'sticky', top: 0, zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--fp-space-3) var(--fp-space-5)', background: 'var(--fp-bg)', color: 'var(--fp-ink)' }}>
            <span style={{ fontWeight: 'var(--fp-weight-semibold)', fontSize: 'var(--fp-text-sm)' }}>{blocks.find((b) => b.id === fullscreen)?.title}</span>
            <Button size="sm" variant="ghost" onClick={() => setFullscreen(null)} style={{ color: 'var(--fp-ink)' }}>{t('blocks.close')} <ExternalLink size={16} /></Button>
          </div>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'var(--fp-space-5)' }}>
            {(() => { const S = screenMap[fullscreen]; return S ? <S /> : null })()}
          </div>
        </div>
      )}
    </div>
  )
}

function BadgeCategory({ category }: { category: BlockCategory }) {
  const variant = 'outline' as const
  return <Badge variant={variant}>{category}</Badge>
}

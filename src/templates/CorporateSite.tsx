import { useState } from 'react'
import {
  ArrowRight, ArrowUpRight, Check, ShieldCheck, Truck, Headphones, Mail,
  Phone, MapPin, Users, Target, Award, Quote, ChevronRight, Menu, X, Plus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { Statistic } from '@/components/ui/statistic'
import { Collapse } from '@/components/ui/collapse'
import { Masonry } from '@/components/ui/masonry'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/primitives'
import { Photo } from '@/templates/Photo'
import { Avatar as _Avatar } from '@/components/ui/avatar'

type Page = 'home' | 'collection' | 'services' | 'about' | 'contact'

const nav: { id: Page; label: string }[] = [
  { id: 'home', label: 'Home' }, { id: 'collection', label: 'Collection' },
  { id: 'services', label: 'Services' }, { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
]

const works = [
  { t: 'Dining chair', c: 'Seating', h: 150, photo: 'chair' as const },
  { t: 'Leather sofa', c: 'Living room', h: 110, photo: 'pendant' as const },
  { t: 'Bookshelf', c: 'Storage', h: 180, photo: 'shelf' as const },
  { t: 'Living room set', c: 'Living room', h: 120, photo: 'rug' as const },
  { t: 'Bedroom set', c: 'Bedroom', h: 160, photo: 'bedroom' as const },
  { t: 'Ceramic bowls', c: 'Objects', h: 100, photo: 'bookcase' as const },
  { t: 'Desk lamp', c: 'Lighting', h: 140, photo: 'lamp' as const },
  { t: 'Bedroom detail', c: 'Bedroom', h: 170, photo: 'mirror' as const },
]

const reviews = [
  { n: 'Alex Wang', r: 'The sideboard arrived flat-packed and took twenty minutes to assemble. The finish is better than the photos.', stars: 5 },
  { n: 'Lea Li', r: 'Honest materials, clear instructions, fair price. Our whole living room is Nordform now.', stars: 5 },
  { n: 'Jonas Berg', r: 'One chair broke a leg after two years. They shipped a replacement for free, no questions.', stars: 4 },
]

export function CorporateSite({ compact = false }: { compact?: boolean }) {
  const [page, setPage] = useState<Page>('home')
  const [sent, setSent] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [review, setReview] = useState(0)
  const [subscribed, setSubscribed] = useState(false)

  const go = (p: Page) => { setPage(p); setMenuOpen(false) }

  return (
    <div style={{ minHeight: 700, background: 'var(--fp-bg)' }}>
      {/* announce bar */}
      <div style={{ background: 'var(--fp-bg)', color: 'var(--fp-ink)', textAlign: 'center', padding: compact ? 'var(--fp-space-1) var(--fp-space-3)' : 'var(--fp-space-2) var(--fp-space-4)', fontSize: compact ? 'var(--fp-text-xs)' : 'var(--fp-text-xs)', }}>
        Free delivery on orders over ¥199 · 365-day returns
      </div>

      {/* nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: compact ? 'var(--fp-space-3) var(--fp-space-4)' : 'var(--fp-space-4) var(--fp-space-6)', borderBottom: '1px solid var(--fp-line)', background: 'var(--fp-surface)', position: 'sticky', top: 0, zIndex: 5 }}>
        <button onClick={() => go('home')} style={{ display: 'flex', alignItems: 'center', gap: 'var(--fp-space-2)', background: 'none', border: 0, cursor: 'pointer', fontWeight: 'var(--fp-weight-semibold)', fontSize: 'var(--fp-text-sm)', color: 'var(--fp-ink)' }}>
          <span style={{ width: 22, height: 22, background: 'var(--fp-bg)', color: 'var(--fp-ink)', display: 'grid', placeItems: 'center', fontSize: 'var(--fp-text-xs)' }}>N</span>
          NORDFORM
        </button>
        <div style={{ display: compact ? 'none' : 'flex', gap: 'var(--fp-space-5)' }}>
          {nav.map((n) => (
            <button key={n.id} onClick={() => go(n.id)} style={{ background: 'none', border: 0, cursor: 'pointer', fontSize: 'var(--fp-text-xs)', fontWeight: 'var(--fp-weight-semibold)', padding: 'var(--fp-space-1) 0', color: page === n.id ? 'var(--fp-ink)' : 'var(--fp-muted)', borderBottom: page === n.id ? '2px solid var(--fp-ink)' : '2px solid transparent' }}>{n.label}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 'var(--fp-space-2)', alignItems: 'center' }}>
          <Button size="icon-sm" variant="ghost" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">{menuOpen ? <X size={16} /> : <Menu size={16} />}</Button>
          <Button size="sm" onClick={() => go('contact')}>{compact ? 'Contact' : 'Get in touch'} {!compact && <ArrowRight size={16} />}</Button>
        </div>
      </div>
      {menuOpen && (
        <div style={{ padding: compact ? 'var(--fp-space-2) var(--fp-space-4)' : 'var(--fp-space-3) var(--fp-space-6)', background: 'var(--fp-surface)', borderBottom: '1px solid var(--fp-line)', display: 'flex', gap: 'var(--fp-space-4)', flexWrap: 'wrap' }}>
          {nav.map((n) => <button key={n.id} onClick={() => go(n.id)} style={{ background: 'none', border: 0, cursor: 'pointer', fontSize: 'var(--fp-text-xs)', color: 'var(--fp-muted)' }}>{n.label}</button>)}
        </div>
      )}

      {page === 'home' && (
        <>
          {/* hero */}
          <div style={{ display: 'grid', gridTemplateColumns: compact ? '1fr' : '1.1fr 0.9fr', minHeight: compact ? 'auto' : 320, background: 'var(--fp-bg)' }}>
            <div style={{ padding: compact ? 'var(--fp-space-6) var(--fp-space-5)' : 'var(--fp-space-8) var(--fp-space-7)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--fp-space-2)', marginBottom: 'var(--fp-space-4)' }}><span style={{ width: 18, height: 2, background: 'var(--fp-ink)' }} /><span className="fp-label">Design for everyday life</span></div>
              <h2 style={{ fontSize: compact ? 'var(--fp-text-xl)' : 'var(--fp-text-3xl)', fontWeight: 'var(--fp-weight-semibold)', letterSpacing: 'var(--fp-tracking-display)', lineHeight: 1.06, margin: '0 0 var(--fp-space-4)' }}>Thoughtful objects,<br />made to last.</h2>
              <p style={{ fontSize: 'var(--fp-text-sm)', color: 'var(--fp-muted)', maxWidth: 420, lineHeight: 1.8, margin: '0 0 var(--fp-space-5)' }}>We build honest furniture with clear forms and durable materials — designed to fit the way you actually live, not the way a showroom looks.</p>
              <div style={{ display: 'flex', gap: 'var(--fp-space-2)' }}>
                <Button onClick={() => go('collection')}>View the collection <ArrowRight size={16} /></Button>
                <Button variant="outline" onClick={() => go('about')}>Our story</Button>
              </div>
              <div style={{ display: 'flex', gap: compact ? 'var(--fp-space-4)' : 'var(--fp-space-5)', marginTop: compact ? 'var(--fp-space-5)' : 'var(--fp-space-6)', flexWrap: 'wrap' }}>
                <Statistic label="Years" value="27" /><Statistic label="Pieces" value="140" /><Statistic label="Countries" value="18" />
              </div>
            </div>
            <div style={{ position: 'relative', overflow: 'hidden' }}>
              <Photo of="livingRoom" alt="Nordform living room" ratio="4:3" style={{ height: compact ? 180 : '100%' }} />
              <Badge style={{ position: 'absolute', top: 20, right: 20 }}>New season</Badge>
            </div>
          </div>

          {/* promises */}
          <div style={{ display: 'grid', gridTemplateColumns: compact ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: 'var(--fp-space-3)', padding: compact ? 'var(--fp-space-4)' : 'var(--fp-space-5) var(--fp-space-6)', background: 'var(--fp-surface)' }}>
            {[
              { icon: <Truck size={16} />, t: 'Free delivery', d: 'Over ¥199, to your door' },
              { icon: <ShieldCheck size={16} />, t: '10-year warranty', d: 'On every piece' },
              { icon: <Headphones size={16} />, t: 'Real support', d: 'People, not bots' },
              { icon: <Target size={16} />, t: 'Take-back', d: 'Old pieces return to the loop' },
            ].map((x) => (
              <div key={x.t} style={{ display: 'flex', gap: 'var(--fp-space-3)', alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--fp-muted)', marginTop: 'var(--fp-space-1)' }}>{x.icon}</span>
                <div><div style={{ fontSize: 'var(--fp-text-xs)', fontWeight: 'var(--fp-weight-semibold)' }}>{x.t}</div><div style={{ fontSize: 'var(--fp-text-xs)', color: 'var(--fp-muted)' }}>{x.d}</div></div>
              </div>
            ))}
          </div>

          {/* collection preview */}
          <div style={{ padding: compact ? 'var(--fp-space-5) var(--fp-space-4)' : 'var(--fp-space-6) var(--fp-space-6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--fp-space-4)' }}>
              <div><div className="fp-label">Selected pieces</div><h3 style={{ fontSize: 'var(--fp-text-xl)', fontWeight: 'var(--fp-weight-semibold)', letterSpacing: 'var(--fp-tracking-display)', margin: 'var(--fp-space-2) 0 0' }}>The collection</h3></div>
              <button onClick={() => go('collection')} style={{ background: 'none', border: 0, cursor: 'pointer', fontSize: 'var(--fp-text-xs)', fontWeight: 'var(--fp-weight-semibold)', display: 'flex', alignItems: 'center', gap: 'var(--fp-space-1)' }}>See all <ChevronRight size={16} /></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: compact ? 'repeat(2,1fr)' : 'repeat(3,1fr)', gap: 'var(--fp-space-3)' }}>
              {works.slice(0, 3).map((w) => (
                <Card key={w.t}>
                  <div style={{ height: compact ? 140 : 180 }}><Photo of={w.photo} alt={w.t} ratio="4:3" /></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--fp-space-3) var(--fp-space-3)' }}><span style={{ fontSize: 'var(--fp-text-xs)', fontWeight: 'var(--fp-weight-semibold)' }}>{w.t}</span><Badge variant="outline">{w.c}</Badge></div>
                </Card>
              ))}
            </div>
          </div>

          {/* reviews */}
          <div style={{ padding: compact ? 'var(--fp-space-5) var(--fp-space-4)' : 'var(--fp-space-6) var(--fp-space-6)', background: 'var(--fp-bg)', borderTop: '1px solid var(--fp-line)', borderBottom: '1px solid var(--fp-line)' }}>
            <div className="fp-label" style={{ marginBottom: 'var(--fp-space-4)' }}>What people say</div>
            <div style={{ display: 'grid', gridTemplateColumns: compact ? '1fr' : '1.3fr 1fr', gap: compact ? 'var(--fp-space-4)' : 'var(--fp-space-5)', alignItems: 'center' }}>
              <div>
                <Quote size={20} style={{ color: 'var(--fp-muted)', marginBottom: 'var(--fp-space-3)' }} />
                <p style={{ fontSize: 'var(--fp-text-base)', margin: '0 0 var(--fp-space-4)', maxWidth: 520 }}>“{reviews[review].r}”</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--fp-space-3)' }}>
                  <Avatar name={reviews[review].n} size="sm" />
                  <span style={{ fontSize: 'var(--fp-text-xs)', fontWeight: 'var(--fp-weight-semibold)' }}>{reviews[review].n}</span>
                  <span style={{ color: 'var(--fp-muted)', fontSize: 'var(--fp-text-xs)' }}>{'★'.repeat(reviews[review].stars)}{'☆'.repeat(5 - reviews[review].stars)}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 'var(--fp-space-2)' }}>
                {reviews.map((r, i) => <button key={r.n} onClick={() => setReview(i)} style={{ width: 28, height: 28, borderRadius: '50%', border: i === review ? '2px solid var(--fp-ink)' : '1px solid var(--fp-line)', background: 'var(--fp-surface)', cursor: 'pointer', fontSize: 'var(--fp-text-xs)', fontWeight: 'var(--fp-weight-semibold)' }}>{i + 1}</button>)}
              </div>
            </div>
          </div>

          {/* CTA with beam */}
          <div style={{ padding: compact ? 'var(--fp-space-5) var(--fp-space-4)' : 'var(--fp-space-6) var(--fp-space-6)' }}>
              <Card style={{ padding: 'var(--fp-space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--fp-space-4)' }}>
                <div><div style={{ fontSize: 'var(--fp-text-lg)', fontWeight: 'var(--fp-weight-semibold)', letterSpacing: 'var(--fp-tracking-display)' }}>Bring it home.</div><div style={{ fontSize: 'var(--fp-text-xs)', color: 'var(--fp-muted)', marginTop: 'var(--fp-space-1)' }}>Join 40,000 homes that chose fewer, better things.</div></div>
                <Button onClick={() => go('contact')}>Start a project <ArrowUpRight size={16} /></Button>
              </Card>
          </div>
        </>
      )}

      {page === 'collection' && (
        <div style={{ padding: compact ? 'var(--fp-space-5) var(--fp-space-4)' : 'var(--fp-space-6) var(--fp-space-6)' }}>
          <div className="fp-label">Catalog · 8 pieces</div>
          <h3 style={{ fontSize: 'var(--fp-text-xl)', fontWeight: 'var(--fp-weight-semibold)', letterSpacing: 'var(--fp-tracking-display)', margin: 'var(--fp-space-2) 0 var(--fp-space-4)' }}>The collection</h3>
          <Masonry
            columns={compact ? 2 : { xs: 1, sm: 2, md: 3 }}
            gutter={12}
            items={works.map((w, i) => ({ key: i, data: w }))}
            itemRender={({ data: d }) => {
              const w = (d ?? works[0]) as typeof works[number]
              return (
              <Card>
                <div style={{ height: w.h }}><Photo of={w.photo} alt={w.t} ratio="4:3" /></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--fp-space-3) var(--fp-space-3)' }}><span style={{ fontSize: 'var(--fp-text-xs)', fontWeight: 'var(--fp-weight-semibold)' }}>{w.t}</span><span style={{ fontSize: 'var(--fp-text-xs)', color: 'var(--fp-muted)' }}>{w.c}</span></div>
              </Card>
              )
            }}
          />
        </div>
      )}

      {page === 'services' && (
        <div style={{ padding: compact ? 'var(--fp-space-5) var(--fp-space-4)' : 'var(--fp-space-6) var(--fp-space-6)' }}>
          <div className="fp-label">What we do</div>
          <h3 style={{ fontSize: 'var(--fp-text-xl)', fontWeight: 'var(--fp-weight-semibold)', letterSpacing: 'var(--fp-tracking-display)', margin: 'var(--fp-space-2) 0 var(--fp-space-5)' }}>Services</h3>
          <div style={{ display: 'grid', gridTemplateColumns: compact ? '1fr' : 'repeat(2,1fr)', gap: 'var(--fp-space-3)' }}>
            {[
              { t: 'Space planning', d: 'Measure, map and arrange a room around how you use it.', icon: <Target size={16} /> },
              { t: 'Custom finishes', d: 'Choose materials and finishes that fit your home.', icon: <Award size={16} /> },
              { t: 'Assembly', d: 'We put it together, so you do not have to.', icon: <Check size={16} /> },
              { t: 'Take-back', d: 'Old pieces return to the loop, not the landfill.', icon: <Users size={16} /> },
            ].map((s) => (
              <Card key={s.t} style={{ padding: 'var(--fp-space-5)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--fp-space-2)', marginBottom: 'var(--fp-space-3)', color: 'var(--fp-muted)' }}>{s.icon}<strong style={{ fontSize: 'var(--fp-text-sm)', color: 'var(--fp-ink)' }}>{s.t}</strong></div>
                <div style={{ fontSize: 'var(--fp-text-xs)', color: 'var(--fp-muted)', marginBottom: 'var(--fp-space-4)' }}>{s.d}</div>
                <Button size="sm" variant="outline" onClick={() => go('contact')}>Enquire <ArrowRight size={16} /></Button>
              </Card>
            ))}
          </div>
          <div style={{ marginTop: 'var(--fp-space-6)' }}>
            <div className="fp-label" style={{ marginBottom: 'var(--fp-space-3)' }}>Common questions</div>
            <Collapse items={[
              { key: 'a', title: 'How long does delivery take?', children: 'Most orders arrive in 3–5 working days. Large pieces may take up to two weeks.' },
              { key: 'b', title: 'Can I return an assembled piece?', children: 'Yes, within 365 days. Keep the packaging where possible — we can arrange collection.' },
              { key: 'c', title: 'Do you offer trade pricing?', children: 'We do, for architects and interior designers. Get in touch with your project details.' },
            ]} />
          </div>
        </div>
      )}

      {page === 'about' && (
        <div style={{ padding: compact ? 'var(--fp-space-5) var(--fp-space-4)' : 'var(--fp-space-6) var(--fp-space-6)' }}>
          <div className="fp-label">Since 1998</div>
          <h3 style={{ fontSize: 'var(--fp-text-xl)', fontWeight: 'var(--fp-weight-semibold)', letterSpacing: 'var(--fp-tracking-display)', margin: 'var(--fp-space-2) 0 var(--fp-space-5)' }}>About Nordform</h3>
          <div style={{ display: 'grid', gridTemplateColumns: compact ? '1fr' : '1fr 1.4fr', gap: compact ? 'var(--fp-space-4)' : 'var(--fp-space-5)' }}>
            <div style={{ height: compact ? 180 : 260 }}><Photo of="studio" alt="Our workshop" ratio="3:4" /></div>
            <div>
              <p style={{ fontSize: 'var(--fp-text-sm)', color: 'var(--fp-muted)', lineHeight: 1.9, margin: '0 0 var(--fp-space-4)' }}>We started in a small workshop with one rule: make fewer things, and make them properly. Everything we ship today still follows that rule.</p>
              <p style={{ fontSize: 'var(--fp-text-sm)', color: 'var(--fp-muted)', lineHeight: 1.9, margin: '0 0 var(--fp-space-5)' }}>Our designers work in the same building as the people who build the prototypes. Nothing leaves until we would put it in our own homes.</p>
              <Tabs defaultValue="numbers">
                <TabsList><TabsTrigger value="numbers">By numbers</TabsTrigger><TabsTrigger value="team">Team</TabsTrigger></TabsList>
                <TabsContent value="numbers"><div style={{ paddingTop: 'var(--fp-space-4)', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'var(--fp-space-3)' }}><Statistic label="Years" value="27" /><Statistic label="People" value="140" /><Statistic label="Countries" value="18" /></div></TabsContent>
                <TabsContent value="team"><div style={{ paddingTop: 'var(--fp-space-4)', display: 'flex', gap: 'var(--fp-space-3)', alignItems: 'center' }}>{['Ava', 'Jonas', 'Mei', 'Lars', 'Ines'].map((n) => <Avatar key={n} name={n} />)}</div></TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      )}

      {page === 'contact' && (
        <div style={{ padding: compact ? 'var(--fp-space-5) var(--fp-space-4)' : 'var(--fp-space-6) var(--fp-space-6)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: compact ? '1fr' : '0.85fr 1.15fr', gap: compact ? 'var(--fp-space-4)' : 'var(--fp-space-6)', alignItems: 'start', maxWidth: 1100, margin: '0 auto' }}>
            {/* left: contact details */}
            <div>
              <div className="fp-label">Get in touch</div>
              <h3 style={{ fontSize: 'var(--fp-text-xl)', fontWeight: 'var(--fp-weight-semibold)', letterSpacing: 'var(--fp-tracking-display)', margin: 'var(--fp-space-2) 0 var(--fp-space-3)' }}>Contact us</h3>
              <p style={{ fontSize: 'var(--fp-text-sm)', color: 'var(--fp-muted)', lineHeight: 1.8, marginBottom: 'var(--fp-space-5)' }}>Tell us what you are planning. We reply within two working days.</p>
              <div style={{ height: 180, marginBottom: 'var(--fp-space-4)' }}><Photo of="studio" alt="Our studio" ratio="16:9" /></div>
              <Card style={{ padding: 0 }}>
                {[
                  { icon: <Mail size={16} />, label: 'Email', value: 'hello@nordform.example' },
                  { icon: <Phone size={16} />, label: 'Phone', value: '+46 8 555 0100' },
                  { icon: <MapPin size={16} />, label: 'Studio', value: 'Södermalm, Stockholm' },
                ].map((x, i) => (
                  <div key={x.label} style={{ display: 'flex', gap: 'var(--fp-space-3)', alignItems: 'center', padding: 'var(--fp-space-3) var(--fp-space-4)', borderBottom: i === 2 ? 0 : '1px solid var(--fp-line)' }}>
                    <span style={{ color: 'var(--fp-muted)' }}>{x.icon}</span>
                    <div><div style={{ fontSize: 'var(--fp-text-xs)', color: 'var(--fp-muted)',}}>{x.label}</div><div style={{ fontSize: 'var(--fp-text-xs)', fontWeight: 'var(--fp-weight-semibold)', marginTop: 'var(--fp-space-1)' }}>{x.value}</div></div>
                  </div>
                ))}
              </Card>
              <div style={{ display: 'flex', gap: 'var(--fp-space-2)', marginTop: 'var(--fp-space-4)', alignItems: 'center', fontSize: 'var(--fp-text-xs)', color: 'var(--fp-muted)' }}>
                <Badge variant="success">Open</Badge> Currently taking new projects for Q1
              </div>
            </div>

            {/* right: form */}
            <div>
              <div className="fp-label" style={{ marginBottom: 'var(--fp-space-3)' }}>Project enquiry</div>
              {sent ? (
                <Card style={{ padding: 'var(--fp-space-7)', textAlign: 'center', minHeight: 360, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Check size={28} style={{ margin: '0 auto var(--fp-space-4)' }} />
                  <div style={{ fontWeight: 'var(--fp-weight-semibold)', fontSize: 'var(--fp-text-base)', marginBottom: 'var(--fp-space-2)' }}>Message sent</div>
                  <div style={{ fontSize: 'var(--fp-text-xs)', color: 'var(--fp-muted)', marginBottom: 'var(--fp-space-5)' }}>Thanks — we will be in touch shortly.</div>
                  <Button size="sm" variant="outline" style={{ alignSelf: 'center' }} onClick={() => setSent(false)}>Send another</Button>
                </Card>
              ) : (
                <Card style={{ padding: 'var(--fp-space-5)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: compact ? '1fr' : '1fr 1fr', gap: 'var(--fp-space-4)', marginBottom: 'var(--fp-space-4)' }}>
                    <div><label style={{ fontSize: 'var(--fp-text-xs)', fontWeight: 'var(--fp-weight-semibold)', display: 'block', marginBottom: 'var(--fp-space-2)' }}>Name</label><Input placeholder="Your name" /></div>
                    <div><label style={{ fontSize: 'var(--fp-text-xs)', fontWeight: 'var(--fp-weight-semibold)', display: 'block', marginBottom: 'var(--fp-space-2)' }}>Email</label><Input type="email" placeholder="you@example.com" /></div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: compact ? '1fr' : '1fr 1fr', gap: 'var(--fp-space-4)', marginBottom: 'var(--fp-space-4)' }}>
                    <div><label style={{ fontSize: 'var(--fp-text-xs)', fontWeight: 'var(--fp-weight-semibold)', display: 'block', marginBottom: 'var(--fp-space-2)' }}>Project type</label><Input placeholder="Furnishing a room" /></div>
                    <div><label style={{ fontSize: 'var(--fp-text-xs)', fontWeight: 'var(--fp-weight-semibold)', display: 'block', marginBottom: 'var(--fp-space-2)' }}>Budget</label><Input placeholder="¥ 5,000–10,000" /></div>
                  </div>
                  <label style={{ fontSize: 'var(--fp-text-xs)', fontWeight: 'var(--fp-weight-semibold)', display: 'block', marginBottom: 'var(--fp-space-2)' }}>Message</label>
                  <Input placeholder="What can we help with?" />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--fp-space-5)', gap: 'var(--fp-space-3)' }}>
                    <span style={{ fontSize: 'var(--fp-text-xs)', color: 'var(--fp-muted)' }}>We never share your details.</span>
                    <Button onClick={() => setSent(true)}>Send message <ArrowRight size={16} /></Button>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      )}

      {/* footer */}
      <div style={{ background: 'var(--fp-bg)', color: 'var(--fp-ink)', padding: 'var(--fp-space-6)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: compact ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: compact ? 'var(--fp-space-4)' : 'var(--fp-space-5)', marginBottom: 'var(--fp-space-5)' }}>
          <div><div style={{ fontWeight: 'var(--fp-weight-semibold)', fontSize: 'var(--fp-text-sm)', marginBottom: 'var(--fp-space-2)' }}>Nordform</div><div style={{ fontSize: 'var(--fp-text-xs)', opacity: 0.65 }}>Thoughtful objects for everyday life. Made to last, built to be repaired.</div></div>
          {[
            { t: 'Shop', items: ['Collection', 'New arrivals', 'Deals', 'Gift cards'] },
            { t: 'Company', items: ['About', 'Journal', 'Careers', 'Stores'] },
            { t: 'Help', items: ['Delivery', 'Returns', 'Assembly', 'Contact'] },
          ].map((col) => (
            <div key={col.t}><div className="fp-label" style={{ color: 'var(--fp-ink)', opacity: 0.7, marginBottom: 'var(--fp-space-2)' }}>{col.t}</div>{col.items.map((x) => <div key={x} style={{ fontSize: 'var(--fp-text-xs)', opacity: 0.65, padding: 'var(--fp-space-1) 0' }}>{x}</div>)}</div>
          ))}
        </div>
        {subscribed ? (
          <div style={{ fontSize: 'var(--fp-text-xs)', display: 'flex', alignItems: 'center', gap: 'var(--fp-space-2)', marginBottom: 'var(--fp-space-5)' }}><Check size={16} /> Subscribed — welcome aboard.</div>
        ) : (
          <div style={{ display: 'flex', gap: 'var(--fp-space-2)', maxWidth: 380, marginBottom: 'var(--fp-space-5)' }}>
            <Input size="sm" placeholder="Your email for the journal" style={{ background: 'transparent', color: 'var(--fp-ink)' }} />
            <Button size="sm" onClick={() => setSubscribed(true)}>Subscribe <Plus size={16} /></Button>
          </div>
        )}
        <Separator />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--fp-text-xs)', color: 'var(--fp-muted)', marginTop: 'var(--fp-space-4)' }}><span>© 2026 Nordform · Built with Flatpack UI</span><span>Stockholm · Seoul · Berlin</span></div>
      </div>
    </div>
  )
}

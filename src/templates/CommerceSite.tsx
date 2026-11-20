import { useState } from 'react'
import {
  ShoppingBag, Heart, ChevronRight, Check, Trash2, ArrowRight,
  Truck, ShieldCheck, RotateCcw, SlidersHorizontal,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Segmented } from '@/components/ui/segmented'
import { Alert } from '@/components/ui/alert'
import { Empty } from '@/components/ui/empty'
import { Pagination } from '@/components/ui/pagination'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet'
import { Collapse } from '@/components/ui/collapse'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbCurrent, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Kicker } from '@/components/ui/primitives'
import { Photo } from '@/templates/Photo'

type Page = 'shop' | 'deals' | 'product'

type Product = {
  id: number; name: string; price: number; cat: string; tag: string; h: number;
  photo: 'chair' | 'pendant' | 'shelf' | 'armchair' | 'bedroom' | 'table' | 'plant' | 'bookcase' | 'rug'; rating: number; reviews: number; desc: string
}

const PRODUCTS: Product[] = [
  { id: 1, name: 'Dining chair', price: 499, cat: 'Seating', tag: 'New', h: 130, photo: 'chair', rating: 5, reviews: 42, desc: 'A clean-lined dining chair in solid wood. Stackable and light enough to move with one hand.' },
  { id: 2, name: 'Leather sofa', price: 899, cat: 'Living room', tag: '', h: 95, photo: 'pendant', rating: 4, reviews: 28, desc: 'A three-seat sofa in full-grain leather that softens with age. Deep seats, low arms.' },
  { id: 3, name: 'Bookshelf', price: 199, cat: 'Storage', tag: 'Low price', h: 160, photo: 'shelf', rating: 4, reviews: 96, desc: 'Open shelving in solid oak. Adjustable shelves and a frame that can grow with a second unit.' },
  { id: 4, name: 'Lounge chair', price: 749, cat: 'Seating', tag: '', h: 115, photo: 'armchair', rating: 5, reviews: 17, desc: 'Upholstered lounge chair with a generous seat and a low, relaxed back.' },
  { id: 5, name: 'Bedroom set', price: 1299, cat: 'Bedroom', tag: 'Popular', h: 150, photo: 'bedroom', rating: 5, reviews: 61, desc: 'A calm bedroom set: platform bed, bedside table and a bench at the foot.' },
  { id: 6, name: 'Pendant lamp', price: 249, cat: 'Lighting', tag: '', h: 85, photo: 'table', rating: 4, reviews: 33, desc: 'A simple pendant shade that throws a soft, even light over the table below.' },
  { id: 7, name: 'Fabric sofa', price: 349, cat: 'Living room', tag: 'New', h: 125, photo: 'plant', rating: 5, reviews: 24, desc: 'Compact two-seat sofa in a woven fabric. Fits small rooms without feeling small.' },
  { id: 8, name: 'Ceramic bowls', price: 179, cat: 'Objects', tag: 'Low price', h: 100, photo: 'bookcase', rating: 4, reviews: 12, desc: 'Four hand-thrown stoneware bowls, each slightly different. Dishwasher safe.' },
  { id: 9, name: 'Living room set', price: 599, cat: 'Living room', tag: '', h: 175, photo: 'rug', rating: 5, reviews: 8, desc: 'A coordinated living room: low sofa, side table and a soft rug underfoot.' },
]

export function CommerceSite({ compact = false }: { compact?: boolean }) {
  const [page, setPage] = useState<Page>('shop')
  const [cat, setCat] = useState('All')
  const [sort, setSort] = useState('Featured')
  const [cart, setCart] = useState<{ id: number; qty: number }[]>([])
  const [wishlist, setWishlist] = useState<number[]>([])
  const [added, setAdded] = useState<number | null>(null)
  const [checkedOut, setCheckedOut] = useState(false)
  const [selected, setSelected] = useState<Product>(PRODUCTS[0])
  const [promo, setPromo] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [pageNo, setPageNo] = useState(1)

  const add = (id: number) => {
    setCart((c) => {
      const hit = c.find((x) => x.id === id)
      return hit ? c.map((x) => x.id === id ? { ...x, qty: x.qty + 1 } : x) : [...c, { id, qty: 1 }]
    })
    setAdded(id)
    setTimeout(() => setAdded(null), 1600)
  }

  let list = PRODUCTS.filter((p) => (cat === 'All' || p.cat === cat) && (page !== 'deals' || p.price < 600 || p.tag === 'Popular'))
  if (sort === 'Low to high') list = [...list].sort((a, b) => a.price - b.price)
  if (sort === 'High to low') list = [...list].sort((a, b) => b.price - a.price)
  if (sort === 'Top rated') list = [...list].sort((a, b) => b.rating - a.rating)
  const pageSize = 4
  const paged = list.slice((pageNo - 1) * pageSize, pageNo * pageSize)

  const cartRows = cart.map((x) => ({ ...x, p: PRODUCTS.find((p) => p.id === x.id)! })).filter((x) => x.p)
  const subtotal = cartRows.reduce((s, x) => s + x.p.price * x.qty, 0)
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0
  const cartCount = cart.reduce((s, x) => s + x.qty, 0)
  const setQty = (idx: number, qty: number) => setCart((c) => c.map((x, j) => j === idx ? { ...x, qty: Math.max(1, qty) } : x))

  const openProduct = (p: Product) => { setSelected(p); setPage('product') }

  return (
    <div style={{ minHeight: 700, background: 'var(--fp-bg)' }}>
      {/* promo strip */}
      <div style={{ background: 'var(--fp-bg)', color: 'var(--fp-ink)', padding: compact ? 'var(--fp-space-2) var(--fp-space-3)' : 'var(--fp-space-2) var(--fp-space-5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: compact ? 'var(--fp-text-xs)' : 'var(--fp-text-xs)' }}>
        <span>{compact ? 'Season sale · up to 30% off' : 'Season sale · up to 30% off selected pieces — ends Sunday'}</span>
        <button onClick={() => setPage('deals')} style={{ background: 'none', border: 0, color: 'inherit', cursor: 'pointer', fontWeight: 'var(--fp-weight-semibold)', display: 'flex', alignItems: 'center', gap: 'var(--fp-space-1)' }}>Shop deals <ChevronRight size={16} /></button>
      </div>

      {/* nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: compact ? 'var(--fp-space-3) var(--fp-space-3)' : 'var(--fp-space-4) var(--fp-space-5)', background: 'var(--fp-surface)', borderBottom: '1px solid var(--fp-line)', position: 'sticky', top: 0, zIndex: 5 }}>
        <button onClick={() => setPage('shop')} style={{ background: 'none', border: 0, cursor: 'pointer', fontWeight: 'var(--fp-weight-semibold)', fontSize: 'var(--fp-text-sm)' }}>NORDFORM STORE</button>
        <div style={{ display: compact ? 'none' : 'flex', gap: 'var(--fp-space-4)', fontSize: 'var(--fp-text-xs)' }}>
          <button onClick={() => setPage('shop')} style={{ background: 'none', border: 0, cursor: 'pointer', color: page === 'shop' ? 'var(--fp-ink)' : 'var(--fp-muted)', fontWeight: 'var(--fp-weight-semibold)' }}>Shop</button>
          <button onClick={() => setPage('deals')} style={{ background: 'none', border: 0, cursor: 'pointer', color: page === 'deals' ? 'var(--fp-ink)' : 'var(--fp-muted)', fontWeight: 'var(--fp-weight-semibold)' }}>Deals</button>
          <span style={{ color: 'var(--fp-muted)' }}>Rooms</span>
          <span style={{ color: 'var(--fp-muted)' }}>Journal</span>
        </div>
        <div style={{ display: 'flex', gap: 'var(--fp-space-2)', alignItems: 'center' }}>
          <Input size="sm" placeholder="Search products" style={{ width: 160, display: compact ? 'none' : undefined }} />
          <Button size="sm" variant="ghost" onClick={() => setWishlist((w) => w.length ? [] : [1, 5])}><Heart size={16} /> {wishlist.length > 0 && <Badge>{wishlist.length}</Badge>}</Button>
          <Sheet>
            <SheetTrigger size="sm">Cart {cartCount > 0 && `(${cartCount})`}</SheetTrigger>
            <SheetContent title="Your cart">
              {checkedOut ? (
                <div style={{ textAlign: 'center', padding: 'var(--fp-space-5) 0' }}>
                  <Check size={26} style={{ margin: '0 auto var(--fp-space-3)' }} />
                  <div style={{ fontWeight: 'var(--fp-weight-semibold)', marginBottom: 'var(--fp-space-1)' }}>Order placed</div>
                  <div style={{ fontSize: 'var(--fp-text-xs)', color: 'var(--fp-muted)', marginBottom: 'var(--fp-space-4)' }}>Arriving in 3–5 days.</div>
                  <Button size="sm" onClick={() => { setCart([]); setCheckedOut(false) }}>Keep shopping</Button>
                </div>
              ) : cartRows.length === 0 ? (
                <Empty title="Cart is empty" description="Add something you like." />
              ) : (
                <>
                  {cartRows.map((x, i) => (
                    <div key={x.id} style={{ display: 'flex', gap: 'var(--fp-space-3)', alignItems: 'center', padding: 'var(--fp-space-3) 0', borderBottom: '1px solid var(--fp-line)' }}>
                      <div style={{ width: 44, height: 44 }}><Photo of={x.p.photo} alt={x.p.name} ratio="square" /></div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 'var(--fp-text-xs)', fontWeight: 'var(--fp-weight-semibold)' }}>{x.p.name}</div>
                        <div style={{ fontSize: 'var(--fp-text-xs)', color: 'var(--fp-muted)' }}>¥ {x.p.price}</div>
                        <div style={{ display: 'inline-flex', border: '1px solid var(--fp-line)', marginTop: 'var(--fp-space-1)' }}>
                          <button onClick={() => setQty(i, x.qty - 1)} style={{ width: 24, height: 22, background: 'none', border: 0, color: 'var(--fp-muted)', cursor: 'pointer' }}>−</button>
                          <span style={{ width: 26, textAlign: 'center', fontSize: 'var(--fp-text-xs)', lineHeight: '22px', fontWeight: 'var(--fp-weight-semibold)' }}>{x.qty}</span>
                          <button onClick={() => setQty(i, x.qty + 1)} style={{ width: 24, height: 22, background: 'none', border: 0, color: 'var(--fp-muted)', cursor: 'pointer' }}>+</button>
                        </div>
                      </div>
                      <Button size="icon-sm" variant="ghost" onClick={() => setCart((c) => c.filter((_, j) => j !== i))} aria-label="Remove from cart"><Trash2 size={16} /></Button>
                    </div>
                  ))}
                  <div style={{ marginTop: 'var(--fp-space-5)', paddingTop: 'var(--fp-space-4)', borderTop: '1px solid var(--fp-line)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--fp-text-xs)', marginBottom: 'var(--fp-space-2)' }}><span style={{ color: 'var(--fp-muted)' }}>Subtotal</span><span>¥ {subtotal.toLocaleString()}</span></div>
                    {promoApplied && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--fp-text-xs)', marginBottom: 'var(--fp-space-2)', color: 'var(--fp-ink)' }}><span>Promo (WELCOME10)</span><span>−¥ {discount.toLocaleString()}</span></div>}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--fp-text-xs)', marginBottom: 'var(--fp-space-2)' }}><span style={{ color: 'var(--fp-muted)' }}>Shipping</span><span>{subtotal - discount >= 199 ? 'Free' : '¥ 20'}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 'var(--fp-space-3)', paddingTop: 'var(--fp-space-3)', borderTop: '1px solid var(--fp-line)' }}>
                      <span className="fp-label">Total</span><strong style={{ fontSize: 'var(--fp-text-xl)', letterSpacing: 'var(--fp-tracking-display)' }}>¥ {(subtotal - discount + (subtotal - discount >= 199 ? 0 : 20)).toLocaleString()}</strong>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--fp-space-2)', marginTop: 'var(--fp-space-4)' }}>
                      <Input size="sm" placeholder="Promo code" value={promo} onChange={(e) => setPromo(e.target.value)} style={{ flex: 1 }} />
                      <Button size="sm" variant="outline" onClick={() => { if (promo.trim().toUpperCase() === 'WELCOME10') setPromoApplied(true) }}>Apply</Button>
                    </div>
                    {promo && !promoApplied && <div style={{ fontSize: 'var(--fp-text-xs)', color: 'var(--fp-muted)', marginTop: 'var(--fp-space-2)' }}>Try WELCOME10 for 10% off.</div>}
                    <Button style={{ width: '100%', marginTop: 'var(--fp-space-4)' }} onClick={() => setCheckedOut(true)}>Checkout <ChevronRight size={16} /></Button>
                    <div style={{ fontSize: 'var(--fp-text-xs)', color: 'var(--fp-muted)', textAlign: 'center', marginTop: 'var(--fp-space-3)' }}>Free shipping over ¥199 · 365-day returns</div>
                  </div>
                </>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {added != null && (
        <div style={{ padding: 'var(--fp-space-3) var(--fp-space-5) 0' }}>
          <Alert variant="success" title="Added to cart">{PRODUCTS.find((p) => p.id === added)?.name} is in your cart.</Alert>
        </div>
      )}

      {/* hero banner */}
      {page === 'shop' && (
        <div className="fp-invert" style={{ margin: compact ? 'var(--fp-space-3) var(--fp-space-3) 0' : 'var(--fp-space-5) var(--fp-space-5) 0', padding: compact ? 'var(--fp-space-5) var(--fp-space-4)' : 'var(--fp-space-6) var(--fp-space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: compact ? 'var(--fp-space-2)' : 'var(--fp-space-5)', flexDirection: compact ? 'column' : 'row' }}>
          <div>
            <div className="fp-label">New season</div>
            <h2 style={{ fontSize: compact ? 'var(--fp-text-xl)' : 'var(--fp-text-xl)', fontWeight: 'var(--fp-weight-semibold)', letterSpacing: 'var(--fp-tracking-display)', margin: 'var(--fp-space-3) 0 var(--fp-space-2)' }}>Fewer things.<br />Better things.</h2>
            <p style={{ fontSize: 'var(--fp-text-sm)', color: 'var(--fp-muted)', maxWidth: 380, margin: '0 0 var(--fp-space-4)' }}>Our autumn collection is in — solid wood, honest joinery, and finishes that age well.</p>
            <Button size="sm" onClick={() => setCat('Living room')}>Shop the collection <ArrowRight size={16} /></Button>
          </div>
          <div style={{ width: compact ? 90 : 150, height: compact ? 90 : 150, overflow: 'hidden', flexShrink: 0, display: compact ? 'none' : undefined }}><Photo of="warmRoom" alt="Autumn collection" ratio="square" /></div>
        </div>
      )}

      {/* breadcrumb on product page */}
      {page === 'product' && (
        <div style={{ padding: 'var(--fp-space-4) var(--fp-space-5) 0' }}>
          <Breadcrumb>
            <BreadcrumbItem><BreadcrumbLink href="#/templates">Shop</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink>{selected.cat}</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbCurrent>{selected.name}</BreadcrumbCurrent></BreadcrumbItem>
          </Breadcrumb>
        </div>
      )}

      {page === 'product' ? (
        <div style={{ padding: 'var(--fp-space-5)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: compact ? '1fr' : '1fr 1fr', gap: compact ? 'var(--fp-space-4)' : 'var(--fp-space-6)' }}>
            <div style={{ height: compact ? 200 : 300, overflow: 'hidden' }}><Photo of={selected.photo} alt={selected.name} ratio="4:3" /></div>
            <div>
              <Badge>{selected.tag || 'In stock'}</Badge>
              <h2 style={{ fontSize: 'var(--fp-text-xl)', fontWeight: 'var(--fp-weight-semibold)', letterSpacing: 'var(--fp-tracking-display)', margin: 'var(--fp-space-3) 0 var(--fp-space-2)' }}>{selected.name}</h2>
              <div style={{ fontSize: 'var(--fp-text-xs)', color: 'var(--fp-muted)', marginBottom: 'var(--fp-space-3)' }}>{'★'.repeat(selected.rating)}{'☆'.repeat(5 - selected.rating)} · {selected.reviews} reviews</div>
              <div style={{ fontSize: 'var(--fp-text-xl)', fontWeight: 'var(--fp-weight-semibold)', marginBottom: 'var(--fp-space-4)' }}>¥ {selected.price}</div>
              <p style={{ fontSize: 'var(--fp-text-sm)', color: 'var(--fp-muted)', lineHeight: 1.8, marginBottom: 'var(--fp-space-5)' }}>{selected.desc}</p>
              <div style={{ display: 'flex', gap: 'var(--fp-space-2)', marginBottom: 'var(--fp-space-4)' }}>
                <Button onClick={() => add(selected.id)}>Add to cart <ShoppingBag size={16} /></Button>
                <Button size="icon" variant="outline" onClick={() => setWishlist((w) => w.includes(selected.id) ? w : [...w, selected.id])} aria-label="Save to wishlist"><Heart size={16} /></Button>
              </div>
              <Collapse items={[
                { key: 'a', title: 'Materials & care', children: 'Solid oak and powder-coated steel. Wipe clean with a dry cloth.' },
                { key: 'b', title: 'Delivery & returns', children: 'Free delivery over ¥199. 365-day returns in original condition.' },
              ]} />
              <div style={{ display: 'flex', gap: 'var(--fp-space-4)', marginTop: 'var(--fp-space-4)', fontSize: 'var(--fp-text-xs)', color: 'var(--fp-muted)' }}>
                <span style={{ display: 'flex', gap: 'var(--fp-space-1)', alignItems: 'center' }}><Truck size={16} /> Free shipping</span>
                <span style={{ display: 'flex', gap: 'var(--fp-space-1)', alignItems: 'center' }}><ShieldCheck size={16} /> 10-year warranty</span>
                <span style={{ display: 'flex', gap: 'var(--fp-space-1)', alignItems: 'center' }}><RotateCcw size={16} /> Easy returns</span>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 'var(--fp-space-6)' }}>
            <div className="fp-label" style={{ marginBottom: 'var(--fp-space-3)' }}>You may also like</div>
            <div style={{ display: 'grid', gridTemplateColumns: compact ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: 'var(--fp-space-3)' }}>
              {PRODUCTS.filter((p) => p.id !== selected.id).slice(0, 4).map((p) => (
                <Card key={p.id} style={{ cursor: 'pointer' }} onClick={() => openProduct(p)}>
                  <div style={{ height: 80 }}><Photo of={p.photo} alt={p.name} ratio="4:3" /></div>
                  <div style={{ padding: 'var(--fp-space-2)' }}><div style={{ fontSize: 'var(--fp-text-xs)', fontWeight: 'var(--fp-weight-semibold)' }}>{p.name}</div><div style={{ fontSize: 'var(--fp-text-xs)' }}>¥ {p.price}</div></div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ padding: compact ? 'var(--fp-space-4) var(--fp-space-3)' : 'var(--fp-space-5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: compact ? 'flex-start' : 'flex-end', marginBottom: 'var(--fp-space-4)', flexWrap: 'wrap', gap: 'var(--fp-space-3)' }}>
            <div>
              <Kicker>{page === 'deals' ? 'Limited time' : 'Catalog'}</Kicker>
              <h2 style={{ fontSize: compact ? 'var(--fp-text-lg)' : 'var(--fp-text-xl)', fontWeight: 'var(--fp-weight-semibold)', letterSpacing: 'var(--fp-tracking-display)', margin: 'var(--fp-space-2) 0 0' }}>
                {page === 'deals' ? 'Deals under ¥600' : 'Browse all products'}
              </h2>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--fp-space-2)', alignItems: 'center', minWidth: 0, maxWidth: '100%' }}>
              <SlidersHorizontal size={16} color="var(--fp-muted)" />
              <div style={{ minWidth: 0, maxWidth: '100%' }}><Segmented size="sm" value={sort} onValueChange={setSort} options={['Featured', 'Low to high', 'High to low', 'Top rated'].map((s) => ({ value: s, label: s }))} /></div>
              <Badge variant="outline">{list.length} items</Badge>
            </div>
          </div>
          <div style={{ marginBottom: 'var(--fp-space-4)', overflowX: 'auto', paddingBottom: compact ? 'var(--fp-space-2)' : 0 }}>
            <Segmented value={cat} onValueChange={(v) => { setCat(v); setPageNo(1) }} options={['All', 'Living room', 'Seating', 'Storage', 'Lighting', 'Bedroom', 'Objects'].map((c) => ({ value: c, label: c }))} />
          </div>
          {paged.length === 0 ? (
            <Empty title="No products here" description="Try another category." />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: compact ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: compact ? 'var(--fp-space-2)' : 'var(--fp-space-3)', alignItems: 'stretch' }}>
              {paged.map((p) => (
                <Card key={p.id} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <CardContent style={{ padding: 'var(--fp-space-3)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ height: compact ? 120 : 160, overflow: 'hidden', cursor: 'pointer' }} onClick={() => openProduct(p)}><Photo of={p.photo} alt={p.name} ratio="4:3" /></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 'var(--fp-space-3)', minHeight: 58 }}>
                      <div>
                        <div style={{ fontSize: 'var(--fp-text-xs)', fontWeight: 'var(--fp-weight-semibold)' }}>{p.name}</div>
                        <div style={{ fontSize: 'var(--fp-text-xs)', color: 'var(--fp-muted)' }}>{'★'.repeat(p.rating)} · {p.reviews}</div>
                        <strong style={{ fontSize: 'var(--fp-text-sm)' }}>¥ {p.price}</strong>
                      </div>
                      {p.tag && <Badge variant={p.tag === 'Popular' ? 'default' : 'outline'}>{p.tag}</Badge>}
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--fp-space-2)', marginTop: 'auto', paddingTop: 'var(--fp-space-3)' }}>
                      <Button size="sm" style={{ flex: 1 }} onClick={() => add(p.id)}>Add to cart</Button>
                      <Button size="icon-sm" variant="outline" onClick={() => setWishlist((w) => w.includes(p.id) ? w.filter((x) => x !== p.id) : [...w, p.id])} aria-label="Save to wishlist"><Heart size={16} /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--fp-space-5)' }}>
            <Dialog>
              <DialogTrigger>Quick view</DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{selected.name}</DialogTitle>
                  <DialogDescription>{selected.desc}</DialogDescription>
                </DialogHeader>
                <div style={{ height: 140, overflow: 'hidden' }}><Photo of={selected.photo} alt={selected.name} ratio="4:3" /></div>
                <div style={{ marginTop: 'var(--fp-space-4)' }}><strong style={{ fontSize: 'var(--fp-text-lg)' }}>¥ {selected.price}</strong></div>
                <DialogFooter>
                  <DialogClose>Cancel</DialogClose>
                  <DialogClose><Button size="sm" onClick={() => add(selected.id)}>Add to cart</Button></DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Pagination total={list.length} pageSize={pageSize} value={pageNo} onValueChange={setPageNo} />
          </div>
        </div>
      )}

      {/* newsletter */}
      <div style={{ margin: compact ? 'var(--fp-space-3) var(--fp-space-3) var(--fp-space-5)' : 'var(--fp-space-3) var(--fp-space-5) var(--fp-space-6)', padding: compact ? 'var(--fp-space-4)' : 'var(--fp-space-5)', border: '1px solid var(--fp-line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--fp-space-4)', flexWrap: 'wrap' }}>
        <div><div style={{ fontWeight: 'var(--fp-weight-semibold)', fontSize: 'var(--fp-text-base)' }}>The journal, monthly.</div><div style={{ fontSize: 'var(--fp-text-xs)', color: 'var(--fp-muted)', marginTop: 'var(--fp-space-1)' }}>New pieces, workshop notes, and ideas for small spaces.</div></div>
        <div style={{ display: 'flex', gap: 'var(--fp-space-2)' }}>
          <Input placeholder="you@example.com" style={{ width: compact ? '100%' : 220 }} />
          <Button onClick={() => setPromoApplied(true)}>Subscribe</Button>
        </div>
      </div>

      {promoApplied && (
        <div style={{ padding: '0 var(--fp-space-5) var(--fp-space-5)' }}>
          <Alert variant="success" title="Subscribed">You are on the list.</Alert>
        </div>
      )}

      <div style={{ background: 'var(--fp-bg)', color: 'var(--fp-ink)', padding: compact ? 'var(--fp-space-4) var(--fp-space-3)' : 'var(--fp-space-5)', display: 'flex', justifyContent: 'space-between', fontSize: compact ? 'var(--fp-text-xs)' : 'var(--fp-text-xs)', flexWrap: 'wrap', gap: 'var(--fp-space-2)' }}>
        <span>Nordform Store · Honest furniture</span><span>Free shipping over ¥199 · 365-day returns</span>
      </div>
    </div>
  )
}

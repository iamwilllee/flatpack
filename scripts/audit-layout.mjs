// Layout audit: renders every page in a headless browser and reports
//   - text clipped by an overflow:hidden ancestor
//   - text or controls overlapping each other
//   - controls side by side with different heights (mixed sizes in one row)
//   - containers collapsed narrower than their content
//   - single-line labels (buttons, badges, table heads, stats) that wrapped
// at 1440px and 390px, including template sub-pages and Create preview tabs.
//
// Needs playwright-core and a Chromium. Not a project dependency yet; one-time:
//   npm i -D playwright-core && npx playwright-core install chromium
// Then:
//   npm run build && npx vite preview --port 4304 &
//   node scripts/audit-layout.mjs http://localhost:4304
// Set CHROME_PATH if Playwright's bundled browser is not installed.
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { chromium } = require('playwright-core')
const BASE = process.argv[2] || 'http://localhost:4304'
const OUT = process.argv[3] || 'layout-audit.json'

function inPage() {
  const vis = (el) => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && +s.opacity > 0 }
  const label = (el) => {
    const t = (el.innerText || el.value || el.placeholder || el.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 40)
    const slot = el.getAttribute('data-slot')
    return `${el.tagName.toLowerCase()}${slot ? `[${slot}]` : ''} "${t}"`
  }
  const out = []
  const textRects = (el) => {
    const rs = []
    for (const n of el.childNodes) if (n.nodeType === 3 && n.textContent.trim()) { const rg = document.createRange(); rg.selectNodeContents(n); rs.push(...[...rg.getClientRects()].filter((r) => r.width > 1)) }
    return rs
  }
  const clip = (el, r) => {
    if (!r) return null
    let { left, right, top, bottom } = r
    for (let a = el; a && a !== document.documentElement; a = a.parentElement) {
      const st = getComputedStyle(a)
      if (st.overflowX !== 'visible' || st.overflowY !== 'visible') {
        const ar = a.getBoundingClientRect()
        left = Math.max(left, ar.left); right = Math.min(right, ar.right); top = Math.max(top, ar.top); bottom = Math.min(bottom, ar.bottom)
      }
    }
    return right - left > 1 && bottom - top > 1 ? { left, right, top, bottom } : null
  }
  const unionRect = (rs) => rs.length ? { left: Math.min(...rs.map((r) => r.left)), right: Math.max(...rs.map((r) => r.right)), top: Math.min(...rs.map((r) => r.top)), bottom: Math.max(...rs.map((r) => r.bottom)) } : null
  const all = [...document.querySelectorAll('body *')].filter(vis)
  // 1. clipping by an overflow:hidden/clip ancestor (text cut off)
  const textEls = all.filter((el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()))
  for (const el of textEls) {
    const r = unionRect(textRects(el)) || el.getBoundingClientRect()
    if (el.closest('[data-slot=visually-hidden]')) continue
    if (el.scrollWidth > el.clientWidth + 1 && ['hidden', 'clip'].includes(getComputedStyle(el).overflowX) && getComputedStyle(el).textOverflow !== 'ellipsis') out.push({ type: 'clipped-self', el: label(el) })
    if (/(auto|scroll)/.test(getComputedStyle(el).overflowX)) continue
    let a = el.parentElement
    while (a && a !== document.body) {
      const s = getComputedStyle(a)
      if (/(hidden|clip)/.test(s.overflowX) && !/(auto|scroll)/.test(s.overflowX)) {
        const ar = a.getBoundingClientRect()
        if (r.right > ar.right + 2 || r.left < ar.left - 2) { out.push({ type: 'clipped', el: label(el), by: label(a) }); break }
      }
      if (/(auto|scroll)/.test(s.overflowX)) break
      a = a.parentElement
    }
  }
  // 2. overlapping text / controls
  const CTRL = '[data-slot=button],[data-slot=input],[data-slot=select-trigger],[data-slot=badge],[data-slot=segmented],textarea'
  const boxes = [...new Set([...textEls, ...document.querySelectorAll(CTRL)])].filter(vis)
    .filter((el) => !el.closest('[data-slot=dialog-content],[data-slot=popover-content],[data-slot=select-content],[data-slot=dropdown-content],[data-slot=tooltip-content],[data-slot=visually-hidden]'))
    .map((el) => ({ el, r: clip(el, el.matches(CTRL) ? el.getBoundingClientRect() : unionRect(textRects(el))) })).filter((b) => b.r)
  for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
    const A = boxes[i], B = boxes[j]
    if (A.el.contains(B.el) || B.el.contains(A.el)) continue
    const w = Math.min(A.r.right, B.r.right) - Math.max(A.r.left, B.r.left)
    const h = Math.min(A.r.bottom, B.r.bottom) - Math.max(A.r.top, B.r.top)
    if (w > 3 && h > 3) out.push({ type: 'overlap', el: label(A.el), with: label(B.el) })
  }
  // 3. controls side by side with different heights
  const ROWCTRL = '[data-slot=button]:not([data-variant=link]):not([data-variant=ghost]),[data-slot=input],[data-slot=select-trigger],[data-slot=segmented],[data-slot=number-input],[data-slot=combobox-input]'
  for (const row of all) {
    const s = getComputedStyle(row)
    if (!s.display.includes('flex') || s.flexDirection.startsWith('column') || row.closest('[data-demo=sizes]')) continue
    const kids = [...row.children].filter(vis).map((k) => k.matches(ROWCTRL) ? k : k.querySelector(':scope > ' + ROWCTRL.split(',').join(', :scope > ')) && k.children.length === 1 ? k.firstElementChild : null).filter(Boolean)
    if (kids.length < 2) continue
    const hs = kids.map((k) => Math.round(k.getBoundingClientRect().height))
    if (Math.max(...hs) - Math.min(...hs) > 1) out.push({ type: 'mixed-height', el: label(row), items: kids.map((k, i) => `${label(k)}=${hs[i]}`).join(' | ') })
  }
  // 5. collapsed boxes: a container squeezed narrower than its content
  for (const el of all) {
    const r = el.getBoundingClientRect()
    if (el.children.length && r.width < 8 && el.scrollWidth > r.width + 16 && getComputedStyle(el).overflowX !== 'visible') out.push({ type: 'collapsed', el: label(el), w: Math.round(r.width), content: el.scrollWidth })
    else if (el.children.length && r.width < 8 && [...el.children].some((k) => k.getBoundingClientRect().width > r.width + 16)) out.push({ type: 'collapsed', el: label(el), w: Math.round(r.width) })
  }
  // 6. controls crowding a hairline: a button / field / badge closer than 8px to a separator or border line
  const LINE_OWNER_SKIP = '[data-slot=tabs-list],[data-slot=toolbar],[data-slot=table-row],[data-slot=table-header],[data-slot=collapse],[data-slot=collapse-item],[data-slot=sidebar],[data-slot=menubar],header'
  const lines = []
  for (const el of all) {
    const s2 = getComputedStyle(el), r = el.getBoundingClientRect()
    if (r.width < 160) continue
    if (el.matches('hr,[data-slot=separator],[data-slot=divider]')) { lines.push({ y: r.top + r.height / 2, l: r.left, r: r.right, el }); continue }
    if (el.matches(LINE_OWNER_SKIP) || el.closest('[data-slot=tabs-list],[data-slot=toolbar]')) continue
    if (parseFloat(s2.borderTopWidth) >= 1 && s2.borderTopStyle !== 'none' && parseFloat(s2.borderLeftWidth) === 0) lines.push({ y: r.top, l: r.left, r: r.right, el, side: 'top' })
    if (parseFloat(s2.borderBottomWidth) >= 1 && s2.borderBottomStyle !== 'none' && parseFloat(s2.borderLeftWidth) === 0) lines.push({ y: r.bottom, l: r.left, r: r.right, el, side: 'bottom' })
  }
  const CROWD = '[data-slot=button]:not([data-variant=link]),[data-slot=input],[data-slot=input-group],[data-slot=select-trigger],[data-slot=chip],[data-slot=segmented],[data-slot=textarea]'
  for (const c of document.querySelectorAll(CROWD)) {
    if (!vis(c) || c.closest('[data-slot=tabs-list],[data-slot=toolbar],[data-slot=table],[data-slot=menubar],header,[data-slot=dialog-content],[data-slot=sheet-content],[data-slot=popover-content]')) continue
    // use the visible part only: content scrolled out of a preview frame is not crowding anything
    const full = c.getBoundingClientRect(), r = clip(c, full)
    if (!r || r.bottom - r.top < full.height - 1) continue
    // nearest scroll container: content meeting its edge mid-scroll is expected, not crowding
    let sc = c.parentElement
    while (sc && sc !== document.body && !/(auto|scroll)/.test(getComputedStyle(sc).overflowY + getComputedStyle(sc).overflowX)) sc = sc.parentElement
    if (sc === document.body) sc = null
    for (const ln of lines) {
      if (sc && !sc.contains(ln.el)) continue
      if (ln.el.contains(c) && ln.side) {
        // inside the bordered box: measure to that edge
        const gap = ln.side === 'top' ? r.top - ln.y : ln.y - r.bottom
        if (gap >= 0 && gap < 8 && r.left < ln.r && r.right > ln.l) { out.push({ type: 'crowds-line', el: label(c), line: label(ln.el), gap: Math.round(gap) }); break }
        continue
      }
      if (ln.el.contains(c) || c.contains(ln.el)) continue
      if (r.right <= ln.l || r.left >= ln.r) continue
      const gap = r.top >= ln.y ? r.top - ln.y : ln.y - r.bottom
      if (gap >= 0 && gap < 8) { out.push({ type: 'crowds-line', el: label(c), line: label(ln.el), gap: Math.round(gap) }); break }
    }
  }
  // 4. single-line things that wrapped
  const ONE = '[data-slot=button],[data-slot=badge],[data-slot=statistic-label],[data-slot=statistic-number],[data-slot=statistic-hint],[data-slot=statistic-trend],[data-slot=table-head],[data-slot=card-title],[data-slot=tabs-trigger],[data-slot=segmented-item],[data-slot=sidebar-item],[data-slot=progress-label],.fp-label'
  for (const el of document.querySelectorAll(ONE)) {
    if (!vis(el)) continue
    const lh = parseFloat(getComputedStyle(el).lineHeight) || parseFloat(getComputedStyle(el).fontSize) * 1.6
    const tn = []; const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); while (w.nextNode()) if (w.currentNode.textContent.trim()) tn.push(w.currentNode)
    const rs = tn.flatMap((n) => { const rg = document.createRange(); rg.selectNodeContents(n); return [...rg.getClientRects()].filter((r) => r.width > 1) })
    const lines = new Set(rs.map((r) => Math.round((r.top + r.bottom) / 2 / (lh * 0.6)))).size
    if (lines > 1 && el.innerText.trim().length < 60) out.push({ type: 'wrapped', el: label(el), lines })
  }
  return out
}

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined })
const results = {}
const record = async (page, key) => {
  // SHAPE=square audits the All square preset
  if (process.env.SHAPE) await page.evaluate((v) => document.documentElement.setAttribute('data-fp-shape', v), process.env.SHAPE)
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(400)
  const r = await page.evaluate(inPage)
  const seen = new Set(); results[key] = r.filter((x) => { const k = JSON.stringify(x); if (seen.has(k)) return false; seen.add(k); return true })
}
for (const [vw, vh] of [[1440, 900], [390, 844]]) {
  const ctx = await browser.newContext({ viewport: { width: vw, height: vh }, colorScheme: 'light' })
  const page = await ctx.newPage()
  await page.goto(BASE + '/#/', { waitUntil: 'networkidle' })
  const docIds = await page.evaluate(async () => [...new Set([...document.querySelectorAll('a[href^="#/docs/components/"]')].map((a) => a.getAttribute('href')))])
  await page.goto(BASE + '/#/docs', { waitUntil: 'networkidle' })
  const docLinks = await page.evaluate(() => [...new Set([...document.querySelectorAll('a[href^="#/docs/components/"]')].map((a) => a.getAttribute('href')))])
  const routes = ['#/', '#/components', '#/docs', '#/blocks', '#/create', ...new Set([...docIds, ...docLinks])]
  for (const h of routes) { await page.goto(BASE + '/' + h, { waitUntil: 'networkidle' }); await record(page, `${vw} ${h}`) }
  // create page preview tabs
  await page.goto(BASE + '/#/create', { waitUntil: 'networkidle' })
  for (const tab of ['Storefront', 'Dashboard', 'AI assistant', 'Login', 'Settings']) {
    const t = page.getByRole('tab', { name: tab }).first()
    if (await t.count()) { await t.click(); await record(page, `${vw} #/create:${tab}`) }
  }
  // templates: each kind × device × inner nav
  for (const kind of ['Corporate', 'Commerce', 'Admin']) for (const dev of vw > 800 ? ['Desktop', 'Mobile'] : ['Desktop']) {
    await page.goto(BASE + '/#/templates', { waitUntil: 'networkidle' })
    await page.getByRole('tab', { name: kind }).first().click()
    if (vw > 800) await page.getByRole('button', { name: dev, exact: true }).click()
    await record(page, `${vw} #/templates:${kind}:${dev}`)
    const navTexts = await page.evaluate(() => {
      const frame = document.querySelector('[data-template-frame]') || document.querySelector('main') || document.body
      return [...frame.querySelectorAll('[data-slot=sidebar-item], nav button, header button')].map((b) => b.innerText.trim()).filter((t) => t && t.length < 20)
    })
    for (const txt of [...new Set(navTexts)].slice(0, 8)) {
      try { await page.getByRole('button', { name: txt, exact: true }).last().click({ timeout: 1500 }); await record(page, `${vw} #/templates:${kind}:${dev}:${txt}`) } catch {}
    }
  }
  await ctx.close()
}
await browser.close()
const fs = await import('node:fs')
fs.writeFileSync(OUT, JSON.stringify(results, null, 1))
const flat = Object.entries(results).flatMap(([k, v]) => v.map((x) => ({ page: k, ...x })))
const byType = {}
for (const f of flat) byType[f.type] = (byType[f.type] || 0) + 1
console.log('pages', Object.keys(results).length, 'issues', flat.length, byType)
for (const f of flat.slice(0, 50)) console.log(`${f.page}  ${f.type}: ${f.el}${f.with ? ' ~ ' + f.with : ''}${f.by ? ' clipped by ' + f.by : ''}${f.items ? ' :: ' + f.items : ''}`)
process.exit(flat.length ? 1 : 0)

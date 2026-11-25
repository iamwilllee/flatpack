import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { readFileSync } from 'node:fs'

// Runs axe on every component doc page in both color schemes. Serious and critical findings fail.
// Rules that need a real browser layout pass (color-contrast on gradients, etc.) stay on; if a rule
// is a known false positive, list it in SKIP with the reason.
const SKIP: string[] = []

const ids = [...new Set([...readFileSync('src/site/componentDocs.ts', 'utf8').matchAll(/^\s{2}\{?\s*id: '([a-z-]+)'/gm)].map((m) => m[1]))]

for (const theme of ['light', 'dark'] as const) {
  test(`doc pages have no serious accessibility violations (${theme})`, async ({ page }) => {
    test.setTimeout(180_000)
    await page.addInitScript((t) => localStorage.setItem('fp-theme', t), theme)
    // Check the settled page. Mid-fade text (entrance reveal) has partial opacity and reads as low contrast.
    await page.emulateMedia({ reducedMotion: 'reduce' })
    const found: string[] = []
    for (const id of ids) {
      await page.goto(`/#/docs/components/${id}`)
      await page.waitForTimeout(120)
      const r = await new AxeBuilder({ page }).disableRules(SKIP).analyze()
      for (const v of r.violations.filter((x) => x.impact === 'serious' || x.impact === 'critical')) {
        found.push(`${id}: ${v.id} (${v.impact}) ×${v.nodes.length} ${v.nodes[0]?.target.join(' ')}`)
      }
    }
    expect(found, found.join('\n')).toEqual([])
  })
}

// The site's own pages. Landmark and region rules are skipped: block and template previews are
// mock screens that sit inside the page, not page regions.
const PAGE_SKIP = ['region']
for (const theme of ['light', 'dark'] as const) {
  test(`site pages have no serious accessibility violations (${theme})`, async ({ page }) => {
    test.setTimeout(120_000)
    await page.addInitScript((t) => localStorage.setItem('fp-theme', t), theme)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    const found: string[] = []
    for (const route of ['', 'components', 'create', 'blocks', 'docs', 'templates']) {
      await page.goto(`/#/${route}`)
      await page.waitForTimeout(300)
      const r = await new AxeBuilder({ page }).disableRules(PAGE_SKIP).analyze()
      for (const v of r.violations) {
        found.push(`/${route}: ${v.id} (${v.impact}) ×${v.nodes.length} ${v.nodes[0]?.target.join(' ')}`)
      }
    }
    expect(found, found.join('\n')).toEqual([])
  })
}

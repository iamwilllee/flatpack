import { test, expect, type Page } from '@playwright/test'
import { readFileSync } from 'node:fs'

// Smoke tests for the built-on-Base-UI components. They guard against regressions when
// @base-ui/react is upgraded: every doc page renders without runtime errors, and the
// interactive primitives still open, close, select and toggle with mouse and keyboard.

const ids = [...readFileSync('src/site/componentDocs.ts', 'utf8').matchAll(/^\s{2}\{?\s*id: '([a-z-]+)'/gm)].map((m) => m[1])

function watch(page: Page) {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
  page.on('console', (m) => {
    if (m.type() !== 'error') return
    const text = m.text()
    if (/fonts\.googleapis|fonts\.gstatic|ERR_|Failed to load resource/.test(text)) return
    errors.push(`console: ${text}`)
  })
  return errors
}

test('doc pages render without runtime errors', async ({ page }) => {
  const errors = watch(page)
  const unique = [...new Set(ids)]
  expect(unique.length).toBeGreaterThan(50)
  for (const id of unique) {
    await page.goto(`/#/docs/components/${id}`)
    await page.waitForTimeout(80)
    const body = await page.locator('body').innerText()
    // Unknown ids fall back to the home page; skip those but never allow a blank page.
    expect(body.length, id).toBeGreaterThan(50)
  }
  for (const route of ['', 'components', 'create', 'blocks', 'docs', 'templates']) {
    await page.goto(`/#/${route}`)
    await page.waitForTimeout(150)
  }
  expect(errors).toEqual([])
})

test('a renamed doc id forwards to the new page', async ({ page }) => {
  await page.goto('/#/docs/components/dropdown')
  await expect(page).toHaveURL(/#\/docs\/components\/dropdown-menu$/)
  await expect(page.getByRole('heading', { level: 1, name: 'DropdownMenu' })).toBeVisible()
})

test.describe('interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/components')
    await page.waitForSelector('[data-slot="button"]')
  })

  test('checkbox and switch toggle', async ({ page }) => {
    const errors = watch(page)
    const cb = page.locator('[data-slot="checkbox-box"]').nth(1)
    const before = await cb.getAttribute('data-state')
    await cb.click()
    await expect(cb).not.toHaveAttribute('data-state', before ?? '')
    const sw = page.locator('[data-slot="switch-track"]').first()
    const swBefore = await sw.getAttribute('data-state')
    await sw.click()
    await expect(sw).not.toHaveAttribute('data-state', swBefore ?? '')
    expect(errors).toEqual([])
  })

  test('select opens, picks an item and closes', async ({ page }) => {
    const trigger = page.locator('[data-slot="select-trigger"]').first()
    await trigger.scrollIntoViewIfNeeded()
    await trigger.click()
    const content = page.locator('[data-slot="select-content"]')
    await expect(content).toBeVisible()
    const item = page.locator('[data-slot="select-item"]').nth(1)
    const label = (await item.innerText()).trim()
    await item.click()
    await expect(content).toBeHidden()
    await expect(trigger).toContainText(label)
  })

  test('dialog opens and Escape closes it', async ({ page }) => {
    const trigger = page.getByText('Open instructions', { exact: true }).first()
    await trigger.scrollIntoViewIfNeeded()
    await trigger.click()
    const dialog = page.locator('[data-slot="dialog-content"]').first()
    await expect(dialog).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
  })

  test('tabs switch panels with the keyboard', async ({ page }) => {
    const first = page.locator('[data-slot="tabs-trigger"]').first()
    await first.scrollIntoViewIfNeeded()
    await first.focus()
    await page.keyboard.press('ArrowRight')
    const second = page.locator('[data-slot="tabs-trigger"]').nth(1)
    await expect(second).toBeFocused()
  })

  test('dropdown menu opens and navigates by keyboard', async ({ page }) => {
    const trigger = page.locator('[data-slot="dropdown"] , [data-slot="button"][aria-haspopup="menu"]').first()
    await trigger.scrollIntoViewIfNeeded()
    await trigger.click()
    await expect(page.locator('[data-slot="dropdown-content"]').first()).toBeVisible()
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('Escape')
    await expect(page.locator('[data-slot="dropdown-content"]')).toHaveCount(0)
  })

  test('collapse expands', async ({ page }) => {
    const trigger = page.locator('[data-slot="collapse-trigger"]').first()
    await trigger.scrollIntoViewIfNeeded()
    const before = await trigger.getAttribute('aria-expanded')
    await trigger.click()
    await expect(trigger).not.toHaveAttribute('aria-expanded', before ?? '')
  })

  test('number input steps', async ({ page }) => {
    const field = page.locator('[data-slot="number-input-field"]').first()
    await field.scrollIntoViewIfNeeded()
    const before = await field.inputValue()
    await page.locator('[data-slot="number-input-step"]').nth(1).click()
    await expect(field).not.toHaveValue(before)
  })

  test('slider moves with the keyboard', async ({ page }) => {
    const input = page.locator('[data-slot="slider-thumb"] input').first()
    await input.scrollIntoViewIfNeeded()
    await input.focus()
    const before = await input.inputValue()
    await page.keyboard.press('ArrowRight')
    await expect(input).not.toHaveValue(before)
  })

  test('combobox filters and picks', async ({ page }) => {
    const input = page.locator('[data-slot="combobox-input"]').first()
    await input.scrollIntoViewIfNeeded()
    await input.click()
    await expect(page.locator('[data-slot="combobox-item"]').first()).toBeVisible()
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('Enter')
    await expect(page.locator('[data-slot="combobox-content"]')).toHaveCount(0)
  })

  test('command palette opens, filters and closes with Escape', async ({ page }) => {
    await page.goto('/#/docs/components/command-palette')
    await page.getByRole('button', { name: /^Search/ }).first().click()
    const palette = page.locator('[data-slot="command-content"]')
    await expect(palette).toBeVisible()
    await page.locator('[data-slot="command-input"]').fill('blocks')
    await expect(page.locator('[data-slot="command-item"]')).toHaveCount(1)
    await page.keyboard.press('Escape')
    await expect(palette).toBeHidden()
  })
})

test('themes swap accent and surface radius, in light and dark', async ({ page }) => {
  await page.goto('/#/components')
  await page.waitForSelector('[data-slot="button"]')
  const read = (theme: string | null, mode: 'light' | 'dark') =>
    page.evaluate(([t, m]) => {
      document.documentElement.setAttribute('data-theme', m as string)
      if (t) document.documentElement.setAttribute('data-fp-theme', t as string)
      else document.documentElement.removeAttribute('data-fp-theme')
      const s = getComputedStyle(document.documentElement)
      return { accent: s.getPropertyValue('--fp-accent').trim(), ink: s.getPropertyValue('--fp-ink').trim(), surface: s.getPropertyValue('--fp-radius-surface').trim() }
    }, [theme, mode])
  const base = await read(null, 'light')
  expect(base.accent).toBe(base.ink) // the default theme keeps ink as its only accent
  expect(base.surface).toBe('0')
  expect(await read('sage', 'light')).toMatchObject({ accent: '#236b4b', surface: '10px' })
  expect(await read('sage', 'dark')).toMatchObject({ accent: '#a6d4aa', surface: '10px' })
  expect(await read('catalog', 'dark')).toMatchObject({ accent: '#f5f5f5', surface: '4px' })
})

test('floating layers use their own radius, which themes and the square preset change', async ({ page }) => {
  await page.goto('/#/components')
  await page.waitForSelector('[data-slot="button"]')
  // Style probes: the radius comes from CSS, so no need to open each real layer.
  const radius = (attrs: Record<string, string>, slot: string) =>
    page.evaluate(([a, sl]) => {
      const host = document.createElement('div')
      for (const [k, v] of Object.entries(a as Record<string, string>)) host.setAttribute(k, v)
      const el = document.createElement('div')
      el.setAttribute('data-slot', sl as string)
      host.appendChild(el)
      document.body.appendChild(host)
      const r = getComputedStyle(el).borderTopLeftRadius
      host.remove()
      return r
    }, [attrs, slot] as const)
  for (const slot of ['dialog-content', 'alert-dialog-content', 'popover-content', 'select-content', 'dropdown-content', 'menu-content', 'toast', 'hover-card-content', 'command-content', 'combobox-content', 'date-picker-content']) {
    expect(await radius({}, slot), slot).toBe('20px')
  }
  expect(await radius({ 'data-fp-shape': 'square' }, 'dialog-content')).toBe('0px')
  expect(await radius({ 'data-fp-theme': 'catalog' }, 'dialog-content')).toBe('8px')
  expect(await radius({ 'data-fp-theme': 'sage' }, 'dialog-content')).toBe('16px')
  // The Composer frames pill controls, so it rounds like the floating layers; a Textarea holds only text and stays square.
  expect(await radius({}, 'composer')).toBe('20px')
  expect(await radius({ 'data-fp-shape': 'square' }, 'composer')).toBe('0px')
  expect(await radius({}, 'textarea')).toBe('0px')
  // Cards are content surfaces, not floating layers, so they stay square.
  expect(await radius({}, 'card')).toBe('0px')
})

test.describe('gallery themes and site blocks', () => {
  test('the theme switch restyles every block preview and survives in the URL', async ({ page }) => {
    await page.goto('/#/blocks')
    await page.waitForSelector('.fp-tune-scope')
    const accent = () => page.locator('.fp-tune-scope').first().evaluate((el) => getComputedStyle(el).getPropertyValue('--fp-accent').trim())
    const before = await accent()
    await page.getByRole('tab', { name: 'Sage' }).click()
    await expect.poll(accent).toBe('#236b4b')
    expect(before).not.toBe('#236b4b')
    expect(page.url()).toContain('theme=sage')
    await page.reload()
    await expect(page.getByRole('tab', { name: 'Sage' })).toHaveAttribute('aria-selected', 'true')
    await page.getByRole('tab', { name: 'Flatpack' }).click()
    expect(page.url()).not.toContain('theme=')
  })

  test('templates take the same theme switch', async ({ page }) => {
    await page.goto('/#/templates?theme=catalog')
    await page.waitForSelector('.fp-tune-scope')
    await expect(page.locator('.fp-tune-scope').first()).toHaveAttribute('data-fp-theme', 'catalog')
  })

  test('directory filters by search and category and offers a way out of empty results', async ({ page }) => {
    await page.goto('/#/blocks')
    const card = page.locator('[data-slot="card"]').filter({ hasText: 'Help centre' }).first()
    await card.scrollIntoViewIfNeeded()
    await card.getByRole('textbox', { name: 'Search articles' }).fill('password')
    await expect(card.getByText('Reset a forgotten password')).toBeVisible()
    await expect(card.getByText('Keyboard shortcuts')).toHaveCount(0)
    await card.getByRole('textbox', { name: 'Search articles' }).fill('zzzz')
    await expect(card.getByText('No matching articles')).toBeVisible()
    await card.getByRole('button', { name: 'Clear filters' }).click()
    await expect(card.getByText('Getting started with your first workspace')).toBeVisible()
  })

  test('workbench adds a task through the dialog and changes its status', async ({ page }) => {
    await page.goto('/#/blocks')
    const card = page.locator('[data-slot="card"]').filter({ hasText: 'Launchpad' }).first()
    await card.scrollIntoViewIfNeeded()
    await card.getByRole('button', { name: 'New task' }).click()
    const dialog = page.getByRole('dialog', { name: 'New task' })
    await dialog.getByLabel('Name').fill('Write the changelog')
    await dialog.getByRole('button', { name: 'Add task' }).click()
    await expect(dialog).toHaveCount(0)
    await expect(card.getByRole('button', { name: 'Write the changelog' })).toBeVisible()
    await expect(card.getByText('TASK DETAILS')).toBeVisible()
  })
})

test.describe('entrance reveal', () => {
  test('plays with the theme pace and is switched off by reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.goto('/#/docs/components/reveal')
    const heading = page.getByRole('heading', { name: 'Write it down once.' }).first()
    await expect(heading).toHaveAttribute('data-reveal', 'enter')
    await page.getByRole('button', { name: 'Replay' }).first().click()
    await expect(page.getByRole('heading', { name: 'Write it down once.' }).first()).toHaveCSS('animation-name', 'fp-reveal')
    // The theme decides the pace: Sage moves 14px over 560ms, the default theme only fades.
    const pace = (theme: string | null) => page.evaluate((t) => {
      const el = document.createElement('div')
      el.setAttribute('data-reveal', 'enter')
      if (t) el.setAttribute('data-fp-theme', t)
      document.body.appendChild(el)
      const s = getComputedStyle(el)
      const raw = s.getPropertyValue('--fp-reveal-duration').trim() // the minifier may write 240ms as .24s
      const out = { duration: Math.round(raw.endsWith('ms') ? parseFloat(raw) : parseFloat(raw) * 1000), distance: s.getPropertyValue('--fp-reveal-distance').trim() }
      el.remove()
      return out
    }, theme)
    expect(await pace(null)).toEqual({ duration: 240, distance: '0px' })
    expect(await pace('sage')).toEqual({ duration: 560, distance: '14px' })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.reload()
    await expect(page.getByRole('heading', { name: 'Write it down once.' }).first()).toHaveCSS('animation-name', 'none')
  })
})

test.describe('drawer, otp and composer', () => {
  test('drawer opens, Escape closes it, and a swipe down dismisses it', async ({ page }) => {
    const errors = watch(page)
    await page.goto('/#/docs/components/drawer')
    await page.getByRole('button', { name: 'Open drawer' }).first().click()
    const dialog = page.getByRole('dialog', { name: 'Add to cart' })
    await expect(dialog).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await page.getByRole('button', { name: 'Open drawer' }).first().click()
    await expect(dialog).toBeVisible()
    await page.waitForTimeout(700) // let the open transition finish; a swipe during it is ignored
    const box = (await dialog.boundingBox())!
    const x = box.x + box.width / 2
    const y = box.y + 30
    await page.mouse.move(x, y)
    await page.mouse.down()
    // Paced like a finger: Base UI measures velocity, so one jump is not a swipe.
    for (let i = 1; i <= 20; i++) {
      await page.mouse.move(x, y + i * 15)
      await page.waitForTimeout(16)
    }
    await page.mouse.up()
    await expect(dialog).toBeHidden()
    expect(errors).toEqual([])
  })

  test('otp field moves forward while typing and back on Backspace', async ({ page }) => {
    await page.goto('/#/docs/components/otp-field')
    const first = page.getByRole('textbox', { name: 'Verification code' }).first()
    await first.click()
    await page.keyboard.type('123')
    await expect(page.locator('[data-slot="otp-input"]').nth(2)).toHaveValue('3')
    await expect(page.locator('[data-slot="otp-input"]').nth(3)).toBeFocused()
    await page.keyboard.press('Backspace')
    await page.keyboard.press('Backspace')
    await expect(page.locator('[data-slot="otp-input"]').nth(2)).toHaveValue('')
  })

  test('composer grows with its text and sends on Enter', async ({ page }) => {
    await page.goto('/#/docs/components/composer')
    const box = page.getByRole('textbox', { name: 'Message' }).first()
    const h0 = (await box.boundingBox())!.height
    await box.click()
    await page.keyboard.type('one')
    await page.keyboard.press('Shift+Enter')
    await page.keyboard.type('two')
    await page.keyboard.press('Shift+Enter')
    await page.keyboard.type('three')
    expect((await box.boundingBox())!.height).toBeGreaterThan(h0)
    await page.keyboard.press('Enter')
    await expect(box).toHaveValue('')
    await expect(page.getByText('one\ntwo\nthree').first()).toBeVisible()
  })
})

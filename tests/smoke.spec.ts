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

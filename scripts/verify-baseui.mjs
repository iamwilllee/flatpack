/* Base UI migration verification — run in browser console via ego-browser */
(async () => {
  const results = []
  const log = (name, ok, detail) => results.push({ name, ok, detail })

  const goto = async (hash) => {
    location.hash = hash
    await new Promise(r => setTimeout(r, 600))
  }

  // button: data-slot present
  await goto('#/components')
  const btn = document.querySelector('[data-slot="button"]')
  log('button has data-slot', !!btn)

  // checkbox toggle
  const cb = document.querySelectorAll('[data-slot="checkbox-box"]')[1]
  const cbBefore = cb?.getAttribute('data-state')
  cb?.click()
  await new Promise(r => setTimeout(r, 150))
  const cbAfter = document.querySelectorAll('[data-slot="checkbox-box"]')[1]?.getAttribute('data-state')
  log('checkbox toggles', cbBefore !== cbAfter, `${cbBefore} -> ${cbAfter}`)

  // switch toggle
  const sw = document.querySelector('[data-slot="switch-track"]')
  const swBefore = sw?.getAttribute('data-state')
  sw?.click()
  await new Promise(r => setTimeout(r, 150))
  const swAfter = document.querySelector('[data-slot="switch-track"]')?.getAttribute('data-state')
  log('switch toggles', swBefore !== swAfter, `${swBefore} -> ${swAfter}`)

  // select open
  const sel = document.querySelector('[data-slot="select-trigger"]')
  sel?.click()
  await new Promise(r => setTimeout(r, 200))
  const selContent = document.querySelector('[data-slot="select-content"]')
  log('select opens', !!selContent && !selContent.hidden)
  selContent && document.body.click()

  // dialog open/close via ESC
  await goto('#/components')
  const dlgTrigger = [...document.querySelectorAll('[data-slot="button"]')].find(b => b.textContent?.includes('打开操作说明'))
  dlgTrigger?.click()
  await new Promise(r => setTimeout(r, 250))
  const dlgOpen = !!document.querySelector('[data-slot="dialog-content"]')
  log('dialog opens', dlgOpen)
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
  await new Promise(r => setTimeout(r, 250))
  log('dialog ESC closes', !document.querySelector('[data-slot="dialog-content"]'))

  // tabs switch
  await goto('#/components')
  const tab = [...document.querySelectorAll('[data-slot="tabs-trigger"]')].find(t => t.textContent?.includes('评价'))
  tab?.click()
  await new Promise(r => setTimeout(r, 150))
  log('tabs switch', tab?.getAttribute('data-active') === 'true', tab?.getAttribute('data-active'))

  return results
})()

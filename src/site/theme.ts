import { useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

const KEY = 'fp-theme'
const EVENT = 'fp-themechange'

function saved(): Theme | null {
  try {
    const t = localStorage.getItem(KEY)
    return t === 'light' || t === 'dark' ? t : null
  } catch { return null }
}

function system(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/** index.html already wrote data-theme before first paint; read it back. */
function current(): Theme {
  const a = document.documentElement.getAttribute('data-theme')
  return a === 'dark' || a === 'light' ? a : saved() ?? system()
}

/** Apply and remember an explicit choice. */
export function setTheme(t: Theme) {
  document.documentElement.setAttribute('data-theme', t)
  try { localStorage.setItem(KEY, t) } catch { /* private mode */ }
  window.dispatchEvent(new CustomEvent(EVENT))
}

/** Forget the explicit choice and follow the system again. */
export function followSystem() {
  try { localStorage.removeItem(KEY) } catch { /* private mode */ }
  document.documentElement.setAttribute('data-theme', system())
  window.dispatchEvent(new CustomEvent(EVENT))
}

/** Whether the user picked a theme, or it follows the system. */
export function hasSavedTheme() {
  return saved() !== null
}

/** Theme state that follows the system until the user picks one. */
export function useTheme() {
  const [theme, setState] = useState<Theme>(current)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onSystem = () => {
      if (saved()) return
      document.documentElement.setAttribute('data-theme', system())
      setState(system())
    }
    const onChange = () => setState(current())
    mq.addEventListener('change', onSystem)
    window.addEventListener(EVENT, onChange)
    return () => {
      mq.removeEventListener('change', onSystem)
      window.removeEventListener(EVENT, onChange)
    }
  }, [])

  return { theme, setTheme, toggle: () => setTheme(theme === 'dark' ? 'light' : 'dark') }
}

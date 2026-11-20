// Create-page settings <-> preset code, driven by tokens/flatpack.tokens.json.
// The same format is decoded by scripts/build-tokens.mjs (--preset / overrides.json):
//   fp1-<one option code per dial, in dial order>
import tokens from '../../tokens/flatpack.tokens.json'

export type DialOption = { value: string; code: string; zh: string; en: string; vars: Record<string, string>; webfont?: string; gray?: Record<string, string>; zhDesc?: string; enDesc?: string; light?: Record<string, string>; dark?: Record<string, string> }
export type Dial = { id: string; zh: string; en: string; default: string; optional?: boolean; zhNote?: string; enNote?: string; options: DialOption[] }
export type Preset = { id: string; zh: string; en: string; zhDesc: string; enDesc: string; values: Record<string, string> }
export type Values = Record<string, string>

export const DIALS = tokens.tune.dials as unknown as Dial[]
export const PRESETS = tokens.tune.presets as unknown as Preset[]
export const DEFAULTS: Values = Object.fromEntries(DIALS.map((d) => [d.id, d.default]))

const option = (d: Dial, v: string) => d.options.find((o) => o.value === v)

export function encodePreset(values: Values) {
  return ['fp1', ...DIALS.map((d) => (option(d, values[d.id]) ?? option(d, d.default)!).code)].join('-')
}

export function decodePreset(code: string): Values | null {
  const parts = code.trim().split('-')
  // Codes made before a dial existed are shorter; missing dials take their default.
  if (parts.shift() !== 'fp1' || parts.length > DIALS.length) return null
  const out: Values = {}
  for (let i = 0; i < DIALS.length; i++) {
    const o = i < parts.length ? DIALS[i].options.find((x) => x.code === parts[i]) : DIALS[i].options.find((x) => x.value === DIALS[i].default)
    if (!o) return null
    out[DIALS[i].id] = o.value
  }
  return out
}

/** Data attributes that switch a subtree to these values (see the tune block in flatpack.css). */
export function scopeAttrs(values: Values) {
  return Object.fromEntries(DIALS.filter((d) => values[d.id] !== d.default).map((d) => [`data-fp-${d.id}`, values[d.id]]))
}

/** Light and dark palettes of the chosen theme, for the CSS export. Empty for the default theme. */
export function themeColors(values: Values) {
  const o = option(DIALS.find((d) => d.id === 'theme')!, values.theme)
  return o?.light && o.dark ? { light: o.light, dark: o.dark } : null
}

/** Every CSS variable the chosen options set, for a plain :root override. */
export function cssVars(values: Values) {
  const out: Record<string, string> = {}
  for (const d of DIALS) {
    const o = option(d, values[d.id])
    if (!o) continue
    if (o.gray) for (const [k, v] of Object.entries(o.gray)) out[`--fp-gray-${k}`] = v
    for (const [k, v] of Object.entries(o.vars)) out[`--fp-${k}`] = v
  }
  return out
}

/** Google Fonts URLs needed by the chosen options. */
export function webfonts(values: Values) {
  return DIALS.map((d) => option(d, values[d.id])?.webfont).filter((w): w is string => !!w)
    .map((w) => `https://fonts.googleapis.com/css2?family=${w}&display=swap`)
}

export function matchPreset(values: Values) {
  return PRESETS.find((p) => DIALS.every((d) => (p.values[d.id] ?? d.default) === values[d.id]))?.id ?? null
}

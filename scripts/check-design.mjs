// Guard the design rules in source code. Exits non-zero on any violation.
// Run: node scripts/check-design.mjs
//
// Checks every .ts/.tsx file under src/ for:
//   - raw font sizes and spacing in inline styles (use var(--fp-text-*) / var(--fp-space-*))
//   - inline border radius other than 0 or 50% (shapes come from --fp-radius-control / --fp-radius-surface in flatpack.css)
//   - box shadows (only floating layers have one, and that lives in flatpack.css)
//   - positive letter spacing and uppercase transforms
//   - hex / rgb colors (all color comes from tokens)
//   - var(--fp-*) references that no token defines
//   - fp-* classes in src/components that flatpack.css does not define (library code ships without site.css)
// Code samples shown to users (template literals after `code:` and the CODE map) are skipped.
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const SRC = path.join(ROOT, 'src')
const css = fs.readFileSync(path.join(SRC, 'styles/flatpack.css'), 'utf8')
const defined = new Set([...css.matchAll(/(--fp-[a-z0-9-]+)\s*:/g)].map((m) => m[1]))
// Runtime-only variables set by components themselves.
for (const v of ['--fp-beam-start', '--fp-beam-len']) defined.add(v)

// Files allowed to carry raw values, with the reason.
const ALLOW = {
  'components/ui/border-beam.tsx': 'optional decorative component; geometry is computed',
  'components/ui/masonry.tsx': 'layout engine; gaps are props',
  'site/photos.ts': 'photo URLs only',
}

const SPACE = 'gap|rowGap|columnGap|padding|paddingTop|paddingBottom|paddingLeft|paddingRight|paddingInline|paddingBlock|margin|marginTop|marginBottom|marginLeft|marginRight|marginInline|marginBlock'
const RULES = [
  { name: 'raw font size', re: /fontSize: ?(?:[^,}\n]*?\?\s*)?(\d+(\.\d+)?|'\d+px')(?![\w%])/ },
  { name: 'raw spacing', re: new RegExp(`\\b(?:${SPACE}): ?(?:[^,}\\n]*?\\?\\s*)?(?:[1-9]\\d*(?![\\w.%])|'[^']*\\b[1-9]\\d*px)`) },
  { name: 'raw spacing', re: new RegExp(`\\b(?:${SPACE}): ?'(?:[^']*\\s)?[1-9]\\d*(?:\\s[^']*)?'`) },
  { name: 'non-zero radius', re: /borderRadius:\s*(?!\s|0\b|'50%')/ },
  { name: 'box shadow', re: /boxShadow:/ },
  { name: 'letter spacing', re: /letterSpacing:\s*(?!\s|'var\(--fp-tracking-display\)')/ },
  { name: 'uppercase', re: /textTransform: ?'uppercase'/ },
  { name: 'control height set by hand (use size="sm|md|lg")', re: /<(Input|Button|Select|Segmented|NumberInput|Combobox|DatePicker|DialogTrigger|SheetTrigger|PopoverTrigger|DropdownMenuTrigger)\b[^>]*style=\{\{[^}]*\b(height|minHeight): ?\d/ },
  // icon-only buttons: square/round icon size (not text padding) and an accessible name
  { name: 'icon-only button needs size="icon" or "icon-sm"', re: /<Button\b(?![^\n]*?size=\\?"icon)((?:[^<\n]|<(?!\/?Button))*?)>\s*(\{[^{}\n]*\?\s*)?<[A-Z]\w* size=\{\d+\} \/>\s*(:\s*<[A-Z]\w* size=\{\d+\} \/>\s*\})?\s*<\/Button>/ },
  { name: 'icon-only button needs aria-label or title', re: /<Button\b(?![^\n]*?(aria-label|title)=)((?:[^<\n]|<(?!\/?Button))*?)>\s*(\{[^{}\n]*\?\s*)?<[A-Z]\w* size=\{\d+\} \/>\s*(:\s*<[A-Z]\w* size=\{\d+\} \/>\s*\})?\s*<\/Button>/ },
  { name: 'raw color', re: /#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b(?!\w)|rgba?\(/ },
]

const problems = []
;(function walk(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f)
    if (fs.statSync(p).isDirectory()) { walk(p); continue }
    if (!/\.tsx?$/.test(f)) continue
    const rel = path.relative(SRC, p)
    const lines = fs.readFileSync(p, 'utf8').split('\n')
    let inSample = false
    lines.forEach((line, i) => {
      // skip multi-line code samples: `code: \`` … closing backtick
      if (inSample) { if (/`/.test(line)) inSample = false; return }
      if (/code: `/.test(line) && (line.match(/`/g) || []).length % 2 === 1) { inSample = true; return }
      if (/^\s*"cmp-/.test(line) || /code: `/.test(line) || rel === 'site/componentDocs.ts') return
      for (const m of line.matchAll(/var\((--fp-[a-z0-9-]+)/g)) {
        if (!defined.has(m[1])) problems.push(`${rel}:${i + 1}  undefined token ${m[1]}`)
      }
      if (ALLOW[rel]) return
      for (const r of RULES) if (r.re.test(line)) problems.push(`${rel}:${i + 1}  ${r.name}: ${line.trim().slice(0, 140)}`)
    })
  }
})(SRC)

// Library code ships without site.css, so every fp-* class used under src/components must be
// defined in flatpack.css. An animation name counts when flatpack.css has its @keyframes; an id
// built from a prefix (`fp-beam-${i}`) is not a class and does not match.
;(function walkLib(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f)
    if (fs.statSync(p).isDirectory()) { walkLib(p); continue }
    if (!/\.tsx?$/.test(f)) continue
    const rel = path.relative(SRC, p)
    fs.readFileSync(p, 'utf8').split('\n').forEach((line, i) => {
      for (const [name] of line.matchAll(/(?<![\w-])fp-[a-z0-9-]*[a-z0-9](?![\w-])/g)) {
        if (new RegExp(`\\.${name}(?![\\w-])`).test(css) || new RegExp(`@keyframes\\s+${name}(?![\\w-])`).test(css)) continue
        problems.push(`${rel}:${i + 1}  class ${name} is not in styles/flatpack.css (library code cannot rely on site.css)`)
      }
    })
  }
})(path.join(SRC, 'components'))

if (problems.length) {
  console.error(problems.join('\n'))
  console.error(`\n${problems.length} design rule violation(s).`)
  process.exit(1)
}
console.log('design check passed')

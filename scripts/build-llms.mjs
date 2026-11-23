// Machine- and crawler-readable docs, generated from src/site/componentDocs.ts into dist/.
// Run after `vite build`: node scripts/build-llms.mjs
//
//   dist/llms.txt            index for LLMs (llmstxt.org format)
//   dist/llms-full.txt       every component in one file
//   dist/docs/<id>.md        one component as plain Markdown
//   dist/docs/<id>/index.html  static page with title, description and usage for crawlers and link
//                            previews. It sends people on to the app route #/docs/components/<id>.
//   dist/sitemap.xml, dist/robots.txt
import fs from 'node:fs'
import path from 'node:path'
import { transform } from 'esbuild'

const ROOT = path.resolve(import.meta.dirname, '..')
const DIST = path.join(ROOT, 'dist')
const BASE = (process.env.FLATPACK_ORIGIN || 'https://iamwilllee.github.io/flatpack').replace(/\/$/, '')

if (!fs.existsSync(DIST)) {
  console.error('dist/ not found. Run `vite build` first.')
  process.exit(1)
}

// componentDocs.ts has no imports, so strip its types and load it as a module.
const src = fs.readFileSync(path.join(ROOT, 'src/site/componentDocs.ts'), 'utf8')
const { code } = await transform(src, { loader: 'ts', format: 'esm' })
const { docs } = await import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'))

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const cell = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ')
const fileOf = (d) => d.importPath.split('/').pop()

function markdown(d) {
  const out = []
  out.push(`# ${d.title}`, '', `Category: ${d.categoryEn ?? d.category}`, '', d.descriptionEn, '')
  out.push('## Install', '', '```bash', `npx shadcn@latest add ${BASE}/r/${fileOf(d)}.json`, '```', '')
  out.push('## Usage', '', '```tsx', d.usage, '```', '')
  for (const ex of d.examples) out.push(`## ${ex.titleEn ?? ex.title}`, '', '```tsx', ex.code, '```', '')
  out.push('## API', '', '| Prop | Type | Default | Description |', '|---|---|---|---|')
  for (const r of d.api) out.push(`| \`${cell(r.prop)}\` | \`${cell(r.type)}\` | ${r.default ? `\`${cell(r.default)}\`` : ''} | ${cell(r.descEn ?? r.desc)} |`)
  out.push('')
  return out.join('\n')
}

function page(d) {
  const url = `${BASE}/docs/${d.id}/`
  const target = `../../#/docs/components/${d.id}`
  const title = `${d.title} · Flatpack UI`
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(d.descriptionEn)}" />
<link rel="canonical" href="${url}" />
<link rel="alternate" type="text/markdown" href="${BASE}/docs/${d.id}.md" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(d.descriptionEn)}" />
<meta property="og:url" content="${url}" />
<meta property="og:type" content="website" />
<noscript><meta http-equiv="refresh" content="0; url=${target}" /></noscript>
<script>location.replace(${JSON.stringify(target)})</script>
</head>
<body>
<main>
<h1>${esc(d.title)}</h1>
<p>${esc(d.descriptionEn)}</p>
<pre><code>${esc(d.usage)}</code></pre>
<p><a href="${target}">Open the live docs</a> · <a href="../${d.id}.md">Markdown</a></p>
</main>
</body>
</html>
`
}

fs.mkdirSync(path.join(DIST, 'docs'), { recursive: true })
const full = []
for (const d of docs) {
  const md = markdown(d)
  fs.writeFileSync(path.join(DIST, 'docs', `${d.id}.md`), md)
  fs.mkdirSync(path.join(DIST, 'docs', d.id), { recursive: true })
  fs.writeFileSync(path.join(DIST, 'docs', d.id, 'index.html'), page(d))
  full.push(md)
}

const groups = new Map()
for (const d of docs) {
  const g = d.categoryEn ?? d.category
  if (!groups.has(g)) groups.set(g, [])
  groups.get(g).push(d)
}
const index = [
  '# Flatpack UI',
  '',
  '> A React 19 + Base UI + Tailwind CSS 4 component library. Shape by role, black and white, whitespace. Copy the source into your project; one stylesheet themes everything through data-slot attributes.',
  '',
  `Install a component with the shadcn CLI: \`npx shadcn@latest add ${BASE}/r/<name>.json\`. Install the theme first: \`npx shadcn@latest add ${BASE}/r/flatpack-theme.json\`.`,
  '',
  '## Guides',
  '',
  `- [Design language](${BASE}/#/docs): the three rules, tokens, themes and presets`,
  `- [Agent skill](https://github.com/iamwilllee/flatpack/blob/main/skills/flatpack-ui/SKILL.md): component list, imports and constraints for coding agents`,
  `- [Full documentation in one file](${BASE}/llms-full.txt)`,
  '',
]
for (const [g, list] of groups) {
  index.push(`## ${g}`, '')
  for (const d of list) index.push(`- [${d.title}](${BASE}/docs/${d.id}.md): ${d.descriptionEn.split(/(?<=\.)\s/)[0]}`)
  index.push('')
}
fs.writeFileSync(path.join(DIST, 'llms.txt'), index.join('\n'))
fs.writeFileSync(path.join(DIST, 'llms-full.txt'), `# Flatpack UI: full documentation\n\n${full.join('\n---\n\n')}`)

const urls = [`${BASE}/`, ...docs.map((d) => `${BASE}/docs/${d.id}/`)]
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n')}\n</urlset>\n`)
fs.writeFileSync(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${BASE}/sitemap.xml\n`)

console.log(`Wrote llms.txt, llms-full.txt, sitemap.xml and ${docs.length} component pages (.md + index.html) to dist/`)

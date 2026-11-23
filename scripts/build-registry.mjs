// Build shadcn-compatible registry from the component library.
// Run: node scripts/build-registry.mjs
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const UI_DIR = path.join(ROOT, 'src/components/ui')
const OUT_R = path.join(ROOT, 'public/r')
const BASE = process.env.FLATPACK_ORIGIN || 'https://iamwilllee.github.io/flatpack'

fs.mkdirSync(OUT_R, { recursive: true })

const SKIP = new Set(['primitives.tsx'])
const files = fs.readdirSync(UI_DIR).filter((f) => f.endsWith('.tsx') && !SKIP.has(f)).sort()

const items = []
items.push({
  name: 'flatpack-theme',
  type: 'registry:file',
  title: 'Flatpack Theme',
  description: 'The whole look in one stylesheet: square corners, black and white, whitespace.',
  files: [{ path: 'src/styles/flatpack.css', type: 'registry:file', target: 'src/styles/flatpack.css', content: fs.readFileSync(path.join(ROOT, 'src/styles/flatpack.css'), 'utf8') }],
})

for (const file of files) {
  const name = file.replace(/\.tsx$/, '')
  const content = fs.readFileSync(path.join(UI_DIR, file), 'utf8')
  const title = name.replace(/(^|-)(\w)/g, (_, __, c) => ' ' + c.toUpperCase()).trim()
  const deps = []
  if (/@base-ui\/react/.test(content)) deps.push('@base-ui/react')
  if (/lucide-react/.test(content)) deps.push('lucide-react')
  if (/clsx|cn\(/.test(content)) deps.push('clsx')
  const registryDeps = []
  if (/from '@\/lib\/utils'/.test(content)) registryDeps.push('lib/utils')
  for (const m of content.matchAll(/from '@\/components\/ui\/([\w-]+)'/g)) if (!registryDeps.includes(m[1])) registryDeps.push(m[1])
  const item = {
    name,
    type: 'registry:ui',
    title,
    description: `Flatpack UI ${title} component.`,
    dependencies: deps,
    registryDependencies: registryDeps,
    files: [{ path: `src/components/ui/${file}`, type: 'registry:ui', content }],
  }
  items.push(item)

  const single = { $schema: 'https://ui.shadcn.com/schema/registry-item.json', ...item }
  fs.writeFileSync(path.join(OUT_R, `${name}.json`), JSON.stringify(single, null, 2))
}

// utils, needed by most components
const utilsContent = fs.readFileSync(path.join(ROOT, 'src/lib/utils.ts'), 'utf8')
const utilsItem = {
  name: 'lib/utils', type: 'registry:lib', title: 'Utils',
  description: 'cn() helper for Flatpack UI.',
  dependencies: ['clsx', 'tailwind-merge'],
  files: [{ path: 'src/lib/utils.ts', type: 'registry:lib', content: utilsContent }],
}
items.push(utilsItem)
fs.writeFileSync(path.join(OUT_R, 'utils.json'), JSON.stringify({ $schema: 'https://ui.shadcn.com/schema/registry-item.json', ...utilsItem }, null, 2))

const registry = { $schema: 'https://ui.shadcn.com/schema/registry.json', name: 'flatpack-ui', homepage: BASE, items }
fs.writeFileSync(path.join(ROOT, 'registry.json'), JSON.stringify(registry, null, 2))
fs.writeFileSync(path.join(ROOT, 'public/registry.json'), JSON.stringify(registry, null, 2))

// Figma tokens are generated (and copied to public/) by scripts/build-tokens.mjs.

console.log(`Built registry with ${items.length} items → registry.json + public/r/`)

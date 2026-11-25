// Build shadcn-compatible registry from the component library.
// Run: node scripts/build-registry.mjs
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const UI_DIR = path.join(ROOT, 'src/components/ui')
const OUT_R = path.join(ROOT, 'public/r')
const BASE = process.env.FLATPACK_ORIGIN || 'https://iamwilllee.github.io/flatpack'

fs.mkdirSync(OUT_R, { recursive: true })

// npm dependencies are emitted as name@range with the range package.json declares, so users get the
// versions this repo is built and tested against instead of whatever is latest.
const PKG = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'))
const DECLARED = { ...PKG.peerDependencies, ...PKG.dependencies }
function pin(deps, item) {
  return deps.map((dep) => {
    const range = DECLARED[dep]
    if (!range) throw new Error(`build-registry: ${item} needs the npm package "${dep}", but package.json does not declare it in dependencies. Add it there so the registry can pin its version.`)
    return `${dep}@${range}`
  })
}

const files = fs.readdirSync(UI_DIR).filter((f) => f.endsWith('.tsx')).sort()

const items = []
const themeItem = {
  name: 'flatpack-theme',
  type: 'registry:file',
  title: 'Flatpack Theme',
  description: 'The whole look in one stylesheet: square corners, black and white, whitespace.',
  files: [{ path: 'src/styles/flatpack.css', type: 'registry:file', target: 'src/styles/flatpack.css', content: fs.readFileSync(path.join(ROOT, 'src/styles/flatpack.css'), 'utf8') }],
}
items.push(themeItem)
fs.writeFileSync(path.join(OUT_R, 'flatpack-theme.json'), JSON.stringify({ $schema: 'https://ui.shadcn.com/schema/registry-item.json', ...themeItem }, null, 2))

for (const file of files) {
  const name = file.replace(/\.tsx$/, '')
  const content = fs.readFileSync(path.join(UI_DIR, file), 'utf8')
  const title = name.replace(/(^|-)(\w)/g, (_, __, c) => ' ' + c.toUpperCase()).trim()
  const deps = []
  if (/@base-ui\/react/.test(content)) deps.push('@base-ui/react')
  if (/lucide-react/.test(content)) deps.push('lucide-react')
  if (/clsx|cn\(/.test(content)) deps.push('clsx')
  // Full URLs: a bare name such as "table" would make the shadcn CLI fetch shadcn's own component.
  const registryDeps = []
  if (/from '@\/lib\/utils'/.test(content)) registryDeps.push(`${BASE}/r/utils.json`)
  for (const m of content.matchAll(/from '@\/components\/ui\/([\w-]+)'/g)) {
    const url = `${BASE}/r/${m[1]}.json`
    if (!registryDeps.includes(url)) registryDeps.push(url)
  }
  const item = {
    name,
    type: 'registry:ui',
    title,
    description: `Flatpack UI ${title} component.`,
    dependencies: pin(deps, name),
    registryDependencies: registryDeps,
    files: [{ path: `src/components/ui/${file}`, type: 'registry:ui', content }],
  }
  items.push(item)

  const single = { $schema: 'https://ui.shadcn.com/schema/registry-item.json', ...item }
  fs.writeFileSync(path.join(OUT_R, `${name}.json`), JSON.stringify(single, null, 2))
}

// Blocks: whole screens built from the components. They install into components/blocks/.
const BLOCK_DIR = path.join(ROOT, 'src/components/blocks')
const BLOCKS = {
  'login-01': 'Sign-in screen: brand panel and a validated email and password form.',
  'settings-01': 'Account settings: section list and a profile form with switches and a toast on save.',
  'data-table-01': 'Orders list: search, status chips with counts, a sortable and selectable table, bulk delete.',
  'chat-01': 'Assistant screen: conversation list, messages and a Composer with stop.',
}
for (const file of fs.readdirSync(BLOCK_DIR).filter((f) => f.endsWith('.tsx')).sort()) {
  const name = file.replace(/\.tsx$/, '')
  if (!BLOCKS[name]) throw new Error(`Add a description for block ${name} in build-registry.mjs`)
  const content = fs.readFileSync(path.join(BLOCK_DIR, file), 'utf8')
  const deps = []
  if (/@base-ui\/react/.test(content)) deps.push('@base-ui/react')
  if (/lucide-react/.test(content)) deps.push('lucide-react')
  const registryDeps = ['flatpack-theme']
  for (const m of content.matchAll(/from '@\/components\/ui\/([\w-]+)'/g)) if (!registryDeps.includes(m[1])) registryDeps.push(m[1])
  const item = {
    name,
    type: 'registry:block',
    title: name.replace(/(^|-)(\w)/g, (_, __, c) => ' ' + c.toUpperCase()).trim(),
    description: BLOCKS[name],
    dependencies: pin(deps, name),
    registryDependencies: registryDeps.map((d) => (d === 'flatpack-theme' ? `${BASE}/r/flatpack-theme.json` : `${BASE}/r/${d}.json`)),
    files: [{ path: `src/components/blocks/${file}`, type: 'registry:block', target: `components/blocks/${file}`, content }],
  }
  items.push(item)
  fs.writeFileSync(path.join(OUT_R, `${name}.json`), JSON.stringify({ $schema: 'https://ui.shadcn.com/schema/registry-item.json', ...item }, null, 2))
}

// utils, needed by most components
const utilsContent = fs.readFileSync(path.join(ROOT, 'src/lib/utils.ts'), 'utf8')
const utilsItem = {
  name: 'lib/utils', type: 'registry:lib', title: 'Utils',
  description: 'cn() helper for Flatpack UI.',
  dependencies: pin(['clsx', 'tailwind-merge'], 'lib/utils'),
  files: [{ path: 'src/lib/utils.ts', type: 'registry:lib', content: utilsContent }],
}
items.push(utilsItem)
fs.writeFileSync(path.join(OUT_R, 'utils.json'), JSON.stringify({ $schema: 'https://ui.shadcn.com/schema/registry-item.json', ...utilsItem }, null, 2))

const registry = { $schema: 'https://ui.shadcn.com/schema/registry.json', name: 'flatpack-ui', homepage: BASE, items }
fs.writeFileSync(path.join(ROOT, 'registry.json'), JSON.stringify(registry, null, 2))
fs.writeFileSync(path.join(ROOT, 'public/registry.json'), JSON.stringify(registry, null, 2))

// Figma tokens are generated (and copied to public/) by scripts/build-tokens.mjs.

console.log(`Built registry with ${items.length} items → registry.json + public/r/`)

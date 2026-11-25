// End-to-end check of what a user does: install Flatpack into a fresh Vite project with the shadcn CLI,
// then type-check and build it.
//   1. builds the registry into a temp folder, with its URLs pointing at a local server
//   2. creates an empty Vite + React + Tailwind 4 project
//   3. runs `shadcn add` for the theme, a few components and a block
//   4. imports them from an entry file, runs tsc and vite build, and checks the npm versions that were installed
// It needs the network (npm install, shadcn from npm) and takes a few minutes, so it is not part of `npm test`.
// Run: npm run test:registry     Keep the project to look at it: KEEP=1 npm run test:registry
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import http from 'node:http'
import { spawn } from 'node:child_process'

const ROOT = path.resolve(import.meta.dirname, '..')
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'flatpack-e2e-'))
const SITE = path.join(TMP, 'site', 'flatpack')
const APP = path.join(TMP, 'app')
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'))

// Async on purpose: the local registry server runs in this process, so a blocking spawn would starve it.
function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: 'pipe', ...opts })
    let out = ''
    child.stdout.on('data', (d) => (out += d))
    child.stderr.on('data', (d) => (out += d))
    child.on('close', (code) => {
      if (code === 0) return resolve(out)
      console.error(`$ ${cmd} ${args.join(' ')}\n${out}`)
      reject(new Error(`${cmd} ${args[0]} failed`))
    })
  })
}
// True when version v satisfies a "^x.y.z" or "x.y.z" range from package.json (same major, not older).
function inCaretRange(v, range) {
  const n = (x) => x.replace(/^[\^~]/, '').split('.').map(Number)
  const [a, b] = [n(v), n(range)]
  if (a[0] !== b[0]) return false
  return a[1] > b[1] || (a[1] === b[1] && a[2] >= b[2])
}
const step = (s) => console.log(`\n== ${s}`)
const write = (file, text) => { fs.mkdirSync(path.dirname(path.join(APP, file)), { recursive: true }); fs.writeFileSync(path.join(APP, file), text) }

// Serve TMP/site; the registry lives under /flatpack like the real GitHub Pages site.
const server = http.createServer((req, res) => {
  const file = path.join(TMP, 'site', decodeURIComponent(new URL(req.url, 'http://x').pathname))
  if (!file.startsWith(path.join(TMP, 'site')) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404).end(); return }
  res.writeHead(200, { 'content-type': 'application/json' }).end(fs.readFileSync(file))
})
await new Promise((ok) => server.listen(0, '127.0.0.1', ok))
const ORIGIN = `http://127.0.0.1:${server.address().port}/flatpack`

let failed = null
try {
  step('build the registry')
  await run('node', ['scripts/build-registry.mjs'], { cwd: ROOT, env: { ...process.env, FLATPACK_ORIGIN: ORIGIN, FLATPACK_OUT: SITE } })

  step('create an empty Vite project')
  write('package.json', JSON.stringify({
    name: 'flatpack-e2e', private: true, type: 'module',
    dependencies: { react: pkg.dependencies.react, 'react-dom': pkg.dependencies['react-dom'] },
    devDependencies: {
      '@tailwindcss/vite': pkg.devDependencies['@tailwindcss/vite'], tailwindcss: pkg.devDependencies.tailwindcss,
      '@types/react': pkg.devDependencies['@types/react'], '@types/react-dom': pkg.devDependencies['@types/react-dom'],
      '@vitejs/plugin-react': pkg.devDependencies['@vitejs/plugin-react'], typescript: pkg.devDependencies.typescript, vite: pkg.devDependencies.vite,
    },
  }, null, 2))
  write('tsconfig.json', JSON.stringify({
    compilerOptions: { target: 'ES2022', lib: ['ES2022', 'DOM', 'DOM.Iterable'], module: 'ESNext', moduleResolution: 'bundler', jsx: 'react-jsx', strict: true, skipLibCheck: true, noEmit: true, baseUrl: '.', paths: { '@/*': ['./src/*'] } },
    include: ['src'],
  }, null, 2))
  write('vite.config.ts', `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'
export default defineConfig({ plugins: [react(), tailwindcss()], resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } } })
`)
  write('index.html', '<!doctype html><html><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>')
  write('src/index.css', '@import "tailwindcss";\n')
  write('src/main.tsx', "import './index.css'\nconsole.log('empty')\n")
  write('components.json', JSON.stringify({
    $schema: 'https://ui.shadcn.com/schema.json', style: 'new-york', rsc: false, tsx: true,
    tailwind: { config: '', css: 'src/index.css', baseColor: 'neutral', cssVariables: true },
    aliases: { components: '@/components', utils: '@/lib/utils', ui: '@/components/ui', lib: '@/lib', hooks: '@/hooks' },
  }, null, 2))
  await run('npm', ['install', '--no-audit', '--no-fund'], { cwd: APP })

  step('shadcn add: theme, components, block')
  for (const name of ['flatpack-theme', 'button', 'sidebar', 'primitives', 'dropdown-menu', 'data-table-01', 'login-01']) {
    await run('npx', ['--yes', 'shadcn@latest', 'add', `${ORIGIN}/r/${name}.json`, '--yes', '--overwrite'], { cwd: APP })
    console.log(`  added ${name}`)
  }

  step('use them, type-check, build')
  // The theme file brings its own @import "tailwindcss", as the docs tell users.
  write('src/index.css', '@import "./styles/flatpack.css";\n')
  write('src/main.tsx', `import './index.css'
import { createRoot } from 'react-dom/client'
import { Button } from '@/components/ui/button'
import { Sidebar, SidebarSection, SidebarItem } from '@/components/ui/sidebar'
import { Kicker, Separator } from '@/components/ui/primitives'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Login01 } from '@/components/blocks/login-01'
import { DataTable01 } from '@/components/blocks/data-table-01'

createRoot(document.getElementById('root')!).render(
  <>
    <Kicker>Hello</Kicker><Separator />
    <Button>Go</Button>
    <Sidebar><SidebarSection label="A"><SidebarItem active>One</SidebarItem></SidebarSection></Sidebar>
    <DropdownMenu><DropdownMenuTrigger>Menu</DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem>Item</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
    <Login01 />
    <DataTable01 />
  </>,
)
`)
  await run('npx', ['tsc', '--noEmit'], { cwd: APP })
  await run('npx', ['vite', 'build'], { cwd: APP })

  step('check what was installed')
  const css = fs.readFileSync(path.join(APP, 'dist/assets', fs.readdirSync(path.join(APP, 'dist/assets')).find((f) => f.endsWith('.css'))), 'utf8')
  for (const slot of ['data-slot=button', 'data-slot=sidebar', 'data-slot=dropdown-content', 'data-slot=block-login', 'data-slot=block-data-table']) {
    if (!css.replace(/["']/g, '').includes(slot)) throw new Error(`built CSS has no rule for ${slot}`)
  }
  // The registry pins each npm package to the range in package.json; npm may pick any version inside it.
  // clsx and tailwind-merge are only installed for items that use them, so only the first two are required.
  const projectDeps = JSON.parse(fs.readFileSync(path.join(APP, 'package.json'), 'utf8')).dependencies
  for (const dep of ['@base-ui/react', 'lucide-react', 'clsx', 'tailwind-merge']) {
    if (!(dep in projectDeps)) {
      if (dep === '@base-ui/react' || dep === 'lucide-react') throw new Error(`${dep} was not installed`)
      continue
    }
    const want = pkg.dependencies[dep]
    const got = JSON.parse(fs.readFileSync(path.join(APP, 'node_modules', dep, 'package.json'), 'utf8')).version
    if (!inCaretRange(got, want)) throw new Error(`${dep}: installed ${got}, which is outside the pinned range ${want}`)
  }
  // Re-adding a component must not offer to overwrite the theme (no component lists it as a dependency).
  const registry = JSON.parse(fs.readFileSync(path.join(SITE, '..', 'flatpack', 'registry.json'), 'utf8'))
  const withTheme = registry.items.filter((i) => i.type === 'registry:ui' && (i.registryDependencies ?? []).some((d) => d.includes('flatpack-theme')))
  if (withTheme.length) throw new Error(`these items depend on flatpack-theme: ${withTheme.map((i) => i.name).join(', ')}`)
  console.log('  all checks passed')
} catch (e) {
  failed = e
} finally {
  server.close()
  if (process.env.KEEP || failed) console.log(`\nproject kept at ${APP}`)
  else fs.rmSync(TMP, { recursive: true, force: true })
}
if (failed) { console.error(`\nFAILED: ${failed.message}`); process.exit(1) }
console.log('\nregistry e2e passed')

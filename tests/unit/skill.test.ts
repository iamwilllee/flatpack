// skills/flatpack-ui/SKILL.md is what an agent reads to build with the library, so it must not drift:
// every component is listed, the count is right, and every code sample compiles against the real sources.
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import ts from 'typescript'
import { docs } from '@/site/componentDocs'

const ROOT = process.cwd()
const skill = readFileSync(path.join(ROOT, 'skills/flatpack-ui/SKILL.md'), 'utf8')

describe('SKILL.md', () => {
  it('names every documented component', () => {
    // A title such as "Field / Fieldset" names two components; each part must appear.
    const names = docs.flatMap((d) => d.title.split(' / '))
    const missing = names.filter((n) => !new RegExp(`\\b${n}`, 'i').test(skill))
    expect(missing).toEqual([])
  })

  it('states the real component count', () => {
    expect(skill).toContain(`${docs.length} components total`)
  })

  it('does not tell users to import tailwindcss next to flatpack.css, which already imports it', () => {
    const css = [...skill.matchAll(/```css\n([\s\S]*?)```/g)].map((m) => m[1]).filter((c) => c.includes('flatpack.css'))
    expect(css.length).toBeGreaterThan(0)
    for (const c of css) expect(c).not.toContain('@import "tailwindcss"')
  })

  it('has tsx samples that type-check against the library', () => {
    const blocks = [...skill.matchAll(/```tsx\n([\s\S]*?)```/g)].map((m) => m[1])
    expect(blocks.length).toBeGreaterThan(0)
    // Imports are hoisted; the rest of each sample becomes one fragment. "//" lines turn into JSX comments.
    const parts = ["import { Search } from 'lucide-react'"]
    blocks.forEach((b, i) => {
      const lines = b.split('\n')
      parts.push(...lines.filter((l) => l.startsWith('import ')))
      const body = lines.filter((l) => !l.startsWith('import ')).join('\n').replace(/^\/\/(.*)$/gm, (_, c) => `{/*${c.replace(/\*\//g, '')}*/}`)
      parts.push(`export const Sample${i} = () => (<>\n${body}\n</>)`)
    })
    const file = path.join(ROOT, 'src/__skill_samples__.tsx')
    const text = parts.join('\n')
    const options: ts.CompilerOptions = {
      target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler,
      jsx: ts.JsxEmit.ReactJSX, strict: true, skipLibCheck: true, noEmit: true, isolatedModules: true,
      lib: ['lib.es2022.d.ts', 'lib.dom.d.ts', 'lib.dom.iterable.d.ts'],
      baseUrl: ROOT, paths: { '@/*': ['src/*'] },
    }
    const host = ts.createCompilerHost(options)
    const read = host.readFile.bind(host)
    const exists = host.fileExists.bind(host)
    host.readFile = (f) => (f === file ? text : read(f))
    host.fileExists = (f) => f === file || exists(f)
    host.getSourceFile = ((orig) => (f, lang, ...rest) => (f === file ? ts.createSourceFile(f, text, lang) : orig(f, lang, ...rest)))(host.getSourceFile.bind(host))
    const program = ts.createProgram([file], options, host)
    const errors = ts.getPreEmitDiagnostics(program, program.getSourceFile(file)).map((d) => {
      const { line } = d.file!.getLineAndCharacterOfPosition(d.start!)
      return `sample line ${line + 1}: ${ts.flattenDiagnosticMessageText(d.messageText, '\n')}`
    })
    expect(errors).toEqual([])
  }, 60_000)
})

// README.md (English) and README.zh-CN.md are the first thing people read, so their facts must
// follow the code: every component listed, and the counts of components, blocks and screens right.
import { describe, expect, it } from 'vitest'
import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { docs } from '@/site/componentDocs'
import { blocks, categories } from '@/blocks/definitions'

const ROOT = process.cwd()
const read = (f: string) => readFileSync(path.join(ROOT, f), 'utf8')
const installable = readdirSync(path.join(ROOT, 'src/components/blocks')).filter((f) => f.endsWith('.tsx')).map((f) => f.replace(/\.tsx$/, ''))

const readmes = [
  { file: 'README.md', components: `${docs.length} components`, blocks: `${installable.length} installable blocks`, screens: `${blocks.length} full screens`, other: '[简体中文](./README.zh-CN.md)' },
  { file: 'README.zh-CN.md', components: `${docs.length} 个组件`, blocks: `${installable.length} 个可安装的区块`, screens: `${blocks.length} 个整屏`, other: '[English](./README.md)' },
]

describe.each(readmes)('$file', ({ file, components, blocks: blockCount, screens, other }) => {
  const text = read(file)

  it('lists every documented component', () => {
    const names = docs.flatMap((d) => d.title.split(' / '))
    expect(names.filter((n) => !new RegExp(`\\b${n}\\b`).test(text))).toEqual([])
  })

  it('states the real counts', () => {
    expect(text).toContain(components)
    expect(text).toContain(blockCount)
    expect(text).toContain(screens)
  })

  it('names every installable block and every Blocks category', () => {
    for (const b of installable) expect(text).toContain(`\`${b}\``)
    for (const c of categories.filter((c) => c !== 'All')) expect(text).toContain(c)
  })

  it('links to the other language', () => {
    expect(text.split('\n')[0]).toContain(other)
  })

  it('has its design section filled by build-tokens', () => {
    const body = text.slice(text.indexOf('<!-- tokens:start -->'), text.indexOf('<!-- tokens:end -->'))
    expect(body.split('\n').length).toBeGreaterThan(10)
  })
})

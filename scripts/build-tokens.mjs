// Generate every token consumer from tokens/flatpack.tokens.json.
// Run: node scripts/build-tokens.mjs
//
// Outputs (all generated, do not edit the marked regions by hand):
//   src/styles/flatpack.css           between /* @tokens:start */ and /* @tokens:end */
//   figma/flatpack-tokens.json         Tokens Studio format (global / light / dark sets)
//   public/figma/flatpack-tokens.json  copy served by the site
//   README.md, DESIGN_LANGUAGE.md      between <!-- tokens:start --> and <!-- tokens:end -->
//
// Create-page choices: put `{ "preset": "fp1-…" }` (or `{ "values": { "density": "compact", … } }`)
// in tokens/overrides.json, or run `npm run build:tokens -- --preset fp1-…` to write that file.
// The chosen options become the :root defaults; every other option stays available as a
// [data-fp-<dial>="<value>"] block, so a subtree can still switch locally.
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const T = JSON.parse(fs.readFileSync(path.join(ROOT, 'tokens/flatpack.tokens.json'), 'utf8'))
const DIALS = T.tune.dials

// ---- preset code: fp1-<one code per dial, in dial order> ----------------
export function decodePreset(code) {
  const parts = String(code).trim().split('-')
  // Codes made before a dial existed are shorter; missing dials take their default.
  if (parts.shift() !== 'fp1' || parts.length > DIALS.length) throw new Error(`bad preset code: ${code}`)
  return Object.fromEntries(DIALS.map((d, i) => {
    const o = i < parts.length ? d.options.find((x) => x.code === parts[i]) : d.options.find((x) => x.value === d.default)
    if (!o) throw new Error(`bad preset code: ${code} (${d.id})`)
    return [d.id, o.value]
  }))
}

const argPreset = process.argv.indexOf('--preset')
if (argPreset > 0) {
  const code = process.argv[argPreset + 1]
  decodePreset(code)
  fs.writeFileSync(path.join(ROOT, 'tokens/overrides.json'), JSON.stringify({ preset: code }, null, 2) + '\n')
  console.log(`tokens/overrides.json ← ${code}`)
}
const OVR_PATH = path.join(ROOT, 'tokens/overrides.json')
const OVR = fs.existsSync(OVR_PATH) ? JSON.parse(fs.readFileSync(OVR_PATH, 'utf8')) : {}
const CHOSEN = Object.fromEntries(DIALS.map((d) => [d.id, d.default]))
Object.assign(CHOSEN, OVR.preset ? decodePreset(OVR.preset) : {}, OVR.values ?? {})
const opt = (d, v) => d.options.find((o) => o.value === v)
// Root-level overrides from the chosen options.
const ROOT_VARS = {}
for (const d of DIALS) {
  const o = opt(d, CHOSEN[d.id])
  if (!o) throw new Error(`overrides: unknown ${d.id} = ${CHOSEN[d.id]}`)
  Object.assign(ROOT_VARS, o.vars)
  if (o.gray) T.gray = o.gray
}

// A color token is `gray.N`, a reference to another semantic color (`ink`, `bg`), or a literal.
const colorVal = (v) => (v.startsWith('gray.') ? `var(--fp-gray-${v.slice(5)})` : /^[a-z-]+$/.test(v) ? `var(--fp-${v})` : v)
const resolve = (v) => (typeof v === 'string' && v.startsWith('gray.') ? T.gray[v.slice(5)] : v)
const px = (n) => (typeof n === 'number' && n !== 0 ? `${n}px` : String(n))

function replaceBetween(file, start, end, body) {
  const p = path.join(ROOT, file)
  const src = fs.readFileSync(p, 'utf8')
  const a = src.indexOf(start)
  const b = src.indexOf(end)
  if (a < 0 || b < 0) throw new Error(`${file}: missing markers ${start} … ${end}`)
  fs.writeFileSync(p, src.slice(0, a + start.length) + '\n' + body + '\n' + src.slice(b))
}

// ---- CSS ------------------------------------------------------------------
function css() {
  const L = [':root {', '  color-scheme: light;']
  L.push('  /* neutral gray scale: every color below comes from here */')
  for (const [k, v] of Object.entries(T.gray)) L.push(`  --fp-gray-${k}: ${v};`)
  L.push('')
  for (const [k, v] of Object.entries(T.color)) {
    const lv = colorVal(v.light)
    L.push(`  --fp-${k}: ${lv};`.padEnd(40) + ` /* ${v.en} */`)
  }
  L.push(`  --fp-shadow-pop: ${T.shadow.pop.light};`)
  L.push('')
  for (const [k, v] of Object.entries(T.fontSize)) L.push(`  --fp-text-${k}: ${px(v)};`)
  for (const [k, v] of Object.entries(T.lineHeight)) L.push(`  --fp-leading-${k}: ${v};`)
  for (const [k, v] of Object.entries(T.fontWeight)) L.push(`  --fp-weight-${k}: ${v};`)
  for (const [k, v] of Object.entries(T.fontFamily)) L.push(`  --fp-${k}: ${v};`)
  L.push(`  --fp-tracking-display: ${T.tracking.display};`)
  L.push('')
  for (const [k, v] of Object.entries(T.space)) L.push(`  --fp-space-${k}: ${px(v)};`)
  L.push(`  --fp-border: ${px(T.border.width)};`)
  L.push(`  --fp-radius-control: ${px(T.radius.control)};`.padEnd(40) + ` /* ${T.radius.en.control} */`)
  L.push(`  --fp-radius-surface: ${px(T.radius.surface)};`.padEnd(40) + ` /* ${T.radius.en.surface} */`)
  for (const [k, v] of Object.entries(T.control)) L.push(`  --fp-control-${k}: ${px(v)};`)
  L.push(`  --fp-icon: ${px(T.icon.size)};`)
  L.push(`  --fp-page-max: ${px(T.layout.pageMax)};`.padEnd(40) + ` /* ${T.layout.en} */`)
  L.push(`  --fp-duration: ${T.motion.duration};`)
  L.push(`  --fp-ease: ${T.motion.ease};`)
  L.push('}')
  L.push('')
  L.push('[data-theme="dark"] {', '  color-scheme: dark;')
  for (const [k, v] of Object.entries(T.color)) {
    const dv = colorVal(v.dark)
    L.push(`  --fp-${k}: ${dv};`)
  }
  L.push(`  --fp-shadow-pop: ${T.shadow.pop.dark};`)
  L.push('}')
  L.push('')
  // .fp-invert: a block in the opposite theme (e.g. an ink banner whose button must stay visible).
  const block = (sel, mode) => {
    L.push(`${sel} {`)
    for (const [k, v] of Object.entries(T.color)) {
      L.push(`  --fp-${k}: ${colorVal(v[mode])};`)
    }
    L.push('  background: var(--fp-bg);', '  color: var(--fp-ink);', '}')
  }
  block(':root:not([data-theme="dark"]) .fp-invert', 'dark')
  block('[data-theme="dark"] .fp-invert', 'light')

  // chosen tune options (tokens/overrides.json) become the root defaults
  if (Object.keys(ROOT_VARS).length) {
    L.push('', '/* tokens/overrides.json */', ':root {')
    for (const [k, v] of Object.entries(ROOT_VARS)) L.push(`  --fp-${k}: ${v};`)
    L.push('}')
  }
  // a chosen theme also sets its light and dark palette at the root
  for (const d of DIALS) {
    const o = opt(d, CHOSEN[d.id])
    if (!o.light) continue
    L.push('', `/* theme: ${o.value} */`, ':root {')
    for (const [k, v] of Object.entries(o.light)) L.push(`  --fp-${k}: ${v};`)
    L.push('}', '[data-theme="dark"] {')
    for (const [k, v] of Object.entries(o.dark)) L.push(`  --fp-${k}: ${v};`)
    L.push('}')
  }

  // every tune option as a local switch: <div data-fp-density="compact">
  L.push('', '/* tune dials (Create page): set data-fp-<dial> on any element */')
  const semantic = (mode) => Object.entries(T.color).map(([k, v]) => {
    return `  --fp-${k}: ${colorVal(v[mode])};`
  })
  for (const d of DIALS) {
    for (const o of d.options) {
      const sel = `[data-fp-${d.id}="${o.value}"]`
      if (o.gray) {
        // custom properties resolve where they are declared, so the semantic colors are re-declared too
        L.push(`${sel} {`)
        for (const [k, v] of Object.entries(o.gray)) L.push(`  --fp-gray-${k}: ${v};`)
        L.push(...semantic('light'), '}')
        L.push(`[data-theme="dark"] ${sel}, [data-theme="dark"]${sel} {`, ...semantic('dark'), '}')
        continue
      }
      if (o.light) {
        // A theme sets palette and shape together. The dark block is more specific than the light one,
        // so a dark page stays dark even when the theme attribute sits on <html>.
        L.push(`${sel} {`)
        for (const [k, v] of Object.entries(o.light)) L.push(`  --fp-${k}: ${v};`)
        for (const [k, v] of Object.entries(o.vars)) L.push(`  --fp-${k}: ${v};`)
        L.push('}')
        L.push(`[data-theme="dark"] ${sel}, [data-theme="dark"]${sel} {`)
        for (const [k, v] of Object.entries(o.dark)) L.push(`  --fp-${k}: ${v};`)
        L.push('}')
        continue
      }
      if (!Object.keys(o.vars).length) continue
      L.push(`${sel} {`)
      for (const [k, v] of Object.entries(o.vars)) L.push(`  --fp-${k}: ${v};`)
      L.push('}')
    }
  }
  return L.join('\n')
}

// ---- Figma (Tokens Studio) ------------------------------------------------
function figma() {
  const colorSet = (mode) => Object.fromEntries(Object.entries(T.color).map(([k, v]) => [
    k, { value: v[mode].startsWith('gray.') ? `{gray.${v[mode].slice(5)}}` : /^[a-z-]+$/.test(v[mode]) ? `{${v[mode]}}` : v[mode], type: 'color', description: v.zh },
  ]))
  return {
    $description: 'Flatpack UI design tokens, generated from tokens/flatpack.tokens.json. Import with the Tokens Studio plugin.',
    $license: 'MIT',
    global: {
      gray: Object.fromEntries(Object.entries(T.gray).map(([k, v]) => [k, { value: v, type: 'color' }])),
      fontSize: Object.fromEntries(Object.entries(T.fontSize).map(([k, v]) => [k, { value: String(v), type: 'fontSizes' }])),
      lineHeight: Object.fromEntries(Object.entries(T.lineHeight).map(([k, v]) => [k, { value: `${v * 100}%`, type: 'lineHeights' }])),
      fontWeight: Object.fromEntries(Object.entries(T.fontWeight).map(([k, v]) => [k, { value: String(v), type: 'fontWeights' }])),
      fontFamily: { sans: { value: 'Noto Sans SC', type: 'fontFamilies' }, mono: { value: 'IBM Plex Mono', type: 'fontFamilies' } },
      letterSpacing: { display: { value: T.tracking.display, type: 'letterSpacing' } },
      spacing: Object.fromEntries(Object.entries(T.space).map(([k, v]) => [k, { value: String(v), type: 'spacing' }])),
      borderRadius: {
        control: { value: String(parseInt(T.radius.control, 10)), type: 'borderRadius', description: T.radius.zh.control + '（直角预设下为 0）' },
        surface: { value: String(T.radius.surface), type: 'borderRadius', description: T.radius.zh.surface },
        round: { value: '50%', type: 'borderRadius', description: T.radius.zh.round },
      },
      borderWidth: { default: { value: String(T.border.width), type: 'borderWidth' } },
      sizing: Object.fromEntries(Object.entries(T.control).map(([k, v]) => [`control-${k}`, { value: String(v), type: 'sizing' }]).concat([['icon', { value: String(T.icon.size), type: 'sizing' }], ['page-max', { value: String(T.layout.pageMax), type: 'sizing', description: T.layout.zh }]])),
    },
    light: { ...colorSet('light'), shadowPop: { value: T.shadow.pop.light, type: 'boxShadow', description: T.shadow.pop.zh } },
    dark: { ...colorSet('dark'), shadowPop: { value: T.shadow.pop.dark, type: 'boxShadow', description: T.shadow.pop.zh } },
    ...Object.fromEntries(DIALS.flatMap((d) => d.options.filter((o) => d.id === 'density' && Object.keys(o.vars).length).map((o) => [
      `density-${o.value}`,
      Object.fromEntries(Object.entries(o.vars).map(([k, v]) => [k, { value: v.replace('px', ''), type: k.startsWith('control') ? 'sizing' : 'spacing' }])),
    ]))),
    ...Object.fromEntries(DIALS.filter((d) => d.id === 'theme').flatMap((d) => d.options.filter((o) => o.light).flatMap((o) => ['light', 'dark'].map((m) => [
      `theme-${o.value}-${m}`,
      {
        ...Object.fromEntries(Object.entries(o[m]).map(([k, v]) => [k, { value: v, type: 'color' }])),
        ...(m === 'light' ? Object.fromEntries(Object.entries(o.vars).filter(([k]) => k.startsWith('radius')).map(([k, v]) => [k, { value: String(parseInt(v, 10)), type: 'borderRadius' }])) : {}),
      },
    ])))),
    'gray-warm': Object.fromEntries(Object.entries(opt(DIALS.find((d) => d.id === 'gray'), 'warm').gray).map(([k, v]) => [k, { value: v, type: 'color', description: '可选暖灰，替换 global.gray' }])),
    $themes: [],
    $metadata: { tokenSetOrder: ['global', 'light', 'dark', 'density-compact', 'density-roomy', 'gray-warm', ...DIALS.filter((d) => d.id === 'theme').flatMap((d) => d.options.filter((o) => o.light).flatMap((o) => [`theme-${o.value}-light`, `theme-${o.value}-dark`]))] },
  }
}

// ---- Markdown -------------------------------------------------------------
function markdown(lang) {
  const zh = lang === 'zh'
  const L = []
  L.push(zh ? '<!-- 本段由 scripts/build-tokens.mjs 从 tokens/flatpack.tokens.json 生成，请勿手改 -->' : '<!-- Generated from tokens/flatpack.tokens.json by scripts/build-tokens.mjs. Do not edit by hand. -->')
  L.push('')
  L.push(zh ? '### 三条原则' : '### Three principles')
  L.push('')
  T.principles.forEach((p, i) => L.push(`${i + 1}. **${zh ? p.zh : p.en}。** ${zh ? p.zhDesc : p.enDesc}`))
  L.push('')
  L.push(zh ? '### 颜色（中性灰，不带蓝调）' : '### Color (neutral, no blue cast)')
  L.push('')
  L.push(zh ? '| Token | 浅色 | 深色 | 用途 |' : '| Token | Light | Dark | Use |')
  L.push('|---|---|---|---|')
  for (const [k, v] of Object.entries(T.color)) {
    const show = (x) => (/^[a-z-]+$/.test(x) ? `--fp-${x}` : resolve(x))
    L.push(`| \`--fp-${k}\` | \`${show(v.light)}\` | \`${show(v.dark)}\` | ${zh ? v.zh : v.en} |`)
  }
  L.push('')
  L.push((zh ? '灰阶 10 级：' : 'Gray scale, 10 steps: ') + Object.values(T.gray).map((v) => `\`${v}\``).join(' · '))
  L.push('')
  L.push(zh ? '### 字体与字号' : '### Type')
  L.push('')
  L.push(`- ${zh ? '字号' : 'Sizes'}: ${Object.values(T.fontSize).join(' / ')} px（\`--fp-text-${Object.keys(T.fontSize).join('/')}\`）`)
  L.push(`- ${zh ? `正文 ${T.fontSize.base}px，行高 ${T.lineHeight.body}；标题行高 ${T.lineHeight.heading}` : `Body ${T.fontSize.base}px at ${T.lineHeight.body}; headings at ${T.lineHeight.heading}`}`)
  L.push(`- ${zh ? '字重只用' : 'Weights'}: ${Object.values(T.fontWeight).join(' / ')}`)
  L.push(`- ${zh ? '正文和标题：系统字体栈，中文优先 PingFang SC / Noto Sans SC' : 'Body and headings: system font stack, PingFang SC / Noto Sans SC for Chinese'}`)
  L.push(`- ${zh ? 'IBM Plex Mono 只用于数字、编号和代码，不做分区标题' : 'IBM Plex Mono for numbers, IDs and code only, never for section titles'}`)
  L.push('')
  L.push(zh ? '### 间距、圆角、边框、阴影' : '### Space, radius, border, shadow')
  L.push('')
  L.push(`- ${zh ? '间距' : 'Space'}: ${Object.values(T.space).join(' / ')} px（\`--fp-space-1\` … \`--fp-space-${Object.keys(T.space).length}\`）${zh ? '，区块之间至少 96px' : '; at least 96px between page sections'}`)
  L.push(`- ${zh ? '圆角只有两种：`--fp-radius-control`（胶囊，用于按钮、筛选项、单行输入框、Select、Segmented、Badge、Switch、Tooltip、分页）和 `--fp-radius-surface`（0，用于卡片、图片、弹窗、浮层、表格、Toast、代码块、多行输入框）。头像和单选圆点是 50%，复选框是方的。「直角」预设把控件也改成 0' : 'Two radii only: `--fp-radius-control` (pill: buttons, chips, single-line inputs, Select, Segmented, Badge, Switch, Tooltip, pagination) and `--fp-radius-surface` (0: cards, images, dialogs, floating layers, tables, toasts, code blocks, multi-line inputs). Avatars and the radio dot are 50%; checkboxes are square. The Square preset sets controls to 0 too'}`)
  L.push(`- ${zh ? `页面宽度：\`--fp-page-max\` ${T.layout.pageMax}px，顶栏、页面和页脚共用 \`.fp-container\`，左右边对齐` : `Page width: \`--fp-page-max\` ${T.layout.pageMax}px; header, pages and footer share \`.fp-container\` so their edges line up`}`)
  L.push(`- ${zh ? '边框：1px `--fp-line`；悬停 `--fp-line-strong`；选中 `--fp-ink`' : 'Border: 1px `--fp-line`; hover `--fp-line-strong`; selected `--fp-ink`'}`)
  L.push(`- ${zh ? '阴影：只有 `--fp-shadow-pop`，' + T.shadow.pop.zh : 'Shadow: `--fp-shadow-pop` only, ' + T.shadow.pop.en}`)
  L.push('')
  L.push(zh ? '### 组件、图标、动效' : '### Components, icons, motion')
  L.push('')
  L.push(`- ${zh ? `按钮高 ${Object.values(T.control).join(' / ')}px，14px，字重 500。主按钮墨底，悬停变反色描边；次按钮 1px 描边、透明底` : `Buttons ${Object.values(T.control).join(' / ')}px tall, 14px, weight 500. Primary is ink-filled and inverts to an outline on hover; secondary is a 1px outline on a transparent fill`}`)
  L.push(`- ${zh ? '交互只变颜色，不做位移' : 'Interaction changes color only, never position'}`)
  L.push(`- ${zh ? `图标：lucide，${T.icon.size}px，描边 ${T.icon.stroke}` : `Icons: lucide at ${T.icon.size}px, stroke ${T.icon.stroke}`}`)
  L.push(`- ${zh ? `动效：只做 ${T.motion.duration} 的颜色和透明度过渡，没有常驻动画` : `Motion: ${T.motion.duration} color and opacity transitions only, no looping animation`}`)
  L.push(`- ${zh ? '主题：默认跟随系统，选择存在 localStorage（`fp-theme`），index.html 在首屏前写入 data-theme' : 'Theme: follows the system by default, choice saved in localStorage (`fp-theme`), index.html sets data-theme before first paint'}`)
  L.push('')
  L.push(zh ? '### 可调项（Create 页）' : '### Tunable (Create page)')
  L.push('')
  L.push(zh ? '只开放不破坏三条原则的项。形状只能在胶囊和直角之间切换；阴影、模糊、厚度不开放。强调色和内容面圆角只能通过「主题」整体更换，不能单独调。' : 'Only dials that keep the three rules. Shape switches controls between pill and square; shadow, blur and thickness are not tunable. Accent color and surface radius change only through a theme, never one by one.')
  L.push('')
  L.push(zh ? '| 设置 | 选项 | 默认 |' : '| Dial | Options | Default |')
  L.push('|---|---|---|')
  for (const d of DIALS) {
    L.push(`| ${zh ? d.zh : d.en}${d.optional ? (zh ? '（可选）' : ' (optional)') : ''} | ${d.options.map((o) => (zh ? o.zh : o.en)).join(' / ')} | ${zh ? opt(d, d.default).zh : opt(d, d.default).en} |`)
  }
  L.push('')
  const themes = DIALS.find((d) => d.id === 'theme').options
  L.push(zh ? '### 主题' : '### Themes')
  L.push('')
  L.push(zh ? '主题是一整套配色、强调色、内容面圆角和字体栈，不改组件代码。在任意元素上写 `data-fp-theme="sage"` 即可局部切换；浅深色仍由 `data-theme` 决定。' : 'A theme is a whole palette, accent, surface radius and font stack; component code does not change. Set `data-fp-theme="sage"` on any element to switch a subtree; light and dark still come from `data-theme`.')
  L.push('')
  L.push(zh ? '| 主题 | 说明 | 强调色（浅 / 深） | 内容面圆角 |' : '| Theme | Use | Accent (light / dark) | Surface radius |')
  L.push('|---|---|---|---|')
  for (const o of themes) {
    const acc = o.light ? `\`${o.light.accent}\` / \`${o.dark.accent}\`` : `\`ink\``
    L.push(`| \`${o.value}\` | ${zh ? o.zhDesc : o.enDesc} | ${acc} | ${o.vars['radius-surface'] ?? '0'} |`)
  }
  L.push('')
  L.push(zh
    ? `预设：${T.tune.presets.map((p) => `${p.zh}（${p.zhDesc}）`).join('、')}。导出的预设码形如 \`fp1-d-s-s-16-6-2-n-p\`，写进 \`tokens/overrides.json\` 或运行 \`npm run build:tokens -- --preset <code>\` 即可生效；任意元素加 \`data-fp-density="compact"\` 这类属性也能局部切换。`
    : `Presets: ${T.tune.presets.map((p) => `${p.en} (${p.enDesc})`).join(', ')}. The exported preset code looks like \`fp1-d-s-s-16-6-2-n-p\`; put it in \`tokens/overrides.json\` or run \`npm run build:tokens -- --preset <code>\`. Attributes such as \`data-fp-density="compact"\` switch a subtree locally.`)
  return L.join('\n')
}

replaceBetween('src/styles/flatpack.css', '/* @tokens:start */', '/* @tokens:end */', css())
const fig = JSON.stringify(figma(), null, 2) + '\n'
fs.writeFileSync(path.join(ROOT, 'figma/flatpack-tokens.json'), fig)
fs.mkdirSync(path.join(ROOT, 'public/figma'), { recursive: true })
fs.writeFileSync(path.join(ROOT, 'public/figma/flatpack-tokens.json'), fig)
replaceBetween('README.md', '<!-- tokens:start -->', '<!-- tokens:end -->', markdown('zh'))
replaceBetween('DESIGN_LANGUAGE.md', '<!-- tokens:start -->', '<!-- tokens:end -->', markdown('zh'))
console.log('tokens → flatpack.css, figma/flatpack-tokens.json, README.md, DESIGN_LANGUAGE.md')

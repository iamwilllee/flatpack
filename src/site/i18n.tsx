import * as React from 'react'

export type Lang = 'zh' | 'en'

type Entry = { zh: string; en: string }

const dict = {
  // nav
  'nav.docs': { zh: '文档', en: 'Docs' },
  'nav.components': { zh: '组件', en: 'Components' },
  'nav.blocks': { zh: '整屏', en: 'Blocks' },
  'nav.create': { zh: '调参', en: 'Create' },
  'nav.templates': { zh: '站点', en: 'Templates' },
  'nav.search': { zh: '搜索文档', en: 'Search docs' },
  'nav.started': { zh: '开始使用', en: 'Get Started' },
  'nav.theme': { zh: '切换主题', en: 'Toggle theme' },
  'nav.repo': { zh: '源码仓库', en: 'Source repository' },

  // home
  'home.title': { zh: '构建，且清晰。', en: 'Build with clarity.' },
  'home.sub': { zh: '形状按角色、黑白、留白。一套让内容做主角的组件系统。', en: 'Shape by role, black and white, plenty of space. A component system that lets the content lead.' },
  'home.viewComponents': { zh: '浏览组件', en: 'View Components' },
  'home.tune': { zh: '调整字号和字距', en: 'Tune type' },
  'home.kicker': { zh: '形状按角色 · 黑白 · 留白', en: 'Shape by role · Black and white · Whitespace' },
  'home.showcase': { zh: '组件', en: 'Components' },
  'home.showcaseTitle': { zh: '安静的界面，清楚的层级', en: 'Quiet surfaces, clear hierarchy' },
  'home.showcaseDesc': { zh: '下面每一块都是真实组件。卡片只有一层 1px 边框，强调只有墨色一种。', en: 'Every piece below is a real component. Cards have a single 1px border, and ink is the only emphasis.' },
  'home.orders': { zh: '本月订单', en: 'Orders this month' },
  'home.vsLast': { zh: '对比上月', en: 'vs last month' },
  'home.product': { zh: '扶手椅', en: 'Armchair' },
  'home.productMeta': { zh: '棉麻面料 · 68 × 72 cm', en: 'Linen upholstery · 68 × 72 cm' },
  'home.principles': { zh: '三条原则', en: 'Three rules' },
  'home.taskProgress': { zh: '任务进度', en: 'Task progress' },
  'home.stockAlert': { zh: '库存提醒', en: 'Stock alerts' },
  'home.newBadge': { zh: '新品', en: 'New' },
  'home.add': { zh: '加入', en: 'Add' },
  'home.created': { zh: '创建项目', en: 'Create project' },
  'home.configure': { zh: '配置参数', en: 'Configure' },
  'home.publish': { zh: '发布上线', en: 'Publish' },
  'home.createdDesc': { zh: '填写项目基本信息', en: 'Enter project details' },
  'home.configureDesc': { zh: '设置核心参数', en: 'Set core parameters' },
  'home.publishDesc': { zh: '确认并保存', en: 'Confirm and save' },
  'home.delivery': { zh: '配送服务', en: 'Delivery' },
  'home.deliveryDesc': { zh: '送到你家门口', en: 'Straight to your door' },
  'home.setup': { zh: '安装服务', en: 'Setup' },
  'home.setupDesc': { zh: '上门帮你装好', en: 'Installed on site' },
  'home.advice': { zh: '咨询服务', en: 'Consultation' },
  'home.adviceDesc': { zh: '专业规划空间', en: 'Plan your space' },
  'home.searchProducts': { zh: '搜索商品…', en: 'Search products…' },
  'home.compCount': { zh: '63 个组件', en: '63 components' },

  // components page
  'cmp.kicker': { zh: '组件库', en: 'Component library' },
  'cmp.title': { zh: '63 个组件', en: '63 components' },
  'cmp.intro': {
    zh: '通用、导航、数据录入、数据展示与反馈——覆盖最常用的基础场景。全部靠 data-slot 换肤。',
    en: 'General, navigation, data entry, data display and feedback — the common building blocks. All themed through data-slot.',
  },
  'cmp.sidebar': { zh: '组件 · 63', en: 'Components · 63' },
  'cmp.viewCode': { zh: '查看代码', en: 'View code' },
  'cmp.hideCode': { zh: '隐藏代码', en: 'Hide code' },
  'cmp.copy': { zh: '复制', en: 'Copy' },
  'cmp.footerA': { zh: 'Flatpack UI · 63 个组件', en: 'Flatpack UI · 63 components' },
  'cmp.footerB': { zh: '换掉一个 CSS，换掉整套系统', en: 'Swap one CSS file, swap the system' },

  // docs page
  'docs.kicker': { zh: '文档', en: 'Documentation' },
  'docs.title': { zh: '开始使用', en: 'Get started' },
  'docs.intro': { zh: 'Flatpack UI 是一套黑白、留白的组件系统：可点的小件是胶囊，承载内容的面是直角。核心是一个 CSS 文件：组件用 data-slot 标记部位，主题层靠属性选择器上样式。换掉这一个文件，就换掉整套外观。', en: 'Flatpack UI is a black-and-white component system with pill controls and square surfaces. Its core is one CSS file: components mark their parts with data-slot, and the theme layer styles them. Swap that file and you swap the whole look.' },
  'docs.componentsCard': { zh: '组件文档', en: 'Component docs' },
  'docs.componentsCardDesc': {
    zh: '60 个组件，每个都有完整用法、变体示例与 API 参数表',
    en: '60 components, each with usage, variant examples and an API table',
  },
  'docs.overview': { zh: '组件总览', en: 'Overview' },
  'docs.stackTitle': { zh: '1. 技术栈与安装', en: '1. Stack & install' },
  'docs.stackDesc': {
    zh: 'Flatpack UI 构建在以下基础之上。组件源码在 src/components/ui/，直接复制到你的项目；分发采用 shadcn registry 格式。',
    en: 'Flatpack UI is built on the following. Component source lives in src/components/ui/ — copy it into your project. Distribution uses the shadcn registry format.',
  },
  'docs.usageTitle': { zh: '2. 使用', en: '2. Usage' },
  'docs.usageDesc': { zh: '所有组件接受原生 props，换肤对使用方透明。', en: 'Every component accepts native props; theming is invisible to you.' },
  'docs.langTitle': { zh: '3. 设计语言', en: '3. Design language' },
  'docs.langDesc': { zh: '方向是简单、舒适、直接：内容是主角，界面本身几乎不出声。三条原则替换了早先的 Boardcraft 四原则。', en: 'The direction is simple, comfortable and direct: content leads and the interface stays quiet. Three rules replace the earlier four Boardcraft principles.' },
  'docs.colorsTitle': { zh: '4. 颜色', en: '4. Color' },
  'docs.colorsDesc': { zh: '一条 10 级中性灰阶，所有颜色都从里面取。下面是实际 token 值，来自 tokens/flatpack.tokens.json。', en: 'One 10-step neutral gray scale; every color comes from it. These are the live token values from tokens/flatpack.tokens.json.' },
  'docs.themeTitle': { zh: '5. 主题切换', en: '5. Theming' },
  'docs.figmaTitle': { zh: '6. Figma 与 registry', en: '6. Figma & registry' },
  'docs.figmaDesc': { zh: '用 Tokens Studio 插件把 flatpack-tokens.json 导入 Figma，同步颜色、字号、间距。这份文件和 flatpack.css 的 token 块由同一份 tokens/flatpack.tokens.json 生成。组件通过 shadcn registry 分发，每个组件在 public/r/ 下有独立 JSON。', en: 'Import flatpack-tokens.json into Figma with the Tokens Studio plugin to sync color, type and spacing. It is generated from the same tokens/flatpack.tokens.json as the token block in flatpack.css. Components ship through the shadcn registry, one JSON per component in public/r/.' },
  'docs.figmaDownload': { zh: '下载 Figma tokens', en: 'Download Figma tokens' },
  'docs.viewRegistry': { zh: '查看 registry.json', en: 'View registry.json' },
  'docs.registryDocs': { zh: 'shadcn registry 文档', en: 'shadcn registry docs' },
  'docs.light': { zh: '切到浅色', en: 'Switch to light' },
  'docs.dark': { zh: '切到深色', en: 'Switch to dark' },

  // component doc page
  'doc.home': { zh: '文档首页', en: 'Docs home' },
  'doc.installation': { zh: '安装', en: 'Installation' },
  'doc.usage': { zh: '使用', en: 'Usage' },
  'doc.api': { zh: 'API 参数', en: 'API Reference' },
  'doc.onThisPage': { zh: '本页目录', en: 'On This Page' },
  'doc.prev': { zh: '上一个', en: 'Previous' },
  'doc.next': { zh: '下一个', en: 'Next' },
  'doc.prop': { zh: '参数', en: 'Prop' },
  'doc.type': { zh: '类型', en: 'Type' },
  'doc.default': { zh: '默认', en: 'Default' },
  'doc.desc': { zh: '说明', en: 'Description' },
  'doc.apiDesc': { zh: '接受以下参数（复合组件为各子组件的合计）：', en: 'Accepts the following props (compound components list all parts):' },
  'doc.importFrom': { zh: '从以下路径导入组件：', en: 'Import the component from:' },

  // blocks page
  'blocks.kicker': { zh: '整屏示例', en: 'Full screens' },
  'blocks.title': { zh: '整屏示例', en: 'Blocks' },
  'blocks.desc': { zh: '整屏示例，全部用 Flatpack UI 组件拼成。看效果、读代码，然后复制过去改成你自己的。', en: 'Whole screens composed entirely from Flatpack UI components. Look, read, then copy and make them yours.' },
  'blocks.preview': { zh: '预览', en: 'Preview' },
  'blocks.code': { zh: '代码', en: 'Code' },
  'blocks.fullscreen': { zh: '全屏查看', en: 'Fullscreen' },
  'blocks.close': { zh: '关闭', en: 'Close' },
  'blocks.all': { zh: '全部', en: 'All' },

  // create page
  'create.title': { zh: '调参', en: 'Create' },
  'create.sub': { zh: '只开放不破坏三条原则的设置', en: 'Only settings that keep the three rules' },
  'create.reset': { zh: '重置', en: 'Reset' },
  'create.copied': { zh: '已复制', en: 'Copied' },
  'create.preset': { zh: '预设', en: 'Preset' },
  'create.custom': { zh: '自定义', en: 'Custom' },
  'create.mode': { zh: '模式', en: 'Mode' },
  'create.modeSystem': { zh: '跟随系统', en: 'System' },
  'create.modeLight': { zh: '浅色', en: 'Light' },
  'create.modeDark': { zh: '深色', en: 'Dark' },
  'create.optional': { zh: '可选', en: 'Optional' },
  'create.code': { zh: '预设码', en: 'Preset code' },
  'create.codePlaceholder': { zh: '粘贴预设码，如 fp1-c-i-s-15-6-2-n', en: 'Paste a code, e.g. fp1-c-i-s-15-6-2-n' },
  'create.apply': { zh: '应用', en: 'Apply' },
  'create.codeInvalid': { zh: '预设码无效', en: 'Invalid preset code' },
  'create.share': { zh: '复制分享链接', en: 'Copy share link' },
  'create.export': { zh: '导出', en: 'Export' },
  'create.exportDesc': { zh: '把 overrides.json 放进 tokens/，或直接运行下面的命令，CSS、Figma 和文档会一起更新。', en: 'Put overrides.json in tokens/, or run the command below; CSS, Figma and docs update together.' },
  'create.locked': { zh: '不开放：圆角的中间值、单独的强调色、阴影、模糊、厚度。形状只在胶囊和直角之间切换；强调色和内容面圆角只能随主题整体更换。', en: 'Not tunable: in-between radii, a standalone accent color, shadow, blur, thickness. Shape only switches between pill and square; accent color and surface radius change only with a theme.' },
  'create.previewTitle': { zh: '实时预览', en: 'Live preview' },
  'create.previewDesc': { zh: '下面是真实的整屏，设置只作用在这块区域里。', en: 'Real screens below; settings apply to this area only.' },
  'create.screenType': { zh: '字体样张', en: 'Type specimen' },

  // templates
  'tpl.kicker': { zh: 'Live site examples', en: 'Live site examples' },
  'tpl.title': { zh: '整站示例', en: 'Templates' },
  'tpl.desc': {
    zh: '三种完整站点，用 Flatpack UI 组件搭成。切换类型、点导航、填表单、加购物车——都是真的能用的。',
    en: 'Three complete sites built from Flatpack UI components. Switch types, use the nav, fill forms, add to cart — everything actually works.',
  },
  'tpl.corporate': { zh: '官网', en: 'Corporate' },
  'tpl.commerce': { zh: '电商', en: 'Commerce' },
  'tpl.admin': { zh: '后台', en: 'Admin' },
  'tpl.reset': { zh: '重置', en: 'Reset' },
  'tpl.fullscreen': { zh: '全屏预览', en: 'Fullscreen' },
  'tpl.close': { zh: '关闭', en: 'Close' },

  // app footer
  'app.footerA': { zh: 'Flatpack UI · 形状按角色 · 黑白 · 留白', en: 'Flatpack UI · Shape by role · Black and white · Whitespace' },
  'app.footerB': { zh: '63 个组件 · 2 套主题 · 1 个 CSS 文件', en: '63 components · 2 themes · 1 CSS file' },
} satisfies Record<string, Entry>

export type TKey = keyof typeof dict

const LangContext = React.createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: 'en', setLang: () => {} })

function detectLang(): Lang {
  if (typeof window === 'undefined') return 'en'
  const saved = window.localStorage.getItem('fp-lang')
  if (saved === 'zh' || saved === 'en') return saved
  return navigator.language?.toLowerCase().startsWith('zh') ? 'zh' : 'en'
}

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = React.useState<Lang>(detectLang)
  const setLang = React.useCallback((l: Lang) => {
    setLangState(l)
    try { window.localStorage.setItem('fp-lang', l) } catch { /* ignore */ }
    document.documentElement.lang = l === 'zh' ? 'zh-CN' : 'en'
  }, [])
  React.useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en'
  }, [lang])
  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>
}

export function useI18n() {
  const { lang, setLang } = React.useContext(LangContext)
  const t = React.useCallback((key: TKey) => dict[key][lang], [lang])
  return { lang, setLang, t }
}
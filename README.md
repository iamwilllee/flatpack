# Flatpack UI

> 简单、舒适、直接：形状按角色、黑白、留白。内容是主角，界面本身几乎不出声。

完整的设计规范见 [DESIGN_LANGUAGE.md](./DESIGN_LANGUAGE.md)。所有 token 只有一份源文件：[`tokens/flatpack.tokens.json`](./tokens/flatpack.tokens.json)。下面这一节、`DESIGN_LANGUAGE.md` 里的同名一节、`flatpack.css` 的 token 块和 `figma/flatpack-tokens.json` 都由 `npm run build:tokens` 从它生成。

## 设计规范

<!-- tokens:start -->
<!-- 本段由 scripts/build-tokens.mjs 从 tokens/flatpack.tokens.json 生成，请勿手改 -->

### 三条原则

1. **形状按角色。** 可点的单行小件（按钮、筛选项、输入框、徽章）用一种圆角，承载内容的面（卡片、图片、表格、代码块）用另一种，没有中间值。默认前者是胶囊、后者是直角。浮在页面上的层（弹窗、菜单、Toast）和多行的输入框（Textarea、Composer、多选框）单独用一种圆角：多行框做不成胶囊，用这个圆角和单行输入框保持一家。想要全直角，选「直角」预设，主题也可以给内容面一个小圆角。
2. **黑白。** 默认只有一个强调色，就是墨色。层级靠反差和字号拉开，不靠颜色。红、绿只用于状态文字和图标。主题可以把墨色换成自己的品牌色，但每个主题仍然只有一个强调色。
3. **留白。** 分区用间距。边框只有 1px 一种，卡片里不再套第二层边框。阴影只给浮层用。

### 颜色（中性灰，不带蓝调）

| Token | 浅色 | 深色 | 用途 |
|---|---|---|---|
| `--fp-bg` | `#ffffff` | `#000000` | 页面底色 |
| `--fp-surface` | `#f5f5f5` | `#0a0a0a` | 抬升面、占位图 |
| `--fp-line` | `#e5e5e5` | `#262626` | 唯一的线色 |
| `--fp-line-strong` | `#a3a3a3` | `#525252` | 输入框、悬停时的边框 |
| `--fp-muted` | `#6b6b6b` | `#a3a3a3` | 次要文字（只有这一个） |
| `--fp-ink` | `#0a0a0a` | `#fafafa` | 文字、边框强调 |
| `--fp-accent` | `--fp-ink` | `--fp-ink` | 主按钮、选中、激活态、焦点框。默认就是墨色，主题可以换成品牌色 |
| `--fp-on-accent` | `--fp-bg` | `--fp-bg` | 强调色上的文字和图标 |
| `--fp-danger` | `#c62828` | `#ef5350` | 错误，只用于文字和图标 |
| `--fp-success` | `#2e7d32` | `#66bb6a` | 成功，只用于文字和图标 |
| `--fp-scrim` | `rgba(0, 0, 0, 0.4)` | `rgba(0, 0, 0, 0.7)` | 弹窗背后的遮罩 |

灰阶 10 级：`#ffffff` · `#fafafa` · `#f5f5f5` · `#e5e5e5` · `#a3a3a3` · `#6b6b6b` · `#525252` · `#262626` · `#0a0a0a` · `#000000`

### 字体与字号

- 字号: 12 / 14 / 16 / 20 / 28 / 40 / 64 / 96 px（`--fp-text-xs/sm/base/lg/xl/2xl/3xl/4xl`）
- 正文 16px，行高 1.6；标题行高 1.1
- 字重只用: 400 / 500 / 600
- 正文和标题：系统字体栈，中文优先 PingFang SC / Noto Sans SC
- IBM Plex Mono 只用于数字、编号和代码，不做分区标题

### 间距、圆角、边框、阴影

- 间距: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128 px（`--fp-space-1` … `--fp-space-10`），区块之间至少 96px
- 圆角只有三种：`--fp-radius-control`（胶囊，用于按钮、筛选项、单行输入框、Select、Segmented、Badge、Switch、Tooltip、分页、菜单选项）、`--fp-radius-surface`（0，用于卡片、图片、表格、代码块这些展示内容的面）和 `--fp-radius-floating`（20px，用于弹窗、菜单、Popover、Toast 这些浮在页面上的层，以及 Textarea、Composer、多选框这些多行输入框）。头像和单选圆点是 50%，复选框是方的。「直角」预设把控件和浮层都改成 0
- 页面宽度：`--fp-page-max` 1280px，顶栏、页面和页脚共用 `.fp-container`，左右边对齐
- 边框：1px `--fp-line`；悬停 `--fp-line-strong`；选中 `--fp-ink`
- 阴影：只有 `--fp-shadow-pop`，只给 Dialog、Popover、Select、Dropdown、Tooltip 这类浮层

### 组件、图标、动效

- 按钮高 32 / 40 / 48px，14px，字重 500。主按钮墨底，悬停变反色描边；次按钮 1px 描边、透明底
- 交互只变颜色，不做位移
- 图标：lucide，16px，描边 1.5
- 动效：只做 150ms 的颜色和透明度过渡，没有常驻动画
- 入场动效（可选）：只对带 data-reveal 的元素生效，默认只淡入，不位移。主题可以给出自己的节奏
- 主题：默认跟随系统，选择存在 localStorage（`fp-theme`），index.html 在首屏前写入 data-theme

### 可调项（Create 页）

只开放不破坏三条原则的项。形状只能在胶囊和直角之间切换；阴影、模糊、厚度不开放。强调色和内容面圆角只能通过「主题」整体更换，不能单独调。

| 设置 | 选项 | 默认 |
|---|---|---|
| 密度 | 紧凑 / 默认 / 宽松 | 默认 |
| 正文字体 | 系统 / Noto Sans SC / Inter + Noto Sans SC | 系统 |
| 标题字体 | 同正文 / Noto Serif SC（编辑风） | 同正文 |
| 正文字号 | 15px / 16px | 16px |
| 标题字重 | 500 / 600 | 600 |
| 标题字距 | -0.03em / -0.02em / 0 | -0.02em |
| 灰阶色温（可选） | 中性 / 暖灰 | 中性 |
| 形状 | 胶囊 / 直角 | 胶囊 |
| 主题 | Flatpack / Catalog / Sage | Flatpack |

### 主题

主题是一整套配色、强调色、内容面圆角和字体栈，不改组件代码。在任意元素上写 `data-fp-theme="sage"` 即可局部切换；浅深色仍由 `data-theme` 决定。

| 主题 | 说明 | 强调色（浅 / 深） | 内容面圆角 |
|---|---|---|---|
| `flatpack` | 黑白、胶囊控件、直角内容面 | `ink` | 0 |
| `catalog` | 中性黑白、Arial 排版、内容面 4px 小圆角，适合商品目录和内容站 | `#111111` / `#f5f5f5` | 4px |
| `sage` | 绿色强调、柔和灰底、10px 圆角，适合工具、SaaS 和会员工作台 | `#236b4b` / `#a6d4aa` | 10px |

预设：默认（规范默认值）、后台紧凑（紧凑间距、Inter、15px 正文）、编辑长文（宽松间距、衬线标题、字重 500）、全直角（所有控件改成直角，接近 x.ai 的硬朗风格）、Catalog（商品目录、内容站）、Sage（工具、SaaS、工作台）。导出的预设码形如 `fp1-d-s-s-16-6-2-n-p`，写进 `tokens/overrides.json` 或运行 `npm run build:tokens -- --preset <code>` 即可生效；任意元素加 `data-fp-density="compact"` 这类属性也能局部切换。
<!-- tokens:end -->

## 双主题

默认跟随系统的浅色/深色设置。用户在顶栏切换后，选择存进 `localStorage`（键名 `fp-theme`）。`index.html` 里有一段内联脚本，在首屏渲染前就写好 `<html data-theme>`，不会闪一下。两套主题共用同一组 `data-slot` 选择器，切主题只换 token，组件代码不动。

## 技术栈

- **React 19 + TypeScript** — 组件运行时
- **Base UI** — 无样式交互原语。Button、Checkbox、Switch、RadioGroup、Select、Dialog、Sheet、DropdownMenu、Tabs、Tooltip、Popover、Progress、Avatar、Collapse、Segmented、Thinking 等所有交互组件基于它构建（状态管理、键盘交互、无障碍由 Base UI 提供）
- **Tailwind CSS 4** — 布局工具类
- **lucide-react** — 图标
- **clsx + tailwind-merge** — `cn()` 类名合并
- **shadcn registry** — 分发格式

## 换肤机制

核心是 `src/styles/flatpack.css` 一个文件。组件用 `data-slot` 标记每个部位，主题层靠属性选择器找到它们并上材质——**换掉这一个 CSS 文件，就换掉整套系统**。Base UI 负责行为，这份 CSS 负责外观，两者彻底分离。

改 token：编辑 `tokens/flatpack.tokens.json`，再跑 `npm run build:tokens`。`npm run check:design` 会扫描 tsx，发现写死的字号、间距、圆角、阴影或不存在的 `--fp-*` 变量就报错。

## 组件清单（77 个）

| 批次 | 组件 |
|---|---|
| P1 基础 | Button（5 variant / 4 size）、Card、Badge、Input / Label、Dialog、Tabs、Sheet、DropdownMenu、Sidebar、Table、Separator、Kicker |
| 第一批补充 | Breadcrumb、Image（4 比例 + fallback）、Avatar、Empty、Steps（任务流程） |
| 第二批补充 | Select、Checkbox、Radio、Switch、Alert（4 变体）、Skeleton、Tooltip、Progress |
| 第三批补充 | Popover、Segmented、Divider、Statistic、Collapse、Pagination |
| 第四批补充 | BorderBeam（边框流光，可选装饰件，站内页面不使用）、Masonry（瀑布流） |
| 第五批：高频件（对照 Astryx） | Textarea、Field / Fieldset、NumberInput、Slider、Combobox、ToggleGroup / ButtonGroup、Toolbar、AlertDialog、Toast、HoverCard、ScrollArea、CommandPalette（⌘K）、Kbd、Spinner、AvatarGroup、CodeBlock |
| 第六批：中等体量 | Calendar、DatePicker / DateRangePicker、FileInput、MultiSelect、Tree、DescriptionList、ContextMenu、Menubar、Carousel、Lightbox、Timestamp、StatusDot、VisuallyHidden |
| 第七批：形状按角色 | ChipGroup（独立筛选项，可带数量）；Input 增加 `variant="filled"` 与 `leading` / `trailing` 图标位 |
| 第九批：数据与区块 | DataTable（排序、多选、分页、空状态）；可安装区块 login-01 / settings-01 / data-table-01 / chat-01 / agent-01（`src/components/blocks/`） |
| 第十批：AI 对话与 Agent | Message（一条消息）、Thinking（折叠的推理过程）、ToolCall（工具调用小标签）、TaskList（Agent 任务状态）、Approval（执行前确认）、Diff（统一 diff 与表格单元格改动）、Sources / Citation（来源清单与行内编号）；Composer 也归入「AI」分类 |
| 第八批：对照 coss ui | Drawer（四边滑入、滑动关闭、吸附点）、Form（提交校验、服务端错误）、OtpField、Meter、InputGroup（图标 / 单位 / 按钮同一个边框）、Composer（AI 对话输入框，回车发送，输入法选字不误发）；Field 增加 `validate` / `validationMode` |

共 **77 个组件**。定位从「补高频、避重型」调整为「补高频，重型件只做到够用」：日期、上传、树、多选这类以前排除的件现在提供，但只做通用部分——日历自己实现、不引第三方库，FileInput 只收集文件、不管上传，Tree 只做展开和选择、不做拖拽和懒加载。富文本编辑器、Markdown 渲染、Cascader、Transfer 仍然不做。

- 第五、六批里能用 Base UI 原语的都用了（Field、NumberField、Slider、Combobox、ToggleGroup、Toolbar、AlertDialog、Toast、PreviewCard、ScrollArea、ContextMenu、Menubar），键盘和无障碍由它负责。
- StatusDot 按规范做成 8px 方块；Spinner 是三个方块轮流改透明度，只在加载时出现，开启「减少动态效果」时静止。
- AI 对话部件在文档里归为「AI」分类：Composer、Message、Thinking、ToolCall、TaskList、Approval、Diff、Sources。整屏有两个可安装区块，都由这些组件拼成：chat-01（对话）和 agent-01（Agent 运行：计划、工具调用、删除前审批、带来源的总结）。

## 品牌标识

LOGO 是一个墨色直角方块里的白色 F，没有描边和厚度。
- `public/favicon.svg` — 站点图标（32×32，浅底墨字，深浅标签栏都可读）
- `src/site/BrandMark.tsx` — 与 favicon 同源的 React 内联版本（`BrandMark` / `BrandLockup`），导航直接使用

## 本地运行

```bash
npm install --cache ./.npm-cache
npm run dev       # http://localhost:5199
npm run build     # 产物在 dist/
npm run test:unit # 组件契约：受控/非受控、props 透传、本地化标签（vitest + jsdom）
npm test          # 浏览器冒烟 + 无障碍：全部文档页无报错，主要交互、滑动手势和主题切换；axe 扫描每个文档页的浅色和深色（Playwright）
```

表单控件和浮层都支持受控（`value` / `open` / `checked` + `on…Change`）和非受控（`default…`）两种用法，Base UI 的其余属性（`id`、`name`、`required`、`aria-*`、`className`、`ref`）原样透传。弹窗类的触发器和关闭按钮支持 `render`，可换成自己的元素。会被屏幕阅读器读到的文案（关闭、分页、面包屑等）都有对应的 label 属性，默认英文，产品按自己的语言传入。

## 文档站

**中英双语**：顶栏 中/EN 切换，按浏览器语言自动选择并记住选择（`localStorage`）。界面文案两套语言；组件演示与代码示例统一英文（示例即代码，只维护一套，避免中英文数据漂移）。

纯静态 hash 路由，主题默认跟随系统。**真实移动端适配**：视口 ≤980px 时全站重排——顶栏折叠为汉堡菜单、页面边距收窄；组件页/组件文档页的固定侧栏改为横向滚动 chips，文档页隐藏 On This Page 目录、API 表格横向滚动；Create 页调参与预览改单列；Blocks 画廊单列并让整屏预览内部滚动；模板预览根据容器宽度自动进入 compact 布局（无需手动点手机按钮）。所有页面在 390px 视口下零横向溢出。**站点自身完全用 Flatpack UI 组件构建**（dogfooding）——导航用 Button、卡片用 Card、表格用 Table、侧栏用 SidebarItem、分隔用 Separator，没有手写按钮或表格。这既是展示，也验证了组件在真实场景里够用。

- `#/` 首页：一个大标题、一句话、一个主按钮；组件展示放在下方
- `#/components` 组件页：左侧粘性分类导航 + 全部组件预览，每个组件带**可展开、可复制的代码示例**
- `#/docs` 文档页：安装 / 使用 / 设计原则 / 色板 / 主题切换 / Figma，含每个组件的入口
- `#/docs/components/:id` **组件文档页**（59 个）：三栏布局——左侧组件列表、中间正文（live 预览 + 代码 / Installation / Usage / 各变体示例 / **API 参数表**）、右侧 On This Page 锚点，顶部有上一个/下一个组件导航。
- `#/create` 调参页：预设（默认 / 后台紧凑 / 编辑长文 / 全直角 / Catalog / Sage）、模式、密度、正文字体、标题字体、正文字号、标题字重、标题字距、形状、主题，以及可选的暖灰色温。预览是真实整屏（商品页、后台、AI 助手、登录、设置），设置只作用在预览区域。导出 `tokens/overrides.json`、CLI 命令和 CSS 三种格式，预设码写在 URL 里可直接分享。圆角的中间值、单独的强调色、阴影、模糊、厚度不开放；强调色和内容面圆角只随主题整体更换
- `#/blocks` 整屏示例：11 个场景（Storefront / Product detail / Cart / Dashboard / Workbench / Orders / Login / Settings / Product site / Directory / AI assistant）。Login、Settings、Orders、AI assistant 就是 `src/components/blocks/` 里的可安装区块，代码页显示的是该文件的真实源码，底部给出安装命令，带分类筛选、Preview↔Code 切换与全屏查看。右上角可切换 Flatpack / Catalog / Sage 主题，选择写在 URL（`#/blocks?theme=sage`）里可直接分享；Workbench、Directory、Product site 是可操作的（筛选、分页、对话框新建），不连接任何服务
- `#/templates` **站点示例**（同样支持三个主题切换）：3 个可真实操作的整站（官网 / 电商 / 后台），浏览器式窗口预览，支持桌面/手机视图、全屏与重置。不是截图——导航、表单、购物车、订单状态都是真的能用。窄容器下自动切换真正的移动布局（后台侧栏改为汉堡按钮 + 抽屉菜单、网格降列、筛选条横滚），不是把桌面版硬压窄

### 图片来源

Templates 里的真实照片来自 [Unsplash](https://unsplash.com/license)（免费商用、无需署名）。所有链接集中在 `src/site/photos.ts`，统一尺寸/质量参数；`src/templates/Photo.tsx` 加载前和断网时显示浅色中性色块，不显示占位文字。想自托管只需替换 `photos.ts` 里的 URL。

## 工程化产物

- `registry.json` + `public/r/*.json`：shadcn registry，包含主题、每个组件和 4 个区块。先装主题 `npx shadcn@latest add https://iamwilllee.github.io/flatpack/r/flatpack-theme.json`，再装组件或区块，如 `…/r/data-table.json`、`…/r/login-01.json`。依赖之间都写成完整 URL，不会误装 shadcn 自带的同名组件。npm 依赖按 `package.json` 里声明的版本范围写入（如 `@base-ui/react@1.9.0`），用户装到的是本仓库构建和测试时用的版本；`npm run build:registry` 遇到未声明的依赖会直接报错
- [MIGRATION.md](./MIGRATION.md)：从 shadcn/ui 迁移，包括改名对照、表单、token 对照
- `figma/flatpack-tokens.json`：Tokens Studio 格式（global / light / dark 三个 set），由 `npm run build:tokens` 生成
- `npm run build`：一次产出站点 + registry + Figma tokens 到 `dist/`
- `dist/llms.txt` / `dist/llms-full.txt`：给 LLM 读的组件索引和全量文档（[llmstxt.org](https://llmstxt.org) 格式），由 `npm run build:llms` 从 `componentDocs.ts` 生成
- `dist/docs/<id>.md`：每个组件一份纯 Markdown（安装命令、用法、示例、API）
- `dist/docs/<id>/index.html`：每个组件一个可被搜索引擎收录的静态页（标题、描述、canonical、Open Graph），打开后跳到 `#/docs/components/<id>`；另有 `sitemap.xml` 和 `robots.txt`
- `skills/flatpack-ui/SKILL.md`：给 Agent 用的技能，包含组件清单、导入路径、设计约束与可复制的用法范例

## 配合 AI 使用

三种方式，按需选一种或组合：

1. **llms.txt**：把 `https://iamwilllee.github.io/flatpack/llms.txt` 给 AI（Cursor 里用 `@Docs` 添加）。它是带链接的组件索引，每个组件另有 `docs/<id>.md`；`llms-full.txt` 是全量文档。
2. **shadcn MCP**：本库就是 shadcn registry，不需要单独的 MCP 服务。在项目的 `components.json` 里加上命名空间：

   ```json
   {
     "registries": {
       "@flatpack": "https://iamwilllee.github.io/flatpack/r/{name}.json"
     }
   }
   ```

   再在 AI 客户端里启用 shadcn MCP（Claude Code 等运行 `npx shadcn@latest mcp init --client claude`；其他客户端的 `command` 填 `npx`，`args` 填 `["shadcn@latest", "mcp"]`）。之后可以直接说"从 @flatpack 里加一个登录页"，AI 会搜索并安装。
3. **SKILL**：见下一节，适合让 Agent 在搭页面时遵守设计约束。

## 给 Agent 用（SKILL）

[skills/flatpack-ui/SKILL.md](./skills/flatpack-ui/SKILL.md) 让 Agent 拿到就能用我们的组件库搭界面。安装到当前环境：

```bash
ln -s "$PWD/skills/flatpack-ui" ~/.dsh/skills/flatpack-ui
```

安装后，Agent 在遇到"用 Flatpack UI 搭页面 / 提到 Flatpack 设计规范"时会自动加载它。SKILL 里的组件 API 与 `src/site/componentDocs.ts` 保持一致——改组件 props 时记得同步 SKILL。

## 路线图

- [x] P0 命名与定位
- [x] P1 Token + 主题层 + 10 组件换肤验证
- [x] 第一批补充 5 组件 — 17 个
- [x] 第二批 8 组件 — 25 个
- [x] 第三批 6 组件 — 31 个
- [x] 第四批 2 组件（BorderBeam / Masonry）— 33 个
- [x] Templates Tab：官网 / 电商 / 后台三套可交互整站示例
- [x] 文档站（首页 / 组件 / 文档 / Create / Blocks）
- [x] shadcn registry 分发 + Figma tokens
- [x] 组件扩充到 77 个，5 个可安装的区块（login / settings / data-table / chat / agent）
- [x] 给 AI 用：llms.txt、每个组件一份 Markdown、SKILL、shadcn MCP（通过 registry 命名空间）
- [x] registry 端到端检查（`npm run test:registry`，CI 每周跑一次）
- [ ] 多框架适配（Vue / Solid）

设计语言与设计决策见 [DESIGN_LANGUAGE.md](./DESIGN_LANGUAGE.md)。

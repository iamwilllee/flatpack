[English](./README.md) | 简体中文

# Flatpack UI

> 纸上的工具：看的方，用的圆。黑白，留白。内容是主角，界面本身几乎不出声。

Flatpack UI 是一个 React 组件库。交互部分基于 [Base UI](https://base-ui.com)（状态、键盘操作和无障碍由它负责），外观全部写在一个样式文件里。安装用 shadcn CLI，源码会复制到你的项目里，归你所有。

- **77 个组件**，**5 个可安装的区块**（登录、设置、订单、对话、Agent 运行）
- **浅色和深色**，三套主题（Flatpack、Catalog、Sage），还有一个 Create 页可以调密度、字体和形状
- **也为 AI 准备好了**：llms.txt、每个组件一份 Markdown、一个 Agent 技能，以及 shadcn MCP

文档和在线示例：**https://iamwilllee.github.io/flatpack/**

## 快速开始

需要 React 19、Tailwind CSS 4 和 TypeScript。

1. 安装主题。它会写入 `src/styles/flatpack.css`，所有组件的样式都在这个文件里：

   ```bash
   npx shadcn@latest add https://iamwilllee.github.io/flatpack/r/flatpack-theme.json
   ```

2. 在入口样式文件里引入它。这个文件已经引入了 Tailwind，所以用它替换你原来的 `@import "tailwindcss"`：

   ```css
   @import "./styles/flatpack.css";
   ```

3. 添加组件或区块。它们依赖的其他 Flatpack 组件、`@base-ui/react` 和 `lucide-react` 会一起装上，版本和本仓库测试时用的一致：

   ```bash
   npx shadcn@latest add https://iamwilllee.github.io/flatpack/r/button.json
   npx shadcn@latest add https://iamwilllee.github.io/flatpack/r/login-01.json
   ```

4. 删掉 shadcn 默认的 `:root` / `.dark` 颜色变量，Flatpack 有自己的一套。

默认是浅色。深色模式是在 `<html>` 上写 `data-theme="dark"`；想跟随系统，就在首屏渲染前根据 `matchMedia('(prefers-color-scheme: dark)')` 设置它。要用默认以外的主题，在任意元素上写 `data-fp-theme="sage"`（或 `catalog`）。

从 shadcn/ui 迁移过来？[MIGRATION.md](./MIGRATION.md)（英文）列出了改名对照和 token 对照。

## 配合 AI 使用

三种方式，选一种或组合使用。

- **llms.txt。** 把 `https://iamwilllee.github.io/flatpack/llms.txt` 给 AI（Cursor 里用 `@Docs` 添加）。它是全部组件的索引，每个组件链接到一份 Markdown；`llms-full.txt` 把所有内容放在一个文件里。
- **shadcn MCP。** 本库本身就是一个 shadcn registry，不需要单独的 MCP 服务。在项目的 `components.json` 里加上命名空间：

  ```json
  {
    "registries": {
      "@flatpack": "https://iamwilllee.github.io/flatpack/r/{name}.json"
    }
  }
  ```

  再在 AI 客户端里启用 shadcn MCP（Claude Code 运行 `npx shadcn@latest mcp init --client claude`；其他客户端把命令设为 `npx`，参数设为 `["shadcn@latest", "mcp"]`）。之后直接说"从 @flatpack 加一个登录页"，AI 就会找到并安装它。
- **Agent 技能。** [skills/flatpack-ui/SKILL.md](./skills/flatpack-ui/SKILL.md) 给 Agent 提供组件清单、准确的 props 和设计规则，它搭出来的页面就会遵守这些规则。把 `skills/flatpack-ui` 文件夹复制或链接到你所用 Agent 的技能目录，比如 Claude Code 的 `~/.claude/skills/`。

## 组件

| 分组 | 组件 |
|---|---|
| 通用 | Button、Primitives（Kicker、Separator）、ChipGroup、ToggleGroup / ButtonGroup、Toolbar |
| 布局 | Divider、ScrollArea、Masonry、BorderBeam（可选的装饰件） |
| 导航 | Tabs、Breadcrumb、Pagination、Steps、Segmented、Sidebar、DropdownMenu、ContextMenu、Menubar、CommandPalette |
| 数据录入 | Input / Label、Textarea、Select、Combobox、MultiSelect、Checkbox、RadioGroup、Switch、Slider、NumberInput、OtpField、InputGroup、Calendar、DatePicker / DateRange、FileInput、Field / Fieldset、Form |
| 数据展示 | Card、Table、DataTable、Badge、Avatar、AvatarGroup、Image、Carousel、Lightbox、Statistic、Meter、DescriptionList、Tree、Collapse、Timestamp、StatusDot、Kbd、CodeBlock、HoverCard、Empty |
| 反馈 | Alert、Toast、Dialog、AlertDialog、Sheet、Drawer、Popover、Tooltip、Progress、Spinner、Skeleton、Reveal |
| AI | Composer、Message、Thinking、ToolCall、TaskList、Approval、Diff、Sources |
| 工具 | VisuallyHidden |

**区块**是只用这些组件拼成的整屏：`login-01`、`settings-01`、`data-table-01`（订单）、`chat-01`（对话）和 `agent-01`（一次 Agent 运行：计划、删除前的审批、带来源的总结）。它们安装到 `components/blocks/`。

范围是"常用件都有，重型件只做到大多数产品够用"。日历不依赖第三方库，FileInput 只收集文件、不负责上传，Tree 能展开和选择、不支持拖拽。富文本编辑器、Markdown 渲染、Cascader 和 Transfer 有意不做。

所有表单控件和浮层都支持受控（`value` / `open` / `checked` 加 `on…Change`）和非受控（`default…`）两种用法，`id`、`name`、`required`、`aria-*`、`className`、`ref` 原样透传。会被屏幕阅读器读出的文字（关闭、分页、面包屑、状态）都有对应的 label 属性，默认英文，按你的产品语言传入。

## 设计

<!-- tokens:start -->
<!-- 本段由 scripts/build-tokens.mjs 从 tokens/flatpack.tokens.json 生成，请勿手改 -->

### 理念：纸上的工具

把界面当成一张印刷品。内容是纸上印的东西：方的，黑白的，靠页边和留白分区。控件是放在纸上、给手用的工具，所以是圆的；只有从纸上拿起来的浮层才有影子。下面三条原则都从这里来。

### 三条原则

1. **看的方，用的圆。** 拿来看的用直角：卡片、图片、表格、代码块，像纸上印的东西。拿来用的是圆的：单行控件用胶囊，多行输入框和浮层用 20px。没有中间值。
2. **黑白。** 默认只有一个强调色，就是墨色。层级靠反差和字号拉开，不靠颜色。红、绿只用于状态文字和图标。主题可以把墨色换成自己的品牌色，但每个主题仍然只有一个强调色。
3. **留白。** 分区用间距。边框只有 1px 一种，卡片里不再套第二层边框。阴影只给浮层用。

**给新组件选形状**，依次问：

1. 能操作吗（点、输入、拖动、移除）？能，就是圆的：单行用胶囊，多行用 20px。
2. 浮在页面上吗？浮着，就用 20px，并加阴影。
3. 都不是，只是拿来看的？那就是直角。

**例外：**

- 徽章（Badge）不能点，但它小，常和按钮排在一行，所以保留胶囊，像贴在纸上的贴纸。
- 复选框是方的，单选圆点是圆的。这是通行的惯例，形状本身告诉人能选几个。
- 头像是圆的，因为它代表人，不是内容面。

完整的 token（颜色、字号、间距、圆角、主题、Create 页可调项）见 [DESIGN_LANGUAGE.md](./DESIGN_LANGUAGE.md) 和文档站的「设计语言」一节。
<!-- tokens:end -->

所有样式都在 `src/styles/flatpack.css` 一个文件里。组件用 `data-slot` 属性标出每个部位，样式表按属性找到它们，所以换掉这一个文件，就换掉了整套外观。所有 token 只有一份源文件：[`tokens/flatpack.tokens.json`](./tokens/flatpack.tokens.json)。

## 文档站

文档站中英双语（顶栏的 中 / EN 切换），整站都用 Flatpack UI 自己的组件搭成。组件演示和代码示例统一用英文，这样只需维护一套。

| 页面 | 内容 |
|---|---|
| 首页 | 一屏讲清理念，再放几个真实组件 |
| 组件 | 所有组件放在一页，每个都带可复制的代码 |
| 文档 | 安装、使用、设计语言、色板、主题和 Figma tokens；每个组件一页，有实时预览、示例和 API 表 |
| Create | 在真实整屏上调密度、字体、字号、字重、字距、形状和主题，导出 `tokens/overrides.json`、CLI 命令或 CSS。预设码写在 URL 里，可以直接分享 |
| 整屏 | 12 个整屏，分五组（Corporate、Commerce、Dashboard、Account、AI）。可安装的区块会显示真实源码和安装命令 |
| 整站示例 | 三个能真实操作的整站：官网、电商和后台，可切桌面和手机视图。预览区变窄时会换成真正的移动端布局 |

视口小于 980px 时整站切换到移动端布局，390px 宽度下任何页面都不会横向滚动。整站示例里的照片来自 [Unsplash](https://unsplash.com/license)，链接都在 `src/site/photos.ts`。

## 本地开发

```bash
npm install
npm run dev            # http://localhost:5199
npm run build          # 站点、registry、Figma tokens 和 llms.txt 输出到 dist/
npm run test:unit      # 组件契约和区块（Vitest + jsdom）
npm test               # 浏览器冒烟测试，以及每个页面浅色和深色下的 axe 无障碍扫描（Playwright）
npm run test:registry  # 把 registry 装进一个全新的 Vite 项目并构建（需要联网）
```

- **Token。** 改 `tokens/flatpack.tokens.json`，再运行 `npm run build:tokens`。它会重新生成 `flatpack.css` 里的 token 块、`figma/flatpack-tokens.json`（Tokens Studio 格式），以及两份 README 和 `DESIGN_LANGUAGE.md` 里的设计章节。
- **设计检查。** `npm run check:design` 发现 `.tsx` 里写死的字号、间距、圆角、阴影或颜色，或者引用了不存在的 `--fp-*` 变量，就会报错。`npm run build` 会自动跑它。
- **组件文档。** `src/site/componentDocs.ts` 是文档页、`llms.txt` 和每个组件 Markdown 的来源。改了组件的 props，要同步改它和技能文件；单元测试会检查技能文件是否列全了所有组件，以及里面的代码示例能否通过类型检查。
- **Registry。** `npm run build:registry` 生成 `registry.json` 和 `public/r/*.json`。依赖都写成完整 URL，CLI 不会误装 shadcn 自带的同名组件；npm 依赖的版本按 `package.json` 里声明的范围写入。

每次推送到 `main`，CI 会跑单元测试和浏览器测试，然后把站点部署到 GitHub Pages。registry 安装检查每周跑一次。

## 路线图

- [x] 组件、区块和整站示例
- [x] shadcn registry、Figma tokens 和三套主题
- [x] AI：llms.txt、每个组件的 Markdown、Agent 技能、shadcn MCP、AI 组件和区块
- [x] CI 里的 registry 安装检查
- [ ] Vue 和 Solid 版本

## 许可证

[MIT](./LICENSE)

// Structured documentation for every Flatpack UI component.
// Each entry drives the ComponentDocPage: description, import, usage,
// variant examples (with live preview + code), and an API reference table.
// Chinese copy stays in `description` / `desc`; English lives in
// `descriptionEn` / `descEn`. Code samples are always English.

export type ApiRow = { prop: string; type: string; default?: string; desc: string; descEn?: string }
export type Example = { title: string; titleEn?: string; code: string; render: 'preview' }
export type ComponentDoc = {
  id: string
  title: string
  category: string
  categoryEn?: string
  description: string
  descriptionEn: string
  importPath: string
  usage: string
  examples: Example[]
  api: ApiRow[]
}

// Doc ids that were renamed, old → new. The site and scripts/build-llms.mjs send the old URLs to the new page.
export const movedDocs = new Map<string, string>([['dropdown', 'dropdown-menu']])

// The one-time setup that goes before any component's install command. Every component's styles live
// in the flatpack-theme stylesheet, yet no ui item lists it as a registry dependency: re-adding a
// component would then offer to overwrite a customized theme. flatpack.css imports tailwindcss itself. ComponentDocPage and
// scripts/build-llms.mjs (docs/<id>.md, llms.txt) both read this, so they say the same thing.
export const themeSetup = {
  command: (origin: string) => `npx shadcn@latest add ${origin}/r/flatpack-theme.json`,
  css: '@import "./styles/flatpack.css";',
  zh: { theme: '第一次使用：先装主题样式，所有组件的样式都在这个文件里', css: '再在入口样式（如 src/index.css）里引入。它已包含 @import "tailwindcss"，用它替换你自己的 tailwind 引入：', component: '安装组件（依赖的组件会一起装上）' },
  en: { theme: 'first time only: install the theme, which holds the styles of every component', css: 'then import it in your entry stylesheet (such as src/index.css). It already includes @import "tailwindcss", so use it in place of your own Tailwind import:', component: 'add the component (its dependencies come with it)' },
}

export const docs: ComponentDoc[] = [
  {
    id: 'button', title: 'Button', category: '通用', categoryEn: 'General',
    description: '按钮触发一个操作。5 种视觉变体、4 种尺寸，black 为主色，通过 data-slot 换肤。',
    descriptionEn: 'A button triggers an action. Five visual variants and four sizes; black is the primary color, and data-slot drives theming.',
    importPath: '@/components/ui/button',
    usage: `import { Button } from "@/components/ui/button"\n\n<Button>Build your interface</Button>`,
    examples: [
      { title: '变体', titleEn: 'Variants', code: `<Button>Primary</Button>\n<Button variant="secondary">Secondary</Button>\n<Button variant="outline">Outline</Button>\n<Button variant="ghost">Ghost</Button>\n<Button variant="destructive">Delete</Button>\n<Button variant="link">Link</Button>`, render: 'preview' },
      { title: '尺寸', titleEn: 'Sizes', code: `<Button size="sm">Small</Button>\n<Button size="default">Default</Button>\n<Button size="lg">Large</Button>\n<Button size="icon"><Search size={15} /></Button>`, render: 'preview' },
      { title: '禁用', titleEn: 'Disabled', code: `<Button disabled>Disabled</Button>`, render: 'preview' },
    ],
    api: [
      { prop: 'variant', type: '"default" | "secondary" | "outline" | "ghost" | "destructive" | "link"', default: '"default"', desc: '视觉变体。destructive 只用红色文字和描边，不填充', descEn: 'Visual variant. destructive is red text and ring only, never a fill' },
      { prop: 'size', type: '"default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg"', default: '"default"', desc: '尺寸（32 / 40 / 48px）', descEn: 'Size (32 / 40 / 48px)' },
      { prop: 'disabled', type: 'boolean', default: 'false', desc: '禁用状态', descEn: 'Disabled state' },
      { prop: '...props', type: 'ButtonHTMLAttributes', desc: '原生 button 属性', descEn: 'Native button attributes' },
    ],
  },
  {
    id: 'card', title: 'Card', category: '数据展示', categoryEn: 'Data display',
    description: '纸板表面容器。由 Card、CardHeader、CardTitle、CardDescription、CardContent、CardFooter 组合而成。',
    descriptionEn: 'Paperboard surface container built from Card, CardHeader, CardTitle, CardDescription, CardContent and CardFooter.',
    importPath: '@/components/ui/card',
    usage: `import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"\n\n<Card>\n  <CardHeader>\n    <CardTitle>Title</CardTitle>\n  </CardHeader>\n  <CardContent>Content</CardContent>\n</Card>`,
    examples: [
      { title: '产品卡片', titleEn: 'Product card', code: `<Card>\n  <CardHeader>\n    <CardTitle>Minimal side table</CardTitle>\n    <CardDescription>Aluminum / 65 × 65 cm</CardDescription>\n  </CardHeader>\n  <CardContent>\n    <Image ratio="4:3" alt="Side table" src="/product.jpg" />\n  </CardContent>\n  <CardFooter>\n    <strong>¥ 499</strong>\n    <Button size="sm">Add to cart</Button>\n  </CardFooter>\n</Card>`, render: 'preview' },
    ],
    api: [
      { prop: ' children', type: 'ReactNode', desc: '任意子组件', descEn: 'Any child nodes' },
      { prop: 'className', type: 'string', desc: '附加样式类', descEn: 'Extra style classes' },
      { prop: '...props', type: 'HTMLAttributes<HTMLDivElement>', desc: '原生 div 属性（各子组件同理）', descEn: 'Native div attributes (same for every subcomponent)' },
    ],
  },
  {
    id: 'badge', title: 'Badge', category: '数据展示', categoryEn: 'Data display',
    description: '小标签，用于状态与分类。4 种变体，等宽大写排版。',
    descriptionEn: 'Small label for status and category. Four variants, set in monospace uppercase.',
    importPath: '@/components/ui/badge',
    usage: `import { Badge } from "@/components/ui/badge"\n\n<Badge>New</Badge>`,
    examples: [
      { title: '变体', titleEn: 'Variants', code: `<Badge>New</Badge>\n<Badge variant="outline">For sale</Badge>\n<Badge variant="success">In stock</Badge>\n<Badge variant="danger">Sold out</Badge>`, render: 'preview' },
    ],
    api: [
      { prop: 'variant', type: '"default" | "outline" | "success" | "danger"', default: '"default"', desc: '视觉变体：墨底 / 描边 / 成功文字 / 错误文字。状态色只上文字，不铺底色', descEn: 'Visual variant: ink fill / outline / success text / danger text. Status colors apply to text only, never a fill' },
      { prop: '...props', type: 'HTMLAttributes<HTMLSpanElement>', desc: '原生 span 属性', descEn: 'Native span attributes' },
    ],
  },
  {
    id: 'input', title: 'Input / Label', category: '数据录入', categoryEn: 'Data entry',
    description: '输入框与标签。默认是 1px 描边，悬停加深，聚焦变成墨色；variant="filled" 是浅灰底、无边框，适合搜索框。leading / trailing 放前后图标。size 与按钮同高。',
    descriptionEn: 'Text input and label. The default is a 1px border that darkens on hover and turns ink on focus; variant="filled" is a light grey fill with no border, good for search. leading / trailing hold icons. size matches Button heights.',
    importPath: '@/components/ui/input',
    usage: `import { Input, Label } from "@/components/ui/input"\n\n<Label>Room name</Label>\n<Input placeholder="e.g. Living room" />`,
    examples: [
      { title: '基础表单', titleEn: 'Basic form', code: `<Label>Room name</Label>\n<Input placeholder="e.g. Living room" />\n\n<Label>Dimensions (cm)</Label>\n<Input defaultValue="65 × 65" />`, render: 'preview' },
      { title: '搜索框：浅灰底与前置图标', titleEn: 'Search: filled with a leading icon', code: `<Input variant="filled" leading={<Search size={16} />} placeholder="找一个项目" />\n\n<Input leading={<Search size={16} />} trailing={<Kbd>⌘K</Kbd>} placeholder="Search docs" />`, render: 'preview' },
    ],
    api: [
      { prop: 'variant', type: '"outline" | "filled"', default: '"outline"', desc: '描边，或浅灰底无边框', descEn: 'Outlined, or a light grey fill with no border' },
      { prop: 'size', type: '"sm" | "md" | "lg"', default: '"md"', desc: '高度 32 / 40 / 48，与按钮一致', descEn: 'Height 32 / 40 / 48, same as Button' },
      { prop: 'leading / trailing', type: 'ReactNode', desc: '前后图标或短文字', descEn: 'Icon or short text before / after' },
      { prop: '...props', type: 'InputHTMLAttributes / LabelHTMLAttributes', desc: '原生 input / label 属性', descEn: 'Native input / label attributes' },
    ],
  },
  {
    id: 'dialog', title: 'Dialog', category: '反馈', categoryEn: 'Feedback',
    description: '模态对话框，portal 渲染到 body，支持 ESC 关闭与点击遮罩关闭。',
    descriptionEn: 'Modal dialog rendered into a portal on body; closes on ESC or an overlay click.',
    importPath: '@/components/ui/dialog',
    usage: `import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog"\n\n<Dialog>\n  <DialogTrigger>Open</DialogTrigger>\n  <DialogContent>\n    <DialogTitle>Title</DialogTitle>\n    <DialogClose>Close</DialogClose>\n  </DialogContent>\n</Dialog>`,
    examples: [
      { title: '操作说明', titleEn: 'Instructions', code: `<Dialog>\n  <DialogTrigger>Open instructions</DialogTrigger>\n  <DialogContent>\n    <DialogHeader>\n      <DialogTitle>Confirm configuration</DialogTitle>\n      <DialogDescription>Follow the prompts to finish setup.</DialogDescription>\n    </DialogHeader>\n    <DialogFooter>\n      <DialogClose>Back</DialogClose>\n      <DialogClose><Button>Next</Button></DialogClose>\n    </DialogFooter>\n  </DialogContent>\n</Dialog>`, render: 'preview' },
    ],
    api: [
      { prop: 'defaultOpen', type: 'boolean', default: 'false', desc: 'Dialog 根组件：默认是否打开', descEn: 'Dialog root: whether it is open by default' },
      { prop: '...props', type: 'Native attributes', desc: 'Trigger/Close 接受 button 属性，其他接受 div/h 属性', descEn: 'Trigger / Close accept button attributes; the rest accept div / heading attributes' },
      { prop: 'open / onOpenChange', type: 'boolean / (open) => void', desc: 'Dialog：受控模式；defaultOpen 为非受控', descEn: 'Dialog: controlled mode; defaultOpen for uncontrolled' },
      { prop: 'showCloseButton / closeLabel', type: 'boolean / string', desc: 'DialogContent：右上角关闭按钮及其可访问名称，默认关闭', descEn: 'DialogContent: corner close button and its accessible name, off by default' },
      { prop: 'render', type: 'ReactElement', desc: 'DialogTrigger / DialogClose：换成自己的元素，例如 <Button variant="destructive" />', descEn: 'DialogTrigger / DialogClose: use your own element, e.g. <Button variant="destructive" />' }
    ],
  },
  {
    id: 'tabs', title: 'Tabs', category: '导航', categoryEn: 'Navigation',
    description: '标签页切换。由 Tabs / TabsList / TabsTrigger / TabsContent 组合。',
    descriptionEn: 'Tab switching, composed of Tabs / TabsList / TabsTrigger / TabsContent.',
    importPath: '@/components/ui/tabs',
    usage: `import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"\n\n<Tabs defaultValue="a">\n  <TabsList>\n    <TabsTrigger value="a">A</TabsTrigger>\n  </TabsList>\n  <TabsContent value="a">Content</TabsContent>\n</Tabs>`,
    examples: [
      { title: '三个面板', titleEn: 'Three panels', code: `<Tabs defaultValue="spec">\n  <TabsList>\n    <TabsTrigger value="spec">Specs</TabsTrigger>\n    <TabsTrigger value="review">Reviews</TabsTrigger>\n    <TabsTrigger value="care">Care</TabsTrigger>\n  </TabsList>\n  <TabsContent value="spec">Solid pine frame.</TabsContent>\n  <TabsContent value="review">Takes ten minutes to assemble.</TabsContent>\n  <TabsContent value="care">Wipe with a soft cloth.</TabsContent>\n</Tabs>`, render: 'preview' },
    ],
    api: [
      { prop: 'defaultValue', type: 'string', desc: 'Tabs 根组件：默认激活项', descEn: 'Tabs root: tab active by default' },
      { prop: 'value', type: 'string', desc: 'Trigger/Content 的匹配值', descEn: 'Matching value for Trigger / Content' },
      { prop: 'value / onValueChange', type: 'string / (value) => void', desc: '受控模式。不传 value 时用 defaultValue', descEn: 'Controlled mode. Without value, defaultValue is used' },
      { prop: 'keepMounted', type: 'boolean', desc: 'TabsContent：切换后保留面板，默认 true', descEn: 'TabsContent: keep inactive panels mounted, default true' }
    ],
  },
  {
    id: 'sheet', title: 'Sheet', category: '反馈', categoryEn: 'Feedback',
    description: '右侧抽屉，portal 渲染。适合购物车、筛选面板等侧边内容。',
    descriptionEn: 'Right-side drawer rendered in a portal. Suits carts, filter panels and other side content.',
    importPath: '@/components/ui/sheet',
    usage: `import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"\n\n<Sheet>\n  <SheetTrigger>Open</SheetTrigger>\n  <SheetContent title="Title">Content</SheetContent>\n</Sheet>`,
    examples: [
      { title: '购物车', titleEn: 'Cart', code: `<Sheet>\n  <SheetTrigger>Cart (2)</SheetTrigger>\n  <SheetContent title="Cart">\n    {/* Line items */}\n    <Button style={{ width: '100%' }}>Checkout</Button>\n  </SheetContent>\n</Sheet>`, render: 'preview' },
    ],
    api: [
      { prop: 'defaultOpen', type: 'boolean', default: 'false', desc: '默认是否打开', descEn: 'Whether it is open by default' },
      { prop: 'title', type: 'string', desc: 'SheetContent：抽屉标题', descEn: 'SheetContent: drawer title' },
    ],
  },
  {
    id: 'dropdown-menu', title: 'DropdownMenu', category: '导航', categoryEn: 'Navigation',
    description: '下拉菜单，点击外部自动关闭。由 Trigger / Content / Item / Separator 组合。',
    descriptionEn: 'Dropdown menu that closes on an outside click; composed of Trigger / Content / Item / Separator.',
    importPath: '@/components/ui/dropdown-menu',
    usage: `import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"\n\n<DropdownMenu>\n  <DropdownMenuTrigger>Menu</DropdownMenuTrigger>\n  <DropdownMenuContent>\n    <DropdownMenuItem>Item</DropdownMenuItem>\n  </DropdownMenuContent>\n</DropdownMenu>`,
    examples: [
      { title: '商品分类', titleEn: 'Categories', code: `<DropdownMenu>\n  <DropdownMenuTrigger>Category</DropdownMenuTrigger>\n  <DropdownMenuContent>\n    <DropdownMenuItem>Living room</DropdownMenuItem>\n    <DropdownMenuItem>Bedroom</DropdownMenuItem>\n    <DropdownMenuSeparator />\n    <DropdownMenuItem>Office and study</DropdownMenuItem>\n  </DropdownMenuContent>\n</DropdownMenu>`, render: 'preview' },
    ],
    api: [
      { prop: 'onSelect', type: '() => void', desc: 'DropdownMenuItem：选中回调', descEn: 'DropdownMenuItem: select callback' },
      { prop: 'open / onOpenChange', type: 'boolean / (open) => void', desc: 'DropdownMenu：受控模式', descEn: 'DropdownMenu: controlled mode' },
      { prop: 'render / hideChevron', type: 'ReactElement / boolean', desc: 'DropdownMenuTrigger：换成自己的触发元素，或隐藏箭头', descEn: 'DropdownMenuTrigger: use your own trigger, or hide the chevron' },
      { prop: 'destructive / disabled / onClick', type: 'boolean', desc: 'DropdownMenuItem：红色文字、禁用、点击', descEn: 'DropdownMenuItem: red text, disabled, click' }
    ],
  },
  {
    id: 'sidebar', title: 'Sidebar', category: '导航', categoryEn: 'Navigation',
    description: '侧边导航，由 Sidebar / SidebarSection / SidebarItem 组合。每组上方是一行灰色小标题，当前项带 aria-current="page"；用 render 可以把导航项换成路由链接。',
    descriptionEn: 'Side navigation, composed of Sidebar / SidebarSection / SidebarItem. Each group sits under a small grey caption, the current item carries aria-current="page", and render turns an item into a router link.',
    importPath: '@/components/ui/sidebar',
    usage: `import { Sidebar, SidebarSection, SidebarItem } from "@/components/ui/sidebar"\n\n<Sidebar>\n  <SidebarSection label="Workspace">\n    <SidebarItem active>Overview</SidebarItem>\n    <SidebarItem>Orders</SidebarItem>\n  </SidebarSection>\n</Sidebar>`,
    examples: [
      { title: '工作台导航', titleEn: 'Workspace navigation', code: `<Sidebar aria-label="Workspace">\n  <SidebarSection label="Workspace">\n    <SidebarItem icon={<LayoutGrid size={16} />} active>Overview</SidebarItem>\n    <SidebarItem icon={<BookOpen size={16} />}>Library</SidebarItem>\n    <SidebarItem icon={<Heart size={16} />}>Saved</SidebarItem>\n  </SidebarSection>\n  <SidebarSection label="Account">\n    <SidebarItem icon={<Moon size={16} />}>Appearance</SidebarItem>\n  </SidebarSection>\n</Sidebar>`, render: 'preview' },
    ],
    api: [
      { prop: 'Sidebar', type: 'HTMLAttributes<HTMLElement>', desc: '外框，渲染 <aside>，HTML 属性透传', descEn: 'The frame: renders an <aside> and forwards HTML attributes' },
      { prop: 'SidebarSection label', type: 'string', desc: '必填，这一组上方的灰色小标题；其余 HTML 属性透传到外层 div', descEn: 'Required: the grey caption above the group. Other HTML attributes go to the wrapping div' },
      { prop: 'SidebarItem active', type: 'boolean', default: 'false', desc: '当前项：加 data-active 和 aria-current="page"', descEn: 'The current item: sets data-active and aria-current="page"' },
      { prop: 'SidebarItem icon', type: 'ReactNode', desc: '文字前的图标（lucide 16px）', descEn: 'Icon before the text (lucide, 16px)' },
      { prop: 'SidebarItem render', type: 'ReactElement', desc: '换成别的元素，比如路由链接：render={<Link to="/x" />}。默认是 <button type="button">', descEn: 'Render another element, such as a router link: render={<Link to="/x" />}. Defaults to <button type="button">' },
      { prop: 'SidebarItem ...props', type: 'ButtonHTMLAttributes<HTMLButtonElement>', desc: 'onClick 等属性透传；文字是字符串时同时用作 title', descEn: 'onClick and other attributes are forwarded; a string label is also used as the title' },
    ],
  },
  {
    id: 'table', title: 'Table', category: '数据展示', categoryEn: 'Data display',
    description: '表格。等宽大写表头、悬停高亮，适合物料清单这类清单数据。',
    descriptionEn: 'Table with monospace uppercase headers and hover highlight, built for list-style data such as item lists.',
    importPath: '@/components/ui/table',
    usage: `import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"\n\n<Table>\n  <TableHeader>\n    <TableRow><TableHead>Column</TableHead></TableRow>\n  </TableHeader>\n  <TableBody>\n    <TableRow><TableCell>Value</TableCell></TableRow>\n  </TableBody>\n</Table>`,
    examples: [
      { title: '物料清单', titleEn: 'Item list', code: `<Table>\n  <TableCaption>ITEM LIST</TableCaption>\n  <TableHeader>\n    <TableRow>\n      <TableHead>Item</TableHead><TableHead>Qty</TableHead><TableHead>Status</TableHead>\n    </TableRow>\n  </TableHeader>\n  <TableBody>\n    <TableRow>\n      <TableCell>Monitor</TableCell><TableCell>1</TableCell>\n      <TableCell><Badge variant="outline">Done</Badge></TableCell>\n    </TableRow>\n  </TableBody>\n</Table>`, render: 'preview' },
    ],
    api: [{ prop: '...props', type: 'Native table attributes', desc: '各子组件透传 HTML 属性', descEn: 'Each subcomponent forwards HTML attributes' }],
  },
  {
    id: 'primitives', title: 'Primitives', category: '通用', categoryEn: 'General',
    description: '两个小部件：Separator 是一条 1px 横线，Kicker 是标题上方的一行灰色小字。要带文字或竖向的分隔线，用 Divider。',
    descriptionEn: 'Two small parts: Separator, a plain 1px horizontal rule, and Kicker, the grey line of text above a heading. For a rule with a label, or a vertical one, use Divider.',
    importPath: '@/components/ui/primitives',
    usage: `import { Separator, Kicker } from "@/components/ui/primitives"\n\n<Kicker>Autumn collection</Kicker>\n<h2>Quiet rooms, fewer things</h2>\n<Separator />`,
    examples: [
      { title: '分区标题', titleEn: 'Section heading', code: `<div>\n  <Kicker>Autumn collection</Kicker>\n  <h2>Quiet rooms, fewer things</h2>\n</div>\n<Separator />\n<p>Twelve pieces, each sized for a small flat.</p>`, render: 'preview' },
    ],
    api: [
      { prop: 'Separator', type: 'HTMLAttributes<HTMLHRElement>', desc: '渲染 <hr>：一条 1px 的 --fp-line 横线，HTML 属性透传', descEn: 'Renders an <hr>: a 1px rule in --fp-line. HTML attributes are forwarded' },
      { prop: 'Kicker', type: 'HTMLAttributes<HTMLDivElement>', desc: '渲染 <div>：14px、字重 500、--fp-muted 灰色，HTML 属性透传', descEn: 'Renders a <div> in 14px, weight 500, --fp-muted grey. HTML attributes are forwarded' },
    ],
  },
  {
    id: 'breadcrumb', title: 'Breadcrumb', category: '导航', categoryEn: 'Navigation',
    description: '面包屑导航，显示当前页面在层级中的位置。',
    descriptionEn: 'Breadcrumb navigation that shows where the current page sits in the hierarchy.',
    importPath: '@/components/ui/breadcrumb',
    usage: `import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbCurrent, BreadcrumbSeparator } from "@/components/ui/breadcrumb"\n\n<Breadcrumb>\n  <BreadcrumbItem><BreadcrumbLink>Home</BreadcrumbLink></BreadcrumbItem>\n  <BreadcrumbSeparator />\n  <BreadcrumbItem><BreadcrumbCurrent>Current</BreadcrumbCurrent></BreadcrumbItem>\n</Breadcrumb>`,
    examples: [
      { title: '层级导航', titleEn: 'Hierarchy', code: `<Breadcrumb>\n  <BreadcrumbItem><BreadcrumbLink>Home</BreadcrumbLink></BreadcrumbItem>\n  <BreadcrumbSeparator />\n  <BreadcrumbItem><BreadcrumbLink>Bedroom</BreadcrumbLink></BreadcrumbItem>\n  <BreadcrumbSeparator />\n  <BreadcrumbItem><BreadcrumbCurrent>Beds and mattresses</BreadcrumbCurrent></BreadcrumbItem>\n</Breadcrumb>`, render: 'preview' },
    ],
    api: [
      { prop: 'href', type: 'string', default: '"#"', desc: 'BreadcrumbLink：链接地址', descEn: 'BreadcrumbLink: link target' },
    ],
  },
  {
    id: 'image', title: 'Image', category: '数据展示', categoryEn: 'Data display',
    description: '图片容器，固定比例裁切，加载失败自动降级为占位。',
    descriptionEn: 'Image container with fixed-ratio cropping that falls back to a placeholder when loading fails.',
    importPath: '@/components/ui/image',
    usage: `import { Image } from "@/components/ui/image"\n\n<Image ratio="4:3" alt="Side table" src="/product.jpg" />`,
    examples: [
      { title: '四种比例', titleEn: 'Four ratios', code: `<Image ratio="square" alt="Square" src="/a.jpg" />\n<Image ratio="4:3" alt="Four by three" src="/b.jpg" />\n<Image ratio="16:9" alt="Widescreen" src="/c.jpg" />\n<Image ratio="3:4" alt="Portrait" src="/d.jpg" />`, render: 'preview' },
      { title: '降级占位', titleEn: 'Fallback', code: `<Image ratio="4:3" alt="No image yet" />\n{/* Shows the alt text placeholder when src is empty or fails to load */}`, render: 'preview' },
    ],
    api: [
      { prop: 'ratio', type: '"square" | "4:3" | "16:9" | "3:4"', default: '"4:3"', desc: '宽高比', descEn: 'Aspect ratio' },
      { prop: 'fallback', type: 'ReactNode', desc: '自定义降级内容', descEn: 'Custom fallback content' },
      { prop: '...props', type: 'ImgHTMLAttributes', desc: '原生 img 属性（src / alt 等）', descEn: 'Native img attributes (src / alt, etc.)' },
    ],
  },
  {
    id: 'avatar', title: 'Avatar', category: '数据展示', categoryEn: 'Data display',
    description: '头像。无图片时用姓名首字母，图片加载失败自动降级。',
    descriptionEn: 'Avatar. Uses the initials of the name when there is no image, and degrades gracefully if the image fails to load.',
    importPath: '@/components/ui/avatar',
    usage: `import { Avatar } from "@/components/ui/avatar"\n\n<Avatar name="Alex Wang" />`,
    examples: [
      { title: '尺寸与首字母', titleEn: 'Sizes & initials', code: `<Avatar size="sm" name="Ann" />\n<Avatar size="md" name="Alex Wang" />\n<Avatar size="lg" name="Anna" />`, render: 'preview' },
    ],
    api: [
      { prop: 'size', type: '"sm" | "md" | "lg"', default: '"md"', desc: '尺寸', descEn: 'Size' },
      { prop: 'name', type: 'string', default: '""', desc: '姓名，用于首字母与 title', descEn: 'Name used for the initials and the title' },
      { prop: 'src', type: 'string', desc: '头像图片地址', descEn: 'Avatar image URL' },
    ],
  },
  {
    id: 'empty', title: 'Empty', category: '数据展示', categoryEn: 'Data display',
    description: '空状态。内置线条插画，可自定义标题、描述与操作按钮。',
    descriptionEn: 'Empty state with a built-in line illustration and customizable title, description and action button.',
    importPath: '@/components/ui/empty',
    usage: `import { Empty } from "@/components/ui/empty"\n\n<Empty title="Nothing here yet" description="Try a different filter" />`,
    examples: [
      { title: '无搜索结果', titleEn: 'No results', code: `<Empty\n  title="No matching results"\n  description="Try another category, or adjust your size filters."\n  action={<Button size="sm">Clear filters</Button>}\n/>`, render: 'preview' },
    ],
    api: [
      { prop: 'title', type: 'string', default: '"这里还空着"', desc: '标题', descEn: 'Title' },
      { prop: 'description', type: 'string', desc: '描述文字', descEn: 'Description text' },
      { prop: 'action', type: 'ReactNode', desc: '操作区，通常放按钮', descEn: 'Action area, usually a button' },
      { prop: 'icon', type: 'ReactNode', desc: '自定义插画', descEn: 'Custom illustration' },
    ],
  },
  {
    id: 'steps', title: 'Steps', category: '导航', categoryEn: 'Navigation',
    description: '步骤条。done / current / upcoming 三态，带竖线轨道——任务流程的核心组件。',
    descriptionEn: 'Step indicator with done / current / upcoming states and a vertical rail — the core component for task flows.',
    importPath: '@/components/ui/steps',
    usage: `import { Steps } from "@/components/ui/steps"\n\n<Steps current={0} steps={[{ title: 'Create project' }, { title: 'Publish' }]} />`,
    examples: [
      { title: '任务流程', titleEn: 'Task flow', code: `<Steps\n  current={1}\n  steps={[\n    { title: 'Create project', description: 'Enter the basic project details' },\n    { title: 'Configure', description: 'Set the core parameters' },\n    { title: 'Go live', description: 'Review and save' },\n    { title: 'Done' },\n  ]}\n/>`, render: 'preview' },
    ],
    api: [
      { prop: 'steps', type: '{ title: string; description?: string }[]', desc: '步骤数组', descEn: 'Array of steps' },
      { prop: 'current', type: 'number', desc: '当前步骤索引（0 起）', descEn: 'Current step index (0-based)' },
    ],
  },
  {
    id: 'select', title: 'Select', category: '数据录入', categoryEn: 'Data entry',
    description: '下拉选择器。自定义 listbox，点击外部或 ESC 关闭，支持受控与非受控。',
    descriptionEn: 'Select menu with a custom listbox that closes on an outside click or ESC; supports controlled and uncontrolled use.',
    importPath: '@/components/ui/select',
    usage: `import { Select } from "@/components/ui/select"\n\n<Select\n  options={[{ value: 'a', label: 'A' }]}\n  defaultValue="a"\n/>`,
    examples: [
      { title: '房间选择', titleEn: 'Room picker', code: `<Select\n  options={[\n    { value: 'living', label: 'Living room' },\n    { value: 'bedroom', label: 'Bedroom' },\n    { value: 'kitchen', label: 'Kitchen' },\n  ]}\n  defaultValue="living"\n  onValueChange={(value) => console.log(value)}\n/>`, render: 'preview' },
      { title: '占位提示', titleEn: 'Placeholder', code: `<Select\n  options={[{ value: 'a', label: 'A' }]}\n  placeholder="Select a room"\n/>`, render: 'preview' },
    ],
    api: [
      { prop: 'options', type: '{ value: string; label: string }[]', desc: '选项数组', descEn: 'Array of options' },
      { prop: 'value / defaultValue', type: 'string', desc: '受控值 / 默认值', descEn: 'Controlled value / default value' },
      { prop: 'onValueChange', type: '(value: string) => void', desc: '选中回调', descEn: 'Select callback' },
      { prop: 'placeholder', type: 'string', default: '"请选择"', desc: '未选中时的占位', descEn: 'Placeholder shown when nothing is selected' },
      { prop: 'disabled', type: 'boolean', default: 'false', desc: '禁用', descEn: 'Disabled' },
      { prop: 'name / required / id', type: 'string | boolean', desc: '提交到表单、标记必填、给触发器 id', descEn: 'Submit with a form, mark required, set the trigger id' },
      { prop: 'aria-label / aria-labelledby', type: 'string', desc: '触发器的可访问名称', descEn: 'Accessible name of the trigger' },
      { prop: 'open / onOpenChange', type: 'boolean / (open) => void', desc: '受控地打开或关闭', descEn: 'Control the open state' },
      { prop: 'SelectRoot, SelectTrigger, SelectContent, SelectItem, SelectValue', type: 'compound', desc: '完整的 Base UI 组合式写法，用于 options 表达不了的场景', descEn: 'The full Base UI compound form, for what options cannot express' }
    ],
  },
  {
    id: 'checkbox', title: 'Checkbox', category: '数据录入', categoryEn: 'Data entry',
    description: '复选框。支持选中、未选、半选（indeterminate）三态与禁用。',
    descriptionEn: 'Checkbox with checked, unchecked and indeterminate states, plus a disabled state.',
    importPath: '@/components/ui/checkbox',
    usage: `import { Checkbox } from "@/components/ui/checkbox"\n\n<Checkbox label="Sofa" />`,
    examples: [
      { title: '各种状态', titleEn: 'States', code: `<Checkbox defaultChecked label="Sofa" />\n<Checkbox label="Coffee table" />\n<Checkbox indeterminate label="Rug" />\n<Checkbox disabled defaultChecked label="Discontinued" />`, render: 'preview' },
    ],
    api: [
      { prop: 'checked / defaultChecked', type: 'boolean', desc: '受控值 / 默认值', descEn: 'Controlled value / default value' },
      { prop: 'indeterminate', type: 'boolean', default: 'false', desc: '半选状态', descEn: 'Indeterminate state' },
      { prop: 'label', type: 'ReactNode', desc: '旁边文字', descEn: 'Adjacent label text' },
      { prop: 'onCheckedChange', type: '(checked: boolean) => void', desc: '变化回调', descEn: 'Change callback' },
      { prop: 'id / name / value / required', type: 'string | boolean', desc: '透传给表单控件，可在 <form> 中提交', descEn: 'Passed to the form control, so it submits with a <form>' },
      { prop: '...props', type: 'Base UI Checkbox.Root props', desc: '其余 Base UI 属性原样透传（inputRef、readOnly、aria-*…）', descEn: 'Other Base UI root props pass through (inputRef, readOnly, aria-*…)' }
    ],
  },
  {
    id: 'radio', title: 'RadioGroup', category: '数据录入', categoryEn: 'Data entry',
    description: '单选组。同一组内互斥，可禁用单项。',
    descriptionEn: 'Radio group with mutually exclusive options inside the group; individual options can be disabled.',
    importPath: '@/components/ui/radio',
    usage: `import { RadioGroup } from "@/components/ui/radio"\n\n<RadioGroup\n  options={[{ value: 'a', label: 'A' }]}\n  defaultValue="a"\n/>`,
    examples: [
      { title: '配送方式', titleEn: 'Delivery options', code: `<RadioGroup\n  defaultValue="standard"\n  options={[\n    { value: 'standard', label: 'Standard delivery (3-5 days)' },\n    { value: 'express', label: 'Express delivery (next day)' },\n    { value: 'pickup', label: 'Store pickup', disabled: true },\n  ]}\n/>`, render: 'preview' },
    ],
    api: [
      { prop: 'options', type: '{ value; label; disabled? }[]', desc: '选项数组', descEn: 'Array of options' },
      { prop: 'value / defaultValue', type: 'string', desc: '受控值 / 默认值', descEn: 'Controlled value / default value' },
      { prop: 'onValueChange', type: '(value: string) => void', desc: '变化回调', descEn: 'Change callback' },
      { prop: 'name', type: 'string', desc: '原生 radio group 名称', descEn: 'Native radio group name' },
    ],
  },
  {
    id: 'switch', title: 'Switch', category: '数据录入', categoryEn: 'Data entry',
    description: '开关。用于即时生效的布尔设置。',
    descriptionEn: 'Switch for boolean settings that take effect immediately.',
    importPath: '@/components/ui/switch',
    usage: `import { Switch } from "@/components/ui/switch"\n\n<Switch label="Receive notifications" />`,
    examples: [
      { title: '设置项', titleEn: 'Settings', code: `<Switch defaultChecked label="New product alerts" />\n<Switch label="Price alerts" />\n<Switch disabled label="Locked" />`, render: 'preview' },
    ],
    api: [
      { prop: 'checked / defaultChecked', type: 'boolean', desc: '受控值 / 默认值', descEn: 'Controlled value / default value' },
      { prop: 'label', type: 'ReactNode', desc: '旁边文字', descEn: 'Adjacent label text' },
      { prop: 'onCheckedChange', type: '(checked: boolean) => void', desc: '变化回调', descEn: 'Change callback' },
      { prop: 'disabled', type: 'boolean', default: 'false', desc: '禁用', descEn: 'Disabled' },
      { prop: 'id / name / required', type: 'string | boolean', desc: '透传给表单控件', descEn: 'Passed to the form control' },
      { prop: '...props', type: 'Base UI Switch.Root props', desc: '其余 Base UI 属性原样透传', descEn: 'Other Base UI root props pass through' }
    ],
  },
  {
    id: 'alert', title: 'Alert', category: '反馈', categoryEn: 'Feedback',
    description: '警告提示。4 种语义变体，左侧 3px 色条区分类型，主色调不受影响。',
    descriptionEn: 'Inline alert with four semantic variants; a 3px color bar on the left marks the type and the primary color stays untouched.',
    importPath: '@/components/ui/alert',
    usage: `import { Alert } from "@/components/ui/alert"\n\n<Alert variant="info" title="Note">Content</Alert>`,
    examples: [
      { title: '四种语义', titleEn: 'Four variants', code: `<Alert variant="info" title="Delivery">Estimated delivery on the 20th.</Alert>\n<Alert variant="success" title="Added to cart">Your side table has been added.</Alert>\n<Alert variant="warning" title="Low stock">Only 3 left.</Alert>\n<Alert variant="error" title="Address missing" onClose={() => {}}>Please add a shipping address.</Alert>`, render: 'preview' },
    ],
    api: [
      { prop: 'variant', type: '"info" | "success" | "warning" | "error"', default: '"info"', desc: '语义变体', descEn: 'Semantic variant' },
      { prop: 'title', type: 'ReactNode', desc: '标题', descEn: 'Title' },
      { prop: 'onClose', type: '() => void', desc: '提供则显示关闭按钮', descEn: 'Shows a close button when provided' },
      { prop: 'closeLabel', type: 'string', desc: '关闭按钮的可访问名称，用于本地化', descEn: 'Accessible name of the close button, for localization' },
      { prop: '...props', type: 'HTMLAttributes<div>', desc: '其余原生属性透传（id、className、data-*）', descEn: 'Other native attributes pass through (id, className, data-*)' }
    ],
  },
  {
    id: 'skeleton', title: 'Skeleton', category: '反馈', categoryEn: 'Feedback',
    description: '骨架屏。带微光动画，SkeletonText 快速生成多行文本占位。',
    descriptionEn: 'Skeleton placeholder with a subtle shimmer; SkeletonText quickly builds multi-line text placeholders.',
    importPath: '@/components/ui/skeleton',
    usage: `import { Skeleton, SkeletonText } from "@/components/ui/skeleton"\n\n<Skeleton circle width={44} height={44} />\n<SkeletonText lines={3} />`,
    examples: [
      { title: '加载占位', titleEn: 'Loading', code: `<Skeleton circle width={44} height={44} />\n<SkeletonText lines={3} />`, render: 'preview' },
    ],
    api: [
      { prop: 'width / height', type: 'number | string', desc: '尺寸', descEn: 'Size' },
      { prop: 'circle', type: 'boolean', default: 'false', desc: '圆形（头像占位）', descEn: 'Circle shape (avatar placeholder)' },
      { prop: 'lines', type: 'number', default: '3', desc: 'SkeletonText：行数', descEn: 'SkeletonText: number of lines' },
    ],
  },
  {
    id: 'tooltip', title: 'Tooltip', category: '反馈', categoryEn: 'Feedback',
    description: '文字提示。悬停或聚焦时显示，支持上下方向。',
    descriptionEn: 'Tooltip that appears on hover or focus, with top and bottom placement.',
    importPath: '@/components/ui/tooltip',
    usage: `import { Tooltip } from "@/components/ui/tooltip"\n\n<Tooltip content="Tooltip text">\n  <Button>Hover me</Button>\n</Tooltip>`,
    examples: [
      { title: '上下方向', titleEn: 'Top & bottom', code: `<Tooltip content="Tooltip on top">\n  <Button size="sm" variant="outline">Top tooltip</Button>\n</Tooltip>\n<Tooltip content="Tooltip on bottom" side="bottom">\n  <Button size="sm" variant="outline">Bottom tooltip</Button>\n</Tooltip>`, render: 'preview' },
    ],
    api: [
      { prop: 'content', type: 'ReactNode', desc: '提示内容', descEn: 'Tooltip content' },
      { prop: 'side', type: '"top" | "bottom"', default: '"top"', desc: '显示方向', descEn: 'Placement' },
      { prop: 'open / defaultOpen / onOpenChange', type: 'boolean / (open) => void', desc: '受控或非受控地显示', descEn: 'Controlled or uncontrolled visibility' },
      { prop: 'side / align / sideOffset / delay / disabled', type: 'string / number / boolean', desc: '位置、延迟、禁用', descEn: 'Placement, delay, disabled' },
      { prop: 'TooltipProvider, TooltipRoot, TooltipTrigger, TooltipContent', type: 'compound', desc: '组合式写法：触发器自动带 aria-describedby 指向内容，支持 render 换成自己的元素', descEn: 'Compound form: the trigger gets aria-describedby pointing at the content, and render swaps in your own element' }
    ],
  },
  {
    id: 'progress', title: 'Progress', category: '反馈', categoryEn: 'Feedback',
    description: '进度条。3 种尺寸，可显示标签与百分比。',
    descriptionEn: 'Progress bar in three sizes, optionally showing a label and a percentage.',
    importPath: '@/components/ui/progress',
    usage: `import { Progress } from "@/components/ui/progress"\n\n<Progress value={64} label="Task progress" showValue />`,
    examples: [
      { title: '三种尺寸', titleEn: 'Three sizes', code: `<Progress value={64} label="Task progress" showValue />\n<Progress value={30} size="sm" />\n<Progress value={90} size="lg" showValue />`, render: 'preview' },
    ],
    api: [
      { prop: 'value', type: 'number', desc: '当前值', descEn: 'Current value' },
      { prop: 'max', type: 'number', default: '100', desc: '最大值', descEn: 'Maximum value' },
      { prop: 'label', type: 'ReactNode', desc: '标签', descEn: 'Label' },
      { prop: 'showValue', type: 'boolean', desc: '显示百分比', descEn: 'Show the percentage' },
      { prop: 'size', type: '"sm" | "default" | "lg"', default: '"default"', desc: '尺寸', descEn: 'Size' },
      { prop: 'aria-label', type: 'string', desc: '没有可见 label 时给进度条命名', descEn: 'Names the bar when there is no visible label' },
      { prop: '...props', type: 'HTMLAttributes<div>', desc: '其余原生属性透传', descEn: 'Other native attributes pass through' }
    ],
  },
  {
    id: 'popover', title: 'Popover', category: '反馈', categoryEn: 'Feedback',
    description: '气泡卡片。锚定在触发元素旁，点击外部自动关闭。',
    descriptionEn: 'Popover card anchored to its trigger that closes on an outside click.',
    importPath: '@/components/ui/popover',
    usage: `import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"\n\n<Popover>\n  <PopoverTrigger>Open</PopoverTrigger>\n  <PopoverContent title="Title">Content</PopoverContent>\n</Popover>`,
    examples: [
      { title: '配送详情', titleEn: 'Delivery details', code: `<Popover>\n  <PopoverTrigger>Delivery details</PopoverTrigger>\n  <PopoverContent title="Estimated delivery">\n    Your order arrives on Nov 20.\n  </PopoverContent>\n</Popover>`, render: 'preview' },
    ],
    api: [
      { prop: 'defaultOpen', type: 'boolean', default: 'false', desc: 'Popover 根：默认打开', descEn: 'Popover root: open by default' },
      { prop: 'title', type: 'string', desc: 'PopoverContent：标题', descEn: 'PopoverContent: title' },
      { prop: 'side', type: '"top" | "bottom"', default: '"bottom"', desc: 'PopoverContent：方向', descEn: 'PopoverContent: placement' },
      { prop: 'open / onOpenChange', type: 'boolean / (open) => void', desc: 'Popover：受控模式', descEn: 'Popover: controlled mode' },
      { prop: 'side / align / sideOffset', type: 'string / number', desc: 'PopoverContent：位置', descEn: 'PopoverContent: placement' }
    ],
  },
  {
    id: 'segmented', title: 'Segmented', category: '导航', categoryEn: 'Navigation',
    description: '分段控制器。互斥选择，比 Tabs 更轻量，适合视图切换。',
    descriptionEn: 'Segmented control for mutually exclusive choices; lighter than Tabs and ideal for switching views.',
    importPath: '@/components/ui/segmented',
    usage: `import { Segmented } from "@/components/ui/segmented"\n\n<Segmented options={[{ value: 'a', label: 'A' }]} defaultValue="a" />`,
    examples: [
      { title: '时间范围', titleEn: 'Time range', code: `<Segmented\n  defaultValue="week"\n  options={[\n    { value: 'day', label: 'Day' },\n    { value: 'week', label: 'Week' },\n    { value: 'month', label: 'Month' },\n    { value: 'year', label: 'Year', disabled: true },\n  ]}\n/>`, render: 'preview' },
    ],
    api: [
      { prop: 'options', type: '{ value; label; disabled? }[]', desc: '选项数组', descEn: 'Array of options' },
      { prop: 'value / defaultValue', type: 'string', desc: '受控值 / 默认值', descEn: 'Controlled value / default value' },
      { prop: 'onValueChange', type: '(value) => void', desc: '变化回调', descEn: 'Change callback' },
    ],
  },
  {
    id: 'divider', title: 'Divider', category: '布局', categoryEn: 'Layout',
    description: '分割线。支持水平、垂直与带文字三种形式。',
    descriptionEn: 'Divider in horizontal, vertical and labeled forms.',
    importPath: '@/components/ui/divider',
    usage: `import { Divider } from "@/components/ui/divider"\n\n<Divider />\n<Divider label="Or pick a room" />\n<Divider orientation="vertical" />`,
    examples: [
      { title: '三种形式', titleEn: 'Three forms', code: `<Divider />\n<Divider label="Or pick a room" />\n<div>\n  <span>Living room</span><Divider orientation="vertical" /><span>Bedroom</span>\n</div>`, render: 'preview' },
    ],
    api: [
      { prop: 'label', type: 'string', desc: '水平分割线的居中文字', descEn: 'Centered text on a horizontal divider' },
      { prop: 'orientation', type: '"horizontal" | "vertical"', default: '"horizontal"', desc: '方向', descEn: 'Orientation' },
    ],
  },
  {
    id: 'statistic', title: 'Statistic', category: '数据展示', categoryEn: 'Data display',
    description: '统计数值。大号数字 + 前后缀 + 趋势标记，适合仪表盘数据。',
    descriptionEn: 'Statistic value with a large number, prefix/suffix and trend marker, built for dashboard data.',
    importPath: '@/components/ui/statistic',
    usage: `import { Statistic } from "@/components/ui/statistic"\n\n<Statistic label="Orders" value="1,472" />`,
    examples: [
      { title: '指标卡', titleEn: 'Metric cards', code: `<Statistic\n  label="Orders"\n  value="1,472"\n  trend={{ value: 12.4 }}\n  hint="vs last month"\n/>\n<Statistic label="Avg. order" value="899" prefix="¥" />`, render: 'preview' },
    ],
    api: [
      { prop: 'label', type: 'string', desc: '标签', descEn: 'Label' },
      { prop: 'value', type: 'ReactNode', desc: '主数值', descEn: 'Primary value' },
      { prop: 'prefix / suffix', type: 'string', desc: '前后缀', descEn: 'Prefix / suffix' },
      { prop: 'trend', type: '{ value: number; direction? }', desc: '趋势', descEn: 'Trend' },
      { prop: 'hint', type: 'string', desc: '辅助说明', descEn: 'Supporting note' },
    ],
  },
  {
    id: 'collapse', title: 'Collapse', category: '数据展示', categoryEn: 'Data display',
    description: '折叠面板。默认手风琴模式，可开 multiple 允许多项展开。',
    descriptionEn: 'Collapsible panels: accordion by default, or enable multiple to keep several panels open at once.',
    importPath: '@/components/ui/collapse',
    usage: `import { Collapse } from "@/components/ui/collapse"\n\n<Collapse items={[{ key: 'a', title: 'Title', children: 'Content' }]} />`,
    examples: [
      { title: '常见问题', titleEn: 'FAQ', code: `<Collapse\n  defaultActive={['ship']}\n  items={[\n    { key: 'ship', title: 'Shipping and pickup', children: 'Free shipping over ¥199.' },\n    { key: 'return', title: 'Returns and exchanges', children: 'Return or exchange within 365 days.' },\n    { key: 'pay', title: 'Payment methods', children: 'We accept Alipay and WeChat Pay.' },\n  ]}\n/>`, render: 'preview' },
    ],
    api: [
      { prop: 'items', type: '{ key; title; children }[]', desc: '面板数组', descEn: 'Array of panels' },
      { prop: 'defaultActive', type: 'string[]', desc: '默认展开的 key', descEn: 'Keys expanded by default' },
      { prop: 'multiple', type: 'boolean', default: 'false', desc: '是否允许同时展开多项', descEn: 'Whether several panels can be open at once' },
      { prop: 'active / onActiveChange', type: 'string[] / (keys) => void', desc: '受控模式：当前展开的 key', descEn: 'Controlled mode: the open keys' }
    ],
  },
  {
    id: 'pagination', title: 'Pagination', category: '导航', categoryEn: 'Navigation',
    description: '分页。自动计算页码并插入省略号，支持受控与非受控。',
    descriptionEn: 'Pagination that computes page numbers and inserts ellipses; supports controlled and uncontrolled use.',
    importPath: '@/components/ui/pagination',
    usage: `import { Pagination } from "@/components/ui/pagination"\n\n<Pagination total={96} pageSize={10} />`,
    examples: [
      { title: '带省略号', titleEn: 'With ellipsis', code: `<Pagination\n  total={96}\n  pageSize={10}\n  defaultValue={4}\n  onValueChange={(page) => console.log(page)}\n/>`, render: 'preview' },
    ],
    api: [
      { prop: 'total', type: 'number', desc: '总条目数', descEn: 'Total number of items' },
      { prop: 'pageSize', type: 'number', default: '10', desc: '每页条数', descEn: 'Items per page' },
      { prop: 'value / defaultValue', type: 'number', desc: '受控页码 / 默认页码', descEn: 'Controlled page / default page' },
      { prop: 'siblingCount', type: 'number', default: '1', desc: '当前页两侧显示的页码数', descEn: 'Page numbers shown on each side of the current page' },
      { prop: 'onValueChange', type: '(page: number) => void', desc: '翻页回调', descEn: 'Page change callback' },
      { prop: 'label / previousLabel / nextLabel', type: 'string', desc: '导航和上一页、下一页按钮的可访问名称，用于本地化', descEn: 'Accessible names of the nav and its buttons, for localization' },
      { prop: '...props', type: 'HTMLAttributes<nav>', desc: '其余原生属性透传', descEn: 'Other native attributes pass through' }
    ],
  },
  {
    id: 'border-beam', title: 'BorderBeam', category: '布局', categoryEn: 'Layout',
    description: '可选的装饰组件：一条沿容器边框移动的墨色线。设计规范不做常驻动画，所以站内页面都不使用它；只在确实需要吸引注意的单个面板上按需引入。',
    descriptionEn: 'Optional decorative component: an ink line that travels along a container border. The design rules have no looping animation, so no page on this site uses it; add it only when one panel truly needs attention.',
    importPath: '@/components/ui/border-beam',
    usage: `import { BorderBeam } from "@/components/ui/border-beam"\n\n<BorderBeam>\n  <Card>Workspace overview</Card>\n</BorderBeam>`,
    examples: [
      { title: '基础用法', titleEn: 'Basic', code: `<BorderBeam>\n  <Card style={{ padding: 20 }}>\n    Deliveries, invoices and returns in one panel.\n  </Card>\n</BorderBeam>`, render: 'preview' },
      { title: '速度与线宽', titleEn: 'Speed & width', code: `<BorderBeam duration={3} lineWidth={2} size={140}>\n  <Card style={{ padding: 20 }}>Faster, thicker beam</Card>\n</BorderBeam>`, render: 'preview' },
    ],
    api: [
      { prop: 'children', type: 'ReactNode', desc: '被装饰的内容', descEn: 'The decorated content' },
      { prop: 'color', type: "string | { color: string; percent: number }[]", desc: '单色或渐变停靠点（0–100）', descEn: 'A color, or gradient stops (0–100)' },
      { prop: 'count', type: 'number', default: '1', desc: '均匀分布的流光数量', descEn: 'Number of beams, spread evenly' },
      { prop: 'items', type: 'BorderBeamItem[]', desc: '逐条流光配置，长度优先于 count', descEn: 'Per-beam config; length overrides count' },
      { prop: 'duration', type: 'number', default: '6', desc: '一圈所需秒数', descEn: 'Seconds per lap' },
      { prop: 'lineWidth', type: 'number | string', default: '1', desc: '流光线宽', descEn: 'Beam stroke width' },
      { prop: 'size', type: 'number | string', default: '100', desc: '可见段长度（px）', descEn: 'Visible segment length (px)' },
      { prop: 'outset', type: 'number | string', default: '0', desc: '相对容器边缘的外扩距离', descEn: 'Expansion outside the container edge' },
      { prop: 'radius', type: 'number | string', desc: '流光路径圆角，默认继承容器', descEn: 'Path radius; inherits the container by default' },
    ],
  },
  {
    id: 'masonry', title: 'Masonry', category: '布局', categoryEn: 'Layout',
    description: '瀑布流布局：每一项落入当前最短的列，支持响应式列数与间距。',
    descriptionEn: 'Waterfall layout: each item drops into the shortest column, with responsive columns and gutters.',
    importPath: '@/components/ui/masonry',
    usage: `import { Masonry } from "@/components/ui/masonry"\n\n<Masonry\n  columns={3}\n  gutter={12}\n  items={items}\n  itemRender={({ data }) => <Card>{data}</Card>}\n/>`,
    examples: [
      { title: '基础用法', titleEn: 'Basic', code: `<Masonry\n  columns={3}\n  gutter={12}\n  items={[\n    { key: 1, height: 120 },\n    { key: 2, height: 80 },\n    { key: 3, height: 160 },\n  ]}\n  itemRender={({ height }) => <div style={{ height }} />}\n/>`, render: 'preview' },
      { title: '响应式列数', titleEn: 'Responsive', code: `<Masonry\n  columns={{ xs: 1, sm: 2, md: 3 }}\n  gutter={{ xs: 8, md: 16 }}\n  items={items}\n  itemRender={renderCard}\n/>`, render: 'preview' },
    ],
    api: [
      { prop: 'items', type: 'MasonryItem[]', desc: '瀑布流项（key / data / height / column / children）', descEn: 'Items (key / data / height / column / children)' },
      { prop: 'columns', type: 'number | { xs, sm, md, lg, xl, xxl }', default: '3', desc: '列数，可为响应式配置', descEn: 'Column count, optionally per breakpoint' },
      { prop: 'gutter', type: 'number | Responsive | [horizontal, vertical]', default: '0', desc: '间距', descEn: 'Gap between items' },
      { prop: 'itemRender', type: '(item, index) => ReactNode', desc: '自定义项渲染', descEn: 'Custom item renderer' },
      { prop: 'onLayoutChange', type: '(layout: { key, column }[]) => void', desc: '分配完成后的列位置回调', descEn: 'Called with each item’s column after layout' },
      { prop: 'fresh', type: 'boolean', default: 'false', desc: '持续监听项高度变化', descEn: 'Keep re-measuring item heights' },
    ],
  },
  // ---- second wave: form, overlay, content (P0) ----
  {
    id: 'textarea', title: 'Textarea', category: '数据录入', categoryEn: 'Data entry',
    description: '多行输入。与 Input 同一套 1px 描边，聚焦变墨色，可纵向拉伸。',
    descriptionEn: 'Multi-line input. Same 1px border as Input, ink on focus, resizes vertically.',
    importPath: '@/components/ui/textarea',
    usage: `import { Textarea } from "@/components/ui/textarea"\n\n<Textarea placeholder="Delivery notes" />`,
    examples: [
      { title: '基础用法', titleEn: 'Basic', code: `<Label>Delivery notes</Label>\n<Textarea placeholder="Leave it at the front desk" rows={4} />`, render: 'preview' },
    ],
    api: [
      { prop: '...props', type: 'TextareaHTMLAttributes', desc: '原生 textarea 属性', descEn: 'Native textarea attributes' },
    ],
  },
  {
    id: 'field', title: 'Field / Fieldset', category: '数据录入', categoryEn: 'Data entry',
    description: '把标签、帮助文字、错误提示和一个控件包在一起，自动关联 aria。Fieldset 给一组字段加标题，靠留白分组，不画框。',
    descriptionEn: 'Wraps one control with its label, help text and error, wiring up aria for you. Fieldset titles a group of fields; space groups them, with no box.',
    importPath: '@/components/ui/field',
    usage: `import { Field, Fieldset, FieldControl } from "@/components/ui/field"\n\n<Field label="Email" description="We only use it for receipts.">\n  <FieldControl render={<Input />} />\n</Field>`,
    examples: [
      { title: '帮助文字与错误', titleEn: 'Help and error', code: `<Fieldset legend="Shipping">\n  <Field label="Name" required description="As on your ID.">\n    <FieldControl render={<Input />} />\n  </Field>\n  <Field label="Postcode" error="Enter a 6-digit postcode.">\n    <FieldControl render={<Input defaultValue="1000" />} />\n  </Field>\n</Fieldset>`, render: 'preview' },
    ],
    api: [
      { prop: 'label', type: 'ReactNode', desc: '标签', descEn: 'Label' },
      { prop: 'description', type: 'ReactNode', desc: '帮助文字（有错误时隐藏）', descEn: 'Help text (hidden while there is an error)' },
      { prop: 'error', type: 'ReactNode', desc: '错误提示，红色文字，同时把字段标记为无效', descEn: 'Error text in red; also marks the field invalid' },
      { prop: 'required', type: 'boolean', default: 'false', desc: '在标签后加红色星号', descEn: 'Adds a red asterisk after the label' },
      { prop: 'disabled / name', type: 'boolean / string', desc: '传给 Base UI Field.Root', descEn: 'Passed to Base UI Field.Root' },
      { prop: 'FieldControl', type: 'Field.Control', desc: '用 render 包住原生控件，让标签和描述能关联上', descEn: 'Wrap a native control via render so the label and description connect' },
    ],
  },
  {
    id: 'number-input', title: 'NumberInput', category: '数据录入', categoryEn: 'Data entry',
    description: '数量、价格这类数字输入，两侧是 − / + 步进按钮。方向键、滚轮也能加减，数字用等宽字体。',
    descriptionEn: 'Numeric input for quantities and prices, with − / + steppers. Arrow keys and the wheel step too; digits use the mono face.',
    importPath: '@/components/ui/number-input',
    usage: `import { NumberInput } from "@/components/ui/number-input"\n\n<NumberInput defaultValue={1} min={1} max={10} />`,
    examples: [
      { title: '数量', titleEn: 'Quantity', code: `<NumberInput defaultValue={2} min={1} max={10} aria-label="Quantity" />`, render: 'preview' },
    ],
    api: [
      { prop: 'value / defaultValue', type: 'number', desc: '受控值 / 默认值', descEn: 'Controlled / default value' },
      { prop: 'min / max / step', type: 'number', desc: '范围与步长', descEn: 'Range and step' },
      { prop: 'onValueChange', type: '(value: number | null) => void', desc: '值变化回调', descEn: 'Change callback' },
      { prop: 'disabled', type: 'boolean', default: 'false', desc: '禁用', descEn: 'Disabled' },
      { prop: '...props', type: 'Base UI NumberField.Root props', desc: 'name、required、format、locale、readOnly 等原样透传', descEn: 'name, required, format, locale, readOnly and more pass through' },
      { prop: 'decrementLabel / incrementLabel', type: 'string', desc: '步进按钮的可访问名称，用于本地化', descEn: 'Accessible names of the step buttons, for localization' }
    ],
  },
  {
    id: 'slider', title: 'Slider', category: '数据录入', categoryEn: 'Data entry',
    description: '范围调节。2px 轨道、墨色填充、方形滑块。传数组就是区间滑块。',
    descriptionEn: 'Range input. A 2px track, ink fill and a square thumb. Pass an array for a two-thumb range.',
    importPath: '@/components/ui/slider',
    usage: `import { Slider } from "@/components/ui/slider"\n\n<Slider defaultValue={40} label="Volume" showValue />`,
    examples: [
      { title: '单值与区间', titleEn: 'Single and range', code: `<Slider defaultValue={40} label="Seat height" showValue format={(v) => v + ' cm'} />\n<Slider defaultValue={[200, 800]} min={0} max={1000} step={50} label="Price" showValue format={(v) => '¥' + v} />`, render: 'preview' },
    ],
    api: [
      { prop: 'value / defaultValue', type: 'number | number[]', desc: '单值或区间', descEn: 'Single value or range' },
      { prop: 'min / max / step', type: 'number', default: '0 / 100 / 1', desc: '范围与步长', descEn: 'Range and step' },
      { prop: 'label', type: 'ReactNode', desc: '左上角标签', descEn: 'Label above the track' },
      { prop: 'showValue', type: 'boolean', default: 'false', desc: '右上角显示当前值', descEn: 'Show the current value' },
      { prop: 'format', type: '(v: number) => string', desc: '格式化显示值', descEn: 'Format the shown value' },
      { prop: 'onValueChange', type: '(value) => void', desc: '值变化回调', descEn: 'Change callback' },
    ],
  },
  {
    id: 'combobox', title: 'Combobox', category: '数据录入', categoryEn: 'Data entry',
    description: '可以输入搜索的下拉选择（Typeahead）。边输入边过滤，没有匹配时显示空状态。',
    descriptionEn: 'A select you can type into (Typeahead). Filters as you type and shows an empty state when nothing matches.',
    importPath: '@/components/ui/combobox',
    usage: `import { Combobox } from "@/components/ui/combobox"\n\n<Combobox options={cities} placeholder="Search a city" />`,
    examples: [
      { title: '城市搜索', titleEn: 'City search', code: `<Combobox\n  placeholder="Search a city"\n  options={[\n    { value: 'sh', label: 'Shanghai' },\n    { value: 'bj', label: 'Beijing' },\n    { value: 'sz', label: 'Shenzhen' },\n    { value: 'hz', label: 'Hangzhou' },\n  ]}\n  onValueChange={(v) => console.log(v)}\n/>`, render: 'preview' },
    ],
    api: [
      { prop: 'options', type: '{ value: string; label: string }[]', desc: '选项', descEn: 'Options' },
      { prop: 'value / defaultValue', type: 'string | null', desc: '受控值 / 默认值', descEn: 'Controlled / default value' },
      { prop: 'onValueChange', type: '(value: string | null) => void', desc: '选择回调', descEn: 'Selection callback' },
      { prop: 'placeholder / emptyText', type: 'string', desc: '占位文字 / 无匹配文案', descEn: 'Placeholder / no-match text' },
      { prop: 'name / required / id', type: 'string | boolean', desc: '提交到表单、标记必填、给输入框 id', descEn: 'Submit with a form, mark required, set the input id' },
      { prop: 'open / onOpenChange / onInputValueChange', type: '', desc: '受控打开状态；监听输入框文字', descEn: 'Controlled open state; listen to the typed text' },
      { prop: 'clearLabel / openLabel', type: 'string', desc: '清除、展开按钮的可访问名称，用于本地化', descEn: 'Accessible names of the clear and open buttons, for localization' }
    ],
  },
  {
    id: 'chip-group', title: 'ChipGroup', category: '通用', categoryEn: 'General',
    description: '一排独立的筛选项，彼此有间隔（Segmented 是连在一起的一条）。未选中是浅色描边，悬停变墨色，选中是墨色块；可以在文字后面带一个数量。默认单选，multiple 允许多选。',
    descriptionEn: 'A row of separate filter chips with gaps between them (Segmented is one joined bar). Unselected chips have a light line that turns ink on hover; the selected one is an ink block. A count can follow the label. Single choice by default; multiple allows several.',
    importPath: '@/components/ui/chip-group',
    usage: `import { ChipGroup } from "@/components/ui/chip-group"\n\n<ChipGroup defaultValue="all" options={[\n  { value: 'all', label: '全部作品', count: 11 },\n  { value: 'dev', label: '开发与发布' },\n]} />`,
    examples: [
      { title: '分类筛选，带数量', titleEn: 'Category filter with a count', code: `<ChipGroup\n  defaultValue="all"\n  options={[\n    { value: 'all', label: '全部作品', count: 11 },\n    { value: 'dev', label: '开发与发布' },\n    { value: 'tools', label: '效率工具' },\n    { value: 'research', label: '研究与创作' },\n    { value: 'family', label: '亲子与家庭' },\n  ]}\n/>`, render: 'preview' },
      { title: '多选', titleEn: 'Multiple', code: `<ChipGroup multiple size="sm" defaultValue={['oak']} options={[\n  { value: 'oak', label: 'Oak' },\n  { value: 'pine', label: 'Pine' },\n  { value: 'walnut', label: 'Walnut' },\n]} />`, render: 'preview' },
      { title: '组合：筛选、搜索与外链按钮', titleEn: 'Together: filter, search and a link button', code: `<ChipGroup defaultValue="all" options={categories} />\n<Input variant="filled" leading={<Search size={16} />} placeholder="找一个项目" />\n<Button variant="outline">GitHub <ArrowUpRight size={16} /></Button>`, render: 'preview' },
    ],
    api: [
      { prop: 'options', type: '{ value; label; count?; disabled? }[]', desc: '筛选项', descEn: 'Chips' },
      { prop: 'value / defaultValue', type: 'string | string[]', desc: '选中的值；multiple 时是数组', descEn: 'Selected value; an array when multiple' },
      { prop: 'multiple', type: 'boolean', default: 'false', desc: '允许多选', descEn: 'Allow several' },
      { prop: 'size', type: '"sm" | "md" | "lg"', default: '"md"', desc: '高度 32 / 40 / 48', descEn: 'Height 32 / 40 / 48' },
      { prop: 'onValueChange', type: '(value) => void', desc: '变化回调', descEn: 'Change callback' },
    ],
  },
  {
    id: 'toggle-group', title: 'ToggleGroup / ButtonGroup', category: '通用', categoryEn: 'General',
    description: '拼在一起的切换按钮，按下的那个变成墨色块；multiple 允许多选（如加粗 + 斜体）。ButtonGroup 只把普通按钮拼成一组，共用一条边框。',
    descriptionEn: 'Joined toggle buttons; the pressed one turns into an ink block. multiple allows several (bold + italic). ButtonGroup joins plain buttons so they share one border.',
    importPath: '@/components/ui/toggle-group',
    usage: `import { ToggleGroup, ButtonGroup } from "@/components/ui/toggle-group"\n\n<ToggleGroup defaultValue={['grid']} options={[{ value: 'grid', label: 'Grid' }, { value: 'list', label: 'List' }]} />`,
    examples: [
      { title: '单选、多选与按钮组', titleEn: 'Single, multiple, button group', code: `<ToggleGroup\n  defaultValue={['left']}\n  options={[\n    { value: 'left', label: <AlignLeft size={16} />, 'aria-label': 'Left' },\n    { value: 'center', label: <AlignCenter size={16} />, 'aria-label': 'Center' },\n    { value: 'right', label: <AlignRight size={16} />, 'aria-label': 'Right' },\n  ]}\n/>\n<ToggleGroup multiple defaultValue={['b']} options={[{ value: 'b', label: 'B' }, { value: 'i', label: 'I' }, { value: 'u', label: 'U' }]} />\n<ButtonGroup>\n  <Button variant="outline">Day</Button>\n  <Button variant="outline">Week</Button>\n  <Button variant="outline">Month</Button>\n</ButtonGroup>`, render: 'preview' },
    ],
    api: [
      { prop: 'options', type: '{ value; label; aria-label?; disabled? }[]', desc: '按钮列表', descEn: 'Buttons' },
      { prop: 'value / defaultValue', type: 'string[]', desc: '按下的值', descEn: 'Pressed values' },
      { prop: 'multiple', type: 'boolean', default: 'false', desc: '允许多个同时按下', descEn: 'Allow several pressed' },
      { prop: 'size', type: '"sm" | "md"', default: '"md"', desc: '高度 32 / 40', descEn: 'Height 32 / 40' },
      { prop: 'onValueChange', type: '(value: string[]) => void', desc: '变化回调', descEn: 'Change callback' },
    ],
  },
  {
    id: 'toolbar', title: 'Toolbar', category: '通用', categoryEn: 'General',
    description: '编辑器、表格上方的操作条。按钮安静无框，发丝线分组，方向键在按钮间移动。',
    descriptionEn: 'Action bar above an editor or table. Quiet borderless buttons, hairline separators, arrow keys move between items.',
    importPath: '@/components/ui/toolbar',
    usage: `import { Toolbar, ToolbarButton, ToolbarToggle, ToolbarSeparator } from "@/components/ui/toolbar"\n\n<Toolbar>\n  <ToolbarToggle aria-label="Bold"><Bold size={16} /></ToolbarToggle>\n  <ToolbarSeparator />\n  <ToolbarButton>Share</ToolbarButton>\n</Toolbar>`,
    examples: [
      { title: '编辑器工具条', titleEn: 'Editor toolbar', code: `<Toolbar aria-label="Formatting">\n  <ToolbarGroup>\n    <ToolbarToggle aria-label="Bold" defaultPressed><Bold size={16} /></ToolbarToggle>\n    <ToolbarToggle aria-label="Italic"><Italic size={16} /></ToolbarToggle>\n    <ToolbarToggle aria-label="Underline"><Underline size={16} /></ToolbarToggle>\n  </ToolbarGroup>\n  <ToolbarSeparator />\n  <ToolbarButton aria-label="Link"><Link2 size={16} /></ToolbarButton>\n  <ToolbarSpacer />\n  <ToolbarButton>Share</ToolbarButton>\n</Toolbar>`, render: 'preview' },
    ],
    api: [
      { prop: 'Toolbar', type: 'Toolbar.Root props', desc: '容器，orientation 默认 horizontal', descEn: 'Container; orientation defaults to horizontal' },
      { prop: 'ToolbarButton', type: 'Toolbar.Button props', desc: '普通按钮', descEn: 'Plain button' },
      { prop: 'ToolbarToggle', type: '{ pressed?; defaultPressed?; onPressedChange? }', desc: '可保持按下的按钮', descEn: 'Button that stays pressed' },
      { prop: 'ToolbarGroup / ToolbarSeparator / ToolbarSpacer', type: '—', desc: '分组 / 发丝分隔 / 把后面的项推到最右', descEn: 'Group / hairline separator / push the rest to the end' },
    ],
  },
  {
    id: 'alert-dialog', title: 'AlertDialog', category: '反馈', categoryEn: 'Feedback',
    description: '"确认删除？"这类必须明确回答的弹窗。点遮罩不会关闭。危险操作的确认按钮是红字描边，不铺红底。',
    descriptionEn: 'A modal that needs an explicit answer, such as "Delete this?". Clicking the backdrop does not close it. Destructive confirms are an outline with red text, never a red fill.',
    importPath: '@/components/ui/alert-dialog',
    usage: `import { AlertDialog } from "@/components/ui/alert-dialog"\n\n<AlertDialog\n  trigger={<Button variant="outline">Delete</Button>}\n  title="Delete project?"\n  danger\n  onConfirm={remove}\n/>`,
    examples: [
      { title: '删除确认', titleEn: 'Delete confirm', code: `<AlertDialog\n  trigger={<Button variant="outline">Delete project</Button>}\n  title="Delete this project?"\n  description="Its 12 pages and all comments go with it. This cannot be undone."\n  confirmLabel="Delete"\n  cancelLabel="Keep"\n  danger\n  onConfirm={() => toast({ title: 'Project deleted' })}\n/>`, render: 'preview' },
    ],
    api: [
      { prop: 'trigger', type: 'ReactElement', desc: '打开弹窗的元素', descEn: 'The element that opens it' },
      { prop: 'title / description', type: 'ReactNode', desc: '标题 / 说明', descEn: 'Title / description' },
      { prop: 'confirmLabel / cancelLabel', type: 'ReactNode', default: '"Confirm" / "Cancel"', desc: '按钮文字', descEn: 'Button labels' },
      { prop: 'danger', type: 'boolean', default: 'false', desc: '危险操作：确认按钮红字描边', descEn: 'Destructive: red-text outline confirm' },
      { prop: 'open / onOpenChange', type: 'boolean / (open) => void', desc: '受控打开', descEn: 'Controlled open state' },
      { prop: 'onConfirm', type: '() => void', desc: '确认回调', descEn: 'Confirm callback' },
    ],
  },
  {
    id: 'toast', title: 'Toast', category: '反馈', categoryEn: 'Feedback',
    description: '操作结果提示，出现在右下角，4 秒后自动消失，悬停时暂停。根部挂一次 <Toaster />，任意位置调用 toast()。',
    descriptionEn: 'Operation feedback in the bottom-right corner; closes after 4 s and pauses on hover. Mount <Toaster /> once, then call toast() anywhere.',
    importPath: '@/components/ui/toast',
    usage: `import { Toaster, toast } from "@/components/ui/toast"\n\n// once, near the root\n<Toaster />\n\ntoast({ title: 'Saved', type: 'success' })`,
    examples: [
      { title: '三种类型', titleEn: 'Three types', code: `<Button variant="outline" onClick={() => toast({ title: 'Added to cart', description: 'Side table × 1' })}>Default</Button>\n<Button variant="outline" onClick={() => toast({ title: 'Order placed', type: 'success' })}>Success</Button>\n<Button variant="outline" onClick={() => toast({ title: 'Payment failed', description: 'Try another card.', type: 'error' })}>Error</Button>`, render: 'preview' },
    ],
    api: [
      { prop: 'toast(options)', type: '{ title; description?; type?; timeout?; action? }', desc: '弹出一条提示，返回 id', descEn: 'Show a toast; returns its id' },
      { prop: 'type', type: '"default" | "success" | "error"', default: '"default"', desc: '只改变图标颜色', descEn: 'Only changes the icon color' },
      { prop: 'action', type: '{ label; onClick }', desc: '附带一个操作按钮（如撤销）', descEn: 'One action button, e.g. Undo' },
      { prop: 'toast.close(id)', type: '(id: string) => void', desc: '手动关闭', descEn: 'Close programmatically' },
      { prop: 'Toaster', type: '{ timeout?: number; limit?: number }', default: '4000 / 3', desc: '挂载点：默认时长与同时显示的条数', descEn: 'Mount point: default timeout and max visible' },
      { prop: 'ToastProvider / useToast()', type: '() => manager', desc: '请求内的 toast：根部包一层 ToastProvider，组件里 useToast().add({ title, type })。模块加载时不创建任何状态，适合 SSR', descEn: 'Request-local toasts: wrap the app in ToastProvider, call useToast().add({ title, type }). Nothing is created at module load, so it suits SSR' },
      { prop: 'dismissLabel / regionLabel', type: 'string', desc: '关闭按钮和通知区域的可访问名称，用于本地化', descEn: 'Accessible names of the close button and the notification region, for localization' }
    ],
  },
  {
    id: 'hover-card', title: 'HoverCard', category: '数据展示', categoryEn: 'Data display',
    description: '悬停链接时出现的预览卡片。触屏上可能看不到，所以不要放必须的信息。',
    descriptionEn: 'A preview card that appears when hovering a link. Touch users may never see it, so keep essential content out of it.',
    importPath: '@/components/ui/hover-card',
    usage: `import { HoverCard } from "@/components/ui/hover-card"\n\n<HoverCard trigger="@alex" href="#">Profile preview</HoverCard>`,
    examples: [
      { title: '用户预览', titleEn: 'Profile preview', code: `<p>Assembled by <HoverCard trigger="Alex Wang" href="#">\n  <Avatar name="Alex Wang" />\n  <strong>Alex Wang</strong>\n  <p>Product designer. 42 reviews.</p>\n</HoverCard>.</p>`, render: 'preview' },
    ],
    api: [
      { prop: 'trigger', type: 'ReactNode', desc: '触发文本（渲染为下划线链接）', descEn: 'Trigger text, rendered as an underlined link' },
      { prop: 'href', type: 'string', desc: '链接地址', descEn: 'Link target' },
      { prop: 'side', type: '"top" | "bottom"', default: '"bottom"', desc: '出现方向', descEn: 'Placement' },
      { prop: 'delay', type: 'number', default: '300', desc: '悬停多久后出现（ms）', descEn: 'Hover delay in ms' },
    ],
  },
  {
    id: 'scroll-area', title: 'ScrollArea', category: '布局', categoryEn: 'Layout',
    description: '自定义滚动区：方形细滚动条，只在悬停或滚动时出现，不占内容宽度。',
    descriptionEn: 'Custom scroll container: a thin square scrollbar that appears on hover or while scrolling and takes no content width.',
    importPath: '@/components/ui/scroll-area',
    usage: `import { ScrollArea } from "@/components/ui/scroll-area"\n\n<ScrollArea style={{ height: 200 }}>{longList}</ScrollArea>`,
    examples: [
      { title: '长列表', titleEn: 'Long list', code: `<ScrollArea style={{ height: 180 }}>\n  {orders.map((o) => <div key={o}>{o}</div>)}\n</ScrollArea>`, render: 'preview' },
    ],
    api: [
      { prop: 'style', type: 'CSSProperties', desc: '需要给定高度', descEn: 'Give it a height' },
      { prop: 'horizontal', type: 'boolean', default: 'false', desc: '同时显示横向滚动条', descEn: 'Also show a horizontal scrollbar' },
    ],
  },
  {
    id: 'command-palette', title: 'CommandPalette', category: '导航', categoryEn: 'Navigation',
    description: '⌘K / Ctrl+K 打开的搜索面板。方向键移动，回车执行，Esc 关闭，可按组显示和标注快捷键。',
    descriptionEn: 'Search panel opened with ⌘K / Ctrl+K. Arrow keys move, Enter runs, Esc closes; supports groups and shortcut hints.',
    importPath: '@/components/ui/command-palette',
    usage: `import { CommandPalette } from "@/components/ui/command-palette"\n\n<CommandPalette commands={[{ id: 'new', label: 'New project', onSelect: create }]} />`,
    examples: [
      { title: '⌘K 搜索', titleEn: '⌘K search', code: `const [open, setOpen] = useState(false)\n\n<Button variant="outline" onClick={() => setOpen(true)}>Search <KbdGroup keys={['⌘', 'K']} /></Button>\n<CommandPalette\n  open={open}\n  onOpenChange={setOpen}\n  commands={[\n    { id: 'new', group: 'Actions', label: 'New project', shortcut: 'N', onSelect: create },\n    { id: 'theme', group: 'Actions', label: 'Toggle theme', onSelect: toggleTheme },\n    { id: 'docs', group: 'Go to', label: 'Docs', onSelect: () => go('docs') },\n  ]}\n/>`, render: 'preview' },
    ],
    api: [
      { prop: 'commands', type: '{ id; label; group?; icon?; shortcut?; keywords?; onSelect }[]', desc: '命令列表，按出现顺序分组', descEn: 'Commands, grouped in order of appearance' },
      { prop: 'open / onOpenChange', type: 'boolean / (open) => void', desc: '受控打开', descEn: 'Controlled open state' },
      { prop: 'hotkey', type: 'boolean', default: 'true', desc: '绑定 ⌘K / Ctrl+K', descEn: 'Bind ⌘K / Ctrl+K' },
      { prop: 'placeholder / emptyText', type: 'string', desc: '输入框占位 / 无结果文案', descEn: 'Input placeholder / no-results text' },
      { prop: 'label / closeHint', type: 'string', desc: '对话框的可访问名称、右侧按键提示，用于本地化', descEn: 'Dialog accessible name and the key hint, for localization' },
      { prop: 'filter', type: '(command, query) => boolean', desc: '自定义匹配规则，替换默认的"包含"匹配', descEn: 'Custom matching, replacing the default contains-match' },
      { prop: 'hotkeyKey / className', type: 'string', desc: '与 ⌘/Ctrl 一起打开的按键（默认 k）、样式', descEn: 'The key that opens it with ⌘/Ctrl (default k), and a class' }
    ],
  },
  {
    id: 'kbd', title: 'Kbd', category: '数据展示', categoryEn: 'Data display',
    description: '快捷键标注：等宽字体、1px 发丝框，一个键一个框。',
    descriptionEn: 'Keyboard key label: mono face in a 1px hairline box, one box per key.',
    importPath: '@/components/ui/kbd',
    usage: `import { Kbd, KbdGroup } from "@/components/ui/kbd"\n\n<KbdGroup keys={['⌘', 'K']} />`,
    examples: [
      { title: '快捷键', titleEn: 'Shortcuts', code: `<KbdGroup keys={['⌘', 'K']} /> Search\n<KbdGroup keys={['Shift', 'Enter']} /> New line\n<Kbd>Esc</Kbd> Close`, render: 'preview' },
    ],
    api: [
      { prop: 'Kbd', type: 'HTMLAttributes<HTMLElement>', desc: '单个按键', descEn: 'One key' },
      { prop: 'KbdGroup keys', type: 'string[]', desc: '组合键', descEn: 'A key combination' },
    ],
  },
  {
    id: 'reveal', title: 'Reveal', category: '反馈', categoryEn: 'Feedback',
    description: '入场动效（可选）：给元素加 data-reveal，页面载入或滚动到时淡入。节奏和位移由主题决定；默认主题只淡入，不位移。',
    descriptionEn: 'Entrance motion (opt-in): add data-reveal to an element and it fades in on load or when scrolled to. The theme sets pace and distance; the default theme fades without moving.',
    importPath: '@/components/ui/reveal',
    usage: `import { RevealGroup } from "@/components/ui/reveal"\n\n<RevealGroup>\n  <h2 data-reveal="enter">Hello</h2>\n  <p data-reveal="enter" data-reveal-step="1">Plays once, a step later.</p>\n  <section data-reveal="scroll">Waits until it scrolls into view.</section>\n</RevealGroup>`,
    examples: [
      { title: '依次入场', titleEn: 'Staggered entrance', code: `<RevealGroup>\n  <h2 data-reveal="enter">Write it down once.</h2>\n  <p data-reveal="enter" data-reveal-step="1">Find it every time.</p>\n  <Button data-reveal="enter" data-reveal-step="2">Try it</Button>\n</RevealGroup>`, render: 'preview' },
    ],
    api: [
      { prop: 'data-reveal', type: '"enter" | "scroll"', desc: 'enter：载入时播放一次；scroll：由 RevealGroup 在进入视口时播放', descEn: 'enter plays once on load; scroll waits until RevealGroup sees it enter the viewport' },
      { prop: 'data-reveal-step', type: '1 | 2 | 3 | 4', desc: '错开的档位，延迟 = 档位 × 主题的 step', descEn: 'Stagger step; the delay is the step times the theme step' },
      { prop: 'RevealGroup', type: 'HTMLAttributes<div>', desc: '容器：只给 scroll 元素挂载观察器；减少动态效果、键盘焦点、不支持观察器时内容照常可读', descEn: 'Container: observes scroll elements only; content stays readable with reduced motion, keyboard focus or no observer' },
      { prop: '--fp-reveal-*', type: 'CSS tokens', desc: 'duration / step / distance / ease，以及手机上的 -sm 版本，由主题设置', descEn: 'duration / step / distance / ease and the -sm versions for phones, set by the theme' },
    ],
  },
  {
    id: 'spinner', title: 'Spinner', category: '反馈', categoryEn: 'Feedback',
    description: '加载中：三个小方块轮流变亮，只改透明度。它只在加载时出现，所以是唯一允许的循环动效；开启"减少动态效果"时静止。',
    descriptionEn: 'Loading: three small squares light up in turn, opacity only. It only exists while loading, so it is the one allowed loop; it stays still with reduced motion.',
    importPath: '@/components/ui/spinner',
    usage: `import { Spinner } from "@/components/ui/spinner"\n\n<Spinner />`,
    examples: [
      { title: '尺寸与按钮内', titleEn: 'Sizes and in a button', code: `<Spinner />\n<Spinner size="lg" />\n<Button disabled><Spinner /> Saving</Button>`, render: 'preview' },
    ],
    api: [
      { prop: 'size', type: '"md" | "lg"', default: '"md"', desc: '方块 4px / 6px', descEn: '4px / 6px squares' },
      { prop: 'label', type: 'string', default: '"Loading"', desc: '读屏文字', descEn: 'Screen reader label' },
    ],
  },
  {
    id: 'avatar-group', title: 'AvatarGroup', category: '数据展示', categoryEn: 'Data display',
    description: '头像叠放，超过 max 的折叠成 +N。头像之间用底色描边隔开，不加阴影。',
    descriptionEn: 'Overlapping avatars; anything past max collapses into +N. A background-colored ring separates them, no shadow.',
    importPath: '@/components/ui/avatar-group',
    usage: `import { AvatarGroup } from "@/components/ui/avatar-group"\n\n<AvatarGroup people={team} max={4} />`,
    examples: [
      { title: '团队成员', titleEn: 'Team', code: `<AvatarGroup\n  max={4}\n  people={[\n    { name: 'Alex Wang' }, { name: 'Lea Li' }, { name: 'Ming Zhao' },\n    { name: 'Anna Chen' }, { name: 'Tom Xu' }, { name: 'Yu Sun' },\n  ]}\n/>`, render: 'preview' },
    ],
    api: [
      { prop: 'people', type: '{ name: string; src?: string }[]', desc: '成员', descEn: 'People' },
      { prop: 'max', type: 'number', default: '4', desc: '最多显示几个', descEn: 'How many to show' },
      { prop: 'size', type: '"sm" | "md" | "lg"', default: '"md"', desc: '尺寸', descEn: 'Size' },
    ],
  },
  {
    id: 'code-block', title: 'CodeBlock', category: '数据展示', categoryEn: 'Data display',
    description: '代码展示加复制按钮，浅色底，无边框。Code 是行内代码。文档站自己就用它。',
    descriptionEn: 'Code sample with a copy button on a light surface, no border. Code is the inline version. The docs site uses it itself.',
    importPath: '@/components/ui/code-block',
    usage: `import { CodeBlock, Code } from "@/components/ui/code-block"\n\n<CodeBlock code={source} label="TSX" />`,
    examples: [
      { title: '代码与行内代码', titleEn: 'Block and inline', code: `<CodeBlock label="Terminal" code="npm run build:tokens -- --preset fp1-c-i-s-15-6-2-n" />\n<p>Run <Code>npm run dev</Code> to start.</p>`, render: 'preview' },
    ],
    api: [
      { prop: 'code', type: 'string', desc: '代码文本', descEn: 'Source text' },
      { prop: 'label', type: 'string', default: '"TSX"', desc: '左上角标签', descEn: 'Label at the top left' },
      { prop: 'copyLabel', type: 'string', default: '"Copy"', desc: '复制按钮的提示', descEn: 'Copy button title' },
    ],
  },
  // ---- second wave (P1) ----
  {
    id: 'calendar', title: 'Calendar', category: '数据录入', categoryEn: 'Data entry',
    description: '月历网格，单选或区间。选中日是墨色块，区间中间是浅色面，今天是一圈细线。方向键按天 / 周移动，PageUp / PageDown 换月。不依赖第三方库。',
    descriptionEn: 'Month grid for a single date or a range. Selected days are ink blocks, the span between is a light surface, today has a hairline. Arrow keys move by day / week, PageUp / PageDown by month. No third-party library.',
    importPath: '@/components/ui/calendar',
    usage: `import { Calendar } from "@/components/ui/calendar"\n\n<Calendar value={date} onValueChange={setDate} />`,
    examples: [
      { title: '单选', titleEn: 'Single date', code: `const [date, setDate] = useState<Date | null>(new Date())\n\n<Calendar value={date} onValueChange={setDate} />`, render: 'preview' },
    ],
    api: [
      { prop: 'mode', type: '"single" | "range"', default: '"single"', desc: '单选或区间', descEn: 'Single date or range' },
      { prop: 'value', type: 'Date | null | { from; to }', desc: '选中值', descEn: 'Selected value' },
      { prop: 'onValueChange', type: '(value) => void', desc: '选择回调', descEn: 'Selection callback' },
      { prop: 'min / max', type: 'Date', desc: '可选范围', descEn: 'Selectable range' },
      { prop: 'weekStartsOn', type: '0 | 1', default: '1', desc: '周日或周一开始', descEn: 'Week starts on Sunday or Monday' },
      { prop: 'locale', type: 'string', desc: '月份和星期的语言', descEn: 'Locale for month and weekday names' },
      { prop: 'month / onMonthChange', type: 'Date / (month) => void', desc: '受控的当前月份', descEn: 'Controlled visible month' },
      { prop: 'previousMonthLabel / nextMonthLabel', type: 'string', desc: '翻月按钮的可访问名称，用于本地化', descEn: 'Accessible names of the month buttons, for localization' }
    ],
  },
  {
    id: 'date-picker', title: 'DatePicker / DateRange', category: '数据录入', categoryEn: 'Data entry',
    description: '输入框样式的触发器加弹出日历。区间选择第一次点开始、第二次点结束，选完自动关闭。',
    descriptionEn: 'An input-style trigger with a popover calendar. For a range, the first click sets the start and the second the end; it closes when done.',
    importPath: '@/components/ui/date-picker',
    usage: `import { DatePicker, DateRangePicker } from "@/components/ui/date-picker"\n\n<DatePicker onValueChange={setDate} />`,
    examples: [
      { title: '单日与区间', titleEn: 'Date and range', code: `<DatePicker placeholder="Delivery date" min={new Date()} />\n<DateRangePicker placeholder="Stay" />`, render: 'preview' },
    ],
    api: [
      { prop: 'value / defaultValue', type: 'Date | null  ·  { from; to }', desc: '受控值 / 默认值', descEn: 'Controlled / default value' },
      { prop: 'onValueChange', type: '(value) => void', desc: '选择回调', descEn: 'Selection callback' },
      { prop: 'placeholder', type: 'string', desc: '未选择时的文字', descEn: 'Text when empty' },
      { prop: 'min / max / locale / disabled', type: '—', desc: '同 Calendar', descEn: 'Same as Calendar' },
      { prop: 'open / onOpenChange', type: 'boolean / (open) => void', desc: '受控地打开弹层', descEn: 'Control the popover' },
      { prop: 'name', type: 'string', desc: '用隐藏输入提交 ISO 日期（范围为 from/to），可放进 <form>', descEn: 'A hidden input carries the ISO date (from/to for a range) so it submits with a <form>' },
      { prop: 'id / aria-label / aria-labelledby / className / weekStartsOn', type: '', desc: '触发按钮的 id、可访问名称、样式和一周起始日', descEn: 'Trigger id, accessible name, class and week start' }
    ],
  },
  {
    id: 'file-input', title: 'FileInput', category: '数据录入', categoryEn: 'Data entry',
    description: '拖拽上传区：虚线框，拖入时变实线墨色。只负责收集文件，上传交给你的代码。',
    descriptionEn: 'Drop zone: a dashed frame that turns solid ink while dragging. It only collects files; uploading is up to your code.',
    importPath: '@/components/ui/file-input',
    usage: `import { FileInput } from "@/components/ui/file-input"\n\n<FileInput multiple onFilesChange={setFiles} />`,
    examples: [
      { title: '多文件', titleEn: 'Multiple files', code: `<FileInput\n  multiple\n  accept="image/*"\n  maxSize={5 * 1024 * 1024}\n  hint="PNG or JPG, up to 5 MB"\n  onFilesChange={(files) => console.log(files)}\n  onReject={(files) => toast({ title: files[0].name + ' is too large', type: 'error' })}\n/>`, render: 'preview' },
    ],
    api: [
      { prop: 'accept / multiple', type: 'string / boolean', desc: '同原生 input[type=file]', descEn: 'Same as native input[type=file]' },
      { prop: 'maxSize', type: 'number', desc: '字节上限，超出的走 onReject', descEn: 'Byte limit; larger files go to onReject' },
      { prop: 'title / hint', type: 'ReactNode', desc: '主文案 / 辅助说明', descEn: 'Main text / hint' },
      { prop: 'onFilesChange', type: '(files: File[]) => void', desc: '当前文件列表', descEn: 'Current file list' },
      { prop: 'onReject', type: '(files: File[]) => void', desc: '被拒绝的文件', descEn: 'Rejected files' },
      { prop: 'value / onFilesChange', type: 'File[] / (files) => void', desc: '受控的文件列表', descEn: 'Controlled file list' },
      { prop: 'name / id / required / aria-label', type: 'string | boolean', desc: '文件同步到真实的 <input type="file">，所在 <form> 可直接提交、校验', descEn: 'Files are set on the real <input type="file">, so a surrounding <form> submits and validates them' },
      { prop: 'removeLabel', type: '(name) => string', desc: '删除按钮的可访问名称，用于本地化', descEn: 'Accessible name of each remove button, for localization' }
    ],
  },
  {
    id: 'multi-select', title: 'MultiSelect', category: '数据录入', categoryEn: 'Data entry',
    description: '多选标签输入（Tokenizer）。选中项变成墨色小块，输入可过滤，退格删最后一个。',
    descriptionEn: 'Multi-value tag input (Tokenizer). Choices become small ink chips; typing filters; Backspace removes the last chip.',
    importPath: '@/components/ui/multi-select',
    usage: `import { MultiSelect } from "@/components/ui/multi-select"\n\n<MultiSelect options={rooms} defaultValue={['living']} />`,
    examples: [
      { title: '房间标签', titleEn: 'Room tags', code: `<MultiSelect\n  placeholder="Add rooms"\n  defaultValue={['living', 'study']}\n  options={[\n    { value: 'living', label: 'Living room' },\n    { value: 'bedroom', label: 'Bedroom' },\n    { value: 'kitchen', label: 'Kitchen' },\n    { value: 'study', label: 'Study' },\n    { value: 'bath', label: 'Bathroom' },\n  ]}\n/>`, render: 'preview' },
    ],
    api: [
      { prop: 'options', type: '{ value: string; label: string }[]', desc: '选项', descEn: 'Options' },
      { prop: 'value / defaultValue', type: 'string[]', desc: '受控值 / 默认值', descEn: 'Controlled / default value' },
      { prop: 'onValueChange', type: '(value: string[]) => void', desc: '变化回调', descEn: 'Change callback' },
      { prop: 'placeholder / emptyText', type: 'string', desc: '占位 / 无匹配文案', descEn: 'Placeholder / no-match text' },
    ],
  },
  {
    id: 'tree', title: 'Tree', category: '数据展示', categoryEn: 'Data display',
    description: '文件树。点文件夹展开，选中行是墨色块；方向键上下移动、左右折叠展开。',
    descriptionEn: 'File tree. Click a folder to expand it; the selected row is an ink block. Up / down move, left / right collapse and expand.',
    importPath: '@/components/ui/tree',
    usage: `import { Tree } from "@/components/ui/tree"\n\n<Tree nodes={nodes} defaultExpanded={['src']} />`,
    examples: [
      { title: '项目文件', titleEn: 'Project files', code: `<Tree\n  aria-label="Files"\n  defaultExpanded={['src', 'ui']}\n  defaultSelected="button"\n  nodes={[\n    { id: 'src', label: 'src', children: [\n      { id: 'ui', label: 'components/ui', children: [\n        { id: 'button', label: 'button.tsx' },\n        { id: 'card', label: 'card.tsx' },\n      ] },\n      { id: 'css', label: 'flatpack.css' },\n    ] },\n    { id: 'tokens', label: 'tokens', children: [{ id: 'json', label: 'flatpack.tokens.json' }] },\n  ]}\n/>`, render: 'preview' },
    ],
    api: [
      { prop: 'nodes', type: '{ id; label; children?; icon? }[]', desc: '树数据', descEn: 'Tree data' },
      { prop: 'defaultExpanded', type: 'string[]', desc: '默认展开的 id', descEn: 'Ids expanded by default' },
      { prop: 'selected / defaultSelected', type: 'string | null', desc: '受控 / 默认选中', descEn: 'Controlled / default selection' },
      { prop: 'onSelect', type: '(id: string) => void', desc: '选择回调', descEn: 'Selection callback' },
      { prop: 'expanded / onExpandedChange', type: 'string[] / (ids) => void', desc: '受控展开：当前打开的文件夹 id', descEn: 'Controlled expansion: the ids of the open folders' },
      { prop: 'className / aria-labelledby', type: 'string', desc: '透传到根节点', descEn: 'Passed to the root' }
    ],
  },
  {
    id: 'description-list', title: 'DescriptionList', category: '数据展示', categoryEn: 'Data display',
    description: '键值对列表（Astryx 叫 Metadata List）：左侧灰色名称、右侧值，行间发丝线。stacked 把名称放到值上方。',
    descriptionEn: 'Key / value list (Metadata List in Astryx): grey term on the left, value on the right, hairlines between rows. stacked puts the term above.',
    importPath: '@/components/ui/description-list',
    usage: `import { DescriptionList } from "@/components/ui/description-list"\n\n<DescriptionList items={[{ term: 'Order', value: '#1042' }]} />`,
    examples: [
      { title: '订单信息', titleEn: 'Order details', code: `<DescriptionList\n  items={[\n    { term: 'Order', value: <span className="fp-num">#1042</span> },\n    { term: 'Status', value: <StatusDot status="success">Delivered</StatusDot> },\n    { term: 'Placed', value: <Timestamp date={placedAt} format="datetime" /> },\n    { term: 'Address', value: '88 Century Ave, Shanghai' },\n  ]}\n/>`, render: 'preview' },
    ],
    api: [
      { prop: 'items', type: '{ term: ReactNode; value: ReactNode }[]', desc: '键值对', descEn: 'Pairs' },
      { prop: 'layout', type: '"inline" | "stacked"', default: '"inline"', desc: '并排或上下', descEn: 'Side by side or stacked' },
    ],
  },
  {
    id: 'context-menu', title: 'ContextMenu', category: '导航', categoryEn: 'Navigation',
    description: '右键菜单（触屏长按）。与 Menubar 共用一套菜单项：图标、快捷键、分隔线、危险项红字。',
    descriptionEn: 'Right-click menu (long-press on touch). Shares its item list with Menubar: icons, shortcuts, separators, red text for danger.',
    importPath: '@/components/ui/context-menu',
    usage: `import { ContextMenu } from "@/components/ui/context-menu"\n\n<ContextMenu entries={[{ label: 'Rename' }, { type: 'separator' }, { label: 'Delete', danger: true }]}>\n  Right-click here\n</ContextMenu>`,
    examples: [
      { title: '文件操作', titleEn: 'File actions', code: `<ContextMenu\n  entries={[\n    { label: 'Open', shortcut: '↵' },\n    { label: 'Rename', shortcut: 'F2' },\n    { label: 'Duplicate', shortcut: '⌘D' },\n    { type: 'separator' },\n    { label: 'Delete', shortcut: '⌫', danger: true },\n  ]}\n>\n  Right-click this area\n</ContextMenu>`, render: 'preview' },
    ],
    api: [
      { prop: 'entries', type: 'MenuEntry[]', desc: '{ label; shortcut?; icon?; danger?; disabled?; onSelect? } 或 { type: "separator" }', descEn: '{ label; shortcut?; icon?; danger?; disabled?; onSelect? } or { type: "separator" }' },
      { prop: 'children', type: 'ReactNode', desc: '可右键的区域', descEn: 'The right-clickable area' },
      { prop: 'open / defaultOpen / onOpenChange', type: 'boolean / (open) => void', desc: '受控或非受控地打开', descEn: 'Controlled or uncontrolled open state' },
      { prop: 'className', type: 'string', desc: '触发区域的样式', descEn: 'Class of the trigger area' }
    ],
  },
  {
    id: 'menubar', title: 'Menubar', category: '导航', categoryEn: 'Navigation',
    description: '桌面应用式菜单栏：文件、编辑、视图……打开一个后，悬停即可切换到相邻菜单。打开的项是墨色块。',
    descriptionEn: 'Desktop-style menu bar: File, Edit, View… Once one is open, hovering moves to its neighbours. The open item is an ink block.',
    importPath: '@/components/ui/menubar',
    usage: `import { Menubar } from "@/components/ui/menubar"\n\n<Menubar menus={[{ label: 'File', entries: [{ label: 'New' }] }]} />`,
    examples: [
      { title: '编辑器菜单', titleEn: 'Editor menus', code: `<Menubar\n  menus={[\n    { label: 'File', entries: [{ label: 'New', shortcut: '⌘N' }, { label: 'Open…', shortcut: '⌘O' }, { type: 'separator' }, { label: 'Export' }] },\n    { label: 'Edit', entries: [{ label: 'Undo', shortcut: '⌘Z' }, { label: 'Redo', shortcut: '⇧⌘Z' }] },\n    { label: 'View', entries: [{ label: 'Zoom in', shortcut: '⌘+' }, { label: 'Zoom out', shortcut: '⌘−' }] },\n  ]}\n/>`, render: 'preview' },
    ],
    api: [
      { prop: 'menus', type: '{ label: string; entries: MenuEntry[] }[]', desc: '菜单列表，菜单项同 ContextMenu', descEn: 'Menus; entries as in ContextMenu' },
      { prop: 'aria-label / className / orientation / loop', type: '', desc: '透传给 Base UI Menubar', descEn: 'Passed to the Base UI Menubar' }
    ],
  },
  {
    id: 'carousel', title: 'Carousel', category: '数据展示', categoryEn: 'Data display',
    description: '横向轮播，靠滚动吸附，可滑动、方向键或按钮切换。不自动播放，进度是一排短线。',
    descriptionEn: 'Horizontal slides with scroll snapping; swipe, arrow keys or buttons move it. No autoplay; progress is a row of short lines.',
    importPath: '@/components/ui/carousel',
    usage: `import { Carousel } from "@/components/ui/carousel"\n\n<Carousel slides={photos.map((p) => <Image src={p} ratio="16:9" alt="" />)} />`,
    examples: [
      { title: '商品图', titleEn: 'Product photos', code: `<Carousel\n  aria-label="Armchair photos"\n  slides={[PHOTOS.armchair, PHOTOS.loungeChair, PHOTOS.chair].map((src) => (\n    <Image key={src} src={src} ratio="4:3" alt="Armchair" />\n  ))}\n/>`, render: 'preview' },
    ],
    api: [
      { prop: 'slides', type: 'ReactNode[]', desc: '每一页内容', descEn: 'One node per slide' },
      { prop: 'aria-label', type: 'string', default: '"Carousel"', desc: '区域名称', descEn: 'Region label' },
      { prop: 'index / defaultIndex / onIndexChange', type: 'number / (index) => void', desc: '受控或非受控的当前页（从 0 开始）', descEn: 'Controlled or uncontrolled current slide (0-based)' },
      { prop: 'previousLabel / nextLabel / slideLabel', type: 'string / (i, n) => string', desc: '按钮和每一页的可访问名称，用于本地化', descEn: 'Accessible names of the buttons and each slide, for localization' }
    ],
  },
  {
    id: 'lightbox', title: 'Lightbox', category: '数据展示', categoryEn: 'Data display',
    description: '全屏看大图：顶部标题与计数，底部缩略图条，← / → 切换，Esc 关闭。LightboxGallery 是现成的缩略图网格。',
    descriptionEn: 'Full-screen image viewer: title and count on top, a thumbnail strip below, ← / → to switch, Esc to close. LightboxGallery is a ready-made thumbnail grid.',
    importPath: '@/components/ui/lightbox',
    usage: `import { LightboxGallery } from "@/components/ui/lightbox"\n\n<LightboxGallery images={[{ src: '/a.jpg', alt: 'Sofa' }]} />`,
    examples: [
      { title: '图集', titleEn: 'Gallery', code: `<LightboxGallery\n  columns={3}\n  images={[\n    { src: PHOTOS.livingRoom, alt: 'Living room' },\n    { src: PHOTOS.bedroom, alt: 'Bedroom' },\n    { src: PHOTOS.office, alt: 'Office' },\n  ]}\n/>`, render: 'preview' },
    ],
    api: [
      { prop: 'images', type: '{ src; alt; thumb? }[]', desc: '图片列表', descEn: 'Images' },
      { prop: 'open / index', type: 'boolean / number', desc: 'Lightbox：是否打开 / 当前第几张', descEn: 'Lightbox: open state / current index' },
      { prop: 'onOpenChange / onIndexChange', type: '(v) => void', desc: 'Lightbox：回调', descEn: 'Lightbox: callbacks' },
      { prop: 'columns', type: 'number', default: '3', desc: 'LightboxGallery：列数', descEn: 'LightboxGallery: columns' },
      { prop: 'label / closeLabel / previousLabel / nextLabel', type: 'string', desc: '可访问名称，用于本地化。label 是对话框的角色描述，名称取当前图片的 alt', descEn: "Accessible names, for localization. label is the dialog's role description; its name is the current image's alt" },
      { prop: 'openLabel', type: '(alt) => string', desc: 'LightboxGallery：缩略图按钮的可访问名称', descEn: 'LightboxGallery: accessible name of each thumbnail button' }
    ],
  },
  {
    id: 'timestamp', title: 'Timestamp', category: '数据展示', categoryEn: 'Data display',
    description: '"3 分钟前"这类相对时间，或本地化的日期。渲染成 <time>，悬停显示完整时间。',
    descriptionEn: 'Relative time ("3 minutes ago") or a localized date. Renders a <time> element with the full date on hover.',
    importPath: '@/components/ui/timestamp',
    usage: `import { Timestamp } from "@/components/ui/timestamp"\n\n<Timestamp date={comment.createdAt} />`,
    examples: [
      { title: '三种格式', titleEn: 'Three formats', code: `<Timestamp date={Date.now() - 3 * 60 * 1000} />\n<Timestamp date={Date.now() - 2 * 86400 * 1000} locale="zh-CN" />\n<Timestamp date="2026-11-20T09:30:00" format="datetime" />`, render: 'preview' },
    ],
    api: [
      { prop: 'date', type: 'Date | string | number', desc: '时间', descEn: 'The time' },
      { prop: 'format', type: '"relative" | "date" | "datetime"', default: '"relative"', desc: '显示格式', descEn: 'Display format' },
      { prop: 'locale', type: 'string', desc: '语言，默认跟随浏览器', descEn: 'Locale; defaults to the browser' },
      { prop: 'refreshMs', type: 'number', desc: '相对时间的刷新间隔，默认不刷新', descEn: 'Refresh interval for relative text; off by default' },
    ],
  },
  {
    id: 'status-dot', title: 'StatusDot', category: '数据展示', categoryEn: 'Data display',
    description: '状态点。按规范做成 8px 方块，颜色只用墨、红、绿，idle 是空心方框。只给小方块和文字上色，不铺底。',
    descriptionEn: 'Status mark. Per the rules it is an 8px square in ink, red or green; idle is an empty outline. Color only tints the mark and text, never a fill.',
    importPath: '@/components/ui/status-dot',
    usage: `import { StatusDot } from "@/components/ui/status-dot"\n\n<StatusDot status="success">Online</StatusDot>`,
    examples: [
      { title: '四种状态', titleEn: 'Four states', code: `<StatusDot>Running</StatusDot>\n<StatusDot status="success">Delivered</StatusDot>\n<StatusDot status="danger">Failed</StatusDot>\n<StatusDot status="idle">Paused</StatusDot>`, render: 'preview' },
    ],
    api: [
      { prop: 'status', type: '"default" | "success" | "danger" | "idle"', default: '"default"', desc: '状态', descEn: 'Status' },
      { prop: 'children', type: 'ReactNode', desc: '状态文字', descEn: 'Status text' },
    ],
  },
  {
    id: 'visually-hidden', title: 'VisuallyHidden', category: '工具', categoryEn: 'Utility',
    description: '视觉上隐藏、读屏仍能读到的文字。给只有图标的按钮补说明时用。',
    descriptionEn: 'Text hidden on screen but still read by screen readers. Use it to label icon-only buttons.',
    importPath: '@/components/ui/visually-hidden',
    usage: `import { VisuallyHidden } from "@/components/ui/visually-hidden"\n\n<Button size="icon"><Heart size={16} /><VisuallyHidden>Save</VisuallyHidden></Button>`,
    examples: [
      { title: '图标按钮', titleEn: 'Icon button', code: `<Button size="icon" variant="outline">\n  <Heart size={16} />\n  <VisuallyHidden>Add to favourites</VisuallyHidden>\n</Button>`, render: 'preview' },
    ],
    api: [
      { prop: '...props', type: 'HTMLAttributes<HTMLSpanElement>', desc: '原生 span 属性', descEn: 'Native span attributes' },
    ],
  },
  {
    id: 'drawer', title: 'Drawer', category: '反馈', categoryEn: 'Feedback',
    description: '从屏幕边缘滑入的面板，支持滑动手势关闭。默认从底部，也可从四边任一边。底部抽屉可用 snapPoints 停在预设高度。只需要普通侧栏、不要手势时用 Sheet。',
    descriptionEn: 'A panel that slides in from a screen edge and closes with a swipe. Bottom by default, or any of the four edges. A bottom drawer can rest at preset heights with snapPoints. Use Sheet when you only need a plain side panel with no gestures.',
    importPath: '@/components/ui/drawer',
    usage: `import { Drawer, DrawerTrigger, DrawerContent, DrawerFooter, DrawerClose } from "@/components/ui/drawer"\n\n<Drawer>\n  <DrawerTrigger>Open</DrawerTrigger>\n  <DrawerContent title="Title" description="Optional">\n    Content\n    <DrawerFooter><DrawerClose>Close</DrawerClose></DrawerFooter>\n  </DrawerContent>\n</Drawer>`,
    examples: [
      { title: '底部抽屉', titleEn: 'Bottom drawer', code: `<Drawer>\n  <DrawerTrigger>Open drawer</DrawerTrigger>\n  <DrawerContent title="Add to cart" description="Swipe down to close.">\n    Oak side table, 45 × 45 cm.\n    <DrawerFooter>\n      <DrawerClose>Keep browsing</DrawerClose>\n      <DrawerClose render={<Button />}>Add to cart</DrawerClose>\n    </DrawerFooter>\n  </DrawerContent>\n</Drawer>`, render: 'preview' },
      { title: '从右侧滑入', titleEn: 'From the right', code: `<Drawer side="right">\n  <DrawerTrigger>Open from the right</DrawerTrigger>\n  <DrawerContent title="Filters">\n    {/* Fields */}\n  </DrawerContent>\n</Drawer>`, render: 'preview' },
    ],
    api: [
      { prop: 'side', type: '"bottom" | "top" | "left" | "right"', default: '"bottom"', desc: 'Drawer：从哪条边滑入，同时决定向哪个方向滑动关闭', descEn: 'Drawer: the edge it slides in from, and the swipe direction that closes it' },
      { prop: 'open / onOpenChange', type: 'boolean / (open, details) => void', desc: '受控模式。不传 open 时用 defaultOpen', descEn: 'Controlled mode. Without open, defaultOpen is used' },
      { prop: 'snapPoints', type: '(number | string)[]', desc: 'Drawer：底部抽屉可停靠的高度。0 到 1 之间为视口高度比例，大于 1 为像素，也可写 "148px" 或 "30rem"', descEn: 'Drawer: heights a bottom drawer can rest at. 0 to 1 is a fraction of the viewport, above 1 is pixels, or write "148px" / "30rem"' },
      { prop: 'snapPoint / onSnapPointChange', type: 'number | string / (point) => void', desc: '受控的当前停靠点', descEn: 'Controlled current snap point' },
      { prop: 'title / description', type: 'string / ReactNode', desc: 'DrawerContent：标题（必填，读屏用）和说明', descEn: 'DrawerContent: title (required, read by screen readers) and description' },
      { prop: 'showHandle', type: 'boolean', default: 'true', desc: 'DrawerContent：底部抽屉顶部的把手', descEn: 'DrawerContent: grab bar on a bottom drawer' },
      { prop: 'showCloseButton / closeLabel', type: 'boolean / string', desc: 'DrawerContent：右上角 × 及其可访问名称，默认关闭', descEn: 'DrawerContent: corner × and its accessible name, off by default' },
      { prop: 'render', type: 'ReactElement', desc: 'DrawerTrigger / DrawerClose：换成自己的元素', descEn: 'DrawerTrigger / DrawerClose: use your own element' },
    ],
  },
  {
    id: 'form', title: 'Form', category: '数据录入', categoryEn: 'Data entry',
    description: '带校验的表单。提交时检查每个 Field，焦点跳到第一个错误，全部通过后用控件 name 做键回调 onFormSubmit。服务端错误用 errors 传入，用户修改该字段后自动清除。',
    descriptionEn: 'A form with validation. On submit it checks every Field, focuses the first error and, when all pass, calls onFormSubmit with values keyed by control name. Server errors go in through errors and clear when the user edits that field.',
    importPath: '@/components/ui/form',
    usage: `import { Form } from "@/components/ui/form"\nimport { Field, FieldControl } from "@/components/ui/field"\n\n<Form onFormSubmit={(values) => save(values)}>\n  <Field label="Email" name="email" required>\n    <FieldControl render={<Input type="email" required />} />\n  </Field>\n  <Button type="submit">Save</Button>\n</Form>`,
    examples: [
      { title: '内置校验 + 服务端错误', titleEn: 'Built-in checks and a server error', code: `<Form errors={errors} onFormSubmit={(v) => submit(v)}>\n  <Field label="Email" name="email" required>\n    <FieldControl render={<Input type="email" required />} />\n  </Field>\n  <Field\n    label="Password"\n    name="password"\n    validate={(v) => (String(v ?? '').length < 8 ? 'Use at least 8 characters.' : null)}\n  >\n    <FieldControl render={<Input type="password" required />} />\n  </Field>\n  <Button type="submit">Create account</Button>\n</Form>`, render: 'preview' },
    ],
    api: [
      { prop: 'onFormSubmit', type: '(values, details) => void', desc: '校验全部通过后调用，values 以控件 name 为键', descEn: 'Called once every check passes; values are keyed by control name' },
      { prop: 'errors', type: 'Record<string, string | string[]>', desc: '按 name 传入外部（如服务端）错误', descEn: 'External (e.g. server) errors by control name' },
      { prop: 'validationMode', type: '"onSubmit" | "onBlur" | "onChange"', default: '"onSubmit"', desc: '何时校验。单个 Field 可覆盖', descEn: 'When to validate. A single Field can override' },
      { prop: 'Field validate', type: '(value, formValues) => string | string[] | null', desc: 'Field：自定义校验，返回错误文字，通过时返回 null', descEn: 'Field: custom check; return the message, or null when valid' },
    ],
  },
  {
    id: 'otp-field', title: 'OtpField', category: '数据录入', categoryEn: 'Data entry',
    description: '一次性验证码输入：一排单字符输入框。输入自动前进，退格回退，粘贴整段验证码会填满所有格子。',
    descriptionEn: 'One-time code entry: a row of single-character boxes. Typing moves forward, Backspace moves back and pasting a whole code fills every box.',
    importPath: '@/components/ui/otp-field',
    usage: `import { OtpField } from "@/components/ui/otp-field"\n\n<OtpField aria-label="Verification code" length={6} onValueComplete={(code) => verify(code)} />`,
    examples: [
      { title: '6 位，分两组', titleEn: 'Six digits in two groups', code: `<OtpField\n  aria-label="Verification code"\n  length={6}\n  groupSize={3}\n  onValueComplete={(code) => verify(code)}\n/>`, render: 'preview' },
    ],
    api: [
      { prop: 'length', type: 'number', default: '6', desc: '格子数', descEn: 'Number of boxes' },
      { prop: 'groupSize', type: 'number', desc: '每组几格，组间画一条短横线', descEn: 'Boxes per group; a short dash is drawn between groups' },
      { prop: 'value / onValueChange', type: 'string / (value) => void', desc: '受控模式。不传 value 时用 defaultValue', descEn: 'Controlled mode. Without value, defaultValue is used' },
      { prop: 'onValueComplete', type: '(value) => void', desc: '所有格子填满时调用', descEn: 'Called once every box is filled' },
      { prop: 'validationType', type: '"numeric" | "alpha" | "alphanumeric" | "none"', default: '"numeric"', desc: '允许的字符', descEn: 'Allowed characters' },
      { prop: 'mask', type: 'boolean', desc: '用点号遮住已输入的字符', descEn: 'Hide typed characters' },
      { prop: 'size / invalid', type: '"sm" | "md" | "lg" / boolean', desc: '格子大小，与 Input 同高；错误态', descEn: 'Box size, same heights as Input; error state' },
    ],
  },
  {
    id: 'meter', title: 'Meter', category: '数据展示', categoryEn: 'Data display',
    description: '已知范围内的一个值，比如已用空间、评分。任务会走到终点用 Progress，这里不会。',
    descriptionEn: 'A value inside a known range, such as disk used or a score. Use Progress for a task that runs to completion; a meter does not.',
    importPath: '@/components/ui/meter',
    usage: `import { Meter } from "@/components/ui/meter"\n\n<Meter label="Storage used" value={68} showValue />`,
    examples: [
      { title: '数值与格式', titleEn: 'Values and formats', code: `<Meter label="Storage used" value={68} max={100} showValue format={{ style: 'unit', unit: 'gigabyte' }} />\n<Meter label="Review score" value={0.9} min={0} max={1} showValue format={{ style: 'percent' }} size="lg" />\n<Meter aria-label="Battery" value={20} size="sm" />`, render: 'preview' },
    ],
    api: [
      { prop: 'value', type: 'number', desc: '当前值', descEn: 'Current value' },
      { prop: 'min / max', type: 'number', default: '0 / 100', desc: '范围', descEn: 'Range' },
      { prop: 'label / showValue', type: 'ReactNode / boolean', desc: '标签与右侧的格式化数值。没有可见标签时请传 aria-label', descEn: 'Label and the formatted value on the right. Pass aria-label when there is no visible label' },
      { prop: 'format', type: 'Intl.NumberFormatOptions', desc: '数值格式，如 { style: "percent" }', descEn: 'Number format, e.g. { style: "percent" }' },
      { prop: 'size', type: '"sm" | "default" | "lg"', default: '"default"', desc: '条的粗细', descEn: 'Bar thickness' },
    ],
  },
  {
    id: 'input-group', title: 'InputGroup', category: '数据录入', categoryEn: 'Data entry',
    description: '一个输入框外面套一个边框，里面可放图标、单位、快捷键和按钮。焦点与错误态作用于整行。只要一个图标时，用 Input 的 leading / trailing 更短。',
    descriptionEn: 'One frame around an input with icons, units, shortcuts and buttons inside. Focus and error states cover the whole row. For a single icon, Input’s leading / trailing props are shorter.',
    importPath: '@/components/ui/input-group',
    usage: `import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupButton } from "@/components/ui/input-group"\n\n<InputGroup>\n  <InputGroupAddon>https://</InputGroupAddon>\n  <InputGroupInput aria-label="Site" />\n  <InputGroupButton>Copy</InputGroupButton>\n</InputGroup>`,
    examples: [
      { title: '图标 + 快捷键 / 前缀 + 按钮', titleEn: 'Icon and shortcut / prefix and button', code: `<InputGroup>\n  <InputGroupAddon aria-hidden="true"><Search size={16} /></InputGroupAddon>\n  <InputGroupInput aria-label="Search" placeholder="Search products" />\n  <InputGroupAddon><KbdGroup keys={['⌘', 'K']} /></InputGroupAddon>\n</InputGroup>\n\n<InputGroup>\n  <InputGroupAddon>https://</InputGroupAddon>\n  <InputGroupInput aria-label="Site" defaultValue="flatpack.dev" />\n  <InputGroupButton>Copy</InputGroupButton>\n</InputGroup>`, render: 'preview' },
    ],
    api: [
      { prop: 'size', type: '"sm" | "md" | "lg"', default: '"md"', desc: 'InputGroup：与 Button、Input 同一套高度', descEn: 'InputGroup: same heights as Button and Input' },
      { prop: 'variant', type: '"outline" | "filled"', default: '"outline"', desc: 'InputGroup：描边或浅灰填充', descEn: 'InputGroup: outlined or light grey fill' },
      { prop: 'disabled', type: 'boolean', desc: 'InputGroup：整行置灰。输入框请同时传 disabled', descEn: 'InputGroup: dims the row. Also pass disabled to the input' },
      { prop: '...props', type: 'InputHTMLAttributes', desc: 'InputGroupInput：原生 input 属性，可放进 Field', descEn: 'InputGroupInput: native input attributes; works inside Field' },
    ],
  },
  {
    id: 'composer', title: 'Composer', category: 'AI', categoryEn: 'AI',
    description: '对话和 AI 助手界面的消息框：随文字增高的输入区、操作栏和发送按钮。回车发送，Shift+回车换行。中文、日文输入法选字时按回车只确认文字，不会发送。',
    descriptionEn: 'The message box of a chat or assistant screen: a textarea that grows with its text, an action bar and a send button. Enter sends, Shift+Enter adds a line. Enter during IME composition (pinyin, kana) only confirms the text.',
    importPath: '@/components/ui/composer',
    usage: `import { Composer } from "@/components/ui/composer"\n\n<Composer placeholder="Ask anything" onSubmit={(text) => send(text)} />`,
    examples: [
      { title: '带提示与附件按钮', titleEn: 'With a hint and an attach button', code: `<Composer\n  placeholder="Ask anything"\n  loading={busy}\n  onStop={() => abort()}\n  onSubmit={(text) => send(text)}\n  leading={<><Kbd>⏎</Kbd> send · <Kbd>⇧⏎</Kbd> new line</>}\n  actions={<Button size="icon" variant="ghost" aria-label="Attach file"><Paperclip size={16} /></Button>}\n/>`, render: 'preview' },
    ],
    api: [
      { prop: 'onSubmit', type: '(text: string) => void', desc: '回车或点发送时调用，参数已去掉首尾空白。空内容不会触发', descEn: 'Called on Enter or the send button with trimmed text. Empty text never fires' },
      { prop: 'value / onValueChange', type: 'string / (value) => void', desc: '受控模式。不传 value 时用 defaultValue', descEn: 'Controlled mode. Without value, defaultValue is used' },
      { prop: 'loading / onStop', type: 'boolean / () => void', desc: '正在生成回复时，发送按钮变成停止按钮', descEn: 'While a reply is being produced the send button becomes a stop button' },
      { prop: 'leading / actions', type: 'ReactNode', desc: '操作栏左侧（提示、模型选择）和右侧发送按钮之前（附件等）', descEn: 'Left of the bar (hint, model picker) and right, before the send button (attach, etc.)' },
      { prop: 'maxRows', type: 'number', default: '8', desc: '输入区最多增高到几行，之后滚动', descEn: 'Lines the input grows to before it scrolls' },
      { prop: 'clearOnSubmit', type: 'boolean', default: 'true', desc: '提交后清空；由父组件清空时设为 false', descEn: 'Clear after submit; set false when the parent clears it' },
      { prop: 'inputLabel / sendLabel / stopLabel', type: 'string', desc: '可访问名称，默认英文', descEn: 'Accessible names, English by default' },
    ],
  },
  {
    id: 'data-table', title: 'DataTable', category: '数据展示', categoryEn: 'Data display',
    description: '一组数据的表格：点表头排序（升序、降序、取消），勾选行，分页，空状态。排序、选择、页码都可受控。选择按行 id 记录，排序和翻页后仍保留。',
    descriptionEn: 'A table for one array of rows: click a header to sort (ascending, descending, off), select rows, page through and show an empty state. Sort, selection and page are each controlled or uncontrolled. Selection is kept by row id, so it survives sorting and paging.',
    importPath: '@/components/ui/data-table',
    usage: `import { DataTable, type DataTableColumn } from "@/components/ui/data-table"\n\nconst columns: DataTableColumn<Order>[] = [\n  { key: 'customer', header: 'Customer', sortable: true },\n  { key: 'total', header: 'Total', sortable: true, align: 'end', cell: (o) => money(o.total) },\n]\n\n<DataTable aria-label="Orders" columns={columns} data={orders} getRowId={(o) => o.id} />`,
    examples: [
      { title: '排序、选择与分页', titleEn: 'Sorting, selection and paging', code: `const [selected, setSelected] = useState<string[]>([])\n\n<DataTable\n  aria-label="Orders"\n  columns={[\n    { key: 'id', header: 'Order', sortable: true },\n    { key: 'customer', header: 'Customer', sortable: true },\n    { key: 'status', header: 'Status', cell: (o) => <Badge variant="outline">{o.status}</Badge> },\n    { key: 'total', header: 'Total', sortable: true, align: 'end', cell: (o) => money(o.total) },\n  ]}\n  data={orders}\n  getRowId={(o) => o.id}\n  defaultSort={{ key: 'total', direction: 'desc' }}\n  selectable\n  selected={selected}\n  onSelectedChange={setSelected}\n  pageSize={4}\n/>`, render: 'preview' },
    ],
    api: [
      { prop: 'columns', type: 'DataTableColumn<T>[]', desc: '列：key、header；可选 cell（显示）、value（排序取值）、sortable、align、width', descEn: 'Columns: key and header; optional cell (display), value (what sorting compares), sortable, align, width' },
      { prop: 'data / getRowId', type: 'T[] / (row) => string', desc: '数据与每行的稳定 id', descEn: 'Rows and a stable id per row' },
      { prop: 'sort / defaultSort / onSortChange', type: '{ key, direction } | null', desc: '排序，受控或非受控。空值总排在最后', descEn: 'Sort, controlled or uncontrolled. Empty values always go last' },
      { prop: 'selectable', type: 'boolean', desc: '加一列复选框；表头的复选框作用于当前页', descEn: 'Adds a checkbox column; the header box acts on the current page' },
      { prop: 'selected / defaultSelected / onSelectedChange', type: 'string[]', desc: '选中的行 id', descEn: 'Selected row ids' },
      { prop: 'pageSize / page / defaultPage / onPageChange', type: 'number', desc: '每页行数与页码。不传 pageSize 时不分页', descEn: 'Rows per page and the page. Without pageSize there is no paging' },
      { prop: 'empty', type: 'ReactNode', desc: '没有数据时显示，默认一个 Empty', descEn: 'Shown when there are no rows; an Empty by default' },
      { prop: 'caption / aria-label', type: 'ReactNode / string', desc: '表格的名字，二选一', descEn: 'The table name; give one of the two' },
      { prop: 'selectAllLabel / selectRowLabel / paginationLabel', type: 'string / (row) => string / string', desc: '可访问名称，默认英文', descEn: 'Accessible names, English by default' },
    ],
  },
  {
    id: 'message', title: 'Message', category: 'AI', categoryEn: 'AI',
    description: '对话里的一条消息：头像加内容。用户的消息在右侧、浅灰底；助手的消息在左侧、无底色。内容可以是文字，也可以是 Thinking、ToolCall、代码块按顺序叠起来。',
    descriptionEn: 'One turn of a conversation: an avatar and the content. The user\'s message sits on the right with a grey ground; the assistant\'s is plain text on the left. The content can be text, or Thinking, ToolCall and a code block stacked in the order they were produced.',
    importPath: '@/components/ui/message',
    usage: `import { Message } from "@/components/ui/message"\n\n<Message role="user">Which chairs are low on stock?</Message>\n<Message>Three chairs are below 10 units.</Message>`,
    examples: [
      { title: '一问一答', titleEn: 'A question and an answer', code: `<Message role="user">Which chairs are low on stock?</Message>\n<Message>\n  <ToolCall name="Searched inventory" detail="3 results" />\n  <p>Three chairs are below 10 units.</p>\n</Message>`, render: 'preview' },
    ],
    api: [
      { prop: 'role', type: '"user" | "assistant"', default: '"assistant"', desc: '谁写的。决定位置和底色', descEn: 'Who wrote it. Sets the side and the ground' },
      { prop: 'name', type: 'string', desc: '默认头像的名字（取前两个字母）。默认「AI」或「You」', descEn: 'Name for the default avatar (its first two letters). "AI" or "You" by default' },
      { prop: 'avatar', type: 'ReactNode', desc: '替换默认头像', descEn: 'Replaces the default avatar' },
      { prop: 'children', type: 'ReactNode', desc: '消息内容。多个子元素竖向排列', descEn: 'The content. Several children stack vertically' },
    ],
  },
  {
    id: 'thinking', title: 'Thinking', category: 'AI', categoryEn: 'AI',
    description: '助手的推理过程，折叠成一行，让答案留在最前面。思考时显示加载指示并默认展开；结束后一行写「Thought for 12s」，点开可以检查每一步。',
    descriptionEn: 'The assistant\'s reasoning, folded under one line so the answer stays in front. While it works the line shows a spinner and the trace is open; when it finishes it reads "Thought for 12s" and the user can open it to check the steps.',
    importPath: '@/components/ui/thinking',
    usage: `import { Thinking } from "@/components/ui/thinking"\n\n<Thinking duration={12}>\n  Checked stock for the three chairs, then read the reorder rule.\n</Thinking>`,
    examples: [
      { title: '思考中与已完成', titleEn: 'Working and finished', code: `<Thinking status="thinking">\n  Looking for chairs with fewer than 10 units.\n</Thinking>\n<Thinking duration={12}>\n  Checked stock for the three chairs, then read the reorder rule.\n</Thinking>`, render: 'preview' },
    ],
    api: [
      { prop: 'status', type: '"thinking" | "done"', default: '"done"', desc: '思考中显示加载指示并默认展开', descEn: 'While thinking it shows a spinner and starts open' },
      { prop: 'duration', type: 'number', desc: '思考了几秒，显示在完成后的标题里', descEn: 'Seconds it thought for, shown in the finished label' },
      { prop: 'label', type: 'ReactNode', desc: '替换标题文字，用于本地化', descEn: 'Replaces the label, for localization' },
      { prop: 'open / defaultOpen / onOpenChange', type: 'boolean / boolean / (open) => void', desc: '展开状态，受控或非受控', descEn: 'Open state, controlled or uncontrolled' },
      { prop: 'children', type: 'ReactNode', desc: '推理内容。不传时只显示一行文字，不能展开', descEn: 'The reasoning. Without children the label is plain text and does not unfold' },
    ],
  },
  {
    id: 'tool-call', title: 'ToolCall', category: 'AI', categoryEn: 'AI',
    description: '一次工具调用或代码改动，做成消息中间的一个紧凑小标签：状态图标、名称和一段等宽的细节。',
    descriptionEn: 'A tool call or code edit as one compact chip in the middle of a message: a status icon, a name and a short detail in the mono face.',
    importPath: '@/components/ui/tool-call',
    usage: `import { ToolCall } from "@/components/ui/tool-call"\n\n<ToolCall name="Searched inventory" detail="3 results" />`,
    examples: [
      { title: '三种状态', titleEn: 'The three states', code: `<ToolCall status="running" name="Searching inventory" />\n<ToolCall name="Searched inventory" detail="3 results" />\n<ToolCall status="error" name="Edit orders.ts" detail="file is read-only" />`, render: 'preview' },
    ],
    api: [
      { prop: 'name', type: 'string', desc: '调用了什么', descEn: 'What was called' },
      { prop: 'detail', type: 'string', desc: '参数或结果：一个查询、路径、「3 results」。用等宽字体', descEn: 'The arguments or result: a query, a path, "3 results". Set in the mono face' },
      { prop: 'status', type: '"running" | "done" | "error"', default: '"done"', desc: '运行中显示加载指示，完成是对勾，失败是叉', descEn: 'Running shows a spinner, done a check, error a cross' },
      { prop: 'statusLabels', type: 'Record<status, string>', desc: '屏幕阅读器读出的状态文字，默认英文', descEn: 'Status text read by screen readers, English by default' },
    ],
  },
  {
    id: 'task-list', title: 'TaskList', category: 'AI', categoryEn: 'AI',
    description: 'Agent 正在做的事，一行一个任务，带状态：排队、运行中、完成、失败。右侧可放时长或错误信息。',
    descriptionEn: 'What an agent is working on, one row per task with its state: queued, running, done or failed. The right side can hold a duration or an error.',
    importPath: '@/components/ui/task-list',
    usage: `import { TaskList } from "@/components/ui/task-list"\n\n<TaskList\n  aria-label="Agent tasks"\n  tasks={[\n    { id: '1', title: 'Read the order export', status: 'done', detail: '2.1s' },\n    { id: '2', title: 'Update reorder rules', status: 'running' },\n  ]}\n/>`,
    examples: [
      { title: '一次运行的进度', titleEn: 'The progress of one run', code: `<TaskList\n  aria-label="Agent tasks"\n  tasks={[\n    { id: '1', title: 'Read the order export', status: 'done', detail: '2.1s' },\n    { id: '2', title: 'Check stock levels', status: 'failed', detail: 'Timed out' },\n    { id: '3', title: 'Update reorder rules', status: 'running' },\n    { id: '4', title: 'Write the summary', status: 'queued' },\n  ]}\n/>`, render: 'preview' },
    ],
    api: [
      { prop: 'tasks', type: 'Task[]', desc: '每项：id、title、status（queued / running / done / failed），可选 detail', descEn: 'Each task: id, title, status (queued / running / done / failed) and an optional detail' },
      { prop: 'statusLabels', type: 'Record<status, string>', desc: '屏幕阅读器读出的状态文字，默认英文', descEn: 'Status text read by screen readers, English by default' },
      { prop: 'aria-label', type: 'string', desc: '列表的名字', descEn: 'The list name' },
    ],
  },
  {
    id: 'approval', title: 'Approval', category: 'AI', categoryEn: 'AI',
    description: '助手在动手之前向人提的问题，放在消息流里。决定之前显示两个按钮，决定之后按钮换成结果，历史记录读起来才对。',
    descriptionEn: 'A question the assistant asks before it acts, placed in the message flow. It shows two buttons until the user decides, then the buttons give way to the result so the history reads correctly.',
    importPath: '@/components/ui/approval',
    usage: `import { Approval } from "@/components/ui/approval"\n\n<Approval\n  title="Delete 12 draft orders?"\n  description="This cannot be undone."\n  onApprove={() => run()}\n  onDeny={() => cancel()}\n/>`,
    examples: [
      { title: '执行前确认', titleEn: 'Confirm before acting', code: `<Approval\n  title="Delete 12 draft orders?"\n  description="The assistant wants to remove every draft older than 30 days. This cannot be undone."\n  onApprove={() => run()}\n  onDeny={() => cancel()}\n/>`, render: 'preview' },
    ],
    api: [
      { prop: 'title / description', type: 'ReactNode', desc: '要做什么，和补充说明', descEn: 'What the assistant wants to do, and a note' },
      { prop: 'children', type: 'ReactNode', desc: '决定前要核对的细节：代码块、受影响的条目', descEn: 'Details to check before deciding: a code block, the items affected' },
      { prop: 'onApprove / onDeny', type: '() => void', desc: '点按钮时调用', descEn: 'Called when a button is pressed' },
      { prop: 'status / defaultStatus', type: '"pending" | "approved" | "denied"', default: '"pending"', desc: '受控状态，或非受控的初始状态。已决定后只显示结果', descEn: 'Controlled status, or the uncontrolled start. Once decided it shows only the result' },
      { prop: 'approveLabel / denyLabel / approvedLabel / deniedLabel', type: 'string', desc: '按钮和结果文字，默认英文', descEn: 'Button and result text, English by default' },
    ],
  },
  {
    id: 'diff', title: 'Diff', category: 'AI', categoryEn: 'AI',
    description: '助手改了什么：用统一 diff 格式写入，删掉的行划线、加入的行标绿，每行前有 +/- 记号，不靠颜色一种信号。表格里改过的单元格用 DiffValue，旧值划线、新值在后。',
    descriptionEn: 'What the assistant changed. Pass a unified diff: removed lines are struck out and added lines are green, each with a +/- marker so colour is not the only signal. For a changed cell in a table, DiffValue shows the old value struck out and the new one after it.',
    importPath: '@/components/ui/diff',
    usage: `import { Diff, DiffValue } from "@/components/ui/diff"\n\n<Diff file="rules/armchair.json" patch={patch} />\n<DiffValue from="10" to="6" />`,
    examples: [
      { title: '代码改动与单元格改动', titleEn: 'A code change and a changed cell', code: `<Diff\n  file="rules/armchair.json"\n  patch={[\n    '@@ -1,3 +1,3 @@',\n    ' {',\n    '-  "reorderPoint": 10,',\n    '+  "reorderPoint": 6,',\n    '   "supplier": "Nordic Wood"',\n    ' }',\n  ].join('\\n')}\n/>\n\n<DiffValue from="10" to="6" />`, render: 'preview' },
    ],
    api: [
      { prop: 'patch', type: 'string', desc: '统一 diff：以 + 开头是加入，- 是删除，空格是未改动，@@ 行标记一段的开始。有 @@ 行时，开头的 --- / +++ 文件头会被去掉', descEn: 'A unified diff: "+" adds, "-" removes, a space leaves a line as is, and an @@ line starts a section. When the patch has an @@ line, the leading --- / +++ file headers are dropped' },
      { prop: 'file', type: 'string', desc: '显示在上方的文件名', descEn: 'File name shown above the lines' },
      { prop: 'labels', type: '{ add, del }', desc: '屏幕阅读器读出的「新增」「删除」文字，默认英文', descEn: 'Text read by screen readers for added and removed lines, English by default' },
      { prop: 'DiffValue: from / to', type: 'ReactNode', desc: '改动前和改动后的值，用于表格单元格', descEn: 'The value before and after, for a table cell' },
    ],
  },
  {
    id: 'sources', title: 'Sources', category: 'AI', categoryEn: 'AI',
    description: '回答依据的来源。句子里用 Citation 放一个编号小标签，指向一条来源；回答末尾用 Sources 列出带编号的来源清单，编号和小标签一一对应。',
    descriptionEn: 'The sources an answer was built from. Put a numbered Citation chip inside a sentence to point at one source, and list the numbered sources at the end with Sources. The numbers match.',
    importPath: '@/components/ui/sources',
    usage: `import { Citation, Sources } from "@/components/ui/sources"\n\n<p>Oak stools are low <Citation n={1} title="Inventory export" href="https://example.com/stock" />.</p>\n<Sources items={[{ title: "Inventory export", href: "https://example.com/stock" }]} />`,
    examples: [
      { title: '行内引用与来源清单', titleEn: 'Inline citations and the list', code: `<p>\n  The armchair is down to 4 units <Citation n={1} title="Inventory export" href="https://example.com/stock" />\n  and the supplier needs two weeks <Citation n={2} title="Supplier terms" href="https://example.org/terms" />.\n</p>\n<Sources\n  items={[\n    { title: 'Inventory export', href: 'https://example.com/stock' },\n    { title: 'Supplier terms', href: 'https://example.org/terms' },\n  ]}\n/>`, render: 'preview' },
    ],
    api: [
      { prop: 'Citation: n', type: 'number', desc: '来源编号，对应 Sources 清单里的序号', descEn: 'The source number, as in the Sources list' },
      { prop: 'Citation: title / href', type: 'string', desc: '来源标题（给屏幕阅读器和悬停提示）和链接。没有 href 时只是文字小标签', descEn: 'Source title (for screen readers and the hover hint) and link. Without href the chip is plain text' },
      { prop: 'Sources: items', type: '{ title, href?, note? }[]', desc: '来源清单，按顺序编号。note 默认是 href 的域名', descEn: 'The sources, numbered in order. note defaults to the host of href' },
      { prop: 'Sources: label', type: 'string', default: '"Sources"', desc: '清单标题，也是它的可访问名称', descEn: 'The heading above the list and its accessible name' },
    ],
  },
]

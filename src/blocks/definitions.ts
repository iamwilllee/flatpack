// Full-screen block definitions for the Blocks gallery.
// Each block is a real screen composed entirely from Flatpack UI components.

export type BlockCategory = 'Commerce' | 'Dashboard' | 'Account' | 'AI'

export type Block = {
  id: string
  title: string
  category: BlockCategory
  description: string
  descriptionEn: string
  code: string
}

export const categories: ('All' | BlockCategory)[] = ['All', 'Commerce', 'Dashboard', 'Account', 'AI']

export const blocks: Block[] = [
  {
    id: 'storefront', title: 'Storefront', category: 'Commerce',
    description: '商品列表页：顶栏、分类筛选与商品网格。',
    descriptionEn: 'Product listing page: top bar, category filters, and a product grid.',
    code: `<div className="store">
  <header>FLATPACK HOME · Input search · Button cart</header>
  <h1>Browse all products</h1>
  <div>All / Living room / Bedroom / Kitchen / Study — Badge</div>
  <div className="grid grid-cols-3">
    {products.map(p => (
      <Card>
        <Image ratio="4:3" alt={p.name} />
        <strong>{p.price}</strong>
        <Button size="sm">Add to cart</Button>
      </Card>
    ))}
  </div>
</div>`,
  },
  {
    id: 'product-detail', title: 'Product detail', category: 'Commerce',
    description: '商品详情页：面包屑、大图、价格与购买操作。',
    descriptionEn: 'Product detail page: breadcrumb, large image, price, and purchase actions.',
    code: `<Breadcrumb>Home / Bedroom / Beds & mattresses</Breadcrumb>
<div className="grid grid-cols-2 gap-7">
  <Image ratio="4:3" alt="Oak bed" />
  <div>
    <h1>Oak bed</h1>
    <p>Oak / 150 × 200 cm · 304.492</p>
    <strong>¥ 1,299</strong>
    <Button size="lg">Add to cart</Button>
    <Avatar name="Alex Wang" /> Verified buyer review
  </div>
</div>`,
  },
  {
    id: 'cart', title: 'Cart & checkout', category: 'Commerce',
    description: '购物车结算页：条目清单、数量加减、价格汇总与结算。',
    descriptionEn: 'Cart and checkout page: line items, quantity controls, order total, and checkout.',
    code: `<h1>Cart</h1>
<div className="grid grid-cols-[1fr_320px] gap-6">
  <Card>
    {items.map(i => (
      <div className="flex">
        <Image ratio="square" width={80} alt={i.name} />
        <div>{i.name} · {i.price}</div>
        <Segmented options={quantityOptions} />
      </div>
    ))}
  </Card>
  <Card>
    <Statistic label="Total" value="1,896" prefix="¥" />
    <Divider />
    <Input placeholder="Promo code" />
    <Button className="w-full">Checkout</Button>
  </Card>
</div>`,
  },
  {
    id: 'dashboard', title: 'Dashboard', category: 'Dashboard',
    description: '数据仪表盘：指标卡、进度、趋势表格与状态标签。',
    descriptionEn: 'Data dashboard: metric cards, progress, trend table, and status badges.',
    code: `<aside><Sidebar>Sections…</Sidebar></aside>
<main>
  <h1>Overview</h1>
  <div className="grid grid-cols-3 gap-4">
    <Card><Statistic label="Orders" value="1,472" trend={{value:12.4}} /></Card>
    <Card><Statistic label="Revenue" value="89,120" prefix="¥" /></Card>
    <Card><Progress value={72} label="Target progress" showValue /></Card>
  </div>
  <Card>
    <Table>Recent orders…</Table>
  </Card>
</main>`,
  },
  {
    id: 'login', title: 'Login', category: 'Account',
    description: '登录页：品牌区、表单输入、记住我与第三方登录。',
    descriptionEn: 'Login page: brand panel, form inputs, remember me, and alternative sign-in.',
    code: `<div className="grid grid-cols-2 min-h-screen">
  <div className="fp-invert p-12">
    <h1>Build with clarity.</h1>
    <p>Square, black and white, whitespace</p>
  </div>
  <div className="p-12">
    <h2>Sign in</h2>
    <Label>Email</Label><Input type="email" placeholder="you@example.com" />
    <Label>Password</Label><Input type="password" />
    <Checkbox label="Remember me" />
    <Button className="w-full">Sign in</Button>
    <Divider label="or" />
    <Button variant="outline" className="w-full">Continue with another method</Button>
  </div>
</div>`,
  },
  {
    id: 'settings', title: 'Settings', category: 'Account',
    description: '设置页：左侧导航、分栏表单、开关与保存操作。',
    descriptionEn: 'Settings page: side navigation, two-column form, switches, and save actions.',
    code: `<div className="grid grid-cols-[200px_1fr] gap-8">
  <Sidebar><SidebarItem active>Profile</SidebarItem>…</Sidebar></Sidebar>
  <main>
    <h1>Profile</h1>
    <Card>
      <CardHeader><CardTitle>Basic info</CardTitle></CardHeader>
      <CardContent>
        <Label>Name</Label><Input defaultValue="Alex Wang" />
        <Switch defaultChecked label="New arrivals" />
        <RadioGroup options={themeOptions} />
      </CardContent>
      <CardFooter><Button>Save changes</Button></CardFooter>
    </Card>
  </main>
</div>`,
  },
  {
    id: 'assistant', title: 'AI assistant', category: 'AI',
    description: 'AI 助手对话页：会话列表、消息、工具调用、思考状态、改动对比和输入框。对话部件先放在整屏里，用法稳定后再拆成组件。',
    descriptionEn: 'AI assistant chat: conversation list, messages, tool calls, thinking status, a diff and the composer. The chat parts live in this block until their API settles.',
    code: `<Sidebar>Conversations…</Sidebar>
<main>
  <ChatMessage role="user">Which chairs are below 10 units?</ChatMessage>
  <ChatMessage role="assistant">
    <div data-slot="chat-tool"><Search /> Searched inventory · 3 results</div>
    <p>Three chairs are low…</p>
    <span data-slot="diff-line" data-kind="del">-  "reorderPoint": 10,</span>
    <span data-slot="diff-line" data-kind="add">+  "reorderPoint": 6,</span>
  </ChatMessage>
  <ChatMessage role="assistant"><Spinner /> Drafting the purchase order…</ChatMessage>
  <div data-slot="chat-composer">
    <Textarea placeholder="Ask about stock, orders or customers" />
    <Button size="icon" variant="ghost"><Paperclip /></Button>
    <Button size="icon"><ArrowUp /></Button>
  </div>
</main>`,
  },
]

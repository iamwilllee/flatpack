// Full-screen block definitions for the Blocks gallery.
// Each block is a real screen composed entirely from Flatpack UI components. Blocks with a
// `registry` name are installable files in src/components/blocks; their code tab shows that file.
import login01 from '@/components/blocks/login-01.tsx?raw'
import settings01 from '@/components/blocks/settings-01.tsx?raw'
import dataTable01 from '@/components/blocks/data-table-01.tsx?raw'
import chat01 from '@/components/blocks/chat-01.tsx?raw'
import agent01 from '@/components/blocks/agent-01.tsx?raw'

export type BlockCategory = 'Corporate' | 'Commerce' | 'Dashboard' | 'Account' | 'AI'

export type Block = {
  id: string
  title: string
  category: BlockCategory
  description: string
  descriptionEn: string
  code: string
  /** Registry item name, for `npx shadcn add <origin>/r/<registry>.json`. */
  registry?: string
}

// Same names and order as the Templates page: Corporate, Commerce, Dashboard.
export const categories: ('All' | BlockCategory)[] = ['All', 'Corporate', 'Commerce', 'Dashboard', 'Account', 'AI']

export const blocks: Block[] = [
  {
    id: 'product-site', title: 'Product site', category: 'Corporate',
    description: '产品官网：一个承诺、一个动作，再用特性、步骤和常见问题支撑。',
    descriptionEn: 'Product website: one promise and one action, backed by features, steps and answers.',
    code: `<header>Brand · Badge · nav</header>
<section className="grid grid-cols-2">
  <div>
    <Kicker>NOTES FOR TEAMS</Kicker>
    <h1>Write it down once. Find it every time.</h1>
    <Button size="lg">Try the demo</Button>
  </div>
  <Card><CardHeader><CardTitle>Decision record</CardTitle></CardHeader>…</Card>
</section>
<section>Three features, each an icon, a title and one line</section>
<Steps current={1} steps={[{ title: 'Write' }, { title: 'Link' }, { title: 'Review' }]} />
<Collapse items={faq} />`,
  },
  {
    id: 'directory', title: 'Directory', category: 'Corporate',
    description: '目录与阅读：搜索、分类筛选、结果列表和分页，空结果有出口。',
    descriptionEn: 'Directory: search, category filters, results and pages, with a way out of empty results.',
    code: `<Input leading={<Search />} value={query} onChange={…} />
<ChipGroup value={category} options={[{ value: 'Guides', label: 'Guides', count: 3 }, …]} />
{results.length === 0
  ? <Empty title="No matching articles" action={<Button>Clear filters</Button>} />
  : results.map((a) => <Card>{a.title} <Badge variant="outline">{a.category}</Badge></Card>)}
<Pagination total={results.length} pageSize={4} value={page} onValueChange={setPage} />`,
  },
  {
    id: 'workbench', title: 'Workbench', category: 'Dashboard',
    description: '数据工作台：筛选列表、查看详情、在对话框里新建，状态可改。',
    descriptionEn: 'Data workbench: filter the list, inspect a record, add one in a dialog, change its status.',
    code: `<Progress value={done} max={tasks.length} label="Completed" showValue />
<Input leading={<Search />} />  <Select options={statusOptions} />
<Table>
  {shown.map((t) => <TableRow><Button variant="link" onClick={() => select(t.id)}>{t.name}</Button> <Badge>{t.status}</Badge></TableRow>)}
</Table>
<Card>Task details <Select value={current.status} /></Card>
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent><Field label="Name"><FieldControl render={<Input />} /></Field></DialogContent>
</Dialog>`,
  },
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
    id: 'login', title: 'Login', category: 'Account', registry: 'login-01',
    description: '登录页：品牌区和带校验的表单。服务端返回的错误显示在对应字段下，窄容器里品牌区自动收起。',
    descriptionEn: 'Sign-in screen: brand panel and a validated form. Server errors show under their field; the brand panel folds away in a narrow container.',
    code: login01,
  },
  {
    id: 'settings', title: 'Settings', category: 'Account', registry: 'settings-01',
    description: '设置页：分区导航和个人资料表单，保存前校验，保存后弹出提示。',
    descriptionEn: 'Settings: section navigation and a profile form, checked before save, confirmed with a toast.',
    code: settings01,
  },
  {
    id: 'orders', title: 'Orders', category: 'Dashboard', registry: 'data-table-01',
    description: '订单列表：搜索、带数量的状态筛选、可排序可多选的表格、分页和二次确认的批量删除。',
    descriptionEn: 'Orders list: search, status chips with counts, a sortable and selectable table, paging and a confirmed bulk delete.',
    code: dataTable01,
  },
  {
    id: 'assistant', title: 'AI assistant', category: 'AI', registry: 'chat-01',
    description: 'AI 助手对话页：会话列表、消息和 Composer 输入框。回复可以包含工具调用和改动对比；生成中可停止。',
    descriptionEn: 'AI assistant: conversation list, messages and the Composer. Replies can hold tool calls and diffs; a running reply can be stopped.',
    code: chat01,
  },
  {
    id: 'agent', title: 'Agent run', category: 'AI', registry: 'agent-01',
    description: 'Agent 运行页：右侧是计划和每一步的状态，左侧是运行记录（推理、工具调用）。删除数据之前停下来等人批准，拒绝或停止后不再执行后续步骤，完成后给出带来源的总结。',
    descriptionEn: 'Agent run: the plan and each step\'s state on the right, the log (reasoning, tool calls) on the left. It stops for approval before deleting anything; after a denial or a stop nothing else runs, and when it finishes it reports back with its sources.',
    code: agent01,
  },
]

---
name: flatpack-ui
description: Build interfaces with Flatpack UI, a React component library whose design rules are shape by role (pill controls, square surfaces), black and white, and whitespace. Use when a user asks to build a page, screen, dashboard, prototype, or UI with Flatpack UI, or mentions Flatpack or the black-and-white component library. Provides component inventory, import paths, design-language rules, and copy-paste patterns so an agent produces on-brand, working UI without inventing APIs.
---

# Build with Flatpack UI

Flatpack UI is a React 19 + Tailwind CSS 4 component library. Interactive components are built on **Base UI** primitives (unstyled, accessible); the visual layer is a single stylesheet. Its design rules are **square, black and white, whitespace**. Build screens by composing the library's components; do not hand-roll styled `<div>`s when a component exists.

## When to use

- User asks to build a page / screen / dashboard / prototype and mentions Flatpack UI or this black-and-white component library.
- User wants a UI in this project's established visual language.
- Do **not** use for a generic "make me a website" request unless the user names this library or the project already uses it.

## Setup (do this first)

Flatpack UI needs only its stylesheet and component source. In a target project:

1. Copy the theme and components from the library root:
   - `src/styles/flatpack.css` → target `src/styles/flatpack.css`
   - `src/components/ui/*.tsx` → target `src/components/ui/`
   - `src/lib/utils.ts` → target `src/lib/utils.ts`
2. Install deps if missing: `react@19 react-dom@19 @base-ui/react clsx tailwind-merge lucide-react`. Tailwind CSS 4 and TypeScript are expected. Interactive components (Button, Checkbox, Switch, RadioGroup, Select, Dialog, Sheet, DropdownMenu, Tabs, Tooltip, Popover, Progress, Avatar, Collapse, Segmented) are built on Base UI primitives; purely visual components are self-contained. Distribution uses the shadcn registry format (`registry.json` + `public/r/`).
3. Import the theme **after** Tailwind:
   ```css
   @import "tailwindcss";
   @import "./styles/flatpack.css";
   ```
4. Remove any stock shadcn `:root` / `.dark` color variables — Flatpack defines its own.

If the project already has the library wired, skip setup and go straight to composing components.

## The one rule that matters

**Never hardcode colors, sizes, spacing, radii, or shadows.** Every visual decision comes from a CSS variable in `flatpack.css`, generated from `tokens/flatpack.tokens.json`. Inline styles reference tokens only: `var(--fp-text-*)` for font size (12/14/16/20/28/40/64/96), `var(--fp-space-*)` for spacing (4 … 128), and the color tokens `--fp-bg`, `--fp-surface`, `--fp-line`, `--fp-line-strong`, `--fp-muted`, `--fp-ink`, `--fp-danger`, `--fp-success`. `npm run check:design` fails on anything else.

The three rules:
- **Shape by role**: clickable single-line parts (Button, ChipGroup, Input, Select, Segmented, Badge, Switch, Tooltip, pagination) use `--fp-radius-control` (a pill by default); surfaces that hold content (Card, Image, Dialog, menus, Table, Toast, code, Textarea) use `--fp-radius-surface` (0). No in-between radii. The "All square" preset (`data-fp-shape="square"` or shape: square in overrides) makes controls 0 too.
- **Filters and search**: separate filter chips are `<ChipGroup options={[{ value, label, count? }]} />`; a search box is `<Input variant="filled" leading={<Search size={16} />} />`; a secondary link button is `<Button variant="outline">` (ink ring).
- **Black and white**: one accent per theme, and in the default theme it is ink (`--fp-accent`). No blue links (links are underlined ink), no cyan, no gradients. Red and green appear in status text and icons only, never as a fill.
- **Whitespace**: separate sections with space (at least 96px between page sections). One 1px border. A card never contains a second bordered box. Only floating layers (Dialog, Popover, Select, Dropdown) have a shadow.

Type: body 16px at 1.6, headings 1.1, weights 400/500/600. Monospace only for numbers, IDs and code (`.fp-num`), never for section titles; no uppercase labels. Icons are lucide at 16px. Interaction changes color only, never position; no looping animation.

To render a block in the opposite theme (for example an ink banner whose primary button must stay visible), add `className="fp-invert"`.

Use the `.fp-label` class for a small grey caption; use `<Kicker>` for a plain grey line above a heading.

## Component inventory

All imports are from `@/components/ui/<name>` (adjust the alias to the target project).

| Need | Component |
|---|---|
| Actions | `Button`, `ButtonGroup` / `ToggleGroup` / `Toggle` (`toggle-group`), `Toolbar` + `ToolbarButton/ToolbarToggle/ToolbarGroup/ToolbarSeparator/ToolbarSpacer` |
| Containers | `Card` + `CardHeader/CardTitle/CardDescription/CardContent/CardFooter` |
| Labels / status | `Badge`, `StatusDot` (8px square: default / success / danger / idle), `Kbd` / `KbdGroup`, `Kicker` (from `primitives`) |
| Text input | `Input`, `Label`, `Textarea`, `NumberInput`, `Field` / `Fieldset` / `FieldControl` (label + help + error) |
| Choice | `Select`, `Combobox` (typeahead), `MultiSelect` (chips), `Checkbox`, `RadioGroup`, `Switch`, `Segmented`, `Slider` (single or range) |
| Dates / files | `Calendar`, `DatePicker`, `DateRangePicker`, `FileInput` (collects files only) |
| Overlays | `Dialog`, `AlertDialog` (confirm; `danger` for destructive), `Sheet`, `Popover`, `HoverCard`, `DropdownMenu`, `ContextMenu`, `Menubar`, `Tooltip`, `CommandPalette` (⌘K), `Lightbox` / `LightboxGallery` |
| Feedback | `Alert`, `Toast` (mount `<Toaster />` once, call `toast({ title, type })`), `Spinner`, `Skeleton` + `SkeletonText`, `Progress`, `Steps` |
| Navigation | `Tabs`, `Breadcrumb`, `Pagination`, `Sidebar` + `SidebarSection/SidebarItem` |
| Data display | `Table` (+ parts), `DescriptionList`, `Tree`, `Image`, `Carousel`, `Avatar`, `AvatarGroup`, `Statistic`, `Timestamp`, `Collapse`, `Empty`, `CodeBlock` / `Code` |
| Layout / utility | `Divider`, `Separator` (from `primitives`), `ScrollArea`, `Masonry` (waterfall), `VisuallyHidden`, `BorderBeam` (optional decorative border line; not used by default because the rules have no looping animation) |

63 components total. If a need isn't in the table, compose from these before adding new source. Not provided on purpose: rich text editor, Markdown renderer, Cascader, Transfer. For AI chat screens, copy the `assistant` block in `src/blocks/BlockScreens.tsx`.

Density, fonts and the optional warm gray are token-level: set `data-fp-density="compact"` (or `data-fp-font`, `data-fp-heading`, `data-fp-gray`) on any element, or write a preset code into `tokens/overrides.json` and run `npm run build:tokens`. Themes (`flatpack`, `catalog`, `sage`) swap palette, accent, surface radius and font stack as one unit: set `data-fp-theme="sage"` on any element. Fill and selected states use `--fp-accent` / `--fp-on-accent`, text uses `--fp-ink`. Never add one-off radius, accent colors, shadows or blur outside a theme.

## Copy-paste patterns

These are the exact props. Use them as-is; do not guess prop names.

```tsx
import { Button } from '@/components/ui/button'
import { Input, Label } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Kicker, Separator } from '@/components/ui/primitives'

// Buttons — variant: default | secondary | outline | ghost | link; size: default | sm | lg | icon
<Button>Primary</Button>
<Button variant="outline" size="sm">Secondary</Button>
<Button size="icon" aria-label="Search"><Search size={16}/></Button>

// Badge — variant: default | outline | success | danger
<Badge>New</Badge><Badge variant="success">In stock</Badge>

// Form
<Label>Name</Label>
<Input placeholder="Type here" />

// Card
<Card>
  <CardHeader><CardTitle>Title</CardTitle><CardDescription>Subtitle</CardDescription></CardHeader>
  <CardContent>...</CardContent>
  <CardFooter><Button size="sm">Action</Button></CardFooter>
</Card>

<Kicker>Section eyebrow</Kicker>
<Separator />
```

```tsx
import { Select } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup } from '@/components/ui/radio'
import { Switch } from '@/components/ui/switch'
import { Segmented } from '@/components/ui/segmented'

<Select
  options={[{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }]}
  defaultValue="a"
  onValueChange={(v) => {}}
/>

<Checkbox defaultChecked label="Enabled" />
<Checkbox indeterminate label="Partial" />
<Checkbox disabled defaultChecked label="Locked" />

<RadioGroup defaultValue="a" options={[
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B', disabled: true },
]} />

<Switch defaultChecked label="Notifications" />

<Segmented defaultValue="day" options={[
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
]} />
```

```tsx
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbCurrent, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Pagination } from '@/components/ui/pagination'
import { Alert } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Steps } from '@/components/ui/steps'
import { Empty } from '@/components/ui/empty'
import { Statistic } from '@/components/ui/statistic'
import { Collapse } from '@/components/ui/collapse'
import { Divider } from '@/components/ui/divider'

<Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    <DialogHeader><DialogTitle>Title</DialogTitle><DialogDescription>Details</DialogDescription></DialogHeader>
    <DialogFooter><DialogClose>Close</DialogClose></DialogFooter>
  </DialogContent>
</Dialog>

<Sheet>
  <SheetTrigger>Cart (2)</SheetTrigger>
  <SheetContent title="Cart">...</SheetContent>
</Sheet>

<Tabs defaultValue="a">
  <TabsList><TabsTrigger value="a">A</TabsTrigger><TabsTrigger value="b">B</TabsTrigger></TabsList>
  <TabsContent value="a">...</TabsContent>
  <TabsContent value="b">...</TabsContent>
</Tabs>

<Breadcrumb>
  <BreadcrumbItem><BreadcrumbLink>Home</BreadcrumbLink></BreadcrumbItem>
  <BreadcrumbSeparator />
  <BreadcrumbItem><BreadcrumbCurrent>Current</BreadcrumbCurrent></BreadcrumbItem>
</Breadcrumb>

<Pagination total={96} pageSize={10} defaultValue={1} onValueChange={(p) => {}} />
<Alert variant="success" title="Saved">Your changes are live.</Alert>
<Progress value={64} label="Progress" showValue />
<Steps current={1} steps={[{ title: 'Start' }, { title: 'Configure' }, { title: 'Done' }]} />
<Empty title="Nothing here" action={<Button size="sm">Create</Button>} />
<Statistic label="Orders" value="1,472" trend={{ value: 12.4 }} />
<Collapse items={[{ key: 'a', title: 'Question', children: 'Answer' }]} />
<Divider label="or" />
```

```tsx
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from '@/components/ui/table'
import { Image } from '@/components/ui/image'
import { Avatar } from '@/components/ui/avatar'
import { Skeleton, SkeletonText } from '@/components/ui/skeleton'

<Table>
  <TableCaption>Items</TableCaption>
  <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Qty</TableHead></TableRow></TableHeader>
  <TableBody><TableRow><TableCell>Widget</TableCell><TableCell>1</TableCell></TableRow></TableBody>
</Table>

<Image ratio="4:3" alt="Preview" src="/x.jpg" />   {/* ratios: square | 4:3 | 16:9 | 3:4 */}
<Avatar size="md" name="Alice" />
<Skeleton circle width={40} height={40} />
<SkeletonText lines={3} />
```

Full API tables for every component live in the library's `src/site/componentDocs.ts` and the rendered docs at `#/docs/components/:id`. Read that file when you need a prop that isn't shown above.

## Theming

The theme follows the system by default. Toggle by setting `data-theme` on `<html>` (the site saves the choice in localStorage as `fp-theme` and sets it in index.html before first paint):

```ts
document.documentElement.setAttribute('data-theme', 'dark')  // or 'light'
```

Never write theme-specific CSS in components. If you need to change the look globally, edit `tokens/flatpack.tokens.json` and run `npm run build:tokens`.

## Anti-patterns (do not do these)

- Inventing a new colored primary action (e.g. a blue or green CTA). Primary is black/near-white only.
- Adding shadows outside floating layers, gradients, glass effects, colored fills, or a second border inside a card.
- Rounded corners, pill buttons, uppercase monospace section labels.
- Hardcoding hex values in JSX instead of using `var(--fp-*)`.
- Reimplementing `Button` / `Card` / `Input` as styled `<div>`s — always import the component.
- Guessing props (`<Button color="red">`, `<Select items={...}>`). Use the exact props in this skill.
- Adding e-commerce-specific components (price tags, product tiles) to the base library. Scenario-specific UI belongs in Blocks, not in the component set.

## Workflow

1. Confirm the target project has Flatpack wired (setup above); if not, wire it.
2. Read `src/site/componentDocs.ts` for any component whose props you're unsure of — it is the source of truth.
3. Compose the screen from the inventory. Use Tailwind only for layout/spacing.
4. Check the result against the three rules and run `npm run check:design`. Remove any hardcoded value, shadow, or decorative accent you introduced.
5. Verify it builds. If you added a component not in the inventory, say so explicitly and keep it scenario-local rather than adding it to the base set.

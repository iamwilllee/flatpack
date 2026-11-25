# Moving from shadcn/ui to Flatpack UI

Flatpack UI uses the same delivery model as shadcn/ui: the shadcn CLI copies component source into your project and you own it. Three things work differently:

- **Primitives.** Interactive parts are built on [Base UI](https://base-ui.com), not Radix. Props follow Base UI names (`render` instead of `asChild`, `onOpenChange(open, details)`).
- **Styling.** Components carry no Tailwind classes. Each part has a `data-slot` attribute, and one stylesheet, `flatpack.css`, styles every slot from `--fp-*` tokens. You restyle by editing tokens or that file, not each component.
- **Dark mode.** Set `data-theme="dark"` on `<html>`. A `.dark` class does nothing.

You can move one screen at a time. Both libraries can live in the same project as long as their files sit in different folders (see step 2).

## 1. Install the theme

```bash
npx shadcn@latest add https://iamwilllee.github.io/flatpack/r/flatpack-theme.json
```

This writes `src/styles/flatpack.css`. The file starts with `@import "tailwindcss"`, so import it **instead of** the Tailwind import in your `globals.css`, or import it after your own CSS if you keep shadcn's tokens during the move:

```css
/* globals.css */
@import "./styles/flatpack.css";
```

Flatpack's rules sit in `@layer base` and `@layer components`, so Tailwind utilities in your own code still override them.

Set the theme before first paint to avoid a flash. The docs site does it with a short inline script in `index.html`; it reads `localStorage['fp-theme']` and falls back to the system setting.

## 2. Add components

Every component and block installs from a URL. Dependencies (other Flatpack components, `@base-ui/react`, `lucide-react`) come with it.

```bash
npx shadcn@latest add https://iamwilllee.github.io/flatpack/r/button.json
npx shadcn@latest add https://iamwilllee.github.io/flatpack/r/data-table.json
npx shadcn@latest add https://iamwilllee.github.io/flatpack/r/login-01.json
```

Files land in `components/ui/<name>.tsx` (blocks in `components/blocks/`), the same paths shadcn uses, so **the CLI asks before overwriting a shadcn component with the same name**. To keep both during the move, point Flatpack at another folder: install into a scratch project and copy, or temporarily change `aliases.ui` in `components.json` to `@/components/flatpack` while you add Flatpack items.

## 3. Rename what changed

Most names match shadcn/ui. The ones below differ.

| shadcn/ui | Flatpack UI | Notes |
|---|---|---|
| `asChild` | `render={<Link href="/x" />}` | Base UI pattern. Works on triggers, `DialogClose`, `SidebarItem` |
| `<Button variant="destructive">` | same | `variant="link"` and `size="icon"` / `"icon-sm"` / `"icon-lg"` also match |
| `<Badge variant="destructive">` | `<Badge variant="danger">` | Also `success`. Colour is text only, per the design rules |
| `DialogContent` close button | `showCloseButton` | Off by default; footer buttons usually close |
| `Sheet` + `side` | `Sheet` (right only) or `Drawer side="bottom│top│left│right"` | Drawer adds swipe to close and `snapPoints` |
| `Select` + `SelectTrigger` + `SelectContent` + `SelectItem` | `SelectRoot` + `SelectTrigger` + `SelectValue` + `SelectContent` + `SelectItem` | Or the short form: `<Select options={[{ value, label }]} />` |
| `Accordion` | `Collapse items={[{ key, title, children }]}` | `multiple` for several open |
| `ToggleGroup type="single"` | `Segmented` (one choice) or `ToggleGroup` | `ToggleGroup multiple` for several |
| `RadioGroup` + `RadioGroupItem` | `RadioGroup options={[{ value, label }]}` | |
| `Tooltip` + `TooltipTrigger` + `TooltipContent` | `<Tooltip content="…">child</Tooltip>` | The compound form is `TooltipRoot` / `TooltipTrigger` / `TooltipContent` |
| `Form` (react-hook-form) | `Form` + `Field` | Base UI validation, see below |
| `sonner` `toast()` | `toast({ title, type })` | Mount `<Toaster />` once |
| `InputOTP` | `OtpField` | |
| `Progress` | `Progress`; `Meter` for a value in a range | |
| `Table` + TanStack example | `DataTable` | Sorting, selection, paging built in |
| `cn()` from `@/lib/utils` | same | Install `utils.json` if you need it |

Event signatures follow Base UI: `onOpenChange(open, eventDetails)`, `onCheckedChange(checked, eventDetails)`, `onValueChange(value, eventDetails)`. Code that only reads the first argument keeps working.

## 4. Forms

shadcn/ui's `Form` wraps react-hook-form. Flatpack's `Form` uses Base UI's built-in validation instead, so simple forms need no form library:

```tsx
<Form errors={serverErrors} onFormSubmit={(values) => save(values)}>
  <Field label="Email" name="email" required>
    <FieldControl render={<Input type="email" required />} />
  </Field>
  <Field label="Password" name="password" validate={(v) => (String(v ?? '').length < 8 ? 'Use at least 8 characters.' : null)}>
    <FieldControl render={<Input type="password" />} />
  </Field>
  <Button type="submit">Save</Button>
</Form>
```

- Native constraints (`required`, `type="email"`, `minLength`) and `validate` run on submit; set `validationMode="onBlur"` or `"onChange"` to run them earlier.
- `errors` takes server messages keyed by field `name`. Each clears when the user edits that field.
- Only controls inside a `Field` with a `name` appear in `values`.

To keep react-hook-form, skip `Form`, use a plain `<form onSubmit={handleSubmit(…)}>`, and pass each field's message to `Field`'s `error` prop.

## 5. Restyle with tokens, not classes

In shadcn/ui you change a component's look by editing its Tailwind classes. In Flatpack, change a token and every component follows:

- Edit `tokens/flatpack.tokens.json` (if you cloned the repo) and run `npm run build:tokens`, or override the variables in your own CSS: `:root { --fp-accent: #236b4b; }`.
- Use a whole theme: `data-fp-theme="catalog"` or `"sage"` on any element.
- Change one part for one product: target its slot, `[data-slot="card"] { … }`.

Tailwind classes on a component (`className="mt-4"`) still work for layout. Avoid using them to restyle colour, radius or shadow; that breaks the one-place-to-change rule.

| shadcn/ui variable | Flatpack token |
|---|---|
| `--background` / `--foreground` | `--fp-bg` / `--fp-ink` |
| `--muted-foreground` | `--fp-muted` |
| `--border`, `--input` | `--fp-line`, `--fp-line-strong` |
| `--primary` / `--primary-foreground` | `--fp-accent` / `--fp-on-accent` |
| `--destructive` | `--fp-danger` |
| `--radius` | `--fp-radius-control` (buttons, inputs), `--fp-radius-surface` (cards, tables) and `--fp-radius-floating` (dialogs, menus, toasts) |

## 6. Check the result

- The design rules allow one accent, one 1px line and one shadow, for floating layers. If a migrated screen relied on coloured buttons or nested borders, it will look flatter. That is intended; use spacing and type size for hierarchy.
- Run your tests. Most roles match Radix for the same parts (`button`, `dialog`, `combobox`, `tab`, `menu`). Segmented is a `tablist` of `tab`s, where a Radix toggle group is a `group` of buttons.

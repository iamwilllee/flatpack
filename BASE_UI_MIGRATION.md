# Flatpack UI → Base UI integration spec (for contributors/agents)

Goal: make Flatpack UI components genuinely built on Base UI primitives (`@base-ui-components/react` 1.0.0-rc.0) **without changing the public API or the CSS/data-slot contract**. Demo pages, docs, SKILL, and `data-slot` styling must keep working unchanged.

## Golden rule

- Keep each component's exported function name, props type, and prop names EXACTLY as-is.
- Keep every `data-slot="..."` attribute and its value EXACTLY as-is (the CSS depends on them).
- Replace hand-rolled state/keyboard/focus/pointer logic with Base UI primitives.
- Base UI's own state attributes (`data-checked`, `data-disabled`, etc.) may be added in ADDITION to our `data-state`.
- Base UI components accept `className` as a function `(state) => string`; you can also pass `data-*` props directly — they land on the DOM node.

## Base UI usage patterns (verified against 1.0.0-rc.0)

Compound components are exported as namespaces: `import { Checkbox } from '@base-ui-components/react/checkbox'` then `<Checkbox.Root>`, `<Checkbox.Indicator>`. Simple ones are direct: `import { Button } from '@base-ui-components/react/button'` then `<Button>`.

Useful parts per primitive (check `node_modules/@base-ui-components/react/<name>/index.d.ts`):
- dialog: `Dialog.Root / Trigger / Portal / Backdrop / Popup / Title / Description / Close`
- checkbox: `Checkbox.Root / Indicator`
- switch: `Switch.Root / Thumb`
- radio: `RadioGroup.Root / Radio.Root / Radio.Indicator`
- select: `Select.Root / Trigger / Value / Icon / Portal / Positioner / Popup / List / Item / ItemIndicator`
- tabs: `Tabs.Root / List / Tab / Panel / Indicator`
- tooltip: `Tooltip.Provider / Root / Trigger / Portal / Positioner / Popup`
- popover: `Popover.Root / Trigger / Portal / Backdrop / Positioner / Popup / Title / Description / Close`
- progress: `Progress.Root / Track / Indicator / Label / Value`
- avatar: `Avatar.Root / Image / Fallback`
- separator: `<Separator>`
- toggle-group (for Segmented): `ToggleGroup.Root / Item`
- accordion (for Collapse): `Accordion.Root / Item / Header / Trigger / Panel`
- menu (for DropdownMenu): `Menu.Root / Trigger / Portal / Positioner / Popup / List / Item / Separator`
- slider, scroll-area, toast, field, form, input, meter: available if needed.

## Mapping: which Flatpack components to convert

Convert to a Base UI primitive (keep our API + data-slots):
- button → `Button`
- checkbox → `Checkbox.Root/Indicator`
- switch → `Switch.Root/Thumb`
- radio (RadioGroup) → `RadioGroup.Root` + `Radio.Root`
- select → `Select.Root` + parts
- dialog → `Dialog.*` + Portal
- sheet → `Dialog.*` (side panel)
- dropdown-menu → `Menu.*`
- tabs → `Tabs.*`
- tooltip → `Tooltip.*`
- popover → `Popover.*`
- progress → `Progress.*`
- avatar → `Avatar.*`
- badge → `Button` (render as span) — optional, low value
- collapse → `Accordion.*`
- segmented → `ToggleGroup.*`

Keep self-built (no suitable primitive / purely visual):
- card, input, label, table (all parts), breadcrumb, image, empty, steps, skeleton, alert, statistic, divider, pagination, sidebar, primitives (Separator/Kicker), separator primitive can use Base UI Separator.

## Conversion rules by component (preserve API examples)

### Checkbox
Current API: `{ checked?, defaultChecked?, indeterminate?, disabled?, label?, onCheckedChange? }`.
- `<Checkbox.Root checked={checked} defaultChecked={defaultChecked} disabled={disabled} indeterminate={indeterminate} onCheckedChange={onCheckedChange} data-slot="checkbox" data-disabled={...}>`
  - Note: Base UI naming is `onCheckedChange` with `(checked: boolean, eventDetails)` — our callback `(checked) => void` is compatible (extra arg ignored).
- Inside: `<Checkbox.Indicator data-slot="checkbox-box" data-state={...}>{icon}</Checkbox.Indicator>`
- Label: wrap in `<span data-slot="checkbox-label">`.
- CRITICAL: our CSS targets `[data-slot="checkbox-box"][data-state="checked"]`; keep `data-state` on the indicator. Base UI Indicator only renders when checked by default — we need it ALWAYS rendered to show unchecked box. Solution: set `keepMounted` on Indicator if supported, OR render our own box span and let Base UI Root handle only the hidden input + interactions. Prefer: Root handles state/input, our box span reads state via render-prop className or via our own React state synced from onCheckedChange. Verify Indicator props for keepMounted.

### Switch
Same approach as Checkbox with `Switch.Root` / `Switch.Thumb`. Keep `data-slot="switch-track"` on Root, `data-slot="switch-thumb"` on Thumb.

### Button
`<BaseButton data-slot="button" data-variant={variant} data-size={size} ...>` — Base UI Button forwards data-* and className. Our CSS keyed on data-slot still works. Keep native `type="button"` default.

### Dialog / Sheet
- `<Dialog.Root defaultOpen>` + `<Dialog.Trigger render={<button data-slot="button" .../>}>` to keep data-slot on trigger.
- `<Dialog.Portal>` containing `<Dialog.Backdrop data-slot="dialog-overlay">` and `<Dialog.Popup data-slot="dialog-content">` with Title/Description/Close.
- Our DialogTrigger/Close currently render `<button data-slot="button">`; use `render` prop with our button element, or just put data-slot on Base UI's Trigger element.
- Keep `defaultOpen` API. Controlled `open` not in our API, don't add.
- Sheet: same root, but Popup styled as right drawer via inline style `position:fixed` etc. (our CSS `[data-slot="sheet-content"]` already does this). Reuse dialog parts with sheet data-slots.

### Tabs
- `<Tabs.Root defaultValue={defaultValue}>` + `<Tabs.List data-slot="tabs-list">` + `<Tabs.Tab value={v} data-slot="tabs-trigger" data-active={...}>` + `<Tabs.Panel value={v} data-slot="tabs-content">`.
- Our tabs.css keys on `[data-active="true"]`. Base UI Tab provides `data-active`; verify. If it uses `data-selected`, add our own `data-active` computed from context.

### Tooltip
- Wrap with `<Tooltip.Provider>` at app root OR per-tooltip (Base UI allows without provider in rc). `<Tooltip.Root>` + `<Tooltip.Trigger render={child}>` + `<Tooltip.Portal><Tooltip.Positioner><Tooltip.Popup data-slot="tooltip-content" data-side={side}>{content}</Tooltip.Popup></Tooltip.Positioner></Tooltip.Portal>`.
- Keep our hover/focus behavior; Base UI handles delay/positioning.

### Progress
- `<Progress.Root value={value} max={max} data-slot="progress">` + `<Progress.Track data-slot="progress-track"><Progress.Indicator data-slot="progress-bar" style={{width: pct+'%'}} /></Progress.Track>`.
- Keep label/value header as plain divs (our API has label/showValue props, not Base UI's Label/Value parts).

### Avatar
- `<Avatar.Root data-slot="avatar" data-size={size}>` + `<Avatar.Image src alt data-slot="avatar-image" />` + `<Avatar.Fallback data-slot="avatar-fallback">initials</Avatar.Fallback>`.
- Base UI Fallback only shows after image error by default — good. Keep our `name`/`src`/`children` API.

### Select (complex)
- `<Select.Root value={value} defaultValue={defaultValue} onValueChange={onValueChange}>`
- `<Select.Trigger data-slot="select-trigger">...<Select.Icon data-slot="select-icon"><ChevronDown/></Select.Icon></Select.Trigger>`
- `<Select.Portal><Select.Positioner><Select.Popup data-slot="select-content"><Select.List>{options.map(o => <Select.Item value data-slot="select-item" data-selected={...}>{o.label}<Select.ItemIndicator data-slot="select-item-check"><Check/></Select.ItemIndicator></Select.Item>)}</Select.List></Select.Popup></Select.Positioner></Select.Portal>`
- Keep options/value/defaultValue/onValueChange/placeholder/disabled API.

### Collapse → Accordion
- `<Accordion.Root defaultValue={defaultActive} multiple={multiple}>` + items map to `<Accordion.Item value={key} data-slot="collapse-item" data-open={...}><Accordion.Header><Accordion.Trigger data-slot="collapse-trigger">{title}<ChevronDown data-slot="collapse-icon"/></Accordion.Trigger></Accordion.Header><Accordion.Panel data-slot="collapse-content">{children}</Accordion.Panel></Accordion.Item>`.
- Our items API stays.

### Segmented → ToggleGroup
- `<ToggleGroup.Root value={current} onValueChange={choose} data-slot="segmented">` + items `<ToggleGroup.Item value={v} data-slot="segmented-item" data-active={...}>`.

### DropdownMenu → Menu
- `<Menu.Root>` + `<Menu.Trigger data-slot="button" data-variant="outline" render...>` + `<Menu.Portal><Menu.Positioner><Menu.Popup data-slot="dropdown-content">{items}</Menu.Popup></Menu.Positioner></Menu.Portal>`.
- Items `<Menu.Item data-slot="dropdown-item">`, `<Menu.Separator data-slot="dropdown-separator">`.

## Verification checklist after conversion
1. `npx tsc -b --noEmit` passes.
2. `npm run build` passes.
3. Browser: every component page still renders; interact (open dialog/select/dropdown/popover/sheet, toggle checkbox/switch/radio, switch tabs, hover tooltip).
4. Data-slot counts unchanged (site dogfooding check).
5. No API change: all demo code in `componentDocs.ts` / `DocParts.tsx` / `ComponentsPage.tsx` still compiles unchanged.
6. Keyboard: Tab focus, Enter/Space activate, Escape closes overlays.

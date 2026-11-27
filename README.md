English | [简体中文](./README.zh-CN.md)

# Flatpack UI

> Tools on paper: square to read, round to touch. Black and white, plenty of space. The content leads and the interface stays quiet.

Flatpack UI is a React component library. Interactive parts are built on [Base UI](https://base-ui.com) (behavior, keyboard and accessibility), and the whole look lives in one stylesheet. You install it with the shadcn CLI, so the source is copied into your project and you own it.

- **77 components** and **5 installable blocks** (login, settings, orders, chat, agent run)
- **Light and dark**, three themes (Flatpack, Catalog, Sage) and a Create page to tune density, fonts and shape
- **Made for AI too**: llms.txt, a Markdown page per component, an agent skill, and the shadcn MCP server

Docs and live examples: **https://iamwilllee.github.io/flatpack/**

## Quick start

You need React 19, Tailwind CSS 4 and TypeScript.

1. Install the theme. It writes `src/styles/flatpack.css`, which holds the styles of every component:

   ```bash
   npx shadcn@latest add https://iamwilllee.github.io/flatpack/r/flatpack-theme.json
   ```

2. Import it in your entry stylesheet. The file already imports Tailwind, so it replaces your own `@import "tailwindcss"`:

   ```css
   @import "./styles/flatpack.css";
   ```

3. Add components or blocks. Their dependencies (other Flatpack components, `@base-ui/react`, `lucide-react`) come with them, at the versions this repo is tested against:

   ```bash
   npx shadcn@latest add https://iamwilllee.github.io/flatpack/r/button.json
   npx shadcn@latest add https://iamwilllee.github.io/flatpack/r/login-01.json
   ```

4. Remove any stock shadcn `:root` / `.dark` color variables. Flatpack defines its own.

Light is the default. Dark mode is `data-theme="dark"` on `<html>`; to follow the system setting, set it from `matchMedia('(prefers-color-scheme: dark)')` before first paint. A theme other than the default is `data-fp-theme="sage"` (or `catalog`) on any element.

Coming from shadcn/ui? [MIGRATION.md](./MIGRATION.md) lists what is renamed and how the tokens map.

## Use with AI

Pick one or combine them.

- **llms.txt.** Give your assistant `https://iamwilllee.github.io/flatpack/llms.txt` (in Cursor, add it under `@Docs`). It indexes every component and links to a Markdown page for each; `llms-full.txt` has everything in one file.
- **shadcn MCP.** The library is a shadcn registry, so no separate MCP server is needed. Add the namespace to your project's `components.json`:

  ```json
  {
    "registries": {
      "@flatpack": "https://iamwilllee.github.io/flatpack/r/{name}.json"
    }
  }
  ```

  Then enable the shadcn MCP server in your client (`npx shadcn@latest mcp init --client claude` for Claude Code; elsewhere the command is `npx` with the arguments `["shadcn@latest", "mcp"]`). You can now ask for "a login screen from @flatpack" and the assistant finds and installs it.
- **Agent skill.** [skills/flatpack-ui/SKILL.md](./skills/flatpack-ui/SKILL.md) gives an agent the component list, exact props and the design rules, so the screens it builds follow them. Copy or link the `skills/flatpack-ui` folder into your agent's skills folder, for example `~/.claude/skills/` for Claude Code.

## Components

| Group | Components |
|---|---|
| General | Button, Primitives (Kicker, Separator), ChipGroup, ToggleGroup / ButtonGroup, Toolbar |
| Layout | Divider, ScrollArea, Masonry, BorderBeam (optional decoration) |
| Navigation | Tabs, Breadcrumb, Pagination, Steps, Segmented, Sidebar, DropdownMenu, ContextMenu, Menubar, CommandPalette |
| Data entry | Input / Label, Textarea, Select, Combobox, MultiSelect, Checkbox, RadioGroup, Switch, Slider, NumberInput, OtpField, InputGroup, Calendar, DatePicker / DateRange, FileInput, Field / Fieldset, Form |
| Data display | Card, Table, DataTable, Badge, Avatar, AvatarGroup, Image, Carousel, Lightbox, Statistic, Meter, DescriptionList, Tree, Collapse, Timestamp, StatusDot, Kbd, CodeBlock, HoverCard, Empty |
| Feedback | Alert, Toast, Dialog, AlertDialog, Sheet, Drawer, Popover, Tooltip, Progress, Spinner, Skeleton, Reveal |
| AI | Composer, Message, Thinking, ToolCall, TaskList, Approval, Diff, Sources |
| Utility | VisuallyHidden |

**Blocks** are whole screens built only from these components: `login-01`, `settings-01`, `data-table-01` (orders), `chat-01` (assistant) and `agent-01` (an agent run with a plan, an approval before it deletes anything, and a cited summary). They install into `components/blocks/`.

The scope is "common parts, heavy parts only as far as most apps need". The calendar has no third-party dependency, FileInput collects files but does not upload them, and Tree expands and selects but does not drag. A rich-text editor, a Markdown renderer, Cascader and Transfer are left out on purpose.

Every form control and overlay works controlled (`value` / `open` / `checked` with `on…Change`) or uncontrolled (`default…`), and passes `id`, `name`, `required`, `aria-*`, `className` and `ref` through. Text that screen readers announce (close, pagination, breadcrumbs, status) has a label prop; it defaults to English, so pass your own language.

## Design

<!-- tokens:start -->
<!-- Generated from tokens/flatpack.tokens.json by scripts/build-tokens.mjs. Do not edit by hand. -->

### Idea: Tools on paper

Treat the interface as a printed page. Content is what is printed on it: square, black and white, divided by margins and space. Controls are tools placed on the page for the hand, so they are round, and only the layers lifted off the page cast a shadow. The three principles below follow from this.

### Three principles

1. **Square to read, round to touch.** What you read is square: cards, images, tables and code, like print on a page. What you touch is round: pills on one line, 20px for multi-line fields and floating layers. Nothing in between.
2. **Black and white.** There is one accent, and by default it is ink. Hierarchy comes from contrast and size, not color. Red and green are only for status text and icons. A theme may swap ink for its own brand color, but each theme still has exactly one accent.
3. **Whitespace.** Space separates sections. There is one 1px border, and no second border inside a card. Shadows are for floating layers only.

**Choosing the shape of a new component**, ask in order:

1. Can you act on it (press, type, drag, remove)? Then it is round: a pill on one line, 20px over several.
2. Does it float above the page? Then it takes 20px and a shadow.
3. Neither, only there to be read? Then it is square.

**Exceptions:**

- A Badge cannot be pressed, but it is small and often sits in a row of buttons, so it stays a pill, like a sticker on the page.
- Checkboxes are square and radio dots are round. That is the common convention, and the shape itself says how many can be chosen.
- Avatars are round because they stand for people, not for a content surface.

The full token set (color, type, space, radius, themes and the Create page dials) is in [DESIGN_LANGUAGE.md](./DESIGN_LANGUAGE.md) (Chinese) and on the docs site under Design language.
<!-- tokens:end -->

One stylesheet, `src/styles/flatpack.css`, styles everything. Components mark each part with a `data-slot` attribute and the stylesheet finds them by attribute, so swapping that one file restyles the whole system. All tokens come from one source, [`tokens/flatpack.tokens.json`](./tokens/flatpack.tokens.json).

## Docs site

The site is bilingual (中 / EN in the top bar) and built entirely from Flatpack UI components. Component demos and code samples are in English, so there is one set to keep correct.

| Page | What is there |
|---|---|
| Home | The idea in one screen and a few real components |
| Components | Every component on one page, each with copyable code |
| Docs | Installation, usage, the design language, colors, themes and Figma tokens; one page per component with a live preview, examples and an API table |
| Create | Tune density, fonts, type size, weight, tracking, shape and theme on real screens, then export `tokens/overrides.json`, a CLI command or CSS. Presets travel in the URL |
| Blocks | 12 full screens in five groups (Corporate, Commerce, Dashboard, Account, AI). The installable ones show their real source and install command |
| Templates | Three complete sites you can use: Corporate, Commerce and Dashboard, with desktop and phone views. Narrow previews switch to the real mobile layout |

Below 980px the whole site switches to a mobile layout, and no page scrolls sideways at 390px. Photos in the templates come from [Unsplash](https://unsplash.com/license); the links live in `src/site/photos.ts`.

## Development

```bash
npm install
npm run dev            # http://localhost:5199
npm run build          # site, registry, Figma tokens and llms.txt into dist/
npm run test:unit      # component contracts and blocks (Vitest + jsdom)
npm test               # browser smoke tests and an axe scan of every page in light and dark (Playwright)
npm run test:registry  # installs the registry into a fresh Vite project and builds it (needs the network)
```

- **Tokens.** Edit `tokens/flatpack.tokens.json`, then run `npm run build:tokens`. It regenerates the token block in `flatpack.css`, `figma/flatpack-tokens.json` (Tokens Studio format) and the design sections of both READMEs and `DESIGN_LANGUAGE.md`.
- **Design check.** `npm run check:design` fails on hard-coded font sizes, spacing, radii, shadows or colors in `.tsx` files, and on `--fp-*` variables that do not exist. It runs as part of `npm run build`.
- **Component docs.** `src/site/componentDocs.ts` drives the docs pages, `llms.txt` and the per-component Markdown. When you change a component's props, update it and the skill; unit tests check that the skill lists every component and that its code samples type-check.
- **Registry.** `npm run build:registry` writes `registry.json` and `public/r/*.json`. Dependencies are full URLs, so the CLI never fetches shadcn's own component of the same name, and npm versions are pinned to the ranges in `package.json`.

CI runs the unit and browser tests on every push to `main`, then deploys the site to GitHub Pages. The registry install check runs weekly.

## Roadmap

- [x] Components, blocks and full-site templates
- [x] shadcn registry, Figma tokens and three themes
- [x] AI: llms.txt, per-component Markdown, agent skill, shadcn MCP, AI components and blocks
- [x] Registry install check in CI
- [ ] Vue and Solid versions

## License

[MIT](./LICENSE)

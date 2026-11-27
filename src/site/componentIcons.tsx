import type { LucideIcon } from 'lucide-react'
import {
  RectangleHorizontal, SquareStack, Tag, TextCursorInput, AppWindow, PanelTop, PanelRight, PanelLeft, ChevronsUpDown,
  Table2, Route, Image, UserRound, Inbox, ListOrdered, ListFilter, SquareCheck, CircleDot, ToggleRight,
  TriangleAlert, LoaderCircle, MessageSquare, Gauge, MessageSquareText, Columns2, Minus, Hash, ListCollapse,
  Ellipsis, LayoutDashboard, Type, FormInput, Binary, SlidersHorizontal, Search, ListChecks, CalendarRange,
  Calendar, Upload, Tags, ToggleLeft, Wrench, ShieldAlert, BellRing, PictureInPicture2, Command,
  MousePointerClick, Menu, ScrollText, FolderTree, List, GalleryHorizontal, Expand, Users, Circle, Clock,
  Keyboard, Loader, Code, EyeOff, Sparkles, PanelBottom, ClipboardList, KeyRound, Ruler, TextCursor, SendHorizontal, Sheet, SeparatorHorizontal,
  MessageCircle, Brain, Wrench as ToolIcon, ListTodo, ShieldQuestion, Diff as DiffIcon, Quote,
} from 'lucide-react'

/**
 * One distinct lucide icon per component, used by the component gallery's
 * sidebar. Ids match componentDocs / the gallery anchors.
 */
export const COMPONENT_ICONS: Record<string, LucideIcon> = {
  buttons: RectangleHorizontal, button: RectangleHorizontal,
  card: SquareStack, badge: Tag, input: TextCursorInput, dialog: AppWindow, tabs: PanelTop, sheet: PanelRight, sidebar: PanelLeft,
  'dropdown-menu': ChevronsUpDown, table: Table2, breadcrumb: Route, image: Image, avatar: UserRound, empty: Inbox,
  steps: ListOrdered, select: ListFilter, checkbox: SquareCheck, radio: CircleDot, switch: ToggleRight,
  alert: TriangleAlert, skeleton: LoaderCircle, tooltip: MessageSquare, progress: Gauge, popover: MessageSquareText,
  segmented: Columns2, divider: Minus, statistic: Hash, collapse: ListCollapse, pagination: Ellipsis,
  masonry: LayoutDashboard, 'border-beam': Sparkles,
  textarea: Type, field: FormInput, 'number-input': Binary, slider: SlidersHorizontal, combobox: Search,
  'multi-select': ListChecks, 'date-picker': CalendarRange, calendar: Calendar, 'file-input': Upload,
  'chip-group': Tags, 'toggle-group': ToggleLeft, toolbar: Wrench, 'alert-dialog': ShieldAlert, toast: BellRing,
  'hover-card': PictureInPicture2, 'command-palette': Command, 'context-menu': MousePointerClick, menubar: Menu,
  'scroll-area': ScrollText, tree: FolderTree, 'description-list': List, carousel: GalleryHorizontal,
  lightbox: Expand, 'avatar-group': Users, 'status-dot': Circle, timestamp: Clock, kbd: Keyboard,
  drawer: PanelBottom, form: ClipboardList, 'otp-field': KeyRound, meter: Ruler, 'input-group': TextCursor, composer: SendHorizontal, 'data-table': Sheet,
  message: MessageCircle, thinking: Brain, 'tool-call': ToolIcon, 'task-list': ListTodo, approval: ShieldQuestion, diff: DiffIcon, sources: Quote,
  spinner: Loader, reveal: Sparkles, 'code-block': Code, 'visually-hidden': EyeOff, primitives: SeparatorHorizontal,
}

export function ComponentIcon({ id }: { id: string }) {
  const I = COMPONENT_ICONS[id] ?? Circle
  return <I size={16} aria-hidden="true" />
}

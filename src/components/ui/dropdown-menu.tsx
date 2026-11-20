import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { Menu as BaseMenu } from '@base-ui/react/menu'

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  return (
    <BaseMenu.Root>
      <div data-slot="dropdown">{children}</div>
    </BaseMenu.Root>
  )
}

export function DropdownMenuTrigger({ children, size = 'md', variant = 'outline' }: { children: React.ReactNode } & { size?: 'sm' | 'md' | 'lg'; variant?: 'default' | 'secondary' | 'outline' | 'ghost' }) {
  return (
    <BaseMenu.Trigger
      render={
        <button data-slot="button" data-variant={variant} data-size={size === 'md' ? 'default' : size} type="button">
          {children}
          <ChevronDown size={16} />
        </button>
      }
    />
  )
}

export function DropdownMenuContent({ children }: { children: React.ReactNode }) {
  return (
    <BaseMenu.Portal>
      <BaseMenu.Positioner>
        <BaseMenu.Popup data-slot="dropdown-content">{children}</BaseMenu.Popup>
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  )
}

export function DropdownMenuItem({ children, onSelect }: { children: React.ReactNode; onSelect?: () => void }) {
  return <BaseMenu.Item data-slot="dropdown-item" onClick={onSelect}>{children}</BaseMenu.Item>
}

export function DropdownMenuSeparator() {
  return <BaseMenu.Separator data-slot="dropdown-separator" />
}

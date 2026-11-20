import * as React from 'react'

export function Sidebar({ children }: { children: React.ReactNode }) {
  return <aside data-slot="sidebar">{children}</aside>
}
export function SidebarSection({ label, children }: { label: string; children: React.ReactNode }) {
  return <div data-slot="sidebar-section"><div className="fp-label" style={{ padding: 'var(--fp-space-1) var(--fp-space-3) var(--fp-space-2)' }}>{label}</div>{children}</div>
}
export function SidebarItem({ children, active = false, icon, onClick }: { children: React.ReactNode; active?: boolean; icon?: React.ReactNode; onClick?: () => void }) {
  return <button data-slot="sidebar-item" data-active={active} type="button" onClick={onClick} title={typeof children === 'string' ? children : undefined}>{icon}<span data-slot="sidebar-item-text">{children}</span></button>
}

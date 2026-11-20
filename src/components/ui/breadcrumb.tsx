import * as React from 'react'
import { ChevronRight } from 'lucide-react'

export function Breadcrumb({ children }: { children: React.ReactNode }) {
  return <nav data-slot="breadcrumb" aria-label="面包屑"><ol data-slot="breadcrumb-list">{children}</ol></nav>
}
export function BreadcrumbItem({ children }: { children: React.ReactNode }) {
  return <li data-slot="breadcrumb-item">{children}</li>
}
export function BreadcrumbLink({ children, href = '#' }: { children: React.ReactNode; href?: string }) {
  return <a data-slot="breadcrumb-link" href={href}>{children}</a>
}
export function BreadcrumbCurrent({ children }: { children: React.ReactNode }) {
  return <span data-slot="breadcrumb-current" aria-current="page">{children}</span>
}
export function BreadcrumbSeparator() {
  return <ChevronRight data-slot="breadcrumb-separator" size={16} aria-hidden="true" />
}

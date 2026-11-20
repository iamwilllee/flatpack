import * as React from 'react'
import { ChevronRight } from 'lucide-react'

/** Pass `label` (the nav's accessible name) in the product's language. */
export function Breadcrumb({ children, label = 'Breadcrumb', ...props }: React.HTMLAttributes<HTMLElement> & { label?: string }) {
  return <nav data-slot="breadcrumb" aria-label={label} {...props}><ol data-slot="breadcrumb-list">{children}</ol></nav>
}
export function BreadcrumbItem(props: React.LiHTMLAttributes<HTMLLIElement>) {
  return <li data-slot="breadcrumb-item" {...props} />
}
/** A plain <a>. For client-side routing, spread a router Link's props or wrap the router Link inside a BreadcrumbItem. */
export function BreadcrumbLink({ href = '#', ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a data-slot="breadcrumb-link" href={href} {...props} />
}
export function BreadcrumbCurrent(props: React.HTMLAttributes<HTMLSpanElement>) {
  return <span data-slot="breadcrumb-current" aria-current="page" {...props} />
}
export function BreadcrumbSeparator() {
  return <ChevronRight data-slot="breadcrumb-separator" size={16} aria-hidden="true" />
}

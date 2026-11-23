import * as React from 'react'

export function Table({ children, className, ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
  // The container scrolls sideways on narrow screens instead of clipping columns. While it scrolls,
  // it takes focus so keyboard users can scroll it with the arrow keys.
  const box = React.useRef<HTMLDivElement>(null)
  const [scrolls, setScrolls] = React.useState(false)
  React.useEffect(() => {
    const el = box.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const check = () => setScrolls(el.scrollWidth > el.clientWidth)
    check()
    const ro = new ResizeObserver(check)
    ro.observe(el)
    if (el.firstElementChild) ro.observe(el.firstElementChild)
    return () => ro.disconnect()
  }, [])
  return <div data-slot="table-container" ref={box} tabIndex={scrolls ? 0 : undefined}><table data-slot="table" className={className} {...props}>{children}</table></div>
}
export function TableHeader({ children, className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead data-slot="table-header" className={className} {...props}>{children}</thead>
}
export function TableBody({ children, className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody data-slot="table-body" className={className} {...props}>{children}</tbody>
}
export function TableRow({ children, className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr data-slot="table-row" className={className} {...props}>{children}</tr>
}
export function TableHead({ children, className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return <th data-slot="table-head" scope="col" className={className} {...props}>{children}</th>
}
export function TableCell({ children, className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td data-slot="table-cell" className={className} {...props}>{children}</td>
}
export function TableCaption({ children, className, ...props }: React.HTMLAttributes<HTMLTableCaptionElement>) {
  return <caption data-slot="table-caption" className={className} {...props}>{children}</caption>
}

import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { Accordion } from '@base-ui/react/accordion'

type CollapseItem = { key: string; title: React.ReactNode; children: React.ReactNode; disabled?: boolean }
export type CollapseProps = {
  items: CollapseItem[]
  /** Uncontrolled: keys open at first render. */
  defaultActive?: string[]
  /** Controlled: keys that are open. Pair with onActiveChange. */
  active?: string[]
  onActiveChange?: (keys: string[]) => void
  multiple?: boolean
  className?: string
}

export function Collapse({ items, defaultActive, active, onActiveChange, multiple = false, className }: CollapseProps) {
  const [internal, setInternal] = React.useState<string[]>(defaultActive ?? [])
  const current = active ?? internal
  return (
    <Accordion.Root
      value={current}
      multiple={multiple}
      onValueChange={(next) => {
        if (active === undefined) setInternal(next as string[])
        onActiveChange?.(next as string[])
      }}
      data-slot="collapse"
      className={className}
    >
      {items.map((item) => (
        <Accordion.Item value={item.key} disabled={item.disabled} data-slot="collapse-item" data-open={current.includes(item.key)} key={item.key}>
          <Accordion.Header render={(props) => <div {...props} />}>
            <Accordion.Trigger data-slot="collapse-trigger">
              <span>{item.title}</span>
              <ChevronDown data-slot="collapse-icon" size={16} />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel data-slot="collapse-content" keepMounted>
            {item.children}
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  )
}

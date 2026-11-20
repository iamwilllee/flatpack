import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { Accordion } from '@base-ui/react/accordion'

type CollapseItem = { key: string; title: React.ReactNode; children: React.ReactNode }
export function Collapse({ items, defaultActive, multiple = false }: {
  items: CollapseItem[]
  defaultActive?: string[]
  multiple?: boolean
}) {
  const [active, setActive] = React.useState<string[]>(defaultActive ?? [])
  return (
    <Accordion.Root
      defaultValue={defaultActive}
      multiple={multiple}
      onValueChange={(next) => setActive(next as string[])}
      data-slot="collapse"
    >
      {items.map((item) => {
        const open = active.includes(item.key)
        return (
          <Accordion.Item value={item.key} data-slot="collapse-item" data-open={open} key={item.key}>
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
        )
      })}
    </Accordion.Root>
  )
}

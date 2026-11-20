import * as React from 'react'
import { Tabs as BaseTabs } from '@base-ui/react/tabs'

type Ctx = { value: string }
const TabsValueContext = React.createContext<Ctx>({ value: '' })

export function Tabs({ defaultValue, children }: { defaultValue: string; children: React.ReactNode }) {
  const [value, setValue] = React.useState(defaultValue)
  return (
    <TabsValueContext.Provider value={{ value }}>
      <BaseTabs.Root
        defaultValue={defaultValue}
        onValueChange={(next) => setValue(next as string)}
        data-slot="tabs"
      >
        {children}
      </BaseTabs.Root>
    </TabsValueContext.Provider>
  )
}

export function TabsList({ children }: { children: React.ReactNode }) {
  return (
    <BaseTabs.List data-slot="tabs-list">
      {children}
      <BaseTabs.Indicator />
    </BaseTabs.List>
  )
}

export function TabsTrigger({ value, children }: { value: string; children: React.ReactNode }) {
  const ctx = React.useContext(TabsValueContext)
  return (
    <BaseTabs.Tab value={value} data-slot="tabs-trigger" data-active={ctx.value === value}>
      {children}
    </BaseTabs.Tab>
  )
}

export function TabsContent({ value, children }: { value: string; children: React.ReactNode }) {
  return (
    <BaseTabs.Panel value={value} data-slot="tabs-content" keepMounted>
      {children}
    </BaseTabs.Panel>
  )
}

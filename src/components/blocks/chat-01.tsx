import * as React from 'react'
import { MessageSquare, Paperclip, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Kbd } from '@/components/ui/kbd'
import { Spinner } from '@/components/ui/spinner'
import { Composer } from '@/components/ui/composer'
import { Sidebar, SidebarSection, SidebarItem } from '@/components/ui/sidebar'

export type ChatMessage = { id: string; role: 'user' | 'assistant'; content: React.ReactNode }

export type Chat01Props = {
  initialMessages?: ChatMessage[]
  /**
   * Produce the reply to `text`. Return the reply content; it is shown when the promise resolves.
   * `signal` aborts when the user presses Stop. Without it the block echoes a canned reply.
   */
  onSend?: (text: string, signal: AbortSignal) => Promise<React.ReactNode>
  conversations?: string[]
}

const echo = (text: string, signal: AbortSignal) =>
  new Promise<React.ReactNode>((resolve, reject) => {
    const t = window.setTimeout(() => resolve(`You asked: “${text}”. Connect onSend to your model to answer for real.`), 1200)
    signal.addEventListener('abort', () => { window.clearTimeout(t); reject(new DOMException('Aborted', 'AbortError')) })
  })

let seq = 0
const nextId = () => `m${++seq}`

/**
 * Assistant screen: a conversation list, the messages, and a Composer that sends with Enter and
 * stops a running reply. The conversation list folds away below 720px of its own width.
 */
export function Chat01({ initialMessages = [], onSend = echo, conversations = ['Restock plan', 'Return policy copy', 'Q4 price check'] }: Chat01Props) {
  const [messages, setMessages] = React.useState(initialMessages)
  const [active, setActive] = React.useState(conversations[0])
  const [pending, setPending] = React.useState<AbortController | null>(null)
  const end = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => { end.current?.scrollIntoView?.({ block: 'nearest' }) }, [messages, pending])

  const send = async (text: string) => {
    setMessages((m) => [...m, { id: nextId(), role: 'user', content: text }])
    const ctrl = new AbortController()
    setPending(ctrl)
    try {
      const reply = await onSend(text, ctrl.signal)
      if (!ctrl.signal.aborted) setMessages((m) => [...m, { id: nextId(), role: 'assistant', content: reply }])
    } catch {
      if (!ctrl.signal.aborted) setMessages((m) => [...m, { id: nextId(), role: 'assistant', content: 'Something went wrong. Try again.' }])
    } finally {
      setPending((p) => (p === ctrl ? null : p))
    }
  }

  return (
    <div data-slot="block-chat">
      <div data-slot="block-chat-layout">
        <Sidebar data-block-chat-list="" aria-label="Conversations">
          <div style={{ padding: 'var(--fp-space-3)' }}>
            <Button size="sm" variant="outline" style={{ width: '100%' }} onClick={() => { pending?.abort(); setMessages([]) }}><Plus size={16} /> New chat</Button>
          </div>
          <SidebarSection label="Recent">
            {conversations.map((c) => <SidebarItem key={c} active={c === active} icon={<MessageSquare size={16} />} onClick={() => setActive(c)}>{c}</SidebarItem>)}
          </SidebarSection>
        </Sidebar>
        <div data-slot="block-chat-main">
          <div data-slot="block-chat-log" role="log" aria-label="Messages" aria-live="polite">
            {messages.length === 0 && !pending && (
              <p style={{ margin: 'auto', color: 'var(--fp-muted)', fontSize: 'var(--fp-text-sm)' }}>Ask about stock, orders or customers.</p>
            )}
            {messages.map((m) => (
              <div key={m.id} data-slot="chat-message" data-role={m.role}>
                <Avatar name={m.role === 'assistant' ? 'AI' : 'You'} size="sm" />
                <div data-slot="chat-bubble">{m.content}</div>
              </div>
            ))}
            {pending && (
              <div data-slot="chat-message" data-role="assistant">
                <Avatar name="AI" size="sm" />
                <div data-slot="chat-bubble"><span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--fp-space-2)', color: 'var(--fp-muted)' }}><Spinner /> Thinking…</span></div>
              </div>
            )}
            <div ref={end} />
          </div>
          <div data-slot="block-chat-input">
            <Composer
              placeholder="Ask anything"
              loading={pending != null}
              onStop={() => { pending?.abort(); setPending(null) }}
              onSubmit={send}
              leading={<span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--fp-space-2)' }}><Kbd>⏎</Kbd> send · <Kbd>⇧⏎</Kbd> new line</span>}
              actions={<Button size="icon" variant="ghost" aria-label="Attach file"><Paperclip size={16} /></Button>}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

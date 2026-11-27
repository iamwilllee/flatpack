import * as React from 'react'
import { Avatar } from '@/components/ui/avatar'

export type MessageProps = Omit<React.ComponentProps<'div'>, 'role'> & {
  /** Who wrote it. The user's message sits on the right with a grey ground; the assistant's is plain text on the left. */
  role?: 'user' | 'assistant'
  /** Name for the default avatar (its first two letters). Default "AI" or "You". */
  name?: string
  /** Replaces the default avatar. */
  avatar?: React.ReactNode
}

/**
 * One turn of a conversation: an avatar and the content. The content can be text or anything
 * else, such as Thinking, ToolCall and a CodeBlock stacked in the order the assistant produced them.
 */
export function Message({ role = 'assistant', name, avatar, children, ...props }: MessageProps) {
  return (
    <div data-slot="message" data-role={role} {...props}>
      {avatar ?? <Avatar size="sm" name={name ?? (role === 'assistant' ? 'AI' : 'You')} />}
      <div data-slot="message-body">{children}</div>
    </div>
  )
}

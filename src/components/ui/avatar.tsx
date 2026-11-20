import * as React from 'react'
import { Avatar as BaseAvatar } from '@base-ui-components/react/avatar'

type AvatarProps = React.HTMLAttributes<HTMLSpanElement> & {
  size?: 'sm' | 'md' | 'lg'
  name?: string
  src?: string
}

export function Avatar({ size = 'md', name = '', src, children, ...props }: AvatarProps) {
  const initials = name.trim().slice(0, 2).toUpperCase() || '?'
  return (
    <BaseAvatar.Root data-slot="avatar" data-size={size} title={name} {...props}>
      <BaseAvatar.Image data-slot="avatar-image" src={src} alt={name} />
      <BaseAvatar.Fallback data-slot="avatar-fallback">{children ?? initials}</BaseAvatar.Fallback>
    </BaseAvatar.Root>
  )
}

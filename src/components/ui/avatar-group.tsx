import { Avatar } from '@/components/ui/avatar'

export type AvatarGroupProps = {
  people: { name: string; src?: string }[]
  max?: number
  size?: 'sm' | 'md' | 'lg'
}

/** Overlapping avatars; anything past `max` collapses into a +N count. */
export function AvatarGroup({ people, max = 4, size = 'md' }: AvatarGroupProps) {
  const shown = people.slice(0, max)
  const rest = people.length - shown.length
  return (
    <span data-slot="avatar-group" aria-label={people.map((p) => p.name).join(', ')}>
      {shown.map((p) => <Avatar key={p.name} name={p.name} src={p.src} size={size} />)}
      {rest > 0 && <Avatar size={size} name={`+${rest}`}><span data-slot="avatar-group-more">+{rest}</span></Avatar>}
    </span>
  )
}

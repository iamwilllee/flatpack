import * as React from 'react'
import { Check, Circle, X } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'
import { VisuallyHidden } from '@/components/ui/visually-hidden'

export type TaskStatus = 'queued' | 'running' | 'done' | 'failed'
export type Task = { id: string; title: React.ReactNode; status: TaskStatus; /** Right side: a duration, an error, a count. */ detail?: React.ReactNode }

export type TaskListProps = Omit<React.ComponentProps<'ul'>, 'children'> & {
  tasks: Task[]
  /** Accessible status text, for localized products. */
  statusLabels?: Record<TaskStatus, string>
}

const DEFAULT_LABELS: Record<TaskStatus, string> = { queued: 'Queued', running: 'Running', done: 'Done', failed: 'Failed' }

/** What an agent is working on, one row per task with its state. Give the list an `aria-label`. */
export function TaskList({ tasks, statusLabels = DEFAULT_LABELS, ...props }: TaskListProps) {
  return (
    <ul data-slot="task-list" {...props}>
      {tasks.map((t) => (
        <li key={t.id} data-slot="task" data-status={t.status}>
          <span data-slot="task-marker">
            {t.status === 'running' ? <Spinner label={statusLabels.running} /> : (
              <>
                {t.status === 'done' ? <Check size={16} aria-hidden="true" /> : t.status === 'failed' ? <X size={16} aria-hidden="true" /> : <Circle size={16} aria-hidden="true" />}
                <VisuallyHidden>{statusLabels[t.status]}: </VisuallyHidden>
              </>
            )}
          </span>
          <span data-slot="task-title">{t.title}</span>
          {t.detail != null && <span data-slot="task-detail">{t.detail}</span>}
        </li>
      ))}
    </ul>
  )
}

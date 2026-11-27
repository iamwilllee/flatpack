import * as React from 'react'
import { RotateCcw, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusDot } from '@/components/ui/status-dot'
import { Message } from '@/components/ui/message'
import { Thinking } from '@/components/ui/thinking'
import { ToolCall } from '@/components/ui/tool-call'
import { TaskList, type Task } from '@/components/ui/task-list'
import { Approval } from '@/components/ui/approval'
import { DiffValue } from '@/components/ui/diff'
import { Citation, Sources } from '@/components/ui/sources'

export type Agent01Props = {
  /** What the user asked the agent to do. */
  goal?: string
  /**
   * Runs the destructive step after the user approves it. While the promise is pending the
   * delete step shows as running; if it rejects, the step fails and the run stops.
   * Without it the block waits a moment and pretends the delete worked.
   */
  onApprove?: () => Promise<void> | void
  /** Called when the user denies the step. Nothing is deleted. */
  onDeny?: () => void
  /** Milliseconds between the simulated steps before and after the approval. Default 700. */
  stepDelay?: number
}

// The run has six steps; each index is one moment of the run.
//   0 reading drafts · 1 checking payments · 2 waiting for approval · 3 deleting · 4 summarizing · 5 done
type Outcome = 'running' | 'denied' | 'stopped' | 'failed'

const PLAN = ['Find draft orders older than 30 days', 'Check none of them has a payment', 'Ask before deleting', 'Delete the drafts', 'Write a summary']

/**
 * Agent run: the agent works through a plan, stops to ask before it deletes anything, then
 * reports back with its sources. The log on the left shows each step as it happens; the plan on
 * the right shows where the run is. The plan moves above the log below 720px of the block's width.
 */
export function Agent01({ goal = 'Clean up draft orders older than 30 days.', onApprove, onDeny, stepDelay = 700 }: Agent01Props) {
  const [step, setStep] = React.useState(0)
  const [outcome, setOutcome] = React.useState<Outcome>('running')
  const [decision, setDecision] = React.useState<'pending' | 'approved' | 'denied'>('pending')

  // Advance the simulated steps. The run halts at the approval (step 2) and while the approved
  // delete is in progress (step 3 is advanced by approve()).
  React.useEffect(() => {
    if (outcome !== 'running' || step === 2 || step === 3 || step >= 5) return
    const t = window.setTimeout(() => setStep((s) => s + 1), stepDelay)
    return () => window.clearTimeout(t)
  }, [step, outcome, stepDelay])

  const approve = async () => {
    if (outcome !== 'running') return
    setDecision('approved')
    setStep(3)
    try {
      if (onApprove) await onApprove()
      else await new Promise((r) => window.setTimeout(r, stepDelay))
      setStep((s) => (s === 3 ? 4 : s))
    } catch {
      setOutcome((o) => (o === 'running' ? 'failed' : o))
    }
  }
  const deny = () => {
    if (outcome !== 'running') return
    setDecision('denied')
    setOutcome('denied')
    onDeny?.()
  }
  const restart = () => { setStep(0); setOutcome('running'); setDecision('pending') }

  const finished = step >= 5 || outcome !== 'running'
  const tasks: Task[] = PLAN.map((title, i) => {
    const id = String(i + 1)
    if (i < step) return { id, title, status: 'done' }
    if (i > step) return { id, title, status: 'queued', detail: outcome !== 'running' ? 'Skipped' : undefined }
    if (outcome === 'denied') return { id, title, status: 'failed', detail: 'Denied' }
    if (outcome === 'stopped') return { id, title, status: 'failed', detail: 'Stopped' }
    if (outcome === 'failed') return { id, title, status: 'failed', detail: 'Failed' }
    return { id, title, status: 'running', detail: i === 2 ? 'Waiting for you' : undefined }
  })

  const state =
    step >= 5 ? { dot: 'success' as const, text: 'Done' }
      : outcome === 'running' ? (step === 2 ? { dot: 'idle' as const, text: 'Waiting for approval' } : { dot: 'default' as const, text: 'Running' })
        : outcome === 'failed' ? { dot: 'danger' as const, text: 'Failed' }
          : { dot: 'idle' as const, text: outcome === 'denied' ? 'Denied' : 'Stopped' }

  return (
    <div data-slot="block-agent">
      <div data-slot="block-agent-layout">
        <header data-slot="block-agent-header">
          <div style={{ minWidth: 0 }}>
            <h2 style={{ fontSize: 'var(--fp-text-lg)', fontWeight: 'var(--fp-weight-semibold)', margin: 0 }}>Agent run</h2>
            <StatusDot status={state.dot} aria-live="polite">{state.text}</StatusDot>
          </div>
          {finished ? (
            <Button size="sm" variant="outline" onClick={restart}><RotateCcw size={16} /> Run again</Button>
          ) : (
            // A delete in progress cannot be taken back halfway, so Stop waits until it is over.
            <Button size="sm" variant="outline" disabled={step === 3} onClick={() => setOutcome('stopped')}><Square size={16} /> Stop</Button>
          )}
        </header>

        <aside data-slot="block-agent-plan" aria-label="Plan">
          <div className="fp-label">Plan</div>
          <TaskList aria-label="Plan steps" tasks={tasks} />
        </aside>

        <div data-slot="block-agent-log" role="log" aria-label="Run log">
          <Message role="user">{goal}</Message>
          <Message>
            {step === 0 && outcome === 'running' ? (
              <Thinking status="thinking"><span>Looking for drafts created more than 30 days ago.</span></Thinking>
            ) : (
              <Thinking duration={2}>
                <span>Looking for drafts created more than 30 days ago.</span>
                <span>A draft with a payment attached is a real order in progress, so those must stay.</span>
              </Thinking>
            )}
            {step >= 1 && <ToolCall name="Searched orders" detail="12 drafts" />}
            {step >= 2 && <ToolCall name="Checked payments" detail="0 paid" />}
            {step >= 2 && (
              <Approval
                title="Delete 12 draft orders?"
                description="All 12 are older than 30 days and none has a payment. Deleted drafts cannot be restored."
                // Stopped before anyone answered: the question closes without a decision.
                status={outcome === 'stopped' && decision === 'pending' ? 'denied' : decision}
                deniedLabel={outcome === 'stopped' && decision === 'pending' ? 'Not answered' : 'Denied'}
                onApprove={approve}
                onDeny={deny}
              />
            )}
            {step >= 3 && (decision === 'approved') && (
              <ToolCall
                status={step === 3 ? (outcome === 'failed' ? 'error' : 'running') : 'done'}
                name={step === 3 ? (outcome === 'failed' ? 'Delete drafts' : 'Deleting drafts') : 'Deleted drafts'}
                detail="12 orders"
              />
            )}
            {step >= 5 && (
              <>
                <p style={{ margin: 0 }}>
                  Done. I deleted the 12 drafts older than 30 days <Citation n={1} title="Orders export" />; none had a
                  payment <Citation n={2} title="Payments ledger" />. Open drafts: <DiffValue from="31" to="19" />.
                </p>
                <Sources items={[{ title: 'Orders export', note: 'status = draft, created before 30 days ago' }, { title: 'Payments ledger', note: '0 matches for the 12 order ids' }]} />
              </>
            )}
            {outcome === 'denied' && <p style={{ margin: 0 }}>Understood. Nothing was deleted; the 12 drafts are still in the list.</p>}
            {outcome === 'stopped' && <p style={{ margin: 0 }}>Stopped. Nothing after this point ran.</p>}
            {outcome === 'failed' && <p style={{ margin: 0 }}>The delete did not go through, so the drafts are unchanged. Try again later.</p>}
          </Message>
        </div>
      </div>
    </div>
  )
}

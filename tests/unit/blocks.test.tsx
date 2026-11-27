// The installable blocks in src/components/blocks: each one's main flow, as a user would do it.
import { describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Login01 } from '@/components/blocks/login-01'
import { Settings01 } from '@/components/blocks/settings-01'
import { DataTable01 } from '@/components/blocks/data-table-01'
import { Chat01 } from '@/components/blocks/chat-01'
import { Agent01 } from '@/components/blocks/agent-01'

describe('Login01', () => {
  it('checks required fields, then passes values and shows a server error under its field', async () => {
    const onSignIn = vi.fn().mockResolvedValue({ password: 'Wrong password' })
    render(<Login01 onSignIn={onSignIn} />)
    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }))
    expect(onSignIn).not.toHaveBeenCalled()
    await userEvent.type(screen.getByRole('textbox', { name: 'Email' }), 'a@b.co')
    await userEvent.type(screen.getByLabelText(/^Password/), 'secret')
    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }))
    expect(onSignIn).toHaveBeenCalledWith({ email: 'a@b.co', password: 'secret', remember: true })
    expect(await screen.findByText('Wrong password')).toBeInTheDocument()
  })
  it('shows the second sign-in method only when it is wired', () => {
    const { rerender } = render(<Login01 />)
    expect(screen.queryByRole('button', { name: 'Continue with SSO' })).toBeNull()
    rerender(<Login01 onOtherMethod={() => {}} />)
    expect(screen.getByRole('button', { name: 'Continue with SSO' })).toBeInTheDocument()
  })
})

describe('Settings01', () => {
  it('saves the edited profile with switch and digest values', async () => {
    const onSave = vi.fn()
    render(<Settings01 onSave={onSave} />)
    const name = screen.getByRole('textbox', { name: 'Name' })
    await userEvent.clear(name)
    await userEvent.type(name, 'Kim')
    await userEvent.click(screen.getByRole('switch', { name: 'Product news' }))
    await userEvent.click(screen.getByRole('tab', { name: 'Daily' }))
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }))
    expect(onSave).toHaveBeenCalledWith({ name: 'Kim', email: 'alex@example.com', newsletter: false, digest: 'daily' })
  })
  it('switches sections from the list', async () => {
    render(<Settings01 />)
    await userEvent.click(screen.getByRole('button', { name: 'Security' }))
    expect(screen.getByRole('heading', { name: 'Security' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Save changes' })).toBeNull()
  })
})

describe('DataTable01', () => {
  it('filters by search and status, offers a way out of empty results', async () => {
    render(<DataTable01 />)
    await userEvent.type(screen.getByRole('textbox', { name: 'Search orders' }), 'mei')
    expect(screen.getAllByRole('row')).toHaveLength(2)
    await userEvent.click(screen.getByRole('button', { name: /Refunded/ }))
    expect(screen.getByText('No matching orders')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Clear filters' }))
    expect(screen.getByRole('textbox', { name: 'Search orders' })).toHaveValue('')
    expect(screen.getAllByRole('row').length).toBeGreaterThan(2)
  })
  it('deletes the selected orders after confirmation', async () => {
    const onDelete = vi.fn()
    render(<DataTable01 onDelete={onDelete} />)
    await userEvent.click(screen.getByRole('checkbox', { name: 'Select order A-1042' }))
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))
    const dialog = await screen.findByRole('alertdialog')
    await userEvent.click(within(dialog).getByRole('button', { name: 'Delete' }))
    expect(onDelete).toHaveBeenCalledWith(['A-1042'])
    expect(screen.queryByText('A-1042')).toBeNull()
  })
})

describe('Chat01', () => {
  it('sends a message, shows the reply, and can stop a running one', async () => {
    let finish: (v: string) => void = () => {}
    const onSend = vi.fn((_text: string, signal: AbortSignal) => new Promise<string>((resolve, reject) => {
      finish = resolve
      signal.addEventListener('abort', () => reject(new Error('aborted')))
    }))
    render(<Chat01 onSend={onSend} />)
    const box = screen.getByRole('textbox', { name: 'Message' })
    await userEvent.type(box, 'Hello{Enter}')
    const log = screen.getByRole('log', { name: 'Messages' })
    expect(within(log).getByText('Hello')).toBeInTheDocument()
    expect(within(log).getByText('Thinking…')).toBeInTheDocument()
    finish('Hi there')
    expect(await within(log).findByText('Hi there')).toBeInTheDocument()

    await userEvent.type(box, 'Again{Enter}')
    await userEvent.click(screen.getByRole('button', { name: 'Stop' }))
    expect(within(log).queryByText('Thinking…')).toBeNull()
    expect(within(log).queryByText('Something went wrong. Try again.')).toBeNull()
    expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument()
  })
})

describe('Agent01', () => {
  const plan = () => within(screen.getByRole('list', { name: 'Plan steps' })).getAllByRole('listitem')
  const waitForApproval = () => screen.findByRole('group', { name: 'Delete 12 draft orders?' })

  it('works through the plan, waits for approval, runs the delete and reports back with sources', async () => {
    let finish: () => void = () => {}
    const onApprove = vi.fn(() => new Promise<void>((r) => { finish = r }))
    render(<Agent01 stepDelay={0} onApprove={onApprove} />)
    const approval = await waitForApproval()
    expect(plan()[2]).toHaveTextContent('Waiting for you')
    expect(screen.getByText('Waiting for approval')).toBeInTheDocument()
    await userEvent.click(within(approval).getByRole('button', { name: 'Approve' }))
    expect(onApprove).toHaveBeenCalledTimes(1)
    // The delete is in progress: it cannot be stopped halfway.
    expect(screen.getByRole('button', { name: 'Stop' })).toBeDisabled()
    finish()
    expect(await screen.findByRole('region', { name: 'Sources' })).toBeInTheDocument()
    expect(screen.getByText('Done')).toBeInTheDocument()
    expect(plan().every((li) => li.textContent?.startsWith('Done:'))).toBe(true)
    expect(screen.getByRole('button', { name: /Run again/ })).toBeInTheDocument()
  })

  it('does nothing more after a denial', async () => {
    const onDeny = vi.fn()
    const onApprove = vi.fn()
    render(<Agent01 stepDelay={0} onDeny={onDeny} onApprove={onApprove} />)
    await userEvent.click(within(await waitForApproval()).getByRole('button', { name: 'Deny' }))
    expect(onDeny).toHaveBeenCalled()
    expect(onApprove).not.toHaveBeenCalled()
    expect(plan()[2]).toHaveTextContent('Failed: Ask before deletingDenied')
    expect(plan()[3]).toHaveTextContent('Skipped')
    expect(screen.getByText(/Nothing was deleted/)).toBeInTheDocument()
  })

  it('closes the question unanswered when stopped while waiting', async () => {
    const onApprove = vi.fn()
    render(<Agent01 stepDelay={0} onApprove={onApprove} />)
    const approval = await waitForApproval()
    await userEvent.click(screen.getByRole('button', { name: 'Stop' }))
    expect(within(approval).queryByRole('button')).toBeNull()
    expect(within(approval).getByText('Not answered')).toBeInTheDocument()
    expect(onApprove).not.toHaveBeenCalled()
    expect(plan()[2]).toHaveTextContent('Failed: Ask before deletingStopped')
    expect(screen.getByRole('banner')).toHaveTextContent('Stopped')
  })

  it('reports a failed delete and leaves the rest of the plan unrun', async () => {
    render(<Agent01 stepDelay={0} onApprove={() => Promise.reject(new Error('503'))} />)
    await userEvent.click(within(await waitForApproval()).getByRole('button', { name: 'Approve' }))
    expect(await screen.findByText(/did not go through/)).toBeInTheDocument()
    expect(plan()[3]).toHaveTextContent('Failed: Delete the draftsFailed')
    expect(plan()[4]).toHaveTextContent('Skipped')
    expect(screen.queryByRole('region', { name: 'Sources' })).toBeNull()
  })
})

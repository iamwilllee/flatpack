// The installable blocks in src/components/blocks: each one's main flow, as a user would do it.
import { describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Login01 } from '@/components/blocks/login-01'
import { Settings01 } from '@/components/blocks/settings-01'
import { DataTable01 } from '@/components/blocks/data-table-01'
import { Chat01 } from '@/components/blocks/chat-01'

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

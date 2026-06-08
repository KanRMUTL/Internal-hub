import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { lightTheme } from 'shared/styles'
import { MEMBER_PRESET_COLORS } from 'entities/member'
import MemberManagementModalModern, {
  type MemberManagementMember,
} from '../MemberManagementModalModern'

// jsdom doesn't lay out flex, so we simulate the constrained List by stubbing
// its scroll metrics. The fix being tested is structural (the flex chain must
// reach the List) — verifying the chain is the right surface for a unit test.
const stubListMetrics = (list: HTMLElement, scrollHeight: number, clientHeight: number) => {
  Object.defineProperty(list, 'scrollHeight', { configurable: true, value: scrollHeight })
  Object.defineProperty(list, 'clientHeight', { configurable: true, value: clientHeight })
}

const makeMembers = (n: number): MemberManagementMember[] =>
  Array.from({ length: n }, (_, i) => ({
    id: `m-${i}`,
    name: `Member ${i + 1}`,
    color: MEMBER_PRESET_COLORS[i % MEMBER_PRESET_COLORS.length],
    active: true,
  }))

const renderModal = (props: Partial<React.ComponentProps<typeof MemberManagementModalModern>> = {}) => {
  const noop = vi.fn()
  return render(
    <ThemeProvider theme={lightTheme}>
      <MemberManagementModalModern
        open
        members={[]}
        onClose={noop}
        onAdd={noop}
        onRemove={noop}
        onToggleActive={noop}
        {...props}
      />
    </ThemeProvider>,
  )
}

describe('MemberManagementModalModern — list scroll region', () => {
  beforeEach(() => {
    // jsdom doesn't ship Element.prototype.scrollBy used by motion/headless
    // helpers. Stub it so rendering doesn't blow up.
    if (!('scrollBy' in HTMLElement.prototype)) {
      Object.defineProperty(HTMLElement.prototype, 'scrollBy', {
        value: vi.fn(),
        writable: true,
      })
    }
    // useBodyScrollLock writes to document.body.style.overflow. Reset
    // between tests so leftover state from one test doesn't leak.
    document.body.style.overflow = ''
  })

  afterEach(() => {
    vi.restoreAllMocks()
    document.body.style.overflow = ''
  })

  it('locks the page scroll while the modal is open', () => {
    renderModal({ members: makeMembers(5) })
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('renders the dialog and the list when there are many members', () => {
    renderModal({ members: makeMembers(25) })
    expect(screen.getByRole('dialog', { name: /members/i })).toBeInTheDocument()
    expect(screen.getByTestId('member-list')).toBeInTheDocument()
    // Sanity: every member row is in the DOM (not virtualised away).
    expect(screen.getAllByRole('listitem')).toHaveLength(25)
  })

  it('establishes a scroll region: List sits inside a flex column ancestor with min-height: 0', () => {
    renderModal({ members: makeMembers(25) })
    const list = screen.getByTestId('member-list')

    // The List itself declares `overflow-y: auto; flex: 1; min-height: 0` in
    // its CSS template — those properties alone don't make it scrollable; the
    // ancestor chain also has to constrain its height. The fix wires the
    // FocusTrap wrapper as a flex column with min-height: 0 so flex: 1 on
    // the List resolves to a bounded height. (styled-components' generated
    // CSS doesn't surface in `element.style` under jsdom, so the assertion
    // is on the *wrapper's* inline style, which is the fix surface.)
    let cursor: HTMLElement | null = list.parentElement
    let flexColumnAncestor: HTMLElement | null = null
    while (cursor) {
      if (cursor.style.display === 'flex' && cursor.style.flexDirection === 'column') {
        flexColumnAncestor = cursor
        break
      }
      cursor = cursor.parentElement
    }
    expect(flexColumnAncestor).not.toBeNull()
    // min-height: 0 is the key property that lets the descendant List shrink
    // below its content size and start scrolling. jsdom serialises numeric 0
    // as "0" (no unit) — accept either form.
    expect(['0', '0px']).toContain(flexColumnAncestor!.style.minHeight)
    // flex: 1 ensures the wrapper fills the Dialog (which is the flex
    // container with max-height), so the constrained height propagates down.
    // Browsers serialise the long form (flex-grow / flex-shrink / flex-basis)
    // as "1 1 0%" — assert on the individual longhand props.
    expect(flexColumnAncestor!.style.flexGrow).toBe('1')
    expect(flexColumnAncestor!.style.flexShrink).toBe('1')
    expect(flexColumnAncestor!.style.flexBasis).toBe('0%')
  })

  it('reports scrollHeight > clientHeight when the list overflows', () => {
    renderModal({ members: makeMembers(40) })
    const list = screen.getByTestId('member-list')
    // 40 rows × 50px ≈ 2000px content, list capped at 400px by the flex chain
    stubListMetrics(list, 2000, 400)
    expect(list.scrollHeight).toBeGreaterThan(list.clientHeight)
  })
})

describe('MemberManagementModalModern — confirm remove flow', () => {
  beforeEach(() => {
    if (!('scrollBy' in HTMLElement.prototype)) {
      Object.defineProperty(HTMLElement.prototype, 'scrollBy', {
        value: vi.fn(),
        writable: true,
      })
    }
    document.body.style.overflow = ''
  })

  afterEach(() => {
    vi.restoreAllMocks()
    document.body.style.overflow = ''
  })

  it('does NOT remove a member on trash click — opens a confirm dialog instead', () => {
    const onRemove = vi.fn()
    renderModal({ members: makeMembers(3), onRemove })
    const trashButton = screen.getAllByRole('button', { name: /remove member 1/i })[0]
    fireEvent.click(trashButton)
    // The destructive action must not have fired yet.
    expect(onRemove).not.toHaveBeenCalled()
    // The confirm dialog must be present.
    expect(screen.getByRole('alertdialog')).toBeInTheDocument()
  })

  it('shows the member name in the confirm body', () => {
    renderModal({
      members: [
        { id: 'a', name: 'Alice', color: MEMBER_PRESET_COLORS[0], active: true },
        { id: 'b', name: 'Bob', color: MEMBER_PRESET_COLORS[1], active: true },
      ],
    })
    const trashButton = screen.getByRole('button', { name: /remove alice/i })
    fireEvent.click(trashButton)
    // The confirm body must include Alice's name (so the user is sure
    // they're deleting the right person).
    const alert = screen.getByRole('alertdialog')
    expect(alert.textContent).toContain('Alice')
    // And not the other member.
    expect(alert.textContent).not.toContain('Bob')
  })

  it('Cancel closes the confirm without removing', async () => {
    const onRemove = vi.fn()
    renderModal({
      members: [{ id: 'a', name: 'Alice', color: MEMBER_PRESET_COLORS[0], active: true }],
      onRemove,
    })
    fireEvent.click(screen.getByRole('button', { name: /remove alice/i }))
    expect(screen.getByRole('alertdialog')).toBeInTheDocument()
    fireEvent.click(screen.getByTestId('confirm-remove-cancel'))
    expect(onRemove).not.toHaveBeenCalled()
    // AnimatePresence keeps the dialog in the DOM during its exit animation;
    // wait for the unmount before asserting.
    await waitFor(() => {
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    })
  })

  it('Remove calls onRemove with the right id and closes the confirm', async () => {
    const onRemove = vi.fn()
    renderModal({
      members: [
        { id: 'a', name: 'Alice', color: MEMBER_PRESET_COLORS[0], active: true },
        { id: 'b', name: 'Bob', color: MEMBER_PRESET_COLORS[1], active: true },
      ],
      onRemove,
    })
    // Click Bob's trash (not Alice's) to verify the right id gets removed.
    fireEvent.click(screen.getByRole('button', { name: /remove bob/i }))
    fireEvent.click(screen.getByTestId('confirm-remove-confirm'))
    expect(onRemove).toHaveBeenCalledTimes(1)
    expect(onRemove).toHaveBeenCalledWith('b')
    await waitFor(() => {
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    })
  })

  it('Escape cancels the confirm (does not close the parent modal)', async () => {
    const onClose = vi.fn()
    renderModal({
      members: [{ id: 'a', name: 'Alice', color: MEMBER_PRESET_COLORS[0], active: true }],
      onClose,
    })
    fireEvent.click(screen.getByRole('button', { name: /remove alice/i }))
    expect(screen.getByRole('alertdialog')).toBeInTheDocument()
    fireEvent.keyDown(window, { key: 'Escape' })
    // Confirm closes, parent stays.
    await waitFor(() => {
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    })
    expect(onClose).not.toHaveBeenCalled()
    // Parent dialog is still on screen.
    expect(screen.getByRole('dialog', { name: /members/i })).toBeInTheDocument()
  })
})

describe('MemberManagementModalModern — search section', () => {
  beforeEach(() => {
    if (!('scrollBy' in HTMLElement.prototype)) {
      Object.defineProperty(HTMLElement.prototype, 'scrollBy', {
        value: vi.fn(),
        writable: true,
      })
    }
    document.body.style.overflow = ''
  })

  afterEach(() => {
    vi.restoreAllMocks()
    document.body.style.overflow = ''
  })

  it('renders the search input when there are members', () => {
    renderModal({ members: makeMembers(3) })
    expect(screen.getByTestId('member-search-input')).toBeInTheDocument()
  })

  it('does NOT render the search input when there are zero members', () => {
    renderModal({ members: [] })
    expect(screen.queryByTestId('member-search-input')).not.toBeInTheDocument()
  })

  it('filters the list as the user types (case-insensitive substring)', async () => {
    renderModal({
      members: [
        { id: '1', name: 'Alice', color: MEMBER_PRESET_COLORS[0], active: true },
        { id: '2', name: 'Bob', color: MEMBER_PRESET_COLORS[1], active: true },
        { id: '3', name: 'Alicia', color: MEMBER_PRESET_COLORS[2], active: true },
      ],
    })
    const input = screen.getByTestId('member-search-input')
    fireEvent.change(input, { target: { value: 'ali' } })
    // AnimatePresence keeps the exiting row in the DOM during its 220ms exit
    // animation; wait for the unmount before asserting the count.
    await waitFor(() => {
      expect(screen.getAllByRole('listitem')).toHaveLength(2)
    })
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Alicia')).toBeInTheDocument()
    expect(screen.queryByText('Bob')).not.toBeInTheDocument()
  })

  it('shows the result-count line when searching', () => {
    renderModal({
      members: [
        { id: '1', name: 'Alice', color: MEMBER_PRESET_COLORS[0], active: true },
        { id: '2', name: 'Bob', color: MEMBER_PRESET_COLORS[1], active: true },
        { id: '3', name: 'Alicia', color: MEMBER_PRESET_COLORS[2], active: true },
      ],
    })
    fireEvent.change(screen.getByTestId('member-search-input'), { target: { value: 'ali' } })
    const meta = screen.getByTestId('member-search-meta')
    expect(meta).toBeInTheDocument()
    expect(meta.textContent).toMatch(/2 of 3/)
    expect(meta.textContent).toMatch(/ali/i)
  })

  it('hides the result-count line when the query is empty', () => {
    renderModal({ members: makeMembers(3) })
    expect(screen.queryByTestId('member-search-meta')).not.toBeInTheDocument()
  })

  it('Cmd+K focuses the search input', () => {
    renderModal({ members: makeMembers(3) })
    const input = screen.getByTestId('member-search-input')
    expect(document.activeElement).not.toBe(input)
    fireEvent.keyDown(window, { key: 'k', metaKey: true })
    expect(document.activeElement).toBe(input)
  })

  it('Ctrl+K focuses the search input (Windows/Linux)', () => {
    renderModal({ members: makeMembers(3) })
    const input = screen.getByTestId('member-search-input')
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true })
    expect(document.activeElement).toBe(input)
  })

  it('Escape clears the query when focused on the search input', () => {
    renderModal({ members: makeMembers(3) })
    const input = screen.getByTestId('member-search-input') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'ali' } })
    expect(input.value).toBe('ali')
    // Focus the input so the Escape target is the search.
    input.focus()
    fireEvent.keyDown(input, { key: 'Escape' })
    expect(input.value).toBe('')
  })

  it('Escape closes the modal when the query is empty and no confirm is open', () => {
    const onClose = vi.fn()
    renderModal({ members: makeMembers(3), onClose })
    // Focus the search input to confirm the rule applies even with focus there.
    const input = screen.getByTestId('member-search-input')
    input.focus()
    fireEvent.keyDown(input, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})

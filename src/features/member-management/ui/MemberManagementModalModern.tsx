import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import styled, { css } from 'styled-components'
import { X, Trash2, Users, UserPlus, Eye, EyeOff, AlertTriangle, Search } from 'lucide-react'
import { FocusTrap } from 'shared/ui'
import { useBodyScrollLock } from 'shared/hooks'
import { memberAvatarText } from 'entities/member'

export interface MemberManagementMember {
  id: string
  name: string
  color: string
  active: boolean
}

interface MemberManagementModalModernProps {
  open: boolean
  members: MemberManagementMember[]
  onClose: () => void
  onAdd: (name: string) => void
  onRemove: (id: string) => void
  onToggleActive: (id: string) => void
}

const Backdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.background.overlay};
  backdrop-filter: blur(8px);
`

const Dialog = styled(motion.div)<{ $inert?: boolean }>`
  position: relative;
  width: 100%;
  max-width: 480px;
  max-height: min(80vh, 640px);
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.background.surface};
  border: 1px solid ${({ theme }) => theme.colors.grey[100]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadow.modal};
  overflow: hidden;
  /* When the confirm-remove dialog is open, dim the parent so the user's eye
     lands on the confirmation. */
  opacity: ${({ $inert }) => ($inert ? 0.5 : 1)};
  transition: opacity 200ms ${({ theme }) => theme.motion.easing.easeOut};
  ${({ $inert }) =>
    $inert &&
    css`
      pointer-events: none;
    `}
`

const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};
`

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const Eyebrow = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: ${({ theme }) => theme.fontSizes.micro};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.interactive};
`

const Title = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.text};
`

const Sub = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.grey[500]};
`

const CloseBtn = styled(motion.button)`
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: transparent;
  color: ${({ theme }) => theme.colors.grey[500]};
  cursor: pointer;
  flex-shrink: 0;
  transition: background-color 160ms ${({ theme }) => theme.motion.easing.easeOut};

  &:hover {
    background: ${({ theme }) => theme.colors.hover};
    color: ${({ theme }) => theme.text};
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadow.focusVisible};
  }
`

const AddForm = styled.form`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  /* No horizontal padding — the Footer provides the gutter. */
`

const Input = styled.input`
  flex: 1;
  height: 40px;
  padding: 0 ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.grey[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.background.surface};
  color: ${({ theme }) => theme.text};
  font-family: inherit;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  letter-spacing: -0.005em;
  transition:
    border-color 180ms ${({ theme }) => theme.motion.easing.easeOut},
    box-shadow 180ms ${({ theme }) => theme.motion.easing.easeOut};

  &::placeholder {
    color: ${({ theme }) => theme.colors.grey[400]};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.focus};
  }
`

const AddBtn = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 40px;
  padding: 0 ${({ theme }) => theme.spacing.md};
  border: 0;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.interactive};
  color: ${({ theme }) => theme.colors.white};
  font-family: inherit;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  cursor: pointer;
  flex-shrink: 0;
  transition:
    background-color 180ms ${({ theme }) => theme.motion.easing.easeOut},
    box-shadow 180ms ${({ theme }) => theme.motion.easing.easeOut};

  &:hover:not(:disabled) {
    box-shadow: 0 6px 16px ${({ theme }) => theme.colors.focusRing};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadow.focusVisible};
  }
`

// Search section. Sits between the Header and the Divider as its own block —
// not buried inside the TitleBlock. The field is full-width with a search
// icon prefix, an inline clear button (only when there's a query), and a
// match-count line below that appears only while a filter is active.
const SearchSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
`

const SearchField = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`

const SearchInput = styled.input`
  width: 100%;
  height: 36px;
  padding: 0 36px;
  border: 1px solid ${({ theme }) => theme.colors.grey[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.grey[50]};
  color: ${({ theme }) => theme.text};
  font-family: inherit;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  letter-spacing: -0.005em;
  transition:
    border-color 180ms ${({ theme }) => theme.motion.easing.easeOut},
    box-shadow 180ms ${({ theme }) => theme.motion.easing.easeOut},
    background-color 180ms ${({ theme }) => theme.motion.easing.easeOut};

  &::placeholder {
    color: ${({ theme }) => theme.colors.grey[400]};
  }

  /* Native search inputs render a ✕ button in some browsers — hide it
     because we render our own (consistent across platforms). */
  &::-webkit-search-cancel-button {
    display: none;
  }

  &:focus {
    outline: none;
    background: ${({ theme }) => theme.background.surface};
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.focus};
  }
`

const SearchIconWrap = styled.span`
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.grey[400]};
  pointer-events: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`

const SearchMeta = styled.div`
`

const SearchMetaCount = styled.span`
  font-variant-numeric: tabular-nums;
  color: ${({ theme }) => theme.text};
`

const Divider = styled.hr`
  margin: 0;
  border: 0;
  border-top: 1px solid ${({ theme }) => theme.colors.grey[100]};
`

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: ${({ theme }) => theme.spacing.xs} 0;
  overflow-y: auto;
  flex: 1;
  min-height: 0;

  /* Hide the scrollbar but keep scroll behavior. The list is short enough
     that the count in the Footer ("N of M members on the wheel") and the
     edge-of-list hover affordance make the scroll position discoverable
     without a visible track. */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE / legacy Edge */
  &::-webkit-scrollbar {
    display: none; /* Chrome / Safari / WebKit */
  }
`

const Row = styled(motion.li)<{ $inactive: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  transition: background-color 160ms ${({ theme }) => theme.motion.easing.easeOut};

  &:hover {
    background: ${({ theme }) => theme.colors.hover};

    .remove-btn {
      opacity: 1;
    }
  }

  ${({ $inactive }) =>
    $inactive &&
    css`
      .name-text {
        color: oklch(60% 0.005 180);
        text-decoration: line-through;
        text-decoration-color: oklch(70% 0.005 180);
        text-decoration-thickness: 1px;
      }
      .member-avatar {
        opacity: 0.4;
        filter: grayscale(0.4);
      }
    `}
`

const Avatar = styled.span<{ $color: string; $textColor: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  color: ${({ $textColor }) => $textColor};
  font-size: ${({ theme }) => theme.fontSizes.chip};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  flex-shrink: 0;
  transition:
    opacity 200ms ${({ theme }) => theme.motion.easing.easeOut},
    filter 200ms ${({ theme }) => theme.motion.easing.easeOut};
`

const Name = styled.span`
  flex: 1;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
  transition: color 200ms ${({ theme }) => theme.motion.easing.easeOut};
`

const ToggleWrap = styled(motion.button)<{ $on: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 28px;
  padding: 0 8px 0 6px;
  border: 1px solid ${({ theme, $on }) => ($on ? theme.colors.primary : theme.colors.grey[200])};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme, $on }) => ($on ? theme.colors.focus : 'transparent')};
  color: ${({ theme, $on }) => ($on ? theme.colors.interactive : theme.colors.grey[500])};
  font-family: inherit;
  font-size: ${({ theme }) => theme.fontSizes.micro};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  letter-spacing: 0.02em;
  cursor: pointer;
  flex-shrink: 0;
  transition:
    background-color 180ms ${({ theme }) => theme.motion.easing.easeOut},
    border-color 180ms ${({ theme }) => theme.motion.easing.easeOut},
    color 180ms ${({ theme }) => theme.motion.easing.easeOut};

  &:hover {
    border-color: ${({ theme, $on }) => ($on ? theme.colors.primary : theme.colors.grey[300])};
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadow.focusVisible};
  }
`

const ToggleIcon = styled.span<{ $on: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: ${({ theme, $on }) => ($on ? theme.colors.interactive : theme.colors.grey[200])};
  color: ${({ theme, $on }) => ($on ? theme.colors.white : theme.colors.grey[500])};
  transition:
    background-color 180ms ${({ theme }) => theme.motion.easing.easeOut},
    color 180ms ${({ theme }) => theme.motion.easing.easeOut};
`

const RemoveBtn = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background: transparent;
  color: ${({ theme }) => theme.colors.grey[400]};
  cursor: pointer;
  opacity: 0.5;
  transition:
    opacity 160ms ${({ theme }) => theme.motion.easing.easeOut},
    background-color 160ms ${({ theme }) => theme.motion.easing.easeOut},
    color 160ms ${({ theme }) => theme.motion.easing.easeOut};

  &:hover {
    background: ${({ theme }) => theme.colors.focus};
    color: ${({ theme }) => theme.colors.danger};
    opacity: 1;
  }

  &:focus-visible {
    outline: none;
    opacity: 1;
    box-shadow: ${({ theme }) => theme.shadow.focusVisible};
  }
`

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.grey[500]};
`

const EmptyIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.grey[100]};
  color: ${({ theme }) => theme.colors.grey[400]};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`

const EmptyTitle = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.text};
  margin-bottom: 2px;
`

const EmptyHint = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.caption};
  color: ${({ theme }) => theme.colors.grey[500]};
  max-width: 30ch;
`

const Footer = styled.footer`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.grey[100]};
  font-size: ${({ theme }) => theme.fontSizes.caption};
  color: ${({ theme }) => theme.colors.grey[500]};
`

const FooterMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
`

const FooterCount = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-variant-numeric: tabular-nums;
`

const KbdHint = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`

const Kbd = styled.kbd`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, monospace;
  font-size: 10px;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.grey[600]};
  background: ${({ theme }) => theme.colors.grey[100]};
  border: 1px solid ${({ theme }) => theme.colors.grey[200]};
  border-bottom-width: 2px;
  border-radius: 3px;
`

// Confirm-remove dialog (nested). Direction 7 visual identity, same animation
// and focus-trap treatment as the parent modal. Stays inside the same
// backdrop as the parent so the page behind both is locked and blurred, but
// the parent dialog is dimmed and aria-hidden while this is open.

// Lifts the dialog above the parent dialog when both are mounted.
const ConfirmLayer = styled(motion.div)`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.lg};
  z-index: 2;
`

const ConfirmDialog = styled(motion.div)`
  width: 100%;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing['2xl']} ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.background.surface};
  border: 1px solid ${({ theme }) => theme.colors.grey[100]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadow.modal};
  text-align: center;
`

const ConfirmIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.focus};
  color: ${({ theme }) => theme.colors.danger};
  margin-bottom: 2px;
`

const ConfirmTitle = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.text};
  line-height: 1.3;
`

const ConfirmBody = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.grey[500]};
  max-width: 36ch;
`

const ConfirmName = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.focus};
  color: ${({ theme }) => theme.colors.interactive};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
`

const ConfirmActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing.xs};
`

const CancelBtn = styled(motion.button)`
  flex: 1;
  height: 40px;
  padding: 0 ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.grey[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.background.surface};
  color: ${({ theme }) => theme.text};
  font-family: inherit;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  cursor: pointer;
  transition:
    background-color 160ms ${({ theme }) => theme.motion.easing.easeOut},
    border-color 160ms ${({ theme }) => theme.motion.easing.easeOut};

  &:hover {
    background: ${({ theme }) => theme.colors.hover};
    border-color: ${({ theme }) => theme.colors.grey[300]};
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadow.focusVisible};
  }
`

const ConfirmRemoveBtn = styled(motion.button)`
  flex: 1;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0 ${({ theme }) => theme.spacing.md};
  border: 0;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.danger};
  color: ${({ theme }) => theme.colors.white};
  font-family: inherit;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  cursor: pointer;
  transition:
    background-color 160ms ${({ theme }) => theme.motion.easing.easeOut},
    box-shadow 160ms ${({ theme }) => theme.motion.easing.easeOut};

  &:hover:not(:disabled) {
    filter: brightness(0.95);
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadow.focusVisible};
  }
`

const MemberManagementModalModern = ({
  open,
  members,
  onClose,
  onAdd,
  onRemove,
  onToggleActive,
}: MemberManagementModalModernProps) => {
  // The dialog is aria-modal but lives in a portal-less tree, so the page
  // behind it would still scroll. Lock body scroll while the modal is open.
  useBodyScrollLock(open)

  const [name, setName] = useState('')
  const [query, setQuery] = useState('')
  const [memberToRemove, setMemberToRemove] = useState<MemberManagementMember | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) {
      setName('')
      setQuery('')
      setMemberToRemove(null)
    }
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e: KeyboardEvent) => {
      // Don't hijack typing in any input/textarea/contenteditable on the page.
      const t = e.target as HTMLElement | null
      const inEditable = !!t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)

      // Cmd/Ctrl+K focuses the search. Works from anywhere inside the modal
      // except when the user is already typing in the add-input (avoid
      // stealing focus mid-keystroke).
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
        searchInputRef.current?.select()
        return
      }

      if (e.key === 'Escape') {
        e.preventDefault()
        // Escape cancels the confirm-remove dialog first; if the search has a
        // query and the user is focused on it, clear the search next; only
        // fall back to closing the parent modal otherwise.
        if (memberToRemove) {
          setMemberToRemove(null)
        } else if (query && t === searchInputRef.current) {
          setQuery('')
        } else {
          onClose()
        }
        return
      }

      // Slash from outside any input → focus search (GitHub-style command
      // palette affordance). Don't fight the user if they're already typing.
      if (e.key === '/' && !inEditable) {
        e.preventDefault()
        searchInputRef.current?.focus()
        searchInputRef.current?.select()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose, memberToRemove, query])

  const trimmed = name.trim()
  const canAdd = trimmed.length > 0

  // Case-insensitive substring match on member name. Trim the query so
  // leading/trailing whitespace doesn't accidentally hide every result.
  const normalizedQuery = query.trim().toLowerCase()
  const isSearching = normalizedQuery.length > 0
  const filteredMembers = isSearching ? members.filter((m) => m.name.toLowerCase().includes(normalizedQuery)) : members

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canAdd) return
    onAdd(trimmed)
    setName('')
    // Clear the search so the newly added member is visible. If the user
    // had a search active and added someone whose name didn't match it,
    // the list would otherwise silently hide the new entry.
    setQuery('')
    inputRef.current?.focus()
  }

  const handleConfirmRemove = () => {
    if (!memberToRemove) return
    onRemove(memberToRemove.id)
    setMemberToRemove(null)
  }

  const handleCancelRemove = () => {
    setMemberToRemove(null)
  }

  return (
    <AnimatePresence>
      {open && (
        <Backdrop
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          role="presentation"
        >
          <Dialog
            $inert={!!memberToRemove}
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="members-modal-title"
          >
            <FocusTrap
              isActive={open && !memberToRemove}
              initialFocus="[data-testid='member-search-input']"
              // The List relies on `flex: 1; min-height: 0` to become a scroll
              // region inside the Dialog's flex column. Re-establish the flex
              // chain on this wrapper — FocusTrap itself is layout-agnostic.
              style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}
            >
              <Header>
                <TitleBlock>
                  <Eyebrow>
                    <Users size={11} strokeWidth={2.25} aria-hidden="true" />
                    Manage
                  </Eyebrow>
                  <Title id="members-modal-title">Members</Title>
                  <Sub>Everyone in this room. The wheel draws from this list.</Sub>
                </TitleBlock>
                <CloseBtn type="button" onClick={onClose} aria-label="Close" whileTap={{ scale: 0.92 }}>
                  <X size={16} strokeWidth={2} aria-hidden="true" />
                </CloseBtn>
              </Header>

              {members.length > 0 && (
                <SearchSection>
                  <SearchField>
                    <SearchIconWrap aria-hidden="true">
                      <Search size={14} strokeWidth={2} />
                    </SearchIconWrap>
                    <SearchInput
                      ref={searchInputRef}
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search members…"
                      aria-label="Search members by name"
                      data-testid="member-search-input"
                    />
                  </SearchField>
                  {isSearching && (
                    <SearchMeta role="status" aria-live="polite" data-testid="member-search-meta">
                      <SearchMetaCount>
                        {filteredMembers.length} of {members.length}
                      </SearchMetaCount>
                      {filteredMembers.length === 1 ? 'member' : 'members'} matching “{query.trim()}”
                    </SearchMeta>
                  )}
                </SearchSection>
              )}

              <Divider />

              {members.length === 0 ? (
                <EmptyState>
                  <EmptyIcon aria-hidden="true">
                    <UserPlus size={20} strokeWidth={1.5} />
                  </EmptyIcon>
                  <EmptyTitle>No members yet</EmptyTitle>
                  <EmptyHint>Add a name below to put them on the wheel.</EmptyHint>
                </EmptyState>
              ) : filteredMembers.length === 0 ? (
                <EmptyState>
                  <EmptyIcon aria-hidden="true">
                    <Search size={20} strokeWidth={1.5} />
                  </EmptyIcon>
                  <EmptyTitle>No matches</EmptyTitle>
                  <EmptyHint>No members match “{query.trim()}”. Try a different name.</EmptyHint>
                </EmptyState>
              ) : (
                <List data-testid="member-list">
                  <AnimatePresence initial={false}>
                    {filteredMembers.map((m) => (
                      <Row
                        key={m.id}
                        $inactive={!m.active}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <Avatar
                          className="member-avatar"
                          $color={m.color}
                          $textColor={memberAvatarText(m.name)}
                          aria-hidden="true"
                        >
                          {m.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Name className="name-text">{m.name}</Name>
                        <ToggleWrap
                          type="button"
                          $on={m.active}
                          onClick={() => onToggleActive(m.id)}
                          aria-label={m.active ? `Take ${m.name} off the wheel` : `Put ${m.name} on the wheel`}
                          aria-pressed={m.active}
                          whileTap={{ scale: 0.94 }}
                        >
                          <ToggleIcon $on={m.active} aria-hidden="true">
                            {m.active ? <Eye size={10} strokeWidth={2.25} /> : <EyeOff size={10} strokeWidth={2.25} />}
                          </ToggleIcon>
                          <span>{m.active ? 'On' : 'Off'}</span>
                        </ToggleWrap>
                        <RemoveBtn
                          type="button"
                          className="remove-btn"
                          onClick={() => setMemberToRemove(m)}
                          aria-label={`Remove ${m.name}`}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 size={14} strokeWidth={1.75} aria-hidden="true" />
                        </RemoveBtn>
                      </Row>
                    ))}
                  </AnimatePresence>
                </List>
              )}

              <Footer>
                <AddForm onSubmit={handleSubmit}>
                  <Input
                    ref={inputRef}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Add a member by name…"
                    aria-label="Member name"
                    maxLength={40}
                    data-testid="member-add-input"
                  />
                  <AddBtn
                    type="submit"
                    disabled={!canAdd}
                    data-testid="member-add-btn"
                    whileTap={canAdd ? { scale: 0.97 } : undefined}
                    whileHover={canAdd ? { scale: 1.01 } : undefined}
                  >
                    <UserPlus size={14} strokeWidth={2} aria-hidden="true" />
                    Add
                  </AddBtn>
                </AddForm>
                <FooterMeta>
                  <FooterCount>
                    <Users size={12} strokeWidth={1.75} aria-hidden="true" />
                    <span>
                      {members.filter((m) => m.active).length} of {members.length}{' '}
                      {members.length === 1 ? 'member' : 'members'} on the wheel
                    </span>
                  </FooterCount>
                  <KbdHint>
                    <Kbd>Esc</Kbd>
                    <span>close</span>
                  </KbdHint>
                </FooterMeta>
              </Footer>
            </FocusTrap>
          </Dialog>

          {/* Confirm-remove dialog. Layered over the (now inert) parent
              dialog; shares the same backdrop so the page behind both is
              still locked and blurred. */}
          <AnimatePresence>
            {memberToRemove && (
              <ConfirmLayer
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                onClick={(e) => e.stopPropagation()}
                role="presentation"
              >
                <FocusTrap
                  isActive={!!memberToRemove}
                  // Default focus lands on Cancel — a destructive Remove button
                  // shouldn't be the one Enter accidentally hits.
                  initialFocus="[data-testid='confirm-remove-cancel']"
                >
                  <ConfirmDialog
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.98 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    role="alertdialog"
                    aria-modal="true"
                    aria-labelledby="confirm-remove-title"
                    aria-describedby="confirm-remove-body"
                  >
                    <ConfirmIcon aria-hidden="true">
                      <AlertTriangle size={20} strokeWidth={2} />
                    </ConfirmIcon>
                    <ConfirmTitle id="confirm-remove-title">Remove member?</ConfirmTitle>
                    <ConfirmBody id="confirm-remove-body">
                      You'll remove <ConfirmName>{memberToRemove.name}</ConfirmName> from this room. They won't appear
                      on the wheel anymore. This can't be undone.
                    </ConfirmBody>
                    <ConfirmActions>
                      <CancelBtn
                        type="button"
                        onClick={handleCancelRemove}
                        data-testid="confirm-remove-cancel"
                        whileTap={{ scale: 0.97 }}
                      >
                        Cancel
                      </CancelBtn>
                      <ConfirmRemoveBtn
                        type="button"
                        onClick={handleConfirmRemove}
                        data-testid="confirm-remove-confirm"
                        whileTap={{ scale: 0.97 }}
                        whileHover={{ scale: 1.01 }}
                      >
                        <Trash2 size={14} strokeWidth={2} aria-hidden="true" />
                        Remove
                      </ConfirmRemoveBtn>
                    </ConfirmActions>
                  </ConfirmDialog>
                </FocusTrap>
              </ConfirmLayer>
            )}
          </AnimatePresence>
        </Backdrop>
      )}
    </AnimatePresence>
  )
}

export default MemberManagementModalModern

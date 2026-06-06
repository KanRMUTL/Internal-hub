import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import styled, { css } from 'styled-components'
import { X, Trash2, Users, UserPlus, Eye, EyeOff } from 'lucide-react'

export interface MemberManagementMember {
  id: string
  name: string
  hue: number
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

const Dialog = styled(motion.div)`
  position: relative;
  width: 100%;
  max-width: 480px;
  max-height: min(80vh, 640px);
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.background.surface};
  border: 1px solid ${({ theme }) => theme.colors.grey[100]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.18);
  overflow: hidden;
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
  font-size: 11px;
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.primary};
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
  padding: 0 ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};
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
  background: ${({ theme }) => theme.colors.primary};
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

const Avatar = styled.span<{ $hue: number }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ $hue }) => `oklch(78% 0.10 ${$hue})`};
  color: ${({ $hue }) => `oklch(30% 0.08 ${$hue})`};
  font-size: 13px;
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
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: ${({ theme, $on }) => ($on ? theme.colors.focus : 'transparent')};
  color: ${({ theme, $on }) => ($on ? theme.colors.primary : theme.colors.grey[500])};
  font-family: inherit;
  font-size: 11px;
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
  background: ${({ theme, $on }) => ($on ? theme.colors.primary : theme.colors.grey[200])};
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
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.grey[100]};
  font-size: ${({ theme }) => theme.fontSizes.caption};
  color: ${({ theme }) => theme.colors.grey[500]};
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

const MemberManagementModalModern = ({
  open,
  members,
  onClose,
  onAdd,
  onRemove,
  onToggleActive,
}: MemberManagementModalModernProps) => {
  const [name, setName] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => inputRef.current?.focus(), 60)
      return () => window.clearTimeout(t)
    }
    setName('')
    return undefined
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const trimmed = name.trim()
  const canAdd = trimmed.length > 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canAdd) return
    onAdd(trimmed)
    setName('')
    inputRef.current?.focus()
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
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="members-modal-title"
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

            <Divider />

            {members.length === 0 ? (
              <EmptyState>
                <EmptyIcon aria-hidden="true">
                  <UserPlus size={20} strokeWidth={1.5} />
                </EmptyIcon>
                <EmptyTitle>No members yet</EmptyTitle>
                <EmptyHint>Add a name above to put them on the wheel.</EmptyHint>
              </EmptyState>
            ) : (
              <List>
                <AnimatePresence initial={false}>
                  {members.map((m) => (
                    <Row
                      key={m.id}
                      $inactive={!m.active}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Avatar className="member-avatar" $hue={m.hue} aria-hidden="true">
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
                        onClick={() => onRemove(m.id)}
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
            </Footer>
          </Dialog>
        </Backdrop>
      )}
    </AnimatePresence>
  )
}

export default MemberManagementModalModern

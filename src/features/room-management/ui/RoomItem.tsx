import { useEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import { Plus, MoreHorizontal, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import type { Room } from 'entities/room/model'

type RoomVariant = 'default' | 'add'

interface RoomItemProps {
  room?: Room
  variant?: RoomVariant
  title?: string
  description?: string
  index?: number
  onClick?: () => void
  onRemove?: () => void
}

const Card = styled(motion.div)<{ $variant: RoomVariant }>`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 90%;
  min-height: 144px;
  padding: ${({ theme }) => theme.spacing.lg};
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  color: ${({ theme }) => theme.text};
  background: ${({ theme }) => theme.background.surface};
  border: 1px solid ${({ theme }) => theme.colors.grey[100]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  transition: border-color 180ms ${({ theme }) => theme.motion.easing.easeOut};

  ${({ $variant }) =>
    $variant === 'add' &&
    css`
      border-style: dashed;
      color: ${({ theme }) => theme.colors.grey[500]};

      &:hover {
        border-color: ${({ theme }) => theme.colors.primary};
        color: ${({ theme }) => theme.colors.interactive};
      }
    `}

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadow.focusVisible};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

const Title = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  letter-spacing: -0.015em;
  line-height: 1.25;
  color: inherit;
  text-wrap: balance;
`

const Description = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.grey[500]};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

const MoreBtn = styled.button`
  position: absolute;
  top: ${({ theme }) => theme.spacing.xs};
  right: ${({ theme }) => theme.spacing.xs};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 0;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: transparent;
  color: ${({ theme }) => theme.colors.grey[500]};
  cursor: pointer;
  transition: color 160ms ${({ theme }) => theme.motion.easing.easeOut};

  /* Expand the touch target to 44x44 without changing the visual size. */
  &::before {
    content: '';
    position: absolute;
    inset: -8px;
  }

  &:hover,
  &[data-open='true'] {
    color: ${({ theme }) => theme.text};
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadow.focusVisible};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

const Menu = styled(motion.div)`
  position: absolute;
  top: calc(${({ theme }) => theme.spacing.xs} + 32px);
  right: ${({ theme }) => theme.spacing.xs};
  min-width: 152px;
  padding: 4px;
  background: ${({ theme }) => theme.background.surface};
  border: 1px solid ${({ theme }) => theme.colors.grey[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadow.menu};
  z-index: 20;
`

const MenuItem = styled.button<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  width: 100%;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border: 0;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background: transparent;
  color: ${({ theme, $danger }) => ($danger ? theme.colors.danger : theme.text)};
  font-family: inherit;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  text-align: left;
  cursor: pointer;
  transition: background-color 160ms ${({ theme }) => theme.motion.easing.easeOut};

  &:hover {
    background: ${({ theme, $danger }) => ($danger ? 'oklch(94% 0.06 25 / 0.18)' : theme.colors.hover)};
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadow.focusVisible};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

const RoomItem = ({ room, variant = 'default', title, description, index = 0, onClick, onRemove }: RoomItemProps) => {
  const displayTitle = title ?? room?.name ?? 'Untitled room'
  const displayDescription = description ?? room?.description ?? ''

  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const moreRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (!menuOpen) return
    const onClickOutside = (e: MouseEvent) => {
      const t = e.target as Node
      if (menuRef.current && !menuRef.current.contains(t) && !moreRef.current?.contains(t)) {
        setMenuOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('mousedown', onClickOutside)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('mousedown', onClickOutside)
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  const handleCardKey = (e: React.KeyboardEvent) => {
    if (menuOpen) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick?.()
    }
  }

  if (variant === 'add') {
    return (
      <Card
        $variant="add"
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={handleCardKey}
        aria-label="Create a new room"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
      >
        <Plus size={20} strokeWidth={1.75} aria-hidden="true" />
        <Title>New room</Title>
      </Card>
    )
  }

  return (
    <Card
      $variant="default"
      role="button"
      tabIndex={0}
      onClick={() => {
        if (menuOpen) return
        onClick?.()
      }}
      onKeyDown={handleCardKey}
      aria-label={`Open ${displayTitle}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
    >
      {onRemove && (
        <>
          <MoreBtn
            ref={moreRef}
            type="button"
            data-open={menuOpen}
            data-testid="room-item-more-btn"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label={`More options for ${displayTitle}`}
            onClick={(e) => {
              e.stopPropagation()
              setMenuOpen((o) => !o)
            }}
          >
            <MoreHorizontal size={16} strokeWidth={1.75} aria-hidden="true" />
          </MoreBtn>
          <AnimatePresence>
            {menuOpen && (
              <Menu
                ref={menuRef}
                role="menu"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
              >
                <MenuItem
                  role="menuitem"
                  $danger
                  data-testid="room-item-remove-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    setMenuOpen(false)
                    onRemove()
                  }}
                >
                  <Trash2 size={14} strokeWidth={1.75} aria-hidden="true" />
                  Remove room
                </MenuItem>
              </Menu>
            )}
          </AnimatePresence>
        </>
      )}
      <Title>{displayTitle}</Title>
      {displayDescription && <Description>{displayDescription}</Description>}
    </Card>
  )
}

export default RoomItem

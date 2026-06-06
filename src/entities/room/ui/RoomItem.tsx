import styled, { css } from 'styled-components'
import { Plus, ArrowUpRight, Users, MoreHorizontal, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import type { Room } from 'entities/room/model'

type RoomVariant = 'default' | 'add' | 'empty'

interface RoomItemProps {
  room?: Room
  variant?: RoomVariant
  title?: string
  description?: string
  memberCount?: number
  isActive?: boolean
  index?: number
  onClick?: () => void
  onRemove?: () => void
}

const Card = styled(motion.div)<{ $variant: RoomVariant; $featured: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  text-align: left;
  width: 100%;
  min-height: 188px;
  padding: ${({ theme }) => theme.spacing.lg};
  font-family: inherit;
  cursor: pointer;
  background: ${({ theme }) => theme.background.surface};
  color: ${({ theme }) => theme.text};
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  transition:
    background-color 220ms ${({ theme }) => theme.motion.easing.easeOut},
    border-color 220ms ${({ theme }) => theme.motion.easing.easeOut},
    transform 220ms ${({ theme }) => theme.motion.easing.easeOut},
    box-shadow 220ms ${({ theme }) => theme.motion.easing.easeOut};
  font-feature-settings: 'cv11', 'ss01', 'ss03';
  font-variant-numeric: tabular-nums;

  ${({ $featured, theme }) =>
    $featured &&
    css`
      background: linear-gradient(135deg, ${theme.colors.focus} 0%, ${theme.colors.hover} 100%);
      border-color: ${theme.colors.primary};
      box-shadow: 0 0 0 1px ${theme.colors.focus};
    `}

  ${({ $variant, theme }) =>
    $variant === 'add'
      ? css`
          background: transparent;
          border-style: dashed;
          border-color: ${theme.colors.grey[200]};
          color: ${theme.colors.grey[500]};

          &:hover {
            border-color: ${theme.colors.primary};
            color: ${theme.colors.primary};
            background: ${theme.colors.hover};

            .plus-icon {
              transform: rotate(90deg);
            }
          }
        `
      : $variant === 'empty'
        ? css`
            cursor: default;
            border-style: dashed;
            border-color: ${theme.colors.grey[200]};
            background: transparent;

            &:hover {
              border-color: ${theme.colors.grey[300]};
            }
          `
        : css`
            &:hover {
              border-color: ${theme.colors.primary};
              background: ${theme.background.elevated};
              transform: translateY(-2px);
              box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);

              .arrow {
                color: ${theme.colors.primary};
                transform: translate(2px, -2px);
              }
            }

            &:active {
              transform: translateY(0);
            }
          `}

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadow.focusVisible};
    border-color: ${({ theme }) => theme.colors.focusVisible};
  }

  @media (prefers-reduced-motion: reduce) {
    transition:
      background-color 0ms,
      border-color 0ms;
    transform: none !important;
    box-shadow: none !important;

    &:hover {
      transform: none;

      .arrow,
      .plus-icon {
        transform: none;
      }
    }
  }
`

const Title = styled.h3`
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
  line-height: 1.55;
  color: ${({ theme }) => theme.colors.grey[500]};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`

const Footer = styled.div<{ $featured: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme, $featured }) => ($featured ? theme.colors.primary : theme.colors.grey[100])};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.grey[500]};
`

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`

const Arrow = styled(ArrowUpRight)`
  color: ${({ theme }) => theme.colors.grey[400]};
  transition:
    color 200ms ${({ theme }) => theme.motion.easing.easeOut},
    transform 200ms ${({ theme }) => theme.motion.easing.easeOut};
`

const AddIconWrap = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  border: 1px solid currentColor;
  color: inherit;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  transition: transform 300ms ${({ theme }) => theme.motion.easing.easeOut};

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

const AddContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.xs};
`

const AddLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  letter-spacing: -0.015em;
  color: inherit;
`

const AddHint = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.grey[500]};
  max-width: 28ch;
`

const FeaturedBadge = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  align-self: flex-start;
  padding: 3px 8px 3px 6px;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  font-size: 11px;
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.background.surface};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.full};
`

const LiveDotWrap = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
`

const LiveDotCore = styled.span`
  position: absolute;
  inset: 4px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: ${({ theme }) => theme.colors.primary};
`

const LiveDotRing = styled(motion.span)`
  position: absolute;
  inset: 0;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  border: 1.5px solid ${({ theme }) => theme.colors.primary};
`

const EmptyIllustration = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.grey[100]};
  color: ${({ theme }) => theme.colors.grey[400]};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`

const MoreBtn = styled(motion.button)`
  position: absolute;
  top: ${({ theme }) => theme.spacing.sm};
  right: ${({ theme }) => theme.spacing.sm};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  padding: 0;
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.background.surface};
  color: ${({ theme }) => theme.colors.grey[500]};
  cursor: pointer;
  opacity: 0.4;
  transition:
    opacity 180ms ${({ theme }) => theme.motion.easing.easeOut},
    color 180ms ${({ theme }) => theme.motion.easing.easeOut},
    border-color 180ms ${({ theme }) => theme.motion.easing.easeOut},
    background-color 180ms ${({ theme }) => theme.motion.easing.easeOut};

  ${Card}:hover &,
  ${Card}:focus-within &,
  &:focus-visible {
    opacity: 1;
  }

  &:hover {
    color: ${({ theme }) => theme.text};
    border-color: ${({ theme }) => theme.colors.grey[200]};
    background: ${({ theme }) => theme.background.elevated};
  }

  &[data-open='true'] {
    opacity: 1;
    color: ${({ theme }) => theme.text};
    border-color: ${({ theme }) => theme.colors.grey[200]};
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
  top: calc(${({ theme }) => theme.spacing.sm} + 36px);
  right: ${({ theme }) => theme.spacing.sm};
  min-width: 168px;
  padding: 4px;
  background: ${({ theme }) => theme.background.surface};
  border: 1px solid ${({ theme }) => theme.colors.grey[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  z-index: 20;
`

const MenuItem = styled.button<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 10px;
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
    background: ${({ theme, $danger }) => ($danger ? `oklch(94% 0.06 25 / 0.18)` : theme.colors.hover)};
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadow.focusVisible};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

const pulseKeyframes = {
  scale: [1, 1.6, 1.6],
  opacity: [0.6, 0, 0],
}

const RoomItem = ({
  room,
  variant = 'default',
  title,
  description,
  memberCount,
  isActive,
  index = 0,
  onClick,
  onRemove,
}: RoomItemProps) => {
  const cardMotion = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.32,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      delay: index * 0.04,
    },
  }

  const displayTitle = title ?? room?.name ?? 'Untitled room'
  const displayDescription = description ?? room?.description ?? ''
  const featured = variant === 'default' && (isActive ?? room?.active ?? false)
  const count = memberCount ?? room?.members?.length ?? 0

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
        $featured={false}
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={handleCardKey}
        aria-label="Create a new room"
        {...cardMotion}
      >
        <AddContent>
          <AddIconWrap className="plus-icon">
            <Plus size={20} strokeWidth={1.75} aria-hidden="true" />
          </AddIconWrap>
          <AddLabel>New room</AddLabel>
          <AddHint>Spin the wheel with a fresh group of people.</AddHint>
        </AddContent>
      </Card>
    )
  }

  if (variant === 'empty') {
    return (
      <Card
        $variant="empty"
        $featured={false}
        role="button"
        tabIndex={-1}
        aria-disabled
        aria-label="Empty slot"
        {...cardMotion}
      >
        <EmptyIllustration>
          <Plus size={20} strokeWidth={1.5} aria-hidden="true" />
        </EmptyIllustration>
        <Title style={{ color: 'inherit' }}>{displayTitle || 'No rooms yet'}</Title>
        <Description>{displayDescription || 'Create your first room to get the wheel spinning.'}</Description>
      </Card>
    )
  }

  return (
    <Card
      $variant="default"
      $featured={featured}
      role="button"
      tabIndex={0}
      onClick={() => {
        if (menuOpen) return
        onClick?.()
      }}
      onKeyDown={handleCardKey}
      aria-label={`Open ${displayTitle}`}
      {...cardMotion}
    >
      {featured && (
        <FeaturedBadge
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + index * 0.04, duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          aria-label="Now spinning"
        >
          <LiveDotWrap>
            <LiveDotCore />
            <LiveDotRing
              animate={pulseKeyframes}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
              aria-hidden="true"
            />
          </LiveDotWrap>
          Now spinning
        </FeaturedBadge>
      )}
      {onRemove && (
        <>
          <MoreBtn
            ref={moreRef}
            type="button"
            data-open={menuOpen}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label={`More options for ${displayTitle}`}
            onClick={(e) => {
              e.stopPropagation()
              setMenuOpen((o) => !o)
            }}
            whileTap={{ scale: 0.94 }}
          >
            <MoreHorizontal size={16} strokeWidth={1.75} aria-hidden="true" />
          </MoreBtn>
          <AnimatePresence>
            {menuOpen && (
              <Menu
                ref={menuRef}
                role="menu"
                initial={{ opacity: 0, y: -4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
              >
                <MenuItem
                  role="menuitem"
                  $danger
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
      <Header>
        <Title>{displayTitle}</Title>
        {displayDescription ? (
          <Description>{displayDescription}</Description>
        ) : (
          <Description>No description yet.</Description>
        )}
      </Header>
      <Footer $featured={featured}>
        <MetaRow>
          <Users size={14} strokeWidth={1.75} aria-hidden="true" />
          <span>
            {count} {count === 1 ? 'member' : 'members'}
          </span>
        </MetaRow>
        <Arrow className="arrow" size={18} strokeWidth={1.75} aria-hidden="true" />
      </Footer>
    </Card>
  )
}

export default RoomItem

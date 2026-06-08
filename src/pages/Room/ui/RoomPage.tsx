import { useState, useMemo, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { doc } from 'firebase/firestore'
import styled from 'styled-components'
import { motion } from 'motion/react'
import { Users, History as HistoryIcon, Dices, DoorOpen } from 'lucide-react'

import { DataBoundary, FlashAlert } from 'shared/ui'
import { db } from 'shared/config'
import { useFirestoreDocument } from 'shared/hooks'
import {
  useMemberCollection,
  useCreateNewMember,
  useMemberToggleOptimistic,
  MemberManagementModalModern,
  MemberChipModern,
  type MemberManagementMember,
} from 'features/member-management'
import {
  WheelOfFortuneModern,
  useWheelSpin,
  WinnerModalModern,
  createFortuneHistoryEntry,
  FortuneHistoryListModern,
} from 'features/fortune'
import { memberAvatarBackground, memberWedgeFill } from 'entities/member'
import { type Room } from 'entities/room'

const Page = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.background.primary};
  color: ${({ theme }) => theme.text};
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    system-ui,
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition: background-color 300ms ${({ theme }) => theme.motion.easing.easeOut};
`

const Main = styled.main`
  max-width: 1180px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};

  @media (max-width: 720px) {
    padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};
  }
`

const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: ${({ theme }) => theme.spacing.xl};
  align-items: start;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`

const HeroCard = styled.section`
  position: relative;
  padding: ${({ theme }) => theme.spacing['3xl']} ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.background.surface};
  border: 1px solid ${({ theme }) => theme.colors.grey[100]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['2xl']};
`

const HeroMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.grey[500]};
`

// Room name sits at the top of the hero card. Centered like the rest of the
// hero contents, with an eyebrow + title pattern so the room name reads as
// the page's primary identifier (above the meta strip and the wheel).
const RoomNameBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  text-align: center;
  width: 100%;
`

const RoomEyebrow = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: ${({ theme }) => theme.fontSizes.micro};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.interactive};
`

const RoomName = styled.h1`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  letter-spacing: -0.025em;
  line-height: 1.15;
  color: ${({ theme }) => theme.text};
  text-wrap: balance;
  /* Cap the title so a long room name wraps before it overflows the hero
     card's content area. */
  max-width: 32ch;
`

const MetaItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-variant-numeric: tabular-nums;
`

const SpinCta = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  height: 44px;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  border: 0;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-family: inherit;
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  letter-spacing: -0.005em;
  cursor: pointer;
  transition:
    background-color 180ms ${({ theme }) => theme.motion.easing.easeOut},
    box-shadow 180ms ${({ theme }) => theme.motion.easing.easeOut};

  &:hover:not(:disabled) {
    box-shadow: 0 8px 20px ${({ theme }) => theme.colors.focusRing};
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadow.focusVisible};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const SideColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`

const SideCard = styled.section`
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.background.surface};
  border: 1px solid ${({ theme }) => theme.colors.grey[100]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
`

const SideHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

const SideTitle = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.grey[500]};
  display: inline-flex;
  align-items: center;
  gap: 6px;
`

const ManageBtn = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 28px;
  padding: 0 10px;
  border: 0;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-family: inherit;
  font-size: ${({ theme }) => theme.fontSizes.caption};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  letter-spacing: -0.005em;
  cursor: pointer;
  transition:
    background-color 180ms ${({ theme }) => theme.motion.easing.easeOut},
    box-shadow 180ms ${({ theme }) => theme.motion.easing.easeOut};

  &:hover:not(:disabled) {
    box-shadow: 0 6px 16px ${({ theme }) => theme.colors.focusRing};
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadow.focusVisible};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`

const RoomPage = () => {
  const { id = '' } = useParams<{ id: string }>()
  const [showMembersModal, setShowMembersModal] = useState(false)

  const { members, loading, error, eligibleRandomMembers } = useMemberCollection(id)
  const { flashAlert, flashState, handleCreateMember } = useCreateNewMember()

  // Subscribe to the room doc so the page can show the room name. `Room.name`
  // lives at `room/{id}`; production data has it. We subscribe (not just
  // fetch once) so a rename in another tab reflects here.
  const roomRef = useMemo(() => (id ? doc(db, 'room', id) : null), [id])
  const { data: room } = useFirestoreDocument<Room>(roomRef)

  // Per-member color comes from the canonical 10-preset palette in
  // entities/member. Production data has no color field; the entity derives
  // it from the name. The wheel takes `memberWedgeFill` (darker) and the
  // avatar/chip surfaces take `memberAvatarBackground` (lighter) — they
  // share the same hue, so the same person is the same color across all
  // surfaces.
  const eligibleWithColor = useMemo(
    () => eligibleRandomMembers.map((m) => ({ ...m, color: memberWedgeFill(m.name) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [eligibleRandomMembers.length, eligibleRandomMembers.map((m) => m.id).join(',')]
  )

  const activeMembers = useMemo(() => eligibleWithColor.filter((m) => m.isEligibleRandom), [eligibleWithColor])

  const { rotation, spinning, winner, showWinnerModal, startSpin, dismissWinner } = useWheelSpin({
    members: activeMembers,
    disabled: showMembersModal,
  })

  const { displayMembers, removeMember, toggleActive } = useMemberToggleOptimistic({
    roomId: id,
    members,
    onError: (message) => {
      flashState.set({ type: 'danger', message })
      flashAlert.open()
    },
  })

  const handleSaveWinner = useCallback(async () => {
    if (!winner) return
    try {
      await createFortuneHistoryEntry({
        roomId: id,
        winnerId: winner.id,
        winnerName: winner.name,
      })
    } catch (err) {
      console.error('Failed to save fortune history', err)
    }
    dismissWinner()
  }, [winner, id, dismissWinner])

  const handleAddMember = useCallback(
    async (name: string) => {
      await handleCreateMember(id, name)
    },
    [id, handleCreateMember]
  )

  const membersForModal: MemberManagementMember[] = useMemo(
    () =>
      // Newest-first: the manage list surfaces the most recent additions at
      // the top so the user doesn't have to scroll past old entries. Firestore
      // returns members oldest-first (orderBy('createdAt', 'asc')), so we
      // reverse locally. createdAt is a `dayjs().toString()` value (e.g.
      // "Sun, 07 Jun 2026 23:30:00 GMT") — that string is NOT
      // lexicographically sortable because the weekday prefix dominates
      // ("Fri" < "Mon"), so we compare via Date#getTime.
      [...displayMembers]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .map((m) => ({
          id: m.id,
          name: m.name,
          color: memberAvatarBackground(m.name),
          active: m.isEligibleRandom,
        })),
    [displayMembers]
  )

  // Keyboard shortcut: Space to spin
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (showWinnerModal || showMembersModal) return
      const target = e.target as HTMLElement | null
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return
      if (e.key === ' ') {
        e.preventDefault()
        startSpin()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [spinning, showWinnerModal, showMembersModal, startSpin, activeMembers.length])

  return (
    <Page>
      <Main>
        <DataBoundary
          loading={loading}
          error={error}
          loadingMessage="Loading room information..."
          errorMessage="Failed to load room information."
        >
          <Layout>
            <HeroCard>
              {room?.name && (
                <RoomNameBlock>
                  <RoomEyebrow>
                    <DoorOpen size={11} strokeWidth={2.25} aria-hidden="true" />
                    Room
                  </RoomEyebrow>
                  <RoomName>{room.name}</RoomName>
                  <HeroMeta>
                    <MetaItem>
                      <Users size={14} strokeWidth={1.75} aria-hidden="true" />
                      <span>{members.length} in pool</span>
                    </MetaItem>
                    <MetaItem>
                      <HistoryIcon size={14} strokeWidth={1.75} aria-hidden="true" />
                      <span>{activeMembers.length} eligible</span>
                    </MetaItem>
                  </HeroMeta>
                </RoomNameBlock>
              )}

              <WheelOfFortuneModern members={activeMembers} rotation={rotation} spinning={spinning} size="lg" />

              <SpinCta
                type="button"
                onClick={startSpin}
                disabled={spinning || activeMembers.length < 2}
                whileHover={!spinning && activeMembers.length >= 2 ? { scale: 1.02 } : undefined}
                whileTap={!spinning && activeMembers.length >= 2 ? { scale: 0.98 } : undefined}
              >
                <Dices size={16} strokeWidth={2} aria-hidden="true" />
                {spinning ? 'Spinning…' : 'Spin the wheel'}
              </SpinCta>
            </HeroCard>

            <SideColumn>
              <SideCard>
                <SideHeader>
                  <SideTitle>
                    <Users size={13} strokeWidth={2} aria-hidden="true" />
                    Members
                  </SideTitle>
                  <ManageBtn type="button" onClick={() => setShowMembersModal(true)} whileTap={{ scale: 0.96 }}>
                    Manage
                  </ManageBtn>
                </SideHeader>
                <Chips>
                  {displayMembers.map((m) => (
                    <MemberChipModern
                      key={m.id}
                      name={m.name}
                      color={memberAvatarBackground(m.name)}
                      isHighlighted={winner?.id === m.id}
                      isActive={m.isEligibleRandom}
                    />
                  ))}
                </Chips>
              </SideCard>

              <SideCard>
                <SideHeader>
                  <SideTitle>
                    <HistoryIcon size={13} strokeWidth={2} aria-hidden="true" />
                    Recent spins
                  </SideTitle>
                </SideHeader>
                <FortuneHistoryListModern
                  roomId={id ?? ''}
                  membersById={Object.fromEntries(
                    displayMembers.map((m) => [m.id, { name: m.name, color: memberAvatarBackground(m.name) }])
                  )}
                />
              </SideCard>
            </SideColumn>
          </Layout>
        </DataBoundary>
      </Main>

      <WinnerModalModern
        open={showWinnerModal}
        winner={winner ? { id: winner.id, name: winner.name, color: memberAvatarBackground(winner.name) } : null}
        onSave={handleSaveWinner}
        onDiscard={dismissWinner}
      />

      <MemberManagementModalModern
        open={showMembersModal}
        members={membersForModal}
        onClose={() => setShowMembersModal(false)}
        onAdd={handleAddMember}
        onRemove={removeMember}
        onToggleActive={toggleActive}
      />

      <FlashAlert
        type={flashState.state.type}
        message={flashState.state.message}
        visible={flashAlert.isOpen}
        onClose={flashAlert.close}
      />
    </Page>
  )
}

export default RoomPage

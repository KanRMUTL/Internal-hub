import { useState, useMemo, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { motion } from 'motion/react'
import { ArrowLeft, Sun, Moon, Sparkles, Users, History as HistoryIcon, Dices } from 'lucide-react'

import { DataBoundary, FlashAlert } from 'shared/ui'
import {
  useMemberCollection,
  useCreateNewMember,
  MemberManagementModalModern,
  type MemberManagementMember,
} from 'features/member-management'
import {
  WheelOfFortuneModern,
  pickWinnerIndex,
  computeNextRotation,
  MODERN_SPIN_DURATION_MS,
  WinnerModalModern,
  createFortuneHistoryEntry,
  FortuneHistoryListModern,
} from 'features/fortune'

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

const TopBar = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.background.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.grey[100]};
  backdrop-filter: saturate(180%) blur(8px);
`

const TopLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`

const BackLink = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border: 0;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: transparent;
  color: ${({ theme }) => theme.colors.grey[500]};
  font-family: inherit;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  cursor: pointer;
  transition:
    background-color 180ms ${({ theme }) => theme.motion.easing.easeOut},
    color 180ms ${({ theme }) => theme.motion.easing.easeOut};

  &:hover {
    background: ${({ theme }) => theme.colors.hover};
    color: ${({ theme }) => theme.colors.primary};
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadow.focusVisible};
  }
`

const TopActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`

const IconButton = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid ${({ theme }) => theme.colors.grey[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.background.surface};
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  transition:
    background-color 180ms ${({ theme }) => theme.motion.easing.easeOut},
    border-color 180ms ${({ theme }) => theme.motion.easing.easeOut};

  &:hover {
    background: ${({ theme }) => theme.colors.hover};
    border-color: ${({ theme }) => theme.colors.grey[300]};
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadow.focusVisible};
  }
`

const Main = styled.main`
  max-width: 1180px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};

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
  padding: ${({ theme }) => theme.spacing.xxl} ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.background.surface};
  border: 1px solid ${({ theme }) => theme.colors.grey[100]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
`

const HeroEyebrow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 10px;
  font-size: 11px;
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.focus};
  border-radius: ${({ theme }) => theme.borderRadius.full};
`

const HeroTitle = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.text};
  text-align: center;
  text-wrap: balance;
`

const WinnerBanner = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.focus};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  letter-spacing: -0.005em;
`

const HeroMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.grey[500]};
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
  gap: ${({ theme }) => theme.spacing.md};
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
  border: 1px solid ${({ theme }) => theme.colors.grey[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.background.surface};
  color: ${({ theme }) => theme.colors.grey[600]};
  font-family: inherit;
  font-size: ${({ theme }) => theme.fontSizes.caption};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  letter-spacing: -0.005em;
  cursor: pointer;
  transition:
    background-color 180ms ${({ theme }) => theme.motion.easing.easeOut},
    border-color 180ms ${({ theme }) => theme.motion.easing.easeOut},
    color 180ms ${({ theme }) => theme.motion.easing.easeOut};

  &:hover {
    background: ${({ theme }) => theme.colors.hover};
    border-color: ${({ theme }) => theme.colors.grey[300]};
    color: ${({ theme }) => theme.colors.primary};
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadow.focusVisible};
  }
`

const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`

const RoomPage = () => {
  const { id = '' } = useParams<{ id: string }>()
  const [mode, setMode] = useState<'light' | 'dark'>('light')
  const [spinning, setSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [winnerId, setWinnerId] = useState<string | null>(null)
  const [showWinnerModal, setShowWinnerModal] = useState(false)
  const [showMembersModal, setShowMembersModal] = useState(false)

  const { members, loading, error, eligibleRandomMembers } = useMemberCollection(id)
  const { flashAlert, flashState, handleCreateMember } = useCreateNewMember()

  // Deterministic hue per member name (production data has no hue field)
  const memberHue = (name: string): number => {
    let h = 0
    for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360
    return h
  }

  // Light/dark theme (local to this preview, mirrors app theme)
  useEffect(() => {
    document.documentElement.style.colorScheme = mode
  }, [mode])

  // Active members are the only ones drawn in the wheel.
  // We use `isEligibleRandom` from the production data model and
  // generate a deterministic hue per member from their name (the production
  // data doesn't carry a hue field, but the visual needs it).

  const membersWithHue = useMemo(
    () => members.map((m) => ({ ...m, hue: memberHue(m.name) })),
    // members reference may change on every render; depend on length + ids
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [members.length, members.map((m) => m.id).join(',')]
  )

  const eligibleWithHue = useMemo(
    () => eligibleRandomMembers.map((m) => ({ ...m, hue: memberHue(m.name) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [eligibleRandomMembers.length, eligibleRandomMembers.map((m) => m.id).join(',')]
  )

  const activeMembers = useMemo(() => eligibleWithHue.filter((m) => m.isEligibleRandom), [eligibleWithHue])

  const winner = useMemo(
    () => (winnerId ? (membersWithHue.find((m) => m.id === winnerId) ?? null) : null),
    [winnerId, membersWithHue]
  )

  const handleSpin = () => {
    if (spinning || activeMembers.length < 2 || showWinnerModal || showMembersModal) return
    setShowWinnerModal(false)
    setWinnerId(null)
    const nextRotation = computeNextRotation(rotation)
    setRotation(nextRotation)
    const idx = pickWinnerIndex(nextRotation, activeMembers.length)
    const picked = activeMembers[idx]
    if (!picked) {
      setSpinning(false)
      return
    }
    setSpinning(true)
    window.setTimeout(() => {
      setSpinning(false)
      setWinnerId(picked.id)
      setShowWinnerModal(true)
    }, MODERN_SPIN_DURATION_MS)
  }

  const handleSaveWinner = async () => {
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
    setShowWinnerModal(false)
  }

  const handleDiscardWinner = () => {
    setShowWinnerModal(false)
    setWinnerId(null)
  }

  const handleSpinAgain = () => {
    setShowWinnerModal(false)
    setWinnerId(null)
    // Re-spin after the modal close animation settles
    window.setTimeout(() => handleSpin(), 200)
  }

  // Manage members locally (preview-only state for the active/inactive toggle)
  const [localMembers, setLocalMembers] = useState<typeof members | null>(null)
  useEffect(() => {
    setLocalMembers(members)
  }, [members])
  const displayMembers = localMembers ?? members

  const membersForModal: MemberManagementMember[] = useMemo(
    () =>
      (localMembers ?? members).map((m) => ({
        id: m.id,
        name: m.name,
        hue: memberHue(m.name),
        active: m.isEligibleRandom,
      })),
    [localMembers, members]
  )

  const handleAddMember = async (name: string) => {
    await handleCreateMember(id, name)
  }
  const handleRemoveMember = (memberId: string) => {
    setLocalMembers((prev) => (prev ?? members).filter((m) => m.id !== memberId))
  }
  const handleToggleActive = (memberId: string) => {
    setLocalMembers((prev) =>
      (prev ?? members).map((m) => (m.id === memberId ? { ...m, isEligibleRandom: !m.isEligibleRandom } : m))
    )
  }

  // Keyboard shortcut: Space to spin
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (showWinnerModal || showMembersModal) return
      const target = e.target as HTMLElement | null
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return
      if (e.key === ' ') {
        e.preventDefault()
        handleSpin()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinning, showWinnerModal, showMembersModal, rotation, activeMembers.length])

  return (
    <Page>
      <TopBar>
        <TopLeft>
          <BackLink type="button">
            <ArrowLeft size={14} strokeWidth={2} aria-hidden="true" />
            <span>Rooms</span>
          </BackLink>
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'var(--primary)',
              }}
            >
              Room
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 600,
                letterSpacing: '-0.015em',
                color: 'var(--text)',
              }}
            >
              {displayMembers[0]?.name ? 'Current room' : 'Loading…'}
            </div>
          </div>
        </TopLeft>
        <TopActions>
          <IconButton
            type="button"
            onClick={() => setMode((m) => (m === 'light' ? 'dark' : 'light'))}
            aria-label={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
            whileTap={{ scale: 0.94 }}
          >
            <motion.span
              key={mode}
              initial={{ opacity: 0, rotate: -45 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'inline-flex' }}
            >
              {mode === 'light' ? <Moon size={16} strokeWidth={1.75} /> : <Sun size={16} strokeWidth={1.75} />}
            </motion.span>
          </IconButton>
        </TopActions>
      </TopBar>

      <Main>
        <DataBoundary
          loading={loading}
          error={error}
          loadingMessage="Loading room information..."
          errorMessage="Failed to load room information."
        >
          <Layout>
            <HeroCard>
              <HeroEyebrow>
                <Sparkles size={11} strokeWidth={2.25} aria-hidden="true" />
                Fortune wheel
              </HeroEyebrow>
              <HeroTitle>Who's up next?</HeroTitle>

              {winner && !spinning && !showWinnerModal && (
                <WinnerBanner
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Sparkles size={14} strokeWidth={2} aria-hidden="true" />
                  <span>{winner.name} is up</span>
                </WinnerBanner>
              )}

              <WheelOfFortuneModern members={activeMembers} rotation={rotation} spinning={spinning} size="lg" />

              <HeroMeta>
                <MetaItem>
                  <Users size={14} strokeWidth={1.75} aria-hidden="true" />
                  <span>{activeMembers.length} in pool</span>
                </MetaItem>
                <MetaItem>
                  <HistoryIcon size={14} strokeWidth={1.75} aria-hidden="true" />
                  <span>{activeMembers.length} eligible</span>
                </MetaItem>
              </HeroMeta>

              <SpinCta
                type="button"
                onClick={handleSpin}
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
                    <span
                      key={m.id}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '6px 12px 6px 6px',
                        borderRadius: 999,
                        background: winner?.id === m.id ? 'var(--focus)' : 'var(--surface)',
                        border: '1px solid var(--grey-200)',
                        fontSize: 13,
                        fontWeight: 500,
                        opacity: m.isEligibleRandom ? 1 : 0.55,
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          background: `oklch(78% 0.10 ${memberHue(m.name)})`,
                          color: `oklch(30% 0.08 ${memberHue(m.name)})`,
                          fontSize: 11,
                          fontWeight: 600,
                        }}
                      >
                        {m.name.charAt(0).toUpperCase()}
                      </span>
                      {m.name}
                    </span>
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
                    displayMembers.map((m) => [m.id, { name: m.name, hue: memberHue(m.name) }])
                  )}
                />
              </SideCard>
            </SideColumn>
          </Layout>
        </DataBoundary>
      </Main>

      <WinnerModalModern
        open={showWinnerModal}
        winner={winner ? { id: winner.id, name: winner.name, hue: memberHue(winner.name) } : null}
        onSave={handleSaveWinner}
        onDiscard={handleDiscardWinner}
        onSpinAgain={handleSpinAgain}
      />

      <MemberManagementModalModern
        open={showMembersModal}
        members={membersForModal}
        onClose={() => setShowMembersModal(false)}
        onAdd={handleAddMember}
        onRemove={handleRemoveMember}
        onToggleActive={handleToggleActive}
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

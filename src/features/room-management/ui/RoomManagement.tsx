import { useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { motion } from 'motion/react'
import { ArrowDownAZ, Plus } from 'lucide-react'
import { Box, Alert, FlashAlert, useFlashAlert } from 'shared/ui'
import { useActiveRooms, useRoomManagement, useRemoveRoom } from 'features/room-management/hooks'
import { ModalConfirmRemoveRoom, RoomList, RoomModal } from 'features/room-management/ui'
import { Room } from 'entities/room'

type SortKey = 'recent' | 'az'

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
  max-width: 1200px;
  padding: 0 ${({ theme }) => theme.spacing.lg};

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
  }
`

const SectionTitle = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  letter-spacing: -0.015em;
  color: ${({ theme }) => theme.text};
`

const SectionCount = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.grey[500]};
  margin-left: 8px;
  font-variant-numeric: tabular-nums;
`

const SectionCountStrong = styled.span`
  color: ${({ theme }) => theme.text};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
`

const SortPill = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.grey[200])};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: ${({ theme, $active }) => ($active ? theme.colors.focus : theme.background.surface)};
  color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.text)};
  font-family: inherit;
  font-size: ${({ theme }) => theme.fontSizes.caption};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  cursor: pointer;
  transition: all 180ms ${({ theme }) => theme.motion.easing.easeOut};

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

const HeaderActions = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`

const NewRoomBtn = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid ${({ theme }) => theme.colors.grey[200]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: ${({ theme }) => theme.background.surface};
  color: ${({ theme }) => theme.text};
  font-family: inherit;
  font-size: ${({ theme }) => theme.fontSizes.caption};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  cursor: pointer;
  transition: border-color 180ms ${({ theme }) => theme.motion.easing.easeOut};

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

const KbdFooter = styled.footer`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.xl};
  width: 100%;
  font-size: ${({ theme }) => theme.fontSizes.caption};
  color: ${({ theme }) => theme.colors.grey[500]};
  border-top: 1px solid ${({ theme }) => theme.colors.grey[100]};
  flex-wrap: wrap;
`

const KbdChip = styled.kbd`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  margin-right: 6px;
  border: 1px solid ${({ theme }) => theme.colors.grey[200]};
  border-bottom-width: 2px;
  border-radius: 5px;
  background: ${({ theme }) => theme.background.surface};
  color: ${({ theme }) => theme.text};
  font-family: 'JetBrains Mono', 'SF Mono', Menlo, monospace;
  font-size: 11px;
  font-weight: 600;
  line-height: 1;
`

const KbdGroup = styled.div`
  display: inline-flex;
  align-items: center;
`

const RoomManagement = () => {
  const { data: rooms, loading, error } = useActiveRooms()
  const { roomModal, handleCreateRoom } = useRoomManagement()
  const { selectedRoom, setSelectedRoom, modalRemoveRoom, removedIds, handleConfirmRemoveRoom } = useRemoveRoom()

  const flashState = useFlashAlert()
  const [flashVisible, setFlashVisible] = useState(false)
  const [sortKey, setSortKey] = useState<SortKey>('recent')
  const gridRef = useRef<HTMLDivElement | null>(null)

  const visibleRooms = useMemo(() => rooms.filter((r) => !removedIds.includes(r.id)), [rooms, removedIds])

  const sortedRooms = useMemo<Room[]>(() => {
    if (sortKey === 'az') {
      return [...visibleRooms].sort((a, b) => a.name.localeCompare(b.name))
    }
    return [...visibleRooms].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  }, [visibleRooms, sortKey])

  const totalMembers = useMemo(() => visibleRooms.reduce((sum, r) => sum + (r.members?.length ?? 0), 0), [visibleRooms])

  const handleOpenRemove = (room: Room) => {
    setSelectedRoom(room)
    modalRemoveRoom.open()
  }

  const handleCreateRoomWithFeedback = async (data: { name: string; description: string }) => {
    try {
      await handleCreateRoom(data)
      flashState.set({ type: 'success', message: 'Room created successfully!' })
      setFlashVisible(true)
    } catch (error) {
      console.log(`Error: handleCreateRoomWithFeedback => ${error}`)
      flashState.set({ type: 'danger', message: 'Failed to create room. Please try again.' })
      setFlashVisible(true)
    }
  }

  const handleRemoveRoomWithFeedback = async () => {
    try {
      await handleConfirmRemoveRoom()
      flashState.set({ type: 'success', message: 'Room removed successfully!' })
      setFlashVisible(true)
    } catch (error) {
      console.log(`Error: handleRemoveRoomWithFeedback => ${error}`)
      flashState.set({ type: 'danger', message: 'Failed to remove room. Please try again.' })
      setFlashVisible(true)
    }
  }

  useEffect(() => {
    if (loading) return
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault()
        roomModal.open()
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        if (sortedRooms.length === 0) return
        e.preventDefault()
        const grid = gridRef.current
        if (!grid) return
        const buttons = Array.from(grid.querySelectorAll<HTMLButtonElement>('button'))
        const focused = document.activeElement as HTMLElement | null
        const currentIdx = focused ? buttons.indexOf(focused as HTMLButtonElement) : -1
        const next = e.key === 'ArrowDown' ? Math.min(currentIdx + 1, buttons.length - 1) : Math.max(currentIdx - 1, 0)
        buttons[next]?.focus()
      } else if (e.key === 'Enter') {
        const target = e.target as HTMLElement | null
        if (target && target.tagName === 'BUTTON' && target.closest('[data-room-grid]')) {
          target.click()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [loading, sortedRooms, roomModal])

  if (error) {
    return (
      <Box $flex $justify="center" $align="center" $p="xl">
        <Alert $type="danger">Failed to load rooms. Please try again.</Alert>
      </Box>
    )
  }

  return (
    <Box $flex $direction="column" $align="center" $gap="xl" $p="lg" $minHeight="100vh">
      <FlashAlert
        type={flashState.state.type}
        message={flashState.state.message}
        visible={flashVisible}
        onClose={() => setFlashVisible(false)}
      />

      {!loading && sortedRooms.length > 0 && (
        <SectionHeader>
          <SectionTitle>
            Your rooms
            <SectionCount>
              · <SectionCountStrong>{sortedRooms.length}</SectionCountStrong>{' '}
              {sortedRooms.length === 1 ? 'room' : 'rooms'} · <SectionCountStrong>{totalMembers}</SectionCountStrong>{' '}
              {totalMembers === 1 ? 'member' : 'members'}
            </SectionCount>
          </SectionTitle>
          <HeaderActions>
            <SortPill
              type="button"
              $active={sortKey === 'recent'}
              onClick={() => setSortKey('recent')}
              aria-label="Sort by recent"
              aria-pressed={sortKey === 'recent'}
            >
              Recent
            </SortPill>
            <SortPill
              type="button"
              $active={sortKey === 'az'}
              onClick={() => setSortKey('az')}
              aria-label="Sort A to Z"
              aria-pressed={sortKey === 'az'}
            >
              <ArrowDownAZ size={12} strokeWidth={2} aria-hidden="true" />
              A–Z
            </SortPill>
            <NewRoomBtn
              type="button"
              onClick={roomModal.open}
              whileTap={{ scale: 0.97 }}
              aria-label="Create a new room"
            >
              <Plus size={12} strokeWidth={2} aria-hidden="true" />
              New
            </NewRoomBtn>
          </HeaderActions>
        </SectionHeader>
      )}

      <Box $flex $justify="center" $align="center" $gap="lg" ref={gridRef}>
        <div data-room-grid style={{ display: 'flex', justifyContent: 'center' }}>
          <RoomList
            rooms={sortedRooms}
            removedIds={removedIds}
            loading={loading}
            onCreateRoom={roomModal.open}
            onRemove={handleOpenRemove}
          />
        </div>
      </Box>

      <RoomModal isOpen={roomModal.isOpen} onClose={roomModal.close} onSubmit={handleCreateRoomWithFeedback} />
      {selectedRoom && (
        <ModalConfirmRemoveRoom
          room={selectedRoom}
          isOpen={modalRemoveRoom.isOpen}
          onConfirm={handleRemoveRoomWithFeedback}
          onCancel={modalRemoveRoom.close}
        />
      )}

      {!loading && sortedRooms.length > 0 && (
        <KbdFooter aria-label="Keyboard shortcuts">
          <KbdGroup>
            <KbdChip>N</KbdChip>
            new room
          </KbdGroup>
          <KbdGroup>
            <KbdChip>↑</KbdChip>
            <KbdChip>↓</KbdChip>
            navigate
          </KbdGroup>
          <KbdGroup>
            <KbdChip>⏎</KbdChip>
            open
          </KbdGroup>
        </KbdFooter>
      )}
    </Box>
  )
}

export default RoomManagement

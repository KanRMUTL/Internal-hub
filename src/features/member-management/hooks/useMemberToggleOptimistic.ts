import { useState, useEffect, useCallback, useMemo } from 'react'
import dayjs from 'dayjs'
import { RoomMember } from 'entities/room'
import { switchEligibleMember } from '../services'

interface UseMemberToggleOptimisticOptions {
  roomId: string
  members: RoomMember[]
  onError?: (message: string) => void
}

interface UseMemberToggleOptimisticReturn {
  displayMembers: RoomMember[]
  removeMember: (memberId: string) => void
  toggleActive: (memberId: string) => Promise<void>
}

/**
 * Owns the local member list and the optimistic eligibility toggle. The page
 * reads `displayMembers` for chips + modal input and the toggle/remove handlers
 * wire to the modal. On toggle failure, the local state reverts and `onError`
 * is invoked for the page to surface a flash alert.
 */
export const useMemberToggleOptimistic = ({
  roomId,
  members,
  onError,
}: UseMemberToggleOptimisticOptions): UseMemberToggleOptimisticReturn => {
  const [localMembers, setLocalMembers] = useState<RoomMember[] | null>(null)

  useEffect(() => {
    setLocalMembers(members)
  }, [members])

  const displayMembers = useMemo(() => localMembers ?? members, [localMembers, members])

  const removeMember = useCallback(
    (memberId: string) => {
      setLocalMembers((prev) => (prev ?? members).filter((m) => m.id !== memberId))
    },
    [members]
  )

  const toggleActive = useCallback(
    async (memberId: string) => {
      const current = (localMembers ?? members).find((m) => m.id === memberId)
      if (!current) return
      const next = !current.isEligibleRandom

      // Optimistic: reflect the toggle locally so chips + modal flip now.
      setLocalMembers((prev) =>
        (prev ?? members).map((m) => (m.id === memberId ? { ...m, isEligibleRandom: next } : m))
      )

      try {
        await switchEligibleMember(roomId, memberId, {
          isEligibleRandom: next,
          updatedAt: dayjs().toString(),
        })
      } catch (err) {
        console.error('Failed to persist member active state', err)
        // Revert to the value we read at click time.
        setLocalMembers((prev) =>
          (prev ?? members).map((m) => (m.id === memberId ? { ...m, isEligibleRandom: current.isEligibleRandom } : m))
        )
        onError?.('Could not update member. Try again.')
      }
    },
    [localMembers, members, roomId, onError]
  )

  return { displayMembers, removeMember, toggleActive }
}

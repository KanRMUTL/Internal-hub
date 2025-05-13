import { MemberManagement } from 'features/member-management'
import { useParams } from 'react-router-dom'
import { Box, Alert, Spinner } from 'shared/ui'
import { WheelOfFortune, LuckyModal } from 'features/fortune'
import { useState } from 'react'
import { useMemberCollection } from 'features/member-management'
import { RoomMember } from 'entities/room'

const RoomPage = () => {
  const { id = '' } = useParams<{ id: string }>()
  const [winner, setWinner] = useState<RoomMember | null>(null)

  const { members, loading, error, eligibleRandomMembers, normalMembers } = useMemberCollection(id)

  const memberNames = eligibleRandomMembers.map(({ id, name }) => ({
    id,
    name,
  }))

  const handleSpinComplete = (id: string) => {
    const findMember = members.find((m) => m.id === id)
    if (!findMember) return

    setWinner(findMember)
  }

  if (loading) return renderLoading()

  if (error) return renderError()

  return (
    <Box $flex $justify="center" $align="center" $gap="md" $p="xl">
      <Box $flex $direction="column" $justify="center" $align="center" $gap="md">
        <WheelOfFortune members={memberNames} onSpinCompleted={handleSpinComplete} />
        {winner && <LuckyModal winner={winner} onAccept={() => setWinner(null)} onDiscard={() => setWinner(null)} />}
        <MemberManagement
          roomId={id}
          members={members}
          eligibleRandomMembers={eligibleRandomMembers}
          normalMembers={normalMembers}
        />
      </Box>
    </Box>
  )
}

export default RoomPage

const renderLoading = () => (
  <Box $flex $justify="center" $align="center" $gap="xl" $p="lg">
    <Spinner label="Loading room..." />
  </Box>
)

const renderError = () => (
  <Box $flex $justify="center" $align="center" $gap="xl" $p="lg">
    <Alert $type="danger">Failed to load room</Alert>
  </Box>
)

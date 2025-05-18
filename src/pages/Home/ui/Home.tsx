import { MemberModal, useCreateNewMember } from 'features/member-management'
import { RoomManagement } from 'features/room-management'
import { useState } from 'react'
import { FlashAlert } from 'shared/ui'

const Home = () => {
  const [room, setRoom] = useState({ id: '', name: '' })
  const { modalNewMember, flashAlert, flashState, handleCreateMember } = useCreateNewMember()

  return (
    <>
      <RoomManagement
        onClickAddItem={(id, name) => {
          setRoom({ id, name })
          modalNewMember.open()
        }}
      />
      <MemberModal
        isOpen={modalNewMember.isOpen}
        title={`Add new item into "${room.name}"`}
        defaultValues={{ name: '' }}
        onClose={modalNewMember.close}
        onSubmit={(data) => {
          handleCreateMember(room.id, data.name)
        }}
      />

      <FlashAlert
        type={flashState.state.type}
        message={flashState.state.message}
        visible={flashAlert.isOpen}
        onClose={flashAlert.close}
      />
    </>
  )
}

export default Home

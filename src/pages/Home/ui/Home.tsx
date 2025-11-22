import { MemberModal, useCreateNewMember } from 'features/member-management'
import { RoomManagement } from 'features/room-management'
import { useState } from 'react'
import { FlashAlert, Container, SkipLinks } from 'shared/ui'

const Home = () => {
  const [room, setRoom] = useState({ id: '', name: '' })
  const { modalNewMember, flashAlert, flashState, handleCreateMember } = useCreateNewMember()

  return (
    <>
      <SkipLinks
        links={[
          { href: '#main-content', label: 'Skip to main content' },
          { href: '#room-management', label: 'Skip to room management' },
        ]}
      />

      <Container $maxWidth="1200px" $centered $px="lg">
        {/* Main content */}
        <main id="main-content" role="main">
          <section id="room-management" aria-labelledby="room-management-heading">
            <RoomManagement
              onClickAddItem={(id, name) => {
                setRoom({ id, name })
                modalNewMember.open()
              }}
            />
          </section>
        </main>

        {/* Modals */}
        <MemberModal
          isOpen={modalNewMember.isOpen}
          defaultValues={{ name: '' }}
          onClose={modalNewMember.close}
          onSubmit={(data) => {
            handleCreateMember(room.id, data.name)
          }}
        />

        {/* Flash alerts */}
        <FlashAlert
          type={flashState.state.type}
          message={flashState.state.message}
          visible={flashAlert.isOpen}
          onClose={flashAlert.close}
        />
      </Container>
    </>
  )
}

export default Home

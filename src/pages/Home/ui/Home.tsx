import { RoomManagement } from 'features/room-management'
import { Container, SkipLinks } from 'shared/ui'

const Home = () => {
  return (
    <>
      <SkipLinks
        links={[
          { href: '#main-content', label: 'Skip to main content' },
          { href: '#room-management', label: 'Skip to room management' },
        ]}
      />

      <Container $maxWidth="1200px" $centered $px="lg">
        <main id="main-content" role="main">
          <section id="room-management" aria-labelledby="room-management-heading">
            <RoomManagement />
          </section>
        </main>
      </Container>
    </>
  )
}

export default Home

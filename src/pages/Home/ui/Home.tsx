import { useEffect } from 'react'
import { RoomManagement } from 'features/room-management'
import { SkipLinks } from 'shared/ui'
import { usePageHeader } from 'widgets/Layout'

const Home = () => {
  const { setSlots, clearSlots } = usePageHeader()

  useEffect(() => {
    setSlots({})
    return clearSlots
  }, [setSlots, clearSlots])

  return (
    <>
      <SkipLinks
        links={[
          { href: '#main-content', label: 'Skip to main content' },
          { href: '#room-management', label: 'Skip to room management' },
        ]}
      />

      <main id="main-content" role="main">
        <section id="room-management" aria-labelledby="room-management-heading">
          <RoomManagement />
        </section>
      </main>
    </>
  )
}

export default Home

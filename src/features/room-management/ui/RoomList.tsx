import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { motion } from 'motion/react'
import { removeRoom, createRoom } from 'features/room-management/services'
import { useActiveRooms } from 'features/room-management/hooks'
import { RoomItem } from 'entities/room'
import { Box, Button, Input, Modal, Spinner, Typography } from 'shared/ui'
import Alert from 'shared/ui/Alert/Alert'
import dayjs from 'dayjs'
import TextArea from 'shared/ui/TextArea'

interface RoomForm {
  name: string
  description: string
}

const RoomList = () => {
  const [visibleModal, setVisibleModal] = useState(false)
  const { data: rooms, loading, error } = useActiveRooms()
  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm<RoomForm>()

  const onSubmit: SubmitHandler<RoomForm> = async (formData) => {
    resetForm()
    setVisibleModal(false)

    const timestamp = dayjs().toString()
    const { name, description } = formData

    await createRoom({
      name,
      description,
      createdAt: timestamp,
      updatedAt: timestamp,
      active: true,
      lastWinner: '',
      members: [],
    })
  }

  if (loading)
    return (
      <Box $flex $justify="center" $align="center" $gap="xl" $p="lg">
        <Spinner label="Loading rooms..." />
      </Box>
    )
  if (error)
    return (
      <Box $flex $justify="center" $align="center" $gap="xl" $p="lg">
        <Alert $type="danger">Failed to load rooms</Alert>
      </Box>
    )

  return (
    <Box $flex $justify="center" $align="center" $gap="xl" $p="lg">
      {rooms.map((room) => (
        <RoomItem
          key={room.id}
          id={room.id}
          title={room.name}
          description={room.description}
          onAdd={(id) => {
            // show modal contain input form to add new member inside the room
          }}
          onRemove={(id) => {
            removeRoom(id)
          }}
        />
      ))}
      <Box>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 1 }}>
          <Button
            $variant="info"
            onClick={() => {
              setVisibleModal(true)
            }}
          >
            + new room
          </Button>
        </motion.div>
      </Box>
      <Modal
        isOpen={visibleModal}
        onClose={() => {
          setVisibleModal(false)
          resetForm()
        }}
      >
        <Box $flex $direction="column" $justify="center" $align="center" $p="sm" $gap="sm">
          <Typography $size="xl" $weight="bold" $color="primary">
            New Room
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
            <Box $flex $direction="column" $justify="center" $align="center" $gap="md">
              <Input
                placeholder="Enter room name..."
                error={errors.name?.message}
                {...register('name', {
                  required: {
                    value: true,
                    message: "Don't forget enter name",
                  },
                  maxLength: { value: 20, message: 'Name must not exceed 20 characters' },
                })}
              />
              <TextArea
                placeholder="Enter room description..."
                error={errors.description?.message}
                {...register('description', {
                  maxLength: { value: 30, message: 'Description must not exceed 30 characters' },
                })}
              />
              <Button type="submit">Save</Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Box>
  )
}

export default RoomList

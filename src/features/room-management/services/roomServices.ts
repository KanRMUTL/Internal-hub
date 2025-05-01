import { doc, addDoc, deleteDoc } from 'firebase/firestore'
import { ROOM_COLLECTION_REF, ROOM_COLLECTION_NAME } from 'features/room-management/config'

import { Room } from 'entities/room'
import { db } from 'shared/config/firebase'

export const createRoom = async (room: Omit<Room, 'id'>) => {
  await addDoc(ROOM_COLLECTION_REF, room)
}

export const removeRoom = async (id: string) => {
  await deleteDoc(doc(db, ROOM_COLLECTION_NAME, id))
}

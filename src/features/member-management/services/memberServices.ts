import { collection, query, orderBy, addDoc, doc, updateDoc } from 'firebase/firestore'
import { RoomMember } from 'entities/room'
import { db } from 'shared/config/firebase'
import { PARENT_COLLECTION_NAME, MEMBER_COLLECTION_NAME } from 'features/member-management/config'

export const getMemberQuery = (roomId: string) =>
  query(collection(db, PARENT_COLLECTION_NAME, roomId, MEMBER_COLLECTION_NAME), orderBy('createdAt', 'asc'))

export const createMember = async (roomId: string, newMember: Omit<RoomMember, 'id'>) => {
  await addDoc(collection(db, PARENT_COLLECTION_NAME, roomId, MEMBER_COLLECTION_NAME), newMember)
}

export const updateMember = async (
  roomId: string,
  memberId: string,
  { name, updatedAt }: Pick<RoomMember, 'name' | 'updatedAt'>
) => {
  const memberRef = doc(db, PARENT_COLLECTION_NAME, roomId, MEMBER_COLLECTION_NAME, memberId)
  await updateDoc(memberRef, { name, updatedAt })
}

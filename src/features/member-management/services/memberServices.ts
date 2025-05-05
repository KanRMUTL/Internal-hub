import { collection, query, orderBy, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { RoomMember } from 'entities/room'
import { db } from 'shared/config/firebase'
import { PARENT_COLLECTION_NAME, MEMBER_COLLECTION_NAME } from 'features/member-management/config'

export const getMemberQuery = (roomId: string) =>
  query(collection(db, PARENT_COLLECTION_NAME, roomId, MEMBER_COLLECTION_NAME), orderBy('createdAt', 'asc'))

export const createMember = async (roomId: string, newMember: Omit<RoomMember, 'id'>) => {
  const membeCollection = collection(db, PARENT_COLLECTION_NAME, roomId, MEMBER_COLLECTION_NAME)
  await addDoc(membeCollection, newMember)
}

function getMemberRef(roomId: string, memberId: string) {
  return doc(db, PARENT_COLLECTION_NAME, roomId, MEMBER_COLLECTION_NAME, memberId)
}

export const updateMember = async (
  roomId: string,
  memberId: string,
  { name, updatedAt }: Pick<RoomMember, 'name' | 'updatedAt'>
) => {
  const memberRef = getMemberRef(roomId, memberId)
  await updateDoc(memberRef, { name, updatedAt })
}

export const switchEligibleMember = async (
  roomId: string,
  memberId: string,
  { isEligibleRandom, updatedAt }: Pick<RoomMember, 'isEligibleRandom' | 'updatedAt'>
) => {
  const memberRef = getMemberRef(roomId, memberId)
  await updateDoc(memberRef, { isEligibleRandom, updatedAt })
}

export const deleteMember = async (roomId: string, memberId: string) => {
  const memberRef = getMemberRef(roomId, memberId)
  await deleteDoc(memberRef)
}

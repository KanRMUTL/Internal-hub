import { db } from 'shared/config'
import { collection, query, where, orderBy } from 'firebase/firestore'

export const ROOM_COLLECTION_NAME = 'room'
export const ROOM_COLLECTION_REF = collection(db, ROOM_COLLECTION_NAME)
export const QUERY_ROOM_ACTIVE = query(ROOM_COLLECTION_REF, where('active', '==', true), orderBy('createdAt', 'asc'))

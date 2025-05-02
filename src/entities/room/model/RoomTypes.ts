export interface RoomMember {
  id: string
  name: string
  joinAt: string
  createdAt: string
  updatedAt: string
}

export interface Room {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
  active: boolean
  lastWinner: string
  members: RoomMember[]
}

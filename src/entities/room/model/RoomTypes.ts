export interface RoomMember {
  id: string
  name: string
  isEligibleRandom: boolean
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
